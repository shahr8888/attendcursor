import { useEffect, useState } from 'react'
import { useAttendance } from '../contexts/AttendanceContext'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'

export default function Dashboard() {
  const { getAttendanceStats, getTodayAttendance } = useAttendance()
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
  })
  const [todayRecords, setTodayRecords] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Get initial stats
    const initialStats = getAttendanceStats()
    setStats(initialStats)
    setTodayRecords(getTodayAttendance())

    return () => clearInterval(timer)
  }, [getAttendanceStats, getTodayAttendance])

  const attendanceRate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.total,
      icon: Users,
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue bg-opacity-10',
    },
    {
      title: 'Present Today',
      value: stats.present,
      icon: CheckCircle,
      color: 'text-status-success',
      bgColor: 'bg-status-success bg-opacity-10',
    },
    {
      title: 'Absent Today',
      value: stats.absent,
      icon: XCircle,
      color: 'text-status-error',
      bgColor: 'bg-status-error bg-opacity-10',
    },
    {
      title: 'Late Today',
      value: stats.late,
      icon: AlertTriangle,
      color: 'text-status-warning',
      bgColor: 'bg-status-warning bg-opacity-10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome to Cursor Attendance Management System
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-text-secondary text-sm">Current Time</p>
            <p className="text-text-primary font-mono text-lg">
              {format(currentTime, 'HH:mm:ss')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-text-secondary text-sm">Today's Date</p>
            <p className="text-text-primary font-medium">
              {format(currentTime, 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-text-primary mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Attendance Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Attendance Rate
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-cursor-surface-variant"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-accent-cyan"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${attendanceRate}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-text-primary">
                  {attendanceRate}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-text-secondary text-sm">
                {stats.present} out of {stats.total} employees present today
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-status-success rounded-full"></div>
                  <span className="text-text-secondary text-sm">Present: {stats.present}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-status-error rounded-full"></div>
                  <span className="text-text-secondary text-sm">Absent: {stats.absent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-status-warning rounded-full"></div>
                  <span className="text-text-secondary text-sm">Late: {stats.late}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-primary">
              <Clock className="w-4 h-4 mr-2" />
              Record Attendance
            </button>
            <button className="w-full btn-secondary">
              <Users className="w-4 h-4 mr-2" />
              Add Employee
            </button>
            <button className="w-full btn-secondary">
              <Calendar className="w-4 h-4 mr-2" />
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Recent Activity
        </h3>
        {todayRecords.length > 0 ? (
          <div className="space-y-3">
            {todayRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-cursor-surface-variant rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
                  <span className="text-text-primary font-medium">
                    Employee {record.employeeId}
                  </span>
                  <span className="text-text-secondary text-sm">
                    {record.status}
                  </span>
                </div>
                <span className="text-text-secondary text-sm">
                  {record.checkIn ? `Checked in at ${record.checkIn}` : 'Not checked in'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary">No attendance records for today</p>
          </div>
        )}
      </div>
    </div>
  )
}
