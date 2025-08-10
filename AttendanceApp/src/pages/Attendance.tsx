import { useState, useEffect } from 'react'
import { useAttendance } from '../contexts/AttendanceContext'
import { Clock, CheckCircle, XCircle, AlertTriangle, Calendar, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function Attendance() {
  const { state, dispatch, getEmployeeById } = useAttendance()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [showBulkEntry, setShowBulkEntry] = useState(false)

  const filteredEmployees = state.employees.filter(employee =>
    employee.status === 'active' &&
    (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     employee.department.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getAttendanceForDate = (employeeId, date) => {
    return state.attendanceRecords.find(record => 
      record.employeeId === employeeId && record.date === date
    )
  }

  const handleCheckIn = (employeeId) => {
    const now = new Date()
    const timeString = now.toTimeString().split(' ')[0]
    
    const newRecord = {
      id: Date.now().toString(),
      employeeId,
      date: selectedDate,
      checkIn: timeString,
      checkOut: null,
      status: 'present',
      workHours: 0,
      overtimeHours: 0,
    }
    
    dispatch({ type: 'ADD_ATTENDANCE_RECORD', payload: newRecord })
  }

  const handleCheckOut = (employeeId) => {
    const now = new Date()
    const timeString = now.toTimeString().split(' ')[0]
    
    const existingRecord = getAttendanceForDate(employeeId, selectedDate)
    if (existingRecord) {
      const updatedRecord = {
        ...existingRecord,
        checkOut: timeString,
        workHours: calculateWorkHours(existingRecord.checkIn, timeString),
      }
      dispatch({ type: 'UPDATE_ATTENDANCE_RECORD', payload: updatedRecord })
    }
  }

  const handleStatusChange = (employeeId, status) => {
    const existingRecord = getAttendanceForDate(employeeId, selectedDate)
    
    if (existingRecord) {
      const updatedRecord = { ...existingRecord, status }
      dispatch({ type: 'UPDATE_ATTENDANCE_RECORD', payload: updatedRecord })
    } else {
      const newRecord = {
        id: Date.now().toString(),
        employeeId,
        date: selectedDate,
        checkIn: null,
        checkOut: null,
        status,
        workHours: 0,
        overtimeHours: 0,
      }
      dispatch({ type: 'ADD_ATTENDANCE_RECORD', payload: newRecord })
    }
  }

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    
    const [inHour, inMin] = checkIn.split(':').map(Number)
    const [outHour, outMin] = checkOut.split(':').map(Number)
    
    const totalInMinutes = inHour * 60 + inMin
    const totalOutMinutes = outHour * 60 + outMin
    
    return Math.round((totalOutMinutes - totalInMinutes) / 60 * 100) / 100
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'present': return 'status-present'
      case 'absent': return 'status-absent'
      case 'late': return 'status-late'
      case 'half-day': return 'status-warning'
      case 'leave': return 'status-leave'
      default: return 'status-absent'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Attendance</h1>
          <p className="text-text-secondary mt-1">
            Record and manage daily attendance
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkEntry(true)}
            className="btn-secondary"
          >
            Bulk Entry
          </button>
          <button className="btn-primary">
            <Calendar className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Date Selection and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-text-secondary" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Employee</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Department</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Check In</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Check Out</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Work Hours</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Status</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => {
                  const attendance = getAttendanceForDate(employee.id, selectedDate)
                  const isCheckedIn = attendance?.checkIn && !attendance?.checkOut
                  
                  return (
                    <tr key={employee.id} className="border-b border-border-light hover:bg-cursor-surface-variant">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-text-primary font-medium">{employee.name}</p>
                          <p className="text-text-secondary text-sm">{employee.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-text-primary">{employee.department}</td>
                      <td className="py-4 px-4">
                        {attendance?.checkIn ? (
                          <span className="text-status-success font-mono">{attendance.checkIn}</span>
                        ) : (
                          <span className="text-text-tertiary">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {attendance?.checkOut ? (
                          <span className="text-status-success font-mono">{attendance.checkOut}</span>
                        ) : (
                          <span className="text-text-tertiary">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {attendance?.workHours ? (
                          <span className="text-text-primary">{attendance.workHours}h</span>
                        ) : (
                          <span className="text-text-tertiary">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {attendance ? (
                          <span className={`status-badge ${getStatusBadgeClass(attendance.status)}`}>
                            {attendance.status}
                          </span>
                        ) : (
                          <span className="status-badge status-absent">Not marked</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {!attendance?.checkIn ? (
                            <button
                              onClick={() => handleCheckIn(employee.id)}
                              className="btn-success text-sm px-3 py-1"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Check In
                            </button>
                          ) : !attendance?.checkOut ? (
                            <button
                              onClick={() => handleCheckOut(employee.id)}
                              className="btn-warning text-sm px-3 py-1"
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Check Out
                            </button>
                          ) : (
                            <span className="text-status-success text-sm">Completed</span>
                          )}
                          
                          <select
                            value={attendance?.status || ''}
                            onChange={(e) => handleStatusChange(employee.id, e.target.value)}
                            className="input-field text-sm px-2 py-1"
                          >
                            <option value="">Set Status</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="half-day">Half Day</option>
                            <option value="leave">Leave</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="text-text-secondary">
                      {searchTerm ? 'No employees found matching your search' : 'No active employees found'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Entry Modal */}
      {showBulkEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-cursor-surface border border-border-light rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Bulk Attendance Entry
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Default Status
                  </label>
                  <select className="input-field w-full">
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half-day">Half Day</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-cursor-surface-variant rounded-lg">
                    <span className="text-text-primary">{employee.name}</span>
                    <select
                      defaultValue="present"
                      className="input-field text-sm px-2 py-1"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="half-day">Half Day</option>
                      <option value="leave">Leave</option>
                    </select>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="btn-primary flex-1">
                  Apply to All
                </button>
                <button 
                  onClick={() => setShowBulkEntry(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
