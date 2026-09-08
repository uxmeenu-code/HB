import Dexie, { type Table } from 'dexie'
import type { Inspection, Asset, Site, ChecklistTemplate, User } from '../types'

export class InspectFieldDB extends Dexie {
  inspections!: Table<Inspection>
  assets!: Table<Asset>
  sites!: Table<Site>
  checklistTemplates!: Table<ChecklistTemplate>
  users!: Table<User>

  constructor() {
    super('InspectFieldDB')
    this.version(1).stores({
      inspections: 'id, siteId, assetId, status, assignedTo, dueDate, createdAt',
      assets: 'id, qrCode, siteId, type',
      sites: 'id, name',
      checklistTemplates: 'id, assetType',
      users: 'id, email',
    })
  }
}

export const db = new InspectFieldDB()
