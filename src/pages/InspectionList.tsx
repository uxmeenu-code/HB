import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useInspections } from '../hooks/useInspections'
import { db } from '../db/database'
import type { Site, InspectionStatus } from '../types'
import { v4 as uuidv4 } from 'uuid'

const filters: { label: string; value: InspectionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Overdue', value: 'overdue' },
]

export default function InspectionList() {
  const [filter, setFilter] = useState<InspectionStatus | 'all'>('all')
  const allInspections = useInspections()
  const [sites, setSites] = useState<Site[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    db.sites.toArray().then(setSites)
  }, [])

  const filtered = allInspections.filter(insp => {
    if (filter !== 'all' && insp.status !== filter) return false
    if (search && !insp.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const getSiteName = (siteId: string) => sites.find(s => s.id === siteId)?.name || ''

  const createNewInspection = async () => {
    const templates = await db.checklistTemplates.toArray()
    const template = templates[0]
    if (!template) return

    const inspection = {
      id: uuidv4(),
      title: `New ${template.name}`,
      siteId: 'site-1',
      checklistTemplateId: template.id,
      assignedTo: 'user-2',
      status: 'pending' as const,
      items: template.items.map(item => ({
        ...item,
        status: 'pending' as const,
        photos: [],
        voiceNotes: [],
      })),
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    await db.inspections.add(inspection)
  }

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>Inspections</h1>
          <button className="btn btn-primary btn-sm" onClick={createNewInspection}>
            <Plus size={18} /> New
          </button>
        </div>

        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search inspections..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {filters.map(f => (
            <button
              key={f.value}
              className={`filter-tab ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="inspection-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>No inspections found</p>
            </div>
          ) : (
            filtered.map(insp => (
              <Link key={insp.id} to={`/inspections/${insp.id}`} className="inspection-card">
                <div className="inspection-card-body">
                  <h3>{insp.title}</h3>
                  <p>{getSiteName(insp.siteId)}</p>
                  <span className="inspection-date">
                    Due: {new Date(insp.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="inspection-card-meta">
                  <span className={`status-badge status-${insp.status}`}>
                    {insp.status.replace('_', ' ')}
                  </span>
                  <span className="progress-text">
                    {insp.items.filter(i => i.status !== 'pending').length}/{insp.items.length}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}
