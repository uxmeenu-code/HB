import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Eraser, Check, X } from 'lucide-react'
import type { DigitalSignature } from '../types'
import { getCurrentGPS } from '../utils/gps'
import { v4 as uuidv4 } from 'uuid'

interface SignatureCaptureProps {
  onSave: (signature: DigitalSignature) => void
  onClose: () => void
}

export default function SignatureCapture({ onSave, onClose }: SignatureCaptureProps) {
  const sigRef = useRef<SignatureCanvas>(null)
  const [signerName, setSignerName] = useState('')
  const [signerRole, setSignerRole] = useState('')

  const handleSave = async () => {
    if (!sigRef.current || sigRef.current.isEmpty() || !signerName.trim()) return
    const gps = await getCurrentGPS()
    onSave({
      id: uuidv4(),
      dataUrl: sigRef.current.toDataURL('image/png'),
      signerName: signerName.trim(),
      signerRole: signerRole.trim() || undefined,
      gps,
      timestamp: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="signature-overlay">
      <div className="signature-header">
        <button className="icon-btn" onClick={onClose}><X size={24} /></button>
        <span>Digital Signature</span>
        <div style={{ width: 40 }} />
      </div>

      <div className="signature-form">
        <input
          type="text"
          placeholder="Signer name *"
          value={signerName}
          onChange={e => setSignerName(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Role (optional)"
          value={signerRole}
          onChange={e => setSignerRole(e.target.value)}
          className="input"
        />
      </div>

      <div className="signature-pad-wrap">
        <p className="signature-hint">Sign below</p>
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{ className: 'signature-canvas' }}
          backgroundColor="white"
        />
      </div>

      <div className="signature-actions">
        <button className="btn btn-secondary" onClick={() => sigRef.current?.clear()}>
          <Eraser size={18} /> Clear
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!signerName.trim()}>
          <Check size={18} /> Save Signature
        </button>
      </div>
    </div>
  )
}
