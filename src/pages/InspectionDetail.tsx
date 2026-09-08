import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, PenTool, Send, Download } from 'lucide-react'
import Layout from '../components/Layout'
import ChecklistItemComponent from '../components/ChecklistItem'
import SignatureCapture from '../components/SignatureCapture'
import { db } from '../db/database'
import type { Inspection, Site, Asset, ChecklistItem, DigitalSignature } from '../types'
import { getCurrentGPS, formatGPS, formatTimestamp } from '../utils/gps'
import { generateInspectionPDF } from '../utils/pdf'

export default function InspectionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [site, setSite] = useState<Site | null>(null)
  const [asset, setAsset] = useState<Asset | null>(null)
  const [showSignature, setShowSignature] = useState(false)

  const loadInspection = useCallback(async () => {
    if (!id) return
    const insp = await db.inspections.get(id)
    if (!insp) return
    setInspection(insp)
    const s = await db.sites.get(insp.siteId)
    setSite(s || null)
    if (insp.assetId) {
      const a = await db.assets.get(insp.assetId)
      setAsset(a || null)
    }
  }, [id])

  useEffect(() => {
    loadInspection()
  }, [loadInspection])

  const updateItem = async (itemId: string, updated: ChecklistItem) => {
    if (!inspection) return
    const items = inspection.items.map(i => i.id === itemId ? updated : i)
    const hasStarted = items.some(i => i.status !== 'pending')
    const allDone = items.every(i => i.status !== 'pending')
    const hasFailed = items.some(i => i.status === 'fail')

    const updates: Partial<Inspection> = {
      items,
      status: allDone ? (hasFailed ? 'failed' : 'completed') : hasStarted ? 'in_progress' : inspection.status,
    }

    if (hasStarted && !inspection.startedAt) {
      updates.startedAt = new Date().toISOString()
      updates.gps = await getCurrentGPS()
    }

    if (allDone) {
      updates.completedAt = new Date().toISOString()
    }

    await db.inspections.update(inspection.id, updates)
    loadInspection()
  }

  const handleSignature = async (signature: DigitalSignature) => {
    if (!inspection) return
    await db.inspections.update(inspection.id, { signature })
    loadInspection()
  }

  const submitInspection = async () => {
    if (!inspection) return
    const gps = await getCurrentGPS()
    const allDone = inspection.items.every(i => i.status !== 'pending')
    const hasFailed = inspection.items.some(i => i.status === 'fail')

    await db.inspections.update(inspection.id, {
      status: allDone ? (hasFailed ? 'failed' : 'completed') : 'in_progress',
      completedAt: allDone ? new Date().toISOString() : undefined,
      gps,
    })
    loadInspection()
  }

  const downloadPDF = () => {
    if (!inspection) return
    generateInspectionPDF(inspection, site || undefined, asset || undefined)
  }

  if (!inspection) {
    return (
      <Layout>
        <div className="page">
          <p>Inspection not found</p>
        </div>
      </Layout>
    )
  }

  const completedCount = inspection.items.filter(i => i.status !== 'pending').length
  const progress = Math.round((completedCount / inspection.items.length) * 100)

  return (
    <Layout>
      <div className="page inspection-detail">
        <div className="detail-header">
          <button className="icon-btn" onClick={() => navigate('/inspections')}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1>{inspection.title}</h1>
            {site && <p className="detail-site">{site.name}</p>}
          </div>
        </div>

        {asset && (
          <div className="asset-banner">
            <strong>{asset.name}</strong>
            <span>{asset.location}</span>
          </div>
        )}

        <div className="progress-bar-wrap">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-label">{completedCount}/{inspection.items.length} items ({progress}%)</span>
        </div>

        <div className={`status-banner status-${inspection.status}`}>
          Status: {inspection.status.replace('_', ' ')}
        </div>

        {inspection.gps && (
          <div className="gps-stamp detail-gps">
            <MapPin size={14} />
            <span>{formatGPS(inspection.gps)} · {formatTimestamp(inspection.gps.timestamp)}</span>
          </div>
        )}

        <div className="checklist">
          {inspection.items.map((item, index) => (
            <ChecklistItemComponent
              key={item.id}
              item={item}
              index={index}
              onUpdate={(updated) => updateItem(item.id, updated)}
            />
          ))}
        </div>

        <div className="detail-actions">
          {!inspection.signature && (
            <button className="btn btn-secondary" onClick={() => setShowSignature(true)}>
              <PenTool size={18} /> Add Signature
            </button>
          )}
          {inspection.signature && (
            <div className="signature-preview">
              <img src={inspection.signature.dataUrl} alt="Signature" />
              <span>Signed by {inspection.signature.signerName}</span>
            </div>
          )}
          <button className="btn btn-primary" onClick={submitInspection}>
            <Send size={18} /> Submit Inspection
          </button>
          {(inspection.status === 'completed' || inspection.status === 'failed') && (
            <button className="btn btn-secondary" onClick={downloadPDF}>
              <Download size={18} /> Download PDF Report
            </button>
          )}
        </div>
      </div>

      {showSignature && (
        <SignatureCapture
          onSave={handleSignature}
          onClose={() => setShowSignature(false)}
        />
      )}
    </Layout>
  )
}
