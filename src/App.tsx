import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import './App.css'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import AboutUsPage from './pages/AboutUsPage'
import GlobalAdminDashboard from './pages/GlobalAdminDashboard'
import UniversityRepDashboard from './pages/UniversityRepDashboard'
import DepartmentRepDashboard from './pages/DepartmentRepDashboard'
import ProgramRepDashboard from './pages/ProgramRepDashboard'
import SessionRepDashboard from './pages/SessionRepDashboard'
import AccountVerification from './pages/AccountVerification'
import ExamFormatsView from './pages/ExamFormatsView'
import GlobalAdminUserQueries from './pages/GlobalAdminUserQueries'
import ProfilePage from './pages/ProfilePage'
import StudentDashboard from './pages/StudentDashboard'
import { useAuthStore } from './store/authStore'

// 🔒 Blocks unauthenticated users from entering protected segments
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return isAuthenticated ? children : <Navigate to="/signin" replace />
}

// 🔓 Blocks authenticated users from visiting auth pages (Login, Signup, Forgot Password)
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

const HomeRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
}

function App() {
  return (
    <Routes>
        {/* Auth / Public Only Routes */}
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/signin" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/forgotpassword" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path='/forgot-password' element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

        {/* Core Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/student-dashboard' element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        
        {/* Representative / Admin Protected Routes */}
        <Route path='/global-admin' element={<ProtectedRoute><GlobalAdminDashboard /></ProtectedRoute>} />
        <Route path='/university-admin' element={<ProtectedRoute><UniversityRepDashboard /></ProtectedRoute>} />
        <Route path='/department-admin' element={<ProtectedRoute><DepartmentRepDashboard /></ProtectedRoute>} />
        <Route path='/program-admin' element={<ProtectedRoute><ProgramRepDashboard /></ProtectedRoute>} />
        <Route path='/session-admin' element={<ProtectedRoute><SessionRepDashboard /></ProtectedRoute>} />
        <Route path='/global-admin-queries' element={<ProtectedRoute><GlobalAdminUserQueries /></ProtectedRoute>} />
        
        {/* Miscellaneous Public Layouts */}
        <Route path='/' element={<HomeRoute />} />
        <Route path='/about-us' element={<AboutUsPage />} />
        <Route path='/verify-account' element={<AccountVerification />} />
        <Route path='/exam-formats' element={<ExamFormatsView universityId='e2d30929-8aa1-4600-8d82-19f239efc007'/>} />
    </Routes>
  )
}

export default App