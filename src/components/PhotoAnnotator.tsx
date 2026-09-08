import { useRef, useState, useEffect, useCallback } from 'react'
import { Circle, Square, Type, ArrowRight, Undo2, Save, X } from 'lucide-react'
import type { PhotoAnnotation, Severity } from '../types'

interface PhotoAnnotatorProps {
  imageUrl: string
  annotations: PhotoAnnotation[]
  onSave: (annotations: PhotoAnnotation[]) => void
  onClose: () => void
}

type Tool = 'circle' | 'rectangle' | 'arrow' | 'text'

const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#ffffff']

export default function PhotoAnnotator({ imageUrl, annotations: initial, onSave, onClose }: PhotoAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [annotations, setAnnotations] = useState<PhotoAnnotation[]>(initial)
  const [tool, setTool] = useState<Tool>('circle')
  const [color, setColor] = useState('#ef4444')
  const [severity, setSeverity] = useState<Severity>('medium')
  const [drawing, setDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    annotations.forEach(ann => {
      ctx.strokeStyle = ann.color
      ctx.fillStyle = ann.color
      ctx.lineWidth = 3

      if (ann.type === 'circle' && ann.width) {
        ctx.beginPath()
        ctx.arc(ann.x, ann.y, ann.width / 2, 0, Math.PI * 2)
        ctx.stroke()
      } else if (ann.type === 'rectangle' && ann.width && ann.height) {
        ctx.strokeRect(ann.x, ann.y, ann.width, ann.height)
      } else if (ann.type === 'arrow' && ann.width && ann.height) {
        const headLen = 15
        const angle = Math.atan2(ann.height!, ann.width!)
        ctx.beginPath()
        ctx.moveTo(ann.x, ann.y)
        ctx.lineTo(ann.x + ann.width!, ann.y + ann.height!)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(ann.x + ann.width!, ann.y + ann.height!)
        ctx.lineTo(
          ann.x + ann.width! - headLen * Math.cos(angle - Math.PI / 6),
          ann.y + ann.height! - headLen * Math.sin(angle - Math.PI / 6)
        )
        ctx.moveTo(ann.x + ann.width!, ann.y + ann.height!)
        ctx.lineTo(
          ann.x + ann.width! - headLen * Math.cos(angle + Math.PI / 6),
          ann.y + ann.height! - headLen * Math.sin(angle + Math.PI / 6)
        )
        ctx.stroke()
      } else if (ann.type === 'text' && ann.text) {
        ctx.font = 'bold 16px sans-serif'
        ctx.fillText(ann.text, ann.x, ann.y)
      }
    })
  }, [annotations])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = img.width
        canvas.height = img.height
        setImageLoaded(true)
        redraw()
      }
    }
    img.src = imageUrl
  }, [imageUrl, redraw])

  useEffect(() => {
    if (imageLoaded) redraw()
  }, [annotations, imageLoaded, redraw])

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e)
    setDrawing(true)
    setStartPos(pos)

    if (tool === 'text') {
      const text = prompt('Enter annotation text:')
      if (text) {
        setAnnotations(prev => [...prev, {
          type: 'text', x: pos.x, y: pos.y, text, color, severity,
        }])
      }
      setDrawing(false)
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || tool === 'text') return
    const pos = getPos(e)
    const width = pos.x - startPos.x
    const height = pos.y - startPos.y

    if (Math.abs(width) > 5 || Math.abs(height) > 5) {
      setAnnotations(prev => [...prev, {
        type: tool,
        x: startPos.x,
        y: startPos.y,
        width: tool === 'circle' ? Math.sqrt(width * width + height * height) : width,
        height: tool === 'circle' ? undefined : height,
        color,
        severity,
      }])
    }
    setDrawing(false)
  }

  return (
    <div className="annotator-overlay">
      <div className="annotator-header">
        <button className="icon-btn" onClick={onClose}><X size={24} /></button>
        <span>Annotate Photo</span>
        <button className="icon-btn" onClick={() => onSave(annotations)}><Save size={24} /></button>
      </div>

      <div className="annotator-tools">
        {([
          { t: 'circle' as Tool, icon: Circle },
          { t: 'rectangle' as Tool, icon: Square },
          { t: 'arrow' as Tool, icon: ArrowRight },
          { t: 'text' as Tool, icon: Type },
        ]).map(({ t, icon: Icon }) => (
          <button key={t} className={`tool-btn ${tool === t ? 'active' : ''}`} onClick={() => setTool(t)}>
            <Icon size={20} />
          </button>
        ))}
        <div className="color-picker">
          {COLORS.map(c => (
            <button key={c} className={`color-dot ${color === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setColor(c)} />
          ))}
        </div>
        <select value={severity} onChange={e => setSeverity(e.target.value as Severity)} className="severity-select">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <button className="tool-btn" onClick={() => setAnnotations(prev => prev.slice(0, -1))}>
          <Undo2 size={20} />
        </button>
      </div>

      <div className="annotator-canvas-wrap">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{ maxWidth: '100%', maxHeight: '60vh', cursor: 'crosshair' }}
        />
      </div>
    </div>
  )
}
