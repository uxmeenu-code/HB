import type { GPSLocation } from '../types'

export async function getCurrentGPS(): Promise<GPSLocation | undefined> {
  if (!navigator.geolocation) return undefined

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        })
      },
      () => resolve(undefined),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
}

export function formatGPS(gps: GPSLocation): string {
  return `${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}`
}

export function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString()
}
