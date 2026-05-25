import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import VerifyOtp from './components/VerifyOtp'
import Dashboard from './components/Dashboard'
import Contact from './components/pages/Contact'
import ProtectedRoute from './components/ProtectedRoute'
import AuthProvider from './context/AuthContext'
import TaskProvider from './context/TaskContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App


