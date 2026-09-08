import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Image } from 'lucide-react'
import Layout from '../components/Layout'
import PhotoAnnotator from '../components/PhotoAnnotator'
import { db } from '../db/database'
import type { InspectionPhoto } from '../types'
import { formatGPS, formatTimestamp } from '../utils/gps'

interface PhotoEntry {
  photo: InspectionPhoto
  inspectionId: string
  inspectionTitle: string
  itemLabel: string
}

export default function Photos() {
  const [photos, setPhotos] = useState<PhotoEntry[]>([])
  const [annotating, setAnnotating] = useState<PhotoEntry | null>(null)

  useEffect(() => {
    async function load() {
      const inspections = await db.inspections.toArray()
      const entries: PhotoEntry[] = []

      for (const insp of inspections) {
        for (const item of insp.items) {
          for (const photo of item.photos) {
            entries.push({
              photo,
              inspectionId: insp.id,
              inspectionTitle: insp.title,
              itemLabel: item.label,
            })
          }
        }
      }

      entries.sort((a, b) =>
        new Date(b.photo.timestamp).getTime() - new Date(a.photo.timestamp).getTime()
      )
      setPhotos(entries)
    }

    load()
    const interval = setInterval(load, 2000)
    return () => clearInterval(interval)
  }, [])

  const saveAnnotations = async (entry: PhotoEntry, annotations: import('../types').PhotoAnnotation[]) => {
    const inspection = await db.inspections.get(entry.inspectionId)
    if (!inspection) return

    const items = inspection.items.map(item => ({
      ...item,
      photos: item.photos.map(p =>
        p.id === entry.photo.id ? { ...p, annotations } : p
      ),
    }))

    await db.inspections.update(entry.inspectionId, { items })
    setAnnotating(null)
    setPhotos(prev => prev.map(e =>
      e.photo.id === entry.photo.id
        ? { ...e, photo: { ...e.photo, annotations } }
        : e
    ))
  }

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>Photos</h1>
          <p>{photos.length} captured offline</p>
        </div>

        {photos.length === 0 ? (
          <div className="empty-state">
            <Image size={48} />
            <p>No photos yet</p>
            <p className="empty-hint">Take photos during an inspection to see them here</p>
            <Link to="/inspections" className="btn btn-primary" style={{ marginTop: 16 }}>
              Go to Inspections
            </Link>
          </div>
        ) : (
          <div className="photos-gallery">
            {photos.map(entry => (
              <div key={entry.photo.id} className="gallery-card">
                <div
                  className="gallery-image"
                  onClick={() => setAnnotating(entry)}
                >
                  <img src={entry.photo.dataUrl} alt={entry.itemLabel} />
                  {entry.photo.severity && (
                    <span className={`photo-severity severity-${entry.photo.severity}`}>
                      {entry.photo.severity}
                    </span>
                  )}
                  {entry.photo.annotations.length > 0 && (
                    <span className="photo-annotated gallery-annotated"><Image size={14} /></span>
                  )}
                </div>
                <div className="gallery-meta">
                  <h3>{entry.itemLabel}</h3>
                  <p>{entry.inspectionTitle}</p>
                  {entry.photo.caption && <p className="photo-caption">{entry.photo.caption}</p>}
                  {entry.photo.gps && (
                    <div className="gps-stamp">
                      <MapPin size={12} />
                      <span>{formatGPS(entry.photo.gps)} · {formatTimestamp(entry.photo.timestamp)}</span>
                    </div>
                  )}
                  <Link to={`/inspections/${entry.inspectionId}`} className="link">
                    View inspection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {annotating && (
        <PhotoAnnotator
          imageUrl={annotating.photo.dataUrl}
          annotations={annotating.photo.annotations}
          onSave={(annotations) => saveAnnotations(annotating, annotations)}
          onClose={() => setAnnotating(null)}
        />
      )}
    </Layout>
  )
}
