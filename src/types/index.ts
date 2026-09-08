export type InspectionStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'failed'
export type ChecklistItemStatus = 'pending' | 'pass' | 'fail' | 'na'
export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface GPSLocation {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: string
}

export interface PhotoAnnotation {
  type: 'circle' | 'arrow' | 'text' | 'rectangle'
  x: number
  y: number
  width?: number
  height?: number
  text?: string
  color: string
  severity?: Severity
}

export interface InspectionPhoto {
  id: string
  dataUrl: string
  annotations: PhotoAnnotation[]
  caption?: string
  severity?: Severity
  gps?: GPSLocation
  timestamp: string
}

export interface VoiceNote {
  id: string
  text: string
  gps?: GPSLocation
  timestamp: string
}

export interface DigitalSignature {
  id: string
  dataUrl: string
  signerName: string
  signerRole?: string
  gps?: GPSLocation
  timestamp: string
}

export interface ChecklistItem {
  id: string
  label: string
  description?: string
  category?: string
  required: boolean
  status: ChecklistItemStatus
  notes?: string
  photos: InspectionPhoto[]
  voiceNotes: VoiceNote[]
  gps?: GPSLocation
  timestamp?: string
}

export interface Asset {
  id: string
  name: string
  qrCode: string
  type: string
  location: string
  siteId: string
  maintenanceHistory: MaintenanceRecord[]
}

export interface MaintenanceRecord {
  id: string
  date: string
  description: string
  technician: string
}

export interface Site {
  id: string
  name: string
  address: string
}

export interface ChecklistTemplate {
  id: string
  name: string
  description: string
  assetType?: string
  items: Omit<ChecklistItem, 'status' | 'photos' | 'voiceNotes'>[]
}

export interface Inspection {
  id: string
  title: string
  siteId: string
  assetId?: string
  checklistTemplateId: string
  assignedTo: string
  status: InspectionStatus
  items: ChecklistItem[]
  signature?: DigitalSignature
  startedAt?: string
  completedAt?: string
  dueDate: string
  gps?: GPSLocation
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'inspector' | 'manager' | 'admin'
}

export interface DashboardStats {
  total: number
  completed: number
  pending: number
  overdue: number
  failed: number
  complianceRate: number
}
