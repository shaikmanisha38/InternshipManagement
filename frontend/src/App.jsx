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
import PlaceholderPage from './pages/PlaceholderPage'
import MyInternship from './pages/MyInternship'
import TodaysTask from './pages/TodaysTask'
import Roadmap from './pages/Roadmap'
import DailySubmission from './pages/DailySubmission'
import Progress from './pages/Progress'
import GithubIntegration from './pages/GithubIntegration'
import AIFeedback from './pages/AIFeedback'
import Assessment from './pages/Assessment'
import Attendance from './pages/Attendance'
import Badges from './pages/Badges'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import MentorOverview from './pages/MentorOverview'
import MentorStudents from './pages/MentorStudents'
import MentorProjects from './pages/MentorProjects'
import MentorAnalytics from './pages/MentorAnalytics'
import MentorAttendance from './pages/MentorAttendance'
import MentorAssessments from './pages/MentorAssessments'
import MentorLeaderboard from './pages/MentorLeaderboard'
import MentorCertificates from './pages/MentorCertificates'
import MentorReports from './pages/MentorReports'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<PlaceholderPage title="Features" />} />
        <Route path="/pricing" element={<PlaceholderPage title="Pricing" />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Intern Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout role="student" />}>
          <Route index element={<DashboardHome />} />
          <Route path="internship" element={<MyInternship />} />
          <Route path="task" element={<TodaysTask />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="submission" element={<DailySubmission />} />
          <Route path="github" element={<GithubIntegration />} />
          <Route path="ai-feedback" element={<AIFeedback />} />
          <Route path="assessments" element={<Assessment />} />
          <Route path="progress" element={<Progress />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="badges" element={<Badges />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Mentor Routes */}
        <Route path="/mentor" element={<DashboardLayout role="mentor" />}>
          <Route index element={<MentorOverview />} />
          <Route path="students" element={<MentorStudents />} />
          <Route path="projects" element={<MentorProjects />} />
          <Route path="analytics" element={<MentorAnalytics />} />
          <Route path="attendance" element={<MentorAttendance />} />
          <Route path="assessments" element={<MentorAssessments />} />
          <Route path="leaderboard" element={<MentorLeaderboard />} />
          <Route path="certificates" element={<MentorCertificates />} />
          <Route path="reports" element={<MentorReports />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<PlaceholderPage title="Students" />} />
          <Route path="mentors" element={<PlaceholderPage title="Mentors" />} />
          <Route path="projects" element={<PlaceholderPage title="Projects" />} />
          <Route path="roadmaps" element={<PlaceholderPage title="Roadmaps" />} />
          <Route path="tasks" element={<PlaceholderPage title="Task Management" />} />
          <Route path="certificates" element={<PlaceholderPage title="Certificates" />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
          <Route path="users" element={<PlaceholderPage title="Users" />} />
          <Route path="roles" element={<PlaceholderPage title="Roles" />} />
          <Route path="logs" element={<PlaceholderPage title="System Logs" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
