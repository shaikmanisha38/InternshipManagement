import React, { useState } from 'react';
import { Card, Table, Tag, Avatar, Segmented } from 'antd';
import { 
  Users, UserCheck, UserMinus, Clock, TrendingUp, TrendingDown, Activity, LogIn, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// --- MOCK DATA ---
const attendanceTrendData = [
  { date: 'Mon', attendance: 98 },
  { date: 'Tue', attendance: 95 },
  { date: 'Wed', attendance: 92 },
  { date: 'Thu', attendance: 88 },
  { date: 'Fri', attendance: 85 },
  { date: 'Sat', attendance: 45 },
  { date: 'Sun', attendance: 40 },
];

const loginVolumeData = [
  { time: '08:00', volume: 15 },
  { time: '09:00', volume: 120 },
  { time: '10:00', volume: 145 },
  { time: '11:00', volume: 130 },
  { time: '12:00', volume: 85 },
  { time: '13:00', volume: 110 },
  { time: '14:00', volume: 95 },
];

const rosterData = [
  {
    key: '1',
    name: 'Emily Chen',
    batch: 'Batch 2024-A',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    login: '08:45 AM',
    logout: '05:15 PM',
    hours: 8.5,
    status: 'Present',
    activity: { state: 'Active', color: 'bg-emerald-500' }
  },
  {
    key: '2',
    name: 'Marcus Johnson',
    batch: 'Batch 2024-B',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    login: '10:30 AM',
    logout: '04:00 PM',
    hours: 5.5,
    status: 'Late',
    activity: { state: 'Idle 45m', color: 'bg-amber-500' }
  },
  {
    key: '3',
    name: 'Sarah Williams',
    batch: 'Batch 2024-A',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    login: '09:00 AM',
    logout: '06:30 PM',
    hours: 9.5,
    status: 'Present',
    activity: { state: 'Active', color: 'bg-emerald-500' }
  },
  {
    key: '4',
    name: 'David Kim',
    batch: 'Batch 2024-A',
    avatar: 'https://i.pravatar.cc/150?u=david',
    login: '--',
    logout: '--',
    hours: 0,
    status: 'Absent',
    activity: { state: 'Offline', color: 'bg-slate-300' }
  },
  {
    key: '5',
    name: 'Priya Patel',
    batch: 'Batch 2024-C',
    avatar: 'https://i.pravatar.cc/150?u=priya',
    login: '09:15 AM',
    logout: '05:30 PM',
    hours: 8.2,
    status: 'Present',
    activity: { state: 'Disconnected', color: 'bg-slate-400' }
  }
];

export default function MentorAttendance() {
  const [filter, setFilter] = useState('Today');

  // Custom Tooltip for Recharts
  const PremiumTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg shadow-blue-900/10">
          <p className="font-bold text-[#0F172A] mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.dataKey === 'attendance' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- COLUMNS CONFIGURATION ---
  const columns = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size="large" />
          <div>
            <div className="font-bold text-[#0F172A]">{record.name}</div>
            <div className="text-xs text-[#64748b]">{record.batch}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Login',
      key: 'login',
      render: (_, record) => (
        <div className="flex items-center gap-2 text-sm text-[#334155]">
          <Clock className="w-4 h-4 text-slate-400" /> {record.login}
        </div>
      ),
    },
    {
      title: 'Logout',
      key: 'logout',
      render: (_, record) => (
        <div className="flex items-center gap-2 text-sm text-[#334155]">
          <Clock className="w-4 h-4 text-slate-400" /> {record.logout}
        </div>
      ),
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      sorter: (a, b) => a.hours - b.hours,
      render: (hours) => (
        <div className="font-semibold text-[#0F172A]">
          {hours > 0 ? `${hours.toFixed(1)} Hrs` : '--'}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => {
        const order = { 'Absent': 1, 'Late': 2, 'Present': 3 };
        return order[a.status] - order[b.status];
      },
      render: (status) => {
        let colorClass = 'bg-slate-100 text-slate-700';
        if (status === 'Present') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (status === 'Late') colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
        if (status === 'Absent') colorClass = 'bg-red-50 text-red-700 border-red-200';
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      title: 'Activity Log',
      key: 'activity',
      render: (_, record) => (
        <div className="flex items-center gap-2 text-sm text-[#475569]">
          <div className={`w-2 h-2 rounded-full ${record.activity.color}`} />
          {record.activity.state}
        </div>
      ),
    },
  ];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Global Filters */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Attendance Management</h1>
            <p className="text-[#475569]">Track daily engagement, punctuality, and session duration.</p>
          </div>
          <div>
            <Segmented 
              options={['Today', 'Week', 'Month']} 
              value={filter} 
              onChange={setFilter}
              className="bg-slate-200 p-1 font-medium"
            />
          </div>
        </div>

        {/* ZONE 1: ATTENDANCE SUMMARY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" /> Present Count
            </p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">212</h2>
              <span className="text-sm font-bold text-emerald-500 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 92%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm shadow-red-900/5 p-5 border border-red-50 flex flex-col justify-center">
            <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <UserMinus className="w-4 h-4 text-red-500" /> Absent Count
            </p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">18</h2>
              <span className="text-sm font-bold text-red-500 mb-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> 8%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm shadow-amber-900/5 p-5 border border-amber-50 flex flex-col justify-center">
            <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Late Arrivals
            </p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">15</h2>
              <span className="text-sm font-bold text-amber-600 mb-1">
                Avg 35m late
              </span>
            </div>
          </div>

          <div className="bg-blue-600 rounded-xl shadow-sm shadow-blue-900/20 p-5 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Clock className="w-32 h-32" />
            </div>
            <p className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2 flex items-center gap-2 relative z-10">
              Average Hours
            </p>
            <div className="flex items-end gap-3 relative z-10">
              <h2 className="text-3xl font-extrabold text-white">7.8</h2>
              <span className="text-sm font-medium text-blue-100 mb-1">
                Hrs/Day
              </span>
            </div>
          </div>

        </div>

        {/* ZONE 2: COHORT ENGAGEMENT PLOTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Panel: Attendance Trend */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 h-[350px] flex flex-col">
            <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-blue-500" /> Cohort Attendance Trend
            </h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} domain={[0, 100]} />
                  <Tooltip content={<PremiumTooltip />} />
                  <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Panel: Daily Logins */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 h-[350px] flex flex-col">
            <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2 mb-6">
              <LogIn className="w-5 h-5 text-emerald-500" /> Login Volume Distribution
            </h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loginVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip content={<PremiumTooltip />} cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="volume" name="Logins" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ZONE 3: MASTER ATTENDANCE ROSTER */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Master Roster
            </h3>
            <p className="text-sm text-[#475569] mt-1">Granular tracking of daily session data. Click column headers to sort.</p>
          </div>
          <Table 
            columns={columns} 
            dataSource={rosterData} 
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            size="large"
            rowClassName="hover:bg-slate-50 transition-colors"
          />
        </div>

      </div>
    </div>
  );
}
