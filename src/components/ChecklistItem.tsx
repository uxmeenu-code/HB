import { useState } from 'react'
import { Check, X, Minus, Camera, MapPin, Image } from 'lucide-react'
import type { ChecklistItem as ChecklistItemType, InspectionPhoto, ChecklistItemStatus } from '../types'
import CameraCapture from './CameraCapture'
import PhotoAnnotator from './PhotoAnnotator'
import { formatGPS, formatTimestamp } from '../utils/gps'

interface ChecklistItemProps {
  item: ChecklistItemType
  index: number
  onUpdate: (updated: ChecklistItemType) => void
}

export default function ChecklistItemComponent({ item, index, onUpdate }: ChecklistItemProps) {
  const [showCamera, setShowCamera] = useState(false)
  const [annotatingPhoto, setAnnotatingPhoto] = useState<InspectionPhoto | null>(null)
  const [expanded, setExpanded] = useState(item.status === 'pending')

  const setStatus = (status: ChecklistItemStatus) => {
    onUpdate({
      ...item,
      status,
      timestamp: new Date().toISOString(),
    })
  }

  const addPhoto = (photo: InspectionPhoto) => {
    onUpdate({ ...item, photos: [...item.photos, photo] })
  }

  const updatePhotoAnnotations = (photoId: string, annotations: import('../types').PhotoAnnotation[]) => {
    onUpdate({
      ...item,
      photos: item.photos.map(p => p.id === photoId ? { ...p, annotations } : p),
    })
  }

  return (
    <div className={`checklist-item ${item.status !== 'pending' ? `status-${item.status}` : ''}`}>
      <div className="checklist-item-header" onClick={() => setExpanded(!expanded)}>
        <span className="item-number">{index + 1}</span>
        <div className="item-info">
          <h4>{item.label}</h4>
          {item.category && <span className="item-category">{item.category}</span>}
        </div>
        <div className="item-status-badge">{item.status !== 'pending' ? item.status : ''}</div>
      </div>

      {expanded && (
        <div className="checklist-item-body">
          {item.description && <p className="item-desc">{item.description}</p>}

          <div className="status-buttons">
            <button className="status-btn pass" onClick={() => setStatus('pass')}>
              <Check size={18} /> Pass
            </button>
            <button className="status-btn fail" onClick={() => setStatus('fail')}>
              <X size={18} /> Fail
            </button>
            <button className="status-btn na" onClick={() => setStatus('na')}>
              <Minus size={18} /> N/A
            </button>
          </div>

          <textarea
            className="input item-notes"
            placeholder="Add notes..."
            value={item.notes || ''}
            onChange={e => onUpdate({ ...item, notes: e.target.value })}
            rows={2}
          />

          <div className="item-actions">
            <button className="action-btn action-btn-photo" onClick={() => setShowCamera(true)}>
              <Camera size={18} /> Take Photo
            </button>
          </div>

          {item.photos.length > 0 && (
            <div className="photo-grid">
              {item.photos.map(photo => (
                <div key={photo.id} className="photo-card">
                  <div className="photo-thumb" onClick={() => setAnnotatingPhoto(photo)}>
                    <img src={photo.dataUrl} alt={photo.caption || 'Photo'} />
                    {photo.severity && <span className={`photo-severity severity-${photo.severity}`}>{photo.severity}</span>}
                    {photo.annotations.length > 0 && <span className="photo-annotated"><Image size={12} /></span>}
                  </div>
                  {photo.caption && <p className="photo-caption">{photo.caption}</p>}
                  {photo.gps && (
                    <div className="gps-stamp photo-gps">
                      <MapPin size={12} />
                      <span>{formatGPS(photo.gps)} · {formatTimestamp(photo.timestamp)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showCamera && <CameraCapture onCapture={addPhoto} onClose={() => setShowCamera(false)} />}
      {annotatingPhoto && (
        <PhotoAnnotator
          imageUrl={annotatingPhoto.dataUrl}
          annotations={annotatingPhoto.annotations}
          onSave={(annotations) => {
            updatePhotoAnnotations(annotatingPhoto.id, annotations)
            setAnnotatingPhoto(null)
          }}
          onClose={() => setAnnotatingPhoto(null)}
        />
      )}
    </div>
  )
}
