import { useState } from 'react'
import { useAttendance } from '../contexts/AttendanceContext'
import { Plus, Search, Edit, Trash2, UserPlus } from 'lucide-react'

export default function Employees() {
  const { state, dispatch } = useAttendance()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)

  const filteredEmployees = state.employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddEmployee = (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: Date.now().toString(),
      status: 'active'
    }
    dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee })
    setShowAddForm(false)
  }

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee)
  }

  const handleUpdateEmployee = (updatedEmployee) => {
    dispatch({ type: 'UPDATE_EMPLOYEE', payload: updatedEmployee })
    setEditingEmployee(null)
  }

  const handleDeleteEmployee = (employeeId) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      dispatch({ type: 'DELETE_EMPLOYEE', payload: employeeId })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Employees</h1>
          <p className="text-text-secondary mt-1">
            Manage your employee database
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
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
          
          <div className="flex gap-2">
            <select className="input-field">
              <option value="">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
            </select>
            
            <select className="input-field">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Employee</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Department</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Position</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Hire Date</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Status</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-border-light hover:bg-cursor-surface-variant">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-text-primary font-medium">{employee.name}</p>
                        <p className="text-text-secondary text-sm">{employee.email}</p>
                        <p className="text-text-tertiary text-sm">{employee.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-text-primary">{employee.department}</td>
                    <td className="py-4 px-4 text-text-primary">{employee.position}</td>
                    <td className="py-4 px-4 text-text-primary">
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`status-badge ${
                        employee.status === 'active' ? 'status-present' : 'status-absent'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="text-accent-blue hover:text-accent-cyan transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-status-error hover:text-opacity-80 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="text-text-secondary">
                      {searchTerm ? 'No employees found matching your search' : 'No employees added yet'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {(showAddForm || editingEmployee) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-cursor-surface border border-border-light rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            
            <EmployeeForm
              employee={editingEmployee}
              onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
              onCancel={() => {
                setShowAddForm(false)
                setEditingEmployee(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Employee Form Component
function EmployeeForm({ employee, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    department: employee?.department || '',
    position: employee?.position || '',
    hireDate: employee?.hireDate || new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      id: employee?.id,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-text-secondary text-sm font-medium mb-2">
          Full Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field w-full"
          placeholder="Enter full name"
        />
      </div>
      
      <div>
        <label className="block text-text-secondary text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input-field w-full"
          placeholder="Enter email address"
        />
      </div>
      
      <div>
        <label className="block text-text-secondary text-sm font-medium mb-2">
          Phone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="input-field w-full"
          placeholder="Enter phone number"
        />
      </div>
      
      <div>
        <label className="block text-text-secondary text-sm font-medium mb-2">
          Department
        </label>
        <select
          required
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="input-field w-full"
        >
          <option value="">Select department</option>
          <option value="engineering">Engineering</option>
          <option value="marketing">Marketing</option>
          <option value="sales">Sales</option>
          <option value="hr">HR</option>
          <option value="finance">Finance</option>
        </select>
      </div>
      
      <div>
        <label className="block text-text-secondary text-sm font-medium mb-2">
          Position
        </label>
        <input
          type="text"
          required
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="input-field w-full"
          placeholder="Enter job position"
        />
      </div>
      
      <div>
        <label className="block text-text-secondary text-sm font-medium mb-2">
          Hire Date
        </label>
        <input
          type="date"
          required
          value={formData.hireDate}
          onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
          className="input-field w-full"
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <button type="submit" className="btn-primary flex-1">
          {employee ? 'Update' : 'Add'} Employee
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}
