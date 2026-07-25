import React, { useState, useEffect } from 'react';
import { Progress, Timeline, Spin } from 'antd';
import {
  Users,
  Award,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function MentorOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/mentor/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Spin size="large" /></div>;

  const progressData = stats?.progressData || [];
  const weeklyPerformance = stats?.weeklyPerformance || [];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Mentor Dashboard</h1>
          <p className="text-[#475569]">Overview of student performance and daily actionable metrics.</p>
        </div>

        {/* ZONE 1: CORE OPERATIONAL METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Students */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#475569] mb-1">Total Students</p>
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{stats?.totalStudents || 0}</h2>
              <p className="text-xs font-medium text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded-md inline-block">{stats?.activeUsers || 0} Active Users</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Card 2: Completion */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#475569] mb-1">Completed Internships</p>
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{stats?.completedInternships || 0}</h2>
              <p className="text-xs font-medium text-emerald-600 mt-2 bg-emerald-50 px-2 py-1 rounded-md inline-block">{stats?.certificatesIssued || 0} Certificates Issued</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          {/* Card 3: Action Items */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#475569] mb-1">Pending Reviews</p>
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{stats?.pendingReviews || 0}</h2>
              <p className="text-xs font-medium text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded-md inline-block">{stats?.todaysSubmissions || 0} Today's Submissions</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>

          {/* Card 4: Performance */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#475569] mb-1">Avg AI Score</p>
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{stats?.avgAiScore || 0}%</h2>
              <p className="text-xs font-medium text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded-md inline-block">{stats?.avgAttendance || 0}% Avg Attendance</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* ZONE 2: PROGRESS OVERVIEW & STUDENT STATUS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Progress Bars */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6">Student Pipeline Status</h3>
            <div className="space-y-6">
              {progressData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm font-semibold text-[#334155] mb-2">
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                  <Progress percent={stats?.totalStudents ? Math.round((item.value / stats.totalStudents) * 100) : 0} strokeColor={item.color} showInfo={false} size="medium" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">Distribution Overview</h3>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0F172A' }}
                    itemStyle={{ fontWeight: '600' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ZONE 3: WEEKLY PERFORMANCE ACTIVITY */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Weekly Performance Activity</h3>
                <p className="text-sm text-[#475569]">Engagement trends over the current week</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="logins" name="Daily Logins" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLogins)" />
                  <Area type="monotone" dataKey="tasks" name="Tasks Completed" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ZONE 4: REAL-TIME NOTIFICATIONS STREAM */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6">Recent Activity Logs</h3>
            <div className="flex-1 pr-2 custom-scrollbar flex items-center justify-center">
              <p className="text-[#64748b] text-sm">No recent activity</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
