import { WifiOff, Wifi } from 'lucide-react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  return (
    <div className={`offline-banner ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? (
        <>
          <Wifi size={14} />
          <span>Offline — Photos stored locally on device</span>
        </>
      ) : (
        <>
          <WifiOff size={14} />
          <span>Offline Mode — Photos saved locally, no connection needed</span>
        </>
      )}
    </div>
  )
}
