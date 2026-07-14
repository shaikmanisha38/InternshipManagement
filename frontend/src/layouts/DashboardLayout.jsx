import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, User, FileText, ClipboardList,
  Building2, Landmark, Compass, Map, HelpCircle,
  LogOut, Home, Code as CodeIcon,
  Briefcase, CheckSquare, TrendingUp, UploadCloud,
  Cpu, ClipboardCheck, CalendarDays, Trophy, Medal, Award,
  Settings, Users, FolderKanban, PieChart, UserCheck, ListTodo,
  UsersRound, Shield, Terminal
} from 'lucide-react';

export default function DashboardLayout({ role = 'student' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { name: 'Students', path: '/admin/students', icon: Users },
          { name: 'Mentors', path: '/admin/mentors', icon: UserCheck },
          { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
          { name: 'Roadmaps', path: '/admin/roadmaps', icon: Map },
          { name: 'Task Management', path: '/admin/tasks', icon: ListTodo },
          { name: 'Certificates', path: '/admin/certificates', icon: Award },
          { name: 'Analytics', path: '/admin/analytics', icon: PieChart },
          { name: 'Users', path: '/admin/users', icon: UsersRound },
          { name: 'Roles', path: '/admin/roles', icon: Shield },
          { name: 'System Logs', path: '/admin/logs', icon: Terminal },
          { name: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'mentor':
        return [
          { name: 'Overview', path: '/mentor', icon: LayoutDashboard },
          { name: 'Students', path: '/mentor/students', icon: Users },
          { name: 'Projects', path: '/mentor/projects', icon: FolderKanban },
          { name: 'Analytics', path: '/mentor/analytics', icon: PieChart },
          { name: 'Attendance', path: '/mentor/attendance', icon: CalendarDays },
          { name: 'Assessments', path: '/mentor/assessments', icon: ClipboardCheck },
          { name: 'Leaderboard', path: '/mentor/leaderboard', icon: Trophy },
          { name: 'Certificates', path: '/mentor/certificates', icon: Award },
          { name: 'Reports', path: '/mentor/reports', icon: FileText },
        ];
      case 'student':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'My Internship', path: '/dashboard/internship', icon: Briefcase },
          { name: 'Today\'s Task', path: '/dashboard/task', icon: CheckSquare },
          { name: 'Roadmap', path: '/dashboard/roadmap', icon: Map },
          { name: 'Daily Submission', path: '/dashboard/submission', icon: UploadCloud },
          { name: 'GitHub Integration', path: '/dashboard/github', icon: CodeIcon },
          { name: 'AI Feedback', path: '/dashboard/ai-feedback', icon: Cpu },
          { name: 'Weekly Assessments', path: '/dashboard/assessments', icon: ClipboardCheck },
          { name: 'Progress', path: '/dashboard/progress', icon: TrendingUp },
          { name: 'Attendance', path: '/dashboard/attendance', icon: CalendarDays },
          { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: Trophy },
          { name: 'Badges', path: '/dashboard/badges', icon: Medal },
          { name: 'Certificates', path: '/dashboard/certificates', icon: Award },
          { name: 'Profile', path: '/dashboard/profile', icon: User },
          { name: 'Settings', path: '/dashboard/settings', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();
  
  // Helper to get current page title
  const currentItem = navItems.find(item => item.path === location.pathname) || navItems[0];

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
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard' || item.path === '/mentor' || item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
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
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 mt-auto border-t border-borderCustom/50 space-y-2">
          <button
            onClick={() => navigate('/')}
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
          <Outlet />
        </div>
      </main>
    </div>
  );
}

