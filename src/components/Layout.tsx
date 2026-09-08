import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Camera, FileText, Home } from 'lucide-react'
import OfflineIndicator from './OfflineIndicator'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/inspections', icon: ClipboardList, label: 'Inspections' },
    { path: '/photos', icon: Camera, label: 'Photos' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ]

  return (
    <div className="app-layout">
      <OfflineIndicator />
      <header className="app-header">
        <Link to="/" className="logo">
          <div className="logo-icon">IF</div>
          <span>InspectField</span>
        </Link>
      </header>

      <main className="app-main">{children}</main>

      <nav className="bottom-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${location.pathname.startsWith(path) ? 'active' : ''}`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        ))}
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={22} />
          <span>Home</span>
        </Link>
      </nav>
    </div>
  )
}
