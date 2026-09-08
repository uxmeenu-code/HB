import { useState, useEffect } from 'react'
import { QrCode, Search, History } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import Layout from '../components/Layout'
import QRScanner from '../components/QRScanner'
import { db } from '../db/database'
import type { Asset, Site } from '../types'

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [search, setSearch] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null)

  useEffect(() => {
    db.assets.toArray().then(setAssets)
    db.sites.toArray().then(setSites)
  }, [])

  const getSiteName = (siteId: string) => sites.find(s => s.id === siteId)?.name || ''

  const handleScan = async (code: string) => {
    const asset = await db.assets.where('qrCode').equals(code).first()
    if (asset) {
      setScannedAsset(asset)
    } else {
      alert(`No asset found for QR code: ${code}`)
    }
  }

  const filtered = assets.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.qrCode.toLowerCase().includes(search.toLowerCase())
  )

  const startInspectionForAsset = async (asset: Asset) => {
    const template = await db.checklistTemplates
      .filter(t => t.assetType === asset.type || !t.assetType)
      .first()
    if (!template) return

    const inspection = {
      id: uuidv4(),
      title: `${template.name} - ${asset.name}`,
      siteId: asset.siteId,
      assetId: asset.id,
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
    window.location.href = `/inspections/${inspection.id}`
  }

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>Assets</h1>
          <button className="btn btn-primary btn-sm" onClick={() => setShowScanner(true)}>
            <QrCode size={18} /> Scan QR
          </button>
        </div>

        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search assets or QR codes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {scannedAsset && (
          <div className="scanned-asset-card">
            <h3>Scanned: {scannedAsset.name}</h3>
            <p>{scannedAsset.location} · {getSiteName(scannedAsset.siteId)}</p>
            <p className="qr-code-label">QR: {scannedAsset.qrCode}</p>

            {scannedAsset.maintenanceHistory.length > 0 && (
              <div className="maintenance-history">
                <h4><History size={16} /> Maintenance History</h4>
                {scannedAsset.maintenanceHistory.map(record => (
                  <div key={record.id} className="history-item">
                    <span className="history-date">{new Date(record.date).toLocaleDateString()}</span>
                    <span>{record.description}</span>
                    <span className="history-tech">{record.technician}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="btn btn-primary" onClick={() => startInspectionForAsset(scannedAsset)}>
              Start Inspection
            </button>
            <button className="btn btn-secondary" onClick={() => setScannedAsset(null)}>
              Dismiss
            </button>
          </div>
        )}

        <div className="asset-list">
          {filtered.map(asset => (
            <div key={asset.id} className="asset-card">
              <div className="asset-card-header">
                <h3>{asset.name}</h3>
                <span className="asset-type">{asset.type}</span>
              </div>
              <p>{asset.location}</p>
              <p className="asset-site">{getSiteName(asset.siteId)}</p>
              <div className="asset-card-footer">
                <span className="qr-code-label">{asset.qrCode}</span>
                <button className="btn btn-sm btn-primary" onClick={() => startInspectionForAsset(asset)}>
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </Layout>
  )
}
