import { createContext, useContext, useReducer, ReactNode } from 'react'

// Types
export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  hireDate: string
  status: 'active' | 'inactive'
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  checkIn: string | null
  checkOut: string | null
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave'
  workHours: number
  overtimeHours: number
}

interface AttendanceState {
  employees: Employee[]
  attendanceRecords: AttendanceRecord[]
  loading: boolean
  error: string | null
}

type AttendanceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'SET_ATTENDANCE_RECORDS'; payload: AttendanceRecord[] }
  | { type: 'ADD_ATTENDANCE_RECORD'; payload: AttendanceRecord }
  | { type: 'UPDATE_ATTENDANCE_RECORD'; payload: AttendanceRecord }

// Initial state
const initialState: AttendanceState = {
  employees: [],
  attendanceRecords: [],
  loading: false,
  error: null,
}

// Reducer
function attendanceReducer(state: AttendanceState, action: AttendanceAction): AttendanceState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload }
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] }
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      }
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload),
        attendanceRecords: state.attendanceRecords.filter(record => record.employeeId !== action.payload),
      }
    case 'SET_ATTENDANCE_RECORDS':
      return { ...state, attendanceRecords: action.payload }
    case 'ADD_ATTENDANCE_RECORD':
      return { ...state, attendanceRecords: [...state.attendanceRecords, action.payload] }
    case 'UPDATE_ATTENDANCE_RECORD':
      return {
        ...state,
        attendanceRecords: state.attendanceRecords.map(record =>
          record.id === action.payload.id ? action.payload : record
        ),
      }
    default:
      return state
  }
}

// Context
interface AttendanceContextType {
  state: AttendanceState
  dispatch: React.Dispatch<AttendanceAction>
  // Helper functions
  getEmployeeById: (id: string) => Employee | undefined
  getAttendanceByDate: (date: string) => AttendanceRecord[]
  getEmployeeAttendance: (employeeId: string) => AttendanceRecord[]
  getTodayAttendance: () => AttendanceRecord[]
  getAttendanceStats: () => {
    total: number
    present: number
    absent: number
    late: number
    leave: number
  }
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined)

// Provider
export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(attendanceReducer, initialState)

  // Helper functions
  const getEmployeeById = (id: string) => {
    return state.employees.find(emp => emp.id === id)
  }

  const getAttendanceByDate = (date: string) => {
    return state.attendanceRecords.filter(record => record.date === date)
  }

  const getEmployeeAttendance = (employeeId: string) => {
    return state.attendanceRecords.filter(record => record.employeeId === employeeId)
  }

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0]
    return getAttendanceByDate(today)
  }

  const getAttendanceStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayRecords = getAttendanceByDate(today)
    
    return {
      total: state.employees.filter(emp => emp.status === 'active').length,
      present: todayRecords.filter(record => record.status === 'present').length,
      absent: todayRecords.filter(record => record.status === 'absent').length,
      late: todayRecords.filter(record => record.status === 'late').length,
      leave: todayRecords.filter(record => record.status === 'leave').length,
    }
  }

  const value: AttendanceContextType = {
    state,
    dispatch,
    getEmployeeById,
    getAttendanceByDate,
    getEmployeeAttendance,
    getTodayAttendance,
    getAttendanceStats,
  }

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  )
}

// Hook
export function useAttendance() {
  const context = useContext(AttendanceContext)
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider')
  }
  return context
}
