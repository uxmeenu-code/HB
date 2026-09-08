import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, Flashlight } from 'lucide-react'

interface QRScannerProps {
  onScan: (code: string) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        onScan(decodedText)
        scanner.stop().catch(() => {})
        onClose()
      },
      () => {}
    ).then(() => setScanning(true)).catch(() => {
      setError('Camera access denied. Please allow camera permissions to scan QR codes.')
    })

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [onScan, onClose])

  return (
    <div className="qr-overlay">
      <div className="qr-header">
        <button className="icon-btn" onClick={() => {
          scannerRef.current?.stop().catch(() => {})
          onClose()
        }}>
          <X size={24} />
        </button>
        <span>Scan QR Code</span>
        <div style={{ width: 40 }} />
      </div>

      {error ? (
        <div className="qr-error">
          <p>{error}</p>
        </div>
      ) : (
        <div className="qr-reader-wrap">
          <div id="qr-reader" />
          {scanning && (
            <p className="qr-hint">
              <Flashlight size={16} /> Point camera at asset QR code
            </p>
          )}
        </div>
      )}
    </div>
  )
}
