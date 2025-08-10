import { useState, useEffect } from 'react'
import { useAttendance } from '../contexts/AttendanceContext'
import { BarChart3, Calendar, Download, Filter, TrendingUp, Users, Clock } from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

export default function Reports() {
  const { state, getAttendanceByDate } = useAttendance()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [startDate, setStartDate] = useState(startOfWeek(new Date()).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(endOfWeek(new Date()).toISOString().split('T')[0])
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const departments = [...new Set(state.employees.map(emp => emp.department))]

  const getDateRange = () => {
    const end = new Date(endDate)
    const start = new Date(startDate)
    return eachDayOfInterval({ start, end })
  }

  const getAttendanceData = () => {
    const dateRange = getDateRange()
    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const records = getAttendanceByDate(dateStr)
      const totalEmployees = state.employees.filter(emp => emp.status === 'active').length
      
      return {
        date: format(date, 'MMM dd'),
        present: records.filter(r => r.status === 'present').length,
        absent: records.filter(r => r.status === 'absent').length,
        late: records.filter(r => r.status === 'late').length,
        leave: records.filter(r => r.status === 'leave').length,
        total: totalEmployees,
        rate: totalEmployees > 0 ? Math.round((records.filter(r => r.status === 'present').length / totalEmployees) * 100) : 0
      }
    })
  }

  const getDepartmentStats = () => {
    const deptStats = {}
    
    departments.forEach(dept => {
      const deptEmployees = state.employees.filter(emp => emp.department === dept && emp.status === 'active')
      const deptRecords = state.attendanceRecords.filter(record => 
        deptEmployees.some(emp => emp.id === record.employeeId) &&
        record.date >= startDate && record.date <= endDate
      )
      
      deptStats[dept] = {
        totalEmployees: deptEmployees.length,
        totalPresent: deptRecords.filter(r => r.status === 'present').length,
        totalAbsent: deptRecords.filter(r => r.status === 'absent').length,
        totalLate: deptRecords.filter(r => r.status === 'late').length,
        totalLeave: deptRecords.filter(r => r.status === 'leave').length,
        avgWorkHours: deptRecords.length > 0 ? 
          Math.round(deptRecords.reduce((sum, r) => sum + (r.workHours || 0), 0) / deptRecords.length * 100) / 100 : 0
      }
    })
    
    return deptStats
  }

  const getTopPerformers = () => {
    const employeeStats = {}
    
    state.employees.forEach(emp => {
      if (emp.status === 'active') {
        const empRecords = state.attendanceRecords.filter(record => 
          record.employeeId === emp.id && record.date >= startDate && record.date <= endDate
        )
        
        employeeStats[emp.id] = {
          name: emp.name,
          department: emp.department,
          presentDays: empRecords.filter(r => r.status === 'present').length,
          totalDays: empRecords.length,
          avgWorkHours: empRecords.length > 0 ? 
            Math.round(empRecords.reduce((sum, r) => sum + (r.workHours || 0), 0) / empRecords.length * 100) / 100 : 0
        }
      }
    })
    
    return Object.values(employeeStats)
      .sort((a, b) => b.presentDays - a.presentDays)
      .slice(0, 10)
  }

  const attendanceData = getAttendanceData()
  const departmentStats = getDepartmentStats()
  const topPerformers = getTopPerformers()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
          <p className="text-text-secondary mt-1">
            Attendance analytics and insights
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field w-full"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field w-full"
            />
          </div>
          
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field w-full"
            />
          </div>
          
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input-field w-full"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Total Employees</p>
              <p className="text-3xl font-bold text-text-primary mt-2">
                {state.employees.filter(emp => emp.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-blue bg-opacity-10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent-blue" />
            </div>
          </div>
        </div>
        
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Avg Attendance Rate</p>
              <p className="text-3xl font-bold text-text-primary mt-2">
                {attendanceData.length > 0 ? 
                  Math.round(attendanceData.reduce((sum, d) => sum + d.rate, 0) / attendanceData.length) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-status-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-status-success" />
            </div>
          </div>
        </div>
        
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Total Work Hours</p>
              <p className="text-3xl font-bold text-text-primary mt-2">
                {Math.round(state.attendanceRecords.reduce((sum, r) => sum + (r.workHours || 0), 0))}h
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-cyan bg-opacity-10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-cyan" />
            </div>
          </div>
        </div>
        
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Period Days</p>
              <p className="text-3xl font-bold text-text-primary mt-2">
                {attendanceData.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-yellow bg-opacity-10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent-yellow" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Attendance Trend
          </h3>
          <div className="space-y-3">
            {attendanceData.map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-text-secondary text-sm w-16">{data.date}</span>
                <div className="flex-1 bg-cursor-surface-variant rounded-full h-2">
                  <div 
                    className="bg-accent-cyan h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.rate}%` }}
                  ></div>
                </div>
                <span className="text-text-primary text-sm w-12 text-right">{data.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Department Performance
          </h3>
          <div className="space-y-3">
            {Object.entries(departmentStats).map(([dept, stats]) => (
              <div key={dept} className="flex items-center justify-between p-3 bg-cursor-surface-variant rounded-lg">
                <div>
                  <p className="text-text-primary font-medium">{dept}</p>
                  <p className="text-text-secondary text-sm">
                    {stats.totalPresent}/{stats.totalEmployees} present
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-text-primary font-medium">
                    {stats.totalEmployees > 0 ? Math.round((stats.totalPresent / stats.totalEmployees) * 100) : 0}%
                  </p>
                  <p className="text-text-secondary text-sm">{stats.avgWorkHours}h avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Top Performers
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Employee</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Department</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Present Days</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Attendance Rate</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Avg Work Hours</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((performer, index) => (
                <tr key={performer.name} className="border-b border-border-light hover:bg-cursor-surface-variant">
                  <td className="py-4 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-accent-yellow text-cursor-primary' :
                      index === 1 ? 'bg-accent-magenta text-text-primary' :
                      index === 2 ? 'bg-accent-cyan text-text-primary' :
                      'bg-cursor-surface-variant text-text-secondary'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-text-primary font-medium">{performer.name}</p>
                  </td>
                  <td className="py-4 px-4 text-text-primary">{performer.department}</td>
                  <td className="py-4 px-4 text-text-primary">{performer.presentDays}</td>
                  <td className="py-4 px-4">
                    <span className="text-text-primary font-medium">
                      {performer.totalDays > 0 ? Math.round((performer.presentDays / performer.totalDays) * 100) : 0}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-text-primary">{performer.avgWorkHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
