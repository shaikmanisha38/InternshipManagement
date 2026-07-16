import React from 'react';
import { Card, Progress, Tabs, Button, Avatar, Tag } from 'antd';
import { 
  Download, FileText, Users, TrendingUp, AlertTriangle, CheckCircle, BrainCircuit, Activity, BookOpen, Star, AlertCircle
} from 'lucide-react';
import { GithubOutlined } from '@ant-design/icons';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart
} from 'recharts';

const { TabPane } = Tabs;

// --- MOCK DATA ---
const timeSeriesData = [
  { name: 'Mon', activity: 4000, engagement: 2400 },
  { name: 'Tue', activity: 3000, engagement: 1398 },
  { name: 'Wed', activity: 2000, engagement: 9800 },
  { name: 'Thu', activity: 2780, engagement: 3908 },
  { name: 'Fri', activity: 1890, engagement: 4800 },
  { name: 'Sat', activity: 2390, engagement: 3800 },
  { name: 'Sun', activity: 3490, engagement: 4300 },
];

const behavioralData = [
  { week: 'Week 1', completion: 85, gitCommits: 120, scores: 78 },
  { week: 'Week 2', completion: 90, gitCommits: 150, scores: 82 },
  { week: 'Week 3', completion: 75, gitCommits: 90, scores: 74 },
  { week: 'Week 4', completion: 95, gitCommits: 210, scores: 89 },
];

export default function MentorAnalytics() {
  
  // Custom Tooltip for Recharts to maintain premium aesthetic
  const PremiumTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg shadow-blue-900/10">
          <p className="font-bold text-[#0F172A] mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Export Toolbar */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Analytics Powerhouse</h1>
            <p className="text-[#475569]">Comprehensive cognitive diagnostics and behavioral metrics.</p>
          </div>
          <div className="flex gap-3">
            <Button icon={<FileText className="w-4 h-4" />} className="rounded-lg font-medium text-[#334155] border-slate-300">
              Download CSV
            </Button>
            <Button icon={<Download className="w-4 h-4" />} className="rounded-lg font-medium text-blue-600 border-blue-200 bg-blue-50">
              Download PDF
            </Button>
          </div>
        </div>

        {/* ZONE 1: EXECUTIVE OVERVIEW BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Active Students
            </p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">245</h2>
              <span className="text-sm font-bold text-emerald-500 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Completed
            </p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">89</h2>
              <span className="text-sm font-bold text-emerald-500 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +5%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm shadow-red-900/5 p-5 border border-red-100 bg-red-50/30 flex flex-col justify-center">
            <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Dropout Rate
            </p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-extrabold text-red-600">4.2%</h2>
              <span className="text-sm font-bold text-red-500 mb-1">
                High Risk
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 flex justify-between items-center lg:col-span-2">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Cohort Averages</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs font-semibold text-[#475569] mb-1">Avg Score</p>
                  <p className="text-xl font-extrabold text-[#0F172A]">88%</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#475569] mb-1"><GithubOutlined className="mr-1"/> Git Commits</p>
                  <p className="text-xl font-extrabold text-[#0F172A]">14/wk</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Progress type="circle" percent={92} size={60} strokeColor="#3b82f6" format={(p) => <span className="font-bold text-[#0F172A] text-sm">{p}%</span>} />
              <p className="text-xs font-semibold text-[#475569] mt-2">Attendance</p>
            </div>
          </div>

        </div>

        {/* ZONE 2: CORE MONITORING & ENGAGEMENT PLOTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Panel: Time-Series Activity */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Platform Activity
              </h3>
              <Tabs defaultActiveKey="1" size="small" className="custom-chart-tabs m-0">
                <TabPane tab="Daily" key="1" />
                <TabPane tab="Weekly" key="2" />
                <TabPane tab="Monthly" key="3" />
              </Tabs>
            </div>
            <div className="flex-1 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip content={<PremiumTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#334155' }} />
                  <Area type="monotone" dataKey="activity" name="Logins" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                  <Area type="monotone" dataKey="engagement" name="Task Submissions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Panel: Behavioral Analytics */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex flex-col h-[400px]">
            <div className="mb-6">
              <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-500" /> Behavioral & Academic Trends
              </h3>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={behavioralData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip content={<PremiumTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#334155' }} />
                  <Bar yAxisId="left" dataKey="completion" name="Completion %" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar yAxisId="left" dataKey="scores" name="Avg Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="gitCommits" name="Git Commits" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ZONE 3: COGNITIVE AI DIAGNOSTICS & INSIGHTS */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100">
          <div className="mb-6 flex justify-between items-end">
            <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-500" /> AI Performance Analytics
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* KPI Block */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-xl text-center">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Avg Cohort AI Score</p>
                <h2 className="text-5xl font-extrabold text-[#0F172A]">82<span className="text-2xl text-indigo-400">%</span></h2>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" /> Top Performer
                </p>
                <div className="flex items-center gap-4">
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size={48} className="shadow-sm" />
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">Alexandra Smith</p>
                    <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">98% AI Rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Columns */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Common Mistakes */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" /> Most Common Mistakes
                </h4>
                <ul className="space-y-3">
                  <li className="text-sm font-medium text-[#475569] bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Missing dependency arrays in React Hooks
                  </li>
                  <li className="text-sm font-medium text-[#475569] bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Unclosed MongoDB connections in API routes
                  </li>
                  <li className="text-sm font-medium text-[#475569] bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Improper error boundary wrappers
                  </li>
                </ul>
              </div>

              {/* Weak Topics */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500 rotate-180" /> Friction Points
                </h4>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center bg-amber-50/50 border border-amber-100 p-3 rounded-lg">
                    <span className="text-sm font-bold text-amber-900">Redux Toolkit</span>
                    <Tag color="warning" className="border-0 m-0">32% struggle</Tag>
                  </div>
                  <div className="flex justify-between items-center bg-amber-50/50 border border-amber-100 p-3 rounded-lg">
                    <span className="text-sm font-bold text-amber-900">JWT Refresh Tokens</span>
                    <Tag color="warning" className="border-0 m-0">45% struggle</Tag>
                  </div>
                  <div className="flex justify-between items-center bg-amber-50/50 border border-amber-100 p-3 rounded-lg">
                    <span className="text-sm font-bold text-amber-900">Docker Compose</span>
                    <Tag color="warning" className="border-0 m-0">28% struggle</Tag>
                  </div>
                </div>
              </div>

              {/* Strong Topics */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" /> Strong Topics
                </h4>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
                    <span className="text-sm font-bold text-emerald-900">Tailwind CSS Layouts</span>
                    <Tag color="success" className="border-0 m-0">92% mastery</Tag>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
                    <span className="text-sm font-bold text-emerald-900">RESTful API Design</span>
                    <Tag color="success" className="border-0 m-0">88% mastery</Tag>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
                    <span className="text-sm font-bold text-emerald-900">Git Branching</span>
                    <Tag color="success" className="border-0 m-0">85% mastery</Tag>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-chart-tabs .ant-tabs-nav { margin: 0 !important; }
        .custom-chart-tabs .ant-tabs-nav::before { display: none; }
        .custom-chart-tabs .ant-tabs-tab { padding: 4px 12px; font-size: 12px; color: #64748b; font-weight: 600; }
        .custom-chart-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #3b82f6 !important; }
        .custom-chart-tabs .ant-tabs-ink-bar { display: none; }
      `}} />
    </div>
  );
}
