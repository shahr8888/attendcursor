import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { AttendanceProvider } from './contexts/AttendanceContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AttendanceProvider>
      <div className="flex h-screen bg-cursor-primary">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="lg:hidden bg-cursor-secondary border-b border-border-light p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-text-secondary hover:text-text-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Main content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-cursor-primary">
            <div className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </AttendanceProvider>
  )
}

export default App
