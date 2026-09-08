import { useState, useEffect } from 'react'
import type { DashboardStats, InspectionStatus } from '../types'
import { db } from '../db/database'

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    failed: 0,
    complianceRate: 0,
  })

  useEffect(() => {
    async function load() {
      const inspections = await db.inspections.toArray()
      const total = inspections.length
      const completed = inspections.filter(i => i.status === 'completed').length
      const pending = inspections.filter(i => i.status === 'pending' || i.status === 'in_progress').length
      const overdue = inspections.filter(i => i.status === 'overdue').length
      const failed = inspections.filter(i => i.status === 'failed').length
      const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 0

      setStats({ total, completed, pending, overdue, failed, complianceRate })
    }
    load()

    const interval = setInterval(load, 2000)
    return () => clearInterval(interval)
  }, [])

  return stats
}

export function useInspections(statusFilter?: InspectionStatus) {
  const [inspections, setInspections] = useState<import('../types').Inspection[]>([])

  useEffect(() => {
    async function load() {
      let results = await db.inspections.toArray()
      if (statusFilter) {
        results = results.filter(i => i.status === statusFilter)
      }
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setInspections(results)
    }
    load()

    const interval = setInterval(load, 2000)
    return () => clearInterval(interval)
  }, [statusFilter])

  return inspections
}
