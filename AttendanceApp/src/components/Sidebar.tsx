import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: Clock },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-cursor-secondary border-r border-border-light transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Cursor Attendance</h1>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-border-light">
            <div className="text-center text-text-tertiary text-sm">
              <p>© 2024 Cursor Attendance</p>
              <p className="mt-1">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
