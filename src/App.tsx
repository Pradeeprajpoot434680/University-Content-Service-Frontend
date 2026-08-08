import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import './App.css'
import { normalizeOptionalId, useAuthStore } from './store/authStore'

// 🔌 Code-split each route page so only the currently-viewed page is downloaded.
const SignupPage = lazy(() => import('./pages/SignupPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'))
const GlobalAdminDashboard = lazy(() => import('./pages/GlobalAdminDashboard'))
const UniversityRepDashboard = lazy(() => import('./pages/UniversityRepDashboard'))
const DepartmentRepDashboard = lazy(() => import('./pages/DepartmentRepDashboard'))
const ProgramRepDashboard = lazy(() => import('./pages/ProgramRepDashboard'))
const SessionRepDashboard = lazy(() => import('./pages/SessionRepDashboard'))
const AccountVerification = lazy(() => import('./pages/AccountVerification'))
const ExamFormatsView = lazy(() => import('./pages/ExamFormatsView'))
const GlobalAdminUserQueries = lazy(() => import('./pages/GlobalAdminUserQueries'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))

// Shown while a route chunk is being loaded.
const PageFallback = () => (
  <div className="pp-route-fallback">
    <div className="pp-route-spinner" />
    <span>Loading…</span>
    <style>{`
      .pp-route-fallback {
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        color: #64748b;
        font-family: Inter, system-ui, sans-serif;
        font-weight: 500;
      }
      .pp-route-spinner {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid #e2e8f0;
        border-top-color: #3cd3ad;
        animation: pp-route-spin 1s linear infinite;
      }
      @keyframes pp-route-spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

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

// Renders university-scoped pages using the logged-in user's universityId
// instead of a hardcoded value. Redirects to sign-in if it's missing.
const UniversityScopedRoute = ({
  children,
}: {
  children: (universityId: string) => ReactNode
}) => {
  const universityId = useAuthStore((state) =>
    normalizeOptionalId(state.user?.universityId)
  )
  const location = useLocation()

  if (!universityId) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children(universityId)
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
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
          <Route path='/exam-formats' element={<ProtectedRoute><UniversityScopedRoute>{(universityId) => <ExamFormatsView universityId={universityId} />}</UniversityScopedRoute></ProtectedRoute>} />
      </Routes>
    </Suspense>
  )
}

export default App
