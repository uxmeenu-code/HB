import { useRef, useState, useCallback, useEffect } from 'react'
import { Camera, RotateCcw, X, Check } from 'lucide-react'
import type { InspectionPhoto, Severity } from '../types'
import { getCurrentGPS } from '../utils/gps'
import { v4 as uuidv4 } from 'uuid'

interface CameraCaptureProps {
  onCapture: (photo: InspectionPhoto) => void
  onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [severity, setSeverity] = useState<Severity>('medium')
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch {
      setError('Camera access denied. Please allow camera permissions.')
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => { stream?.getTracks().forEach(track => track.stop()) }
  }, [startCamera])

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.85))
  }

  const confirmPhoto = async () => {
    if (!capturedImage) return
    const gps = await getCurrentGPS()
    onCapture({
      id: uuidv4(),
      dataUrl: capturedImage,
      annotations: [],
      caption: caption || undefined,
      severity,
      gps,
      timestamp: new Date().toISOString(),
    })
    stopCamera()
    onClose()
  }

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop())
    setStream(null)
  }

  const retake = () => {
    setCapturedImage(null)
    setCaption('')
  }

  return (
    <div className="camera-overlay">
      <div className="camera-header">
        <button className="icon-btn" onClick={() => { stopCamera(); onClose() }}>
          <X size={24} />
        </button>
        <span>Capture Photo</span>
        <div style={{ width: 40 }} />
      </div>

      {error ? (
        <div className="camera-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={startCamera}>Retry</button>
        </div>
      ) : capturedImage ? (
        <div className="camera-preview">
          <img src={capturedImage} alt="Captured" />
          <div className="camera-form">
            <input
              type="text"
              placeholder="Add caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="input"
            />
            <div className="severity-selector">
              <label>Severity:</label>
              {(['low', 'medium', 'high', 'critical'] as Severity[]).map(s => (
                <button
                  key={s}
                  className={`severity-btn severity-${s} ${severity === s ? 'active' : ''}`}
                  onClick={() => setSeverity(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="camera-actions">
              <button className="btn btn-secondary" onClick={retake}>
                <RotateCcw size={18} /> Retake
              </button>
              <button className="btn btn-primary" onClick={confirmPhoto}>
                <Check size={18} /> Save Photo
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="camera-view">
          <video ref={videoRef} autoPlay playsInline muted />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button className="capture-btn" onClick={takePhoto}>
            <Camera size={32} />
          </button>
        </div>
      )}
    </div>
  )
}
