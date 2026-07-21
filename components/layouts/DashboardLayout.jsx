"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  LayoutDashboard, User, FileText, ClipboardList,
  Building2, Landmark, Compass, Map, HelpCircle,
  LogOut, Home, Code as CodeIcon,
  Briefcase, CheckSquare, TrendingUp, UploadCloud,
  Cpu, ClipboardCheck, CalendarDays, Trophy, Medal, Award,
  Settings, Users, FolderKanban, PieChart, UserCheck, ListTodo,
  UsersRound, Shield, Terminal
} from 'lucide-react';

export default function DashboardLayout({ role = "student", children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        // Optionally clear it if it's corrupted
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/login');
  };

  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, group: 'Overview' },
          { name: 'Students', path: '/admin/students', icon: Users, group: 'User Management' },
          { name: 'Mentors', path: '/admin/mentors', icon: UserCheck, group: 'User Management' },
          { name: 'Users', path: '/admin/users', icon: UsersRound, group: 'User Management' },
          { name: 'Roles', path: '/admin/roles', icon: Shield, group: 'User Management' },
          { name: 'Projects', path: '/admin/projects', icon: FolderKanban, group: 'System Operations' },
          { name: 'Roadmaps', path: '/admin/roadmaps', icon: Map, group: 'System Operations' },
          { name: 'Task Management', path: '/admin/tasks', icon: ListTodo, group: 'System Operations' },
          { name: 'Certificates', path: '/admin/certificates', icon: Award, group: 'System Operations' },
          { name: 'Analytics', path: '/admin/analytics', icon: PieChart, group: 'Insights & Settings' },
          { name: 'System Logs', path: '/admin/logs', icon: Terminal, group: 'Insights & Settings' },
          { name: 'Settings', path: '/admin/settings', icon: Settings, group: 'Insights & Settings' },
        ];
      case 'mentor':
        return [
          { name: 'Overview', path: '/mentor', icon: LayoutDashboard, group: 'Overview' },
          { name: 'Students', path: '/mentor/students', icon: Users, group: 'Student Management' },
          { name: 'Projects', path: '/mentor/projects', icon: FolderKanban, group: 'Student Management' },
          { name: 'Attendance', path: '/mentor/attendance', icon: CalendarDays, group: 'Student Management' },
          { name: 'Assessments', path: '/mentor/assessments', icon: ClipboardCheck, group: 'Evaluation & Grading' },
          { name: 'Certificates', path: '/mentor/certificates', icon: Award, group: 'Evaluation & Grading' },
          { name: 'Reports', path: '/mentor/reports', icon: FileText, group: 'Evaluation & Grading' },
          { name: 'Leaderboard', path: '/mentor/leaderboard', icon: Trophy, group: 'Performance & Analytics' },
          { name: 'Analytics', path: '/mentor/analytics', icon: PieChart, group: 'Performance & Analytics' },
        ];
      case 'student':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, group: 'Overview' },
          { name: 'My Internship', path: '/dashboard/internship', icon: Briefcase, group: 'Internship Details' },
          { name: 'Roadmap', path: '/dashboard/roadmap', icon: Map, group: 'Learning & Tasks' },
          { name: 'Today\'s Task', path: '/dashboard/task', icon: CheckSquare, group: 'Learning & Tasks' },
          { name: 'Daily Submission', path: '/dashboard/submission', icon: UploadCloud, group: 'Learning & Tasks' },
          { name: 'Weekly Assessments', path: '/dashboard/assessments', icon: ClipboardCheck, group: 'Learning & Tasks' },
          { name: 'GitHub Integration', path: '/dashboard/github', icon: CodeIcon, group: 'Tools & Integrations' },
          { name: 'AI Feedback', path: '/dashboard/ai-feedback', icon: Cpu, group: 'Tools & Integrations' },
          { name: 'Progress', path: '/dashboard/progress', icon: TrendingUp, group: 'Tracking & Analytics' },
          { name: 'Attendance', path: '/dashboard/attendance', icon: CalendarDays, group: 'Tracking & Analytics' },
          { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: Trophy, group: 'Gamification & Rewards' },
          { name: 'Badges', path: '/dashboard/badges', icon: Medal, group: 'Gamification & Rewards' },
          { name: 'Certificates', path: '/dashboard/certificates', icon: Award, group: 'Gamification & Rewards' },
          { name: 'Profile', path: '/dashboard/profile', icon: User, group: 'Account' },
          { name: 'Settings', path: '/dashboard/settings', icon: Settings, group: 'Account' },
        ];
    }
  };

  const navItems = getNavItems();
  
  // Helper to get current page title
  const currentItem = navItems.find(item => item.path === pathname) || navItems[0];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 glass border-r border-y-0 border-l-0 border-borderCustom flex flex-col z-20 overflow-y-auto">

        {/* Logo Section */}
        <div className="p-6 border-b border-borderCustom/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-bg flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <CodeIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-white">National Internship</span>
              <span className="text-sm font-medium text-primary">Portal</span>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="p-6 bg-primary/10 border-b border-borderCustom/50">
          <p className="text-xs text-textMuted uppercase tracking-wider font-bold mb-1">Welcome</p>
          <p className="text-white font-semibold mb-2">{user?.name || 'Loading...'}</p>
          <p className="text-xs text-textMuted uppercase tracking-wider font-bold mb-1">Email</p>
          <p className="text-white/80 text-sm truncate">{user?.email || 'Loading...'}</p>
        </div>

        {/* Navigation Links */}
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const previousGroup = index > 0 ? navItems[index - 1].group : null;
              const currentGroup = item.group;
              const showGroupHeader = currentGroup && currentGroup !== previousGroup;

              return (
                <React.Fragment key={item.path}>
                  {showGroupHeader && (
                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-textMuted uppercase tracking-wider">
                      {currentGroup}
                    </div>
                  )}
                  <Link
                    href={item.path}
                    className={
                      `flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${pathname === item.path
                        ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                        : 'text-textMuted hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${item.highlight ? 'text-accent animate-pulse' : ''}`} />
                      <span className={item.highlight ? 'text-white' : ''}>{item.name}</span>
                    </div>
                    {item.highlight && (
                      <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent text-[10px] font-bold border border-accent/30">
                        NEW
                      </span>
                    )}
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 mt-auto border-t border-borderCustom/50 space-y-2">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-textMuted hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            <Home className="w-5 h-5" />
            Go to Main Page
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto bg-black/40">
        <div className="absolute inset-0 pointer-events-none z-[-1] opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        {/* Header equivalent to the top bar in screenshot */}
        <header className="h-20 glass border-b border-borderCustom/50 flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">{currentItem?.name || 'Dashboard'}</h2>
        </header>

        <div className="p-8 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
