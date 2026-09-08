import { Link } from 'react-router-dom'
import { ClipboardList, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import Layout from '../components/Layout'
import { useDashboardStats, useInspections } from '../hooks/useInspections'
import { db } from '../db/database'
import { useEffect, useState } from 'react'
import type { Site } from '../types'

export default function Dashboard() {
  const stats = useDashboardStats()
  const recentInspections = useInspections()
  const [sites, setSites] = useState<Site[]>([])

  useEffect(() => {
    db.sites.toArray().then(setSites)
  }, [])

  const getSiteName = (siteId: string) => sites.find(s => s.id === siteId)?.name || siteId

  const statCards = [
    { label: 'Total', value: stats.total, icon: ClipboardList, color: 'teal' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'blue' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'red' },
  ]

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Real-time overview of all inspections</p>
        </div>

        <div className="compliance-card">
          <div className="compliance-info">
            <TrendingUp size={24} />
            <div>
              <h3>Compliance Rate</h3>
              <p>Across all sites</p>
            </div>
          </div>
          <div className="compliance-value">{stats.complianceRate}%</div>
        </div>

        <div className="stats-grid">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`stat-card stat-${color}`}>
              <Icon size={22} />
              <div>
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="section-header">
          <h2>Recent Inspections</h2>
          <Link to="/inspections" className="link">View all</Link>
        </div>

        <div className="inspection-list">
          {recentInspections.slice(0, 5).map(insp => (
            <Link key={insp.id} to={`/inspections/${insp.id}`} className="inspection-card">
              <div className="inspection-card-body">
                <h3>{insp.title}</h3>
                <p>{getSiteName(insp.siteId)}</p>
              </div>
              <span className={`status-badge status-${insp.status}`}>
                {insp.status.replace('_', ' ')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
