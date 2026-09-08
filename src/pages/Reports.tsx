import { useState, useEffect } from 'react'
import { Download, FileText } from 'lucide-react'
import Layout from '../components/Layout'
import { db } from '../db/database'
import type { Inspection, Site, Asset } from '../types'
import { generateInspectionPDF } from '../utils/pdf'

export default function Reports() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [assets, setAssets] = useState<Asset[]>([])

  useEffect(() => {
    db.inspections
      .filter(i => i.status === 'completed' || i.status === 'failed')
      .toArray()
      .then(results => {
        results.sort((a, b) =>
          new Date(b.completedAt || b.createdAt).getTime() -
          new Date(a.completedAt || a.createdAt).getTime()
        )
        setInspections(results)
      })
    db.sites.toArray().then(setSites)
    db.assets.toArray().then(setAssets)
  }, [])

  const getSiteName = (siteId: string) => sites.find(s => s.id === siteId)?.name || ''
  const getAssetName = (assetId?: string) => assetId ? assets.find(a => a.id === assetId)?.name || '' : ''

  const downloadReport = (inspection: Inspection) => {
    const site = sites.find(s => s.id === inspection.siteId)
    const asset = inspection.assetId ? assets.find(a => a.id === inspection.assetId) : undefined
    generateInspectionPDF(inspection, site, asset)
  }

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>Reports</h1>
          <p>Download PDF reports for completed inspections</p>
        </div>

        {inspections.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <p>No completed inspections yet</p>
            <p className="empty-hint">Complete an inspection to generate a report</p>
          </div>
        ) : (
          <div className="report-list">
            {inspections.map(insp => (
              <div key={insp.id} className="report-card">
                <div className="report-card-body">
                  <h3>{insp.title}</h3>
                  <p>{getSiteName(insp.siteId)}{getAssetName(insp.assetId) ? ` · ${getAssetName(insp.assetId)}` : ''}</p>
                  <span className="report-date">
                    {insp.completedAt
                      ? new Date(insp.completedAt).toLocaleString()
                      : new Date(insp.createdAt).toLocaleString()}
                  </span>
                  <span className={`status-badge status-${insp.status}`}>
                    {insp.status}
                  </span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => downloadReport(insp)}>
                  <Download size={16} /> PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
