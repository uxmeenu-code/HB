import { Link } from 'react-router-dom'
import {
  ClipboardCheck, Camera, MapPin,
  Shield, WifiOff, Smartphone, ArrowRight, CheckCircle2
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    { icon: Camera, title: 'Integrated Camera', desc: 'Instant photo capture with built-in markup — annotate defects and tag severity directly on the image' },
    { icon: MapPin, title: 'GPS-Stamped Photos', desc: 'Every photo is tagged with GPS coordinates and timestamp for a complete audit trail' },
    { icon: ClipboardCheck, title: 'Attached to Checklists', desc: 'Photos link to each inspection item so evidence stays with the right check' },
  ]

  const steps = [
    { num: '1', title: 'Open the app', desc: 'Launch InspectField on your phone or tablet. Works fully offline — no sign-in or internet required.' },
    { num: '2', title: 'Start an inspection', desc: 'Open an assigned inspection and walk through the checklist on site.' },
    { num: '3', title: 'Capture photos', desc: 'Tap Take Photo on any item. Annotate defects, tag severity, and add a caption.' },
    { num: '4', title: 'Review locally', desc: 'All photos are stored on your device with GPS proof. Browse them anytime in the Photos tab.' },
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
          <span>Offline Photo Capture — No Internet Required</span>
        </div>
        <h1>Capture & Annotate Inspection Photos Offline</h1>
        <p className="hero-sub">
          Take photos on site, annotate defects, and tag severity — all stored locally on your device.
          Every photo is GPS-stamped and linked to the right checklist item.
        </p>
        <div className="hero-actions">
          <Link to="/inspections" className="btn btn-primary btn-lg">
            Start Inspecting <ArrowRight size={20} />
          </Link>
          <Link to="/photos" className="btn btn-secondary btn-lg">
            View Photos
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <Shield size={20} />
            <span>Photos saved offline in harsh environments</span>
          </div>
          <div className="stat">
            <Smartphone size={20} />
            <span>Install as app on any device</span>
          </div>
          <div className="stat">
            <CheckCircle2 size={20} />
            <span>Markup tools built in</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Photo capture for field teams</h2>
        <p className="section-sub">Replace loose camera-roll photos and WhatsApp threads with organized, GPS-stamped evidence.</p>
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
              <li>Loose photos scattered across personal camera rolls</li>
              <li>No link between a photo and the inspection item it documents</li>
              <li>No GPS proof of where or when a photo was taken</li>
            </ul>
          </div>
          <div className="comparison-col after">
            <h3>After InspectField</h3>
            <ul>
              <li>Every photo attached to the right checklist item</li>
              <li>Defects annotated with severity tags on the image</li>
              <li>GPS coordinates and timestamps on every photo</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to capture photos offline?</h2>
        <p>No account needed. No internet required. Just open and shoot.</p>
        <Link to="/inspections" className="btn btn-primary btn-lg">
          Get Started <ArrowRight size={20} />
        </Link>
      </section>

      <footer className="landing-footer">
        <p>InspectField — Offline Photo Capture for Inspections</p>
      </footer>
    </div>
  )
}
