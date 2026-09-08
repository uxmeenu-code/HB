import { db } from './database'
import type { ChecklistTemplate, Site, Asset, User, Inspection } from '../types'

const sites: Site[] = [
  { id: 'site-1', name: 'Meridian Tower', address: '1200 Commerce Blvd, Austin, TX' },
  { id: 'site-2', name: 'Riverside Complex', address: '450 River Rd, Austin, TX' },
  { id: 'site-3', name: 'North Campus', address: '88 University Dr, Austin, TX' },
]

const users: User[] = [
  { id: 'user-1', name: 'Sarah Mitchell', email: 'sarah@meridian.com', role: 'manager' },
  { id: 'user-2', name: 'James Chen', email: 'james@meridian.com', role: 'inspector' },
  { id: 'user-3', name: 'Maria Garcia', email: 'maria@meridian.com', role: 'inspector' },
]

const checklistTemplates: ChecklistTemplate[] = [
  {
    id: 'cl-safety',
    name: 'Safety Inspection Checklist',
    description: 'Daily site safety walkthrough',
    items: [
      { id: 'si-1', label: 'Fire exits clear and accessible', category: 'Fire Safety', required: true },
      { id: 'si-2', label: 'Fire extinguishers inspected and tagged', category: 'Fire Safety', required: true },
      { id: 'si-3', label: 'Emergency lighting functional', category: 'Fire Safety', required: true },
      { id: 'si-4', label: 'Walkways free of trip hazards', category: 'General Safety', required: true },
      { id: 'si-5', label: 'PPE stations stocked', category: 'General Safety', required: false },
      { id: 'si-6', label: 'First aid kit complete', category: 'General Safety', required: true },
      { id: 'si-7', label: 'Scaffolding properly secured', category: 'Structural', required: true },
      { id: 'si-8', label: 'Electrical panels accessible', category: 'Electrical', required: true },
    ],
  },
  {
    id: 'cl-hvac',
    name: 'HVAC Maintenance Checklist',
    description: 'Quarterly HVAC unit inspection',
    assetType: 'hvac',
    items: [
      { id: 'hv-1', label: 'Air filters clean or replaced', category: 'Filters', required: true },
      { id: 'hv-2', label: 'Condenser coils clean', category: 'Coils', required: true },
      { id: 'hv-3', label: 'Refrigerant levels normal', category: 'Refrigerant', required: true },
      { id: 'hv-4', label: 'Belt tension correct', category: 'Mechanical', required: true },
      { id: 'hv-5', label: 'Thermostat calibration verified', category: 'Controls', required: false },
      { id: 'hv-6', label: 'Drain lines clear', category: 'Drainage', required: true },
    ],
  },
  {
    id: 'cl-building',
    name: 'Building Inspection Checklist',
    description: 'Monthly building condition assessment',
    items: [
      { id: 'bi-1', label: 'Roof condition - no visible damage', category: 'Exterior', required: true },
      { id: 'bi-2', label: 'Foundation - no cracks or settling', category: 'Structure', required: true },
      { id: 'bi-3', label: 'Windows and doors seal properly', category: 'Envelope', required: true },
      { id: 'bi-4', label: 'Plumbing - no leaks detected', category: 'Plumbing', required: true },
      { id: 'bi-5', label: 'HVAC operational', category: 'Mechanical', required: true },
      { id: 'bi-6', label: 'Elevator inspection current', category: 'Mechanical', required: true },
      { id: 'bi-7', label: 'Parking lot condition acceptable', category: 'Exterior', required: false },
      { id: 'bi-8', label: 'Landscaping maintained', category: 'Exterior', required: false },
    ],
  },
]

const assets: Asset[] = [
  {
    id: 'asset-1',
    name: 'HVAC Unit A - Floor 3',
    qrCode: 'HVAC-A3-001',
    type: 'hvac',
    location: 'Floor 3, Mechanical Room',
    siteId: 'site-1',
    maintenanceHistory: [
      { id: 'mh-1', date: '2026-06-15', description: 'Filter replacement', technician: 'James Chen' },
      { id: 'mh-2', date: '2026-03-10', description: 'Coil cleaning', technician: 'Maria Garcia' },
    ],
  },
  {
    id: 'asset-2',
    name: 'HVAC Unit B - Floor 5',
    qrCode: 'HVAC-B5-002',
    type: 'hvac',
    location: 'Floor 5, Mechanical Room',
    siteId: 'site-1',
    maintenanceHistory: [
      { id: 'mh-3', date: '2026-07-01', description: 'Refrigerant top-up', technician: 'James Chen' },
    ],
  },
  {
    id: 'asset-3',
    name: 'Fire Panel - Lobby',
    qrCode: 'FIRE-LB-001',
    type: 'fire',
    location: 'Lobby, Security Desk',
    siteId: 'site-1',
    maintenanceHistory: [],
  },
  {
    id: 'asset-4',
    name: 'Elevator 1',
    qrCode: 'ELEV-01',
    type: 'elevator',
    location: 'Main Tower',
    siteId: 'site-2',
    maintenanceHistory: [
      { id: 'mh-4', date: '2026-05-20', description: 'Annual certification', technician: 'External Vendor' },
    ],
  },
]

function createInspectionItems(templateId: string) {
  const template = checklistTemplates.find(t => t.id === templateId)
  if (!template) return []
  return template.items.map(item => ({
    ...item,
    status: 'pending' as const,
    photos: [],
    voiceNotes: [],
  }))
}

const now = new Date()
const tomorrow = new Date(now)
tomorrow.setDate(tomorrow.getDate() + 1)
const yesterday = new Date(now)
yesterday.setDate(yesterday.getDate() - 1)
const lastWeek = new Date(now)
lastWeek.setDate(lastWeek.getDate() - 7)

const inspections: Inspection[] = [
  {
    id: 'insp-1',
    title: 'Daily Safety Walk - Meridian Tower',
    siteId: 'site-1',
    checklistTemplateId: 'cl-safety',
    assignedTo: 'user-2',
    status: 'pending',
    items: createInspectionItems('cl-safety'),
    dueDate: now.toISOString(),
    createdAt: now.toISOString(),
  },
  {
    id: 'insp-2',
    title: 'HVAC Quarterly - Unit A3',
    siteId: 'site-1',
    assetId: 'asset-1',
    checklistTemplateId: 'cl-hvac',
    assignedTo: 'user-2',
    status: 'in_progress',
    items: createInspectionItems('cl-hvac').map((item, i) =>
      i < 2 ? { ...item, status: 'pass' as const, timestamp: now.toISOString() } : item
    ),
    startedAt: now.toISOString(),
    dueDate: tomorrow.toISOString(),
    createdAt: yesterday.toISOString(),
  },
  {
    id: 'insp-3',
    title: 'Monthly Building Check - Riverside',
    siteId: 'site-2',
    checklistTemplateId: 'cl-building',
    assignedTo: 'user-3',
    status: 'overdue',
    items: createInspectionItems('cl-building'),
    dueDate: yesterday.toISOString(),
    createdAt: lastWeek.toISOString(),
  },
  {
    id: 'insp-4',
    title: 'Safety Walk - North Campus',
    siteId: 'site-3',
    checklistTemplateId: 'cl-safety',
    assignedTo: 'user-3',
    status: 'completed',
    items: createInspectionItems('cl-safety').map(item => ({
      ...item,
      status: 'pass' as const,
      timestamp: lastWeek.toISOString(),
    })),
    completedAt: lastWeek.toISOString(),
    startedAt: lastWeek.toISOString(),
    dueDate: lastWeek.toISOString(),
    createdAt: lastWeek.toISOString(),
  },
]

export async function seedDatabase() {
  const count = await db.inspections.count()
  if (count > 0) return

  await db.transaction('rw', [db.sites, db.users, db.checklistTemplates, db.assets, db.inspections], async () => {
    await db.sites.bulkAdd(sites)
    await db.users.bulkAdd(users)
    await db.checklistTemplates.bulkAdd(checklistTemplates)
    await db.assets.bulkAdd(assets)
    await db.inspections.bulkAdd(inspections)
  })
}
