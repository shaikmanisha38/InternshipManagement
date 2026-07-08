import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import Leaderboard from './pages/Leaderboard'
import Certificates from './pages/Certificates'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Intern Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="certificates" element={<Certificates />} />
        </Route>

        {/* Manager/Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
