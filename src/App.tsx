import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import InspectionList from './pages/InspectionList'
import InspectionDetail from './pages/InspectionDetail'
import Assets from './pages/Assets'
import Reports from './pages/Reports'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inspections" element={<InspectionList />} />
        <Route path="/inspections/:id" element={<InspectionDetail />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  )
}
