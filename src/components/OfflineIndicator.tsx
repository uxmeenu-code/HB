import { WifiOff, Wifi } from 'lucide-react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  return (
    <div className={`offline-banner ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? (
        <>
          <Wifi size={14} />
          <span>Online — All data stored locally</span>
        </>
      ) : (
        <>
          <WifiOff size={14} />
          <span>Offline Mode — Working locally, no connection needed</span>
        </>
      )}
    </div>
  )
}
