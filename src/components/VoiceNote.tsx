import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Check, X } from 'lucide-react'
import type { VoiceNote } from '../types'
import { getCurrentGPS } from '../utils/gps'
import { v4 as uuidv4 } from 'uuid'

interface VoiceNoteProps {
  onSave: (note: VoiceNote) => void
  onClose: () => void
}

export default function VoiceNoteRecorder({ onSave, onClose }: VoiceNoteProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = ''
      let interimText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript
        } else {
          interimText += event.results[i][0].transcript
        }
      }
      if (final) setTranscript(prev => prev + final)
      setInterim(interimText)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSave = async () => {
    const text = (transcript + interim).trim()
    if (!text) return
    const gps = await getCurrentGPS()
    onSave({
      id: uuidv4(),
      text,
      gps,
      timestamp: new Date().toISOString(),
    })
    onClose()
  }

  if (!supported) {
    return (
      <div className="voice-overlay">
        <div className="voice-header">
          <button className="icon-btn" onClick={onClose}><X size={24} /></button>
          <span>Voice Note</span>
          <div style={{ width: 40 }} />
        </div>
        <div className="voice-fallback">
          <p>Voice recognition is not supported in this browser.</p>
          <textarea
            className="input voice-textarea"
            placeholder="Type your observation instead..."
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            rows={4}
          />
          <button className="btn btn-primary" onClick={handleSave} disabled={!transcript.trim()}>
            <Check size={18} /> Save Note
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="voice-overlay">
      <div className="voice-header">
        <button className="icon-btn" onClick={onClose}><X size={24} /></button>
        <span>Voice Note</span>
        <div style={{ width: 40 }} />
      </div>

      <div className="voice-content">
        <button
          className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
        >
          {isListening ? <MicOff size={40} /> : <Mic size={40} />}
        </button>
        <p className="voice-status">
          {isListening ? 'Listening... tap to stop' : 'Tap to start dictating'}
        </p>

        <div className="voice-transcript">
          {transcript && <p>{transcript}</p>}
          {interim && <p className="interim">{interim}</p>}
          {!transcript && !interim && <p className="placeholder">Your words will appear here...</p>}
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={!transcript.trim() && !interim.trim()}>
          <Check size={18} /> Save Note
        </button>
      </div>
    </div>
  )
}
