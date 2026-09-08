import { Link } from 'react-router-dom'
import {
  ClipboardCheck, Camera, PenTool, QrCode, Mic, MapPin,
  Shield, WifiOff, Smartphone, ArrowRight, CheckCircle2
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    { icon: ClipboardCheck, title: 'Digital Checklists', desc: 'Complete guided inspections with pass/fail tracking on every item' },
    { icon: Camera, title: 'Photo Capture & Markup', desc: 'Capture photos, annotate defects, and tag severity directly on images' },
    { icon: PenTool, title: 'Digital Signatures', desc: 'Collect on-site sign-offs tied to inspection records with timestamps' },
    { icon: QrCode, title: 'QR Code Scanning', desc: 'Scan asset barcodes to pull up maintenance history and load checklists' },
    { icon: Mic, title: 'Voice-to-Text Notes', desc: 'Dictate observations hands-free while keeping eyes on the asset' },
    { icon: MapPin, title: 'GPS-Stamped Records', desc: 'Every action tagged with GPS coordinates and time for audit trails' },
  ]

  const steps = [
    { num: '1', title: 'Open the app', desc: 'Launch InspectField on your phone or tablet. All data is stored locally — no sign-in or internet required.' },
    { num: '2', title: 'Start an inspection', desc: 'Tap an assigned inspection or scan an asset QR code. The right checklist loads automatically.' },
    { num: '3', title: 'Capture findings', desc: 'Answer each item, take photos, annotate defects, dictate voice notes, and collect signatures.' },
    { num: '4', title: 'Submit locally', desc: 'Complete the inspection and generate a PDF report — all stored on your device, fully offline.' },
  ]

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="logo">
          <div className="logo-icon">IF</div>
          <span>InspectField</span>
        </div>
        <Link to="/dashboard" className="btn btn-primary">
          Open App <ArrowRight size={18} />
        </Link>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <WifiOff size={14} />
          <span>100% Offline — No Internet Required</span>
        </div>
        <h1>Mobile Inspection App for Field Teams</h1>
        <p className="hero-sub">
          Complete inspections on site with checklists, photos, signatures, QR scanning, and voice notes.
          Every record is GPS-stamped and stored locally on your device.
        </p>
        <div className="hero-actions">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Start Inspecting <ArrowRight size={20} />
          </Link>
          <Link to="/inspections" className="btn btn-secondary btn-lg">
            View Inspections
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <Shield size={20} />
            <span>Works offline in harsh environments</span>
          </div>
          <div className="stat">
            <Smartphone size={20} />
            <span>Install as app on any device</span>
          </div>
          <div className="stat">
            <CheckCircle2 size={20} />
            <span>No training required</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>What InspectField includes</h2>
        <p className="section-sub">Everything field teams need to replace paper forms and WhatsApp photo threads.</p>
        <div className="features-grid">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon"><Icon size={28} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <h2>How it works</h2>
        <div className="steps">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="step">
              <div className="step-num">{num}</div>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Before vs After</h2>
        <div className="comparison">
          <div className="comparison-col before">
            <h3>Before InspectField</h3>
            <ul>
              <li>Paper forms on a clipboard, loose photos on personal phones</li>
              <li>Data typed into spreadsheets days later — or never</li>
              <li>Missed inspections found only when a client complains</li>
            </ul>
          </div>
          <div className="comparison-col after">
            <h3>After InspectField</h3>
            <ul>
              <li>Every check completed in one app with photos attached</li>
              <li>Records stored instantly on device with GPS proof</li>
              <li>Dashboard shows completed, overdue, and failed inspections</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to run inspections offline?</h2>
        <p>No account needed. No internet required. Just open and inspect.</p>
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          Get Started <ArrowRight size={20} />
        </Link>
      </section>

      <footer className="landing-footer">
        <p>InspectField — Offline Mobile Inspection App</p>
      </footer>
    </div>
  )
}
