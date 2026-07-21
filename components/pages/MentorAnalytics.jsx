"use client";
import React, { useState } from 'react';
import { 
  Progress, Button, Skeleton, Segmented, Tag, message
} from 'antd';
import { 
  Download, FileText, TrendingUp, TrendingDown, Users, CheckCircle, AlertTriangle
} from 'lucide-react';
import useSWR from 'swr';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ComposedChart, Bar, Line, Legend
} from 'recharts';

const fetcher = (url) => fetch(url).then(res => res.json());

export default function MentorAnalytics() {
  const [timeframe, setTimeframe] = useState('Daily');

  const { data, isLoading } = useSWR(`/api/v1/mentor/analytics?timeframe=${timeframe}`, fetcher, {
    refreshInterval: 5000
  });

  const metrics = data?.metrics || {
    activeCount: 0, activeDelta: 0, completedCount: 0, completedDelta: 0,
    dropoutRate: 0, avgScore: 0, avgCommits: 0, attendance: 0
  };

  const platformActivity = data?.platformActivity || [];
  const behavioralTrends = data?.behavioralTrends || [];

  const handleExport = (format) => {
    window.location.href = `/api/v1/mentor/analytics/export?format=${format}`;
    message.success(`Downloading ${format.toUpperCase()} report...`);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
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
        
        {/* Header & Export Triggers */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Analytics Powerhouse</h1>
            <p className="text-[#475569]">Monitor advanced cohort health and behavioral time-series trends.</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              icon={<Download className="w-4 h-4" />} 
              onClick={() => handleExport('csv')}
              className="bg-white text-[#0F172A] border-slate-300 font-semibold"
            >
              Download CSV
            </Button>
            <Button 
              type="primary"
              icon={<FileText className="w-4 h-4" />} 
              onClick={() => handleExport('pdf')}
              className="bg-blue-600 rounded-lg font-semibold shadow-md shadow-blue-600/20"
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Students</p>
            {isLoading ? <Skeleton active paragraph={{rows: 1}} title={false} /> : (
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-extrabold text-[#0F172A]">{metrics.activeCount}</h3>
                <Tag color="success" className="mb-1 border-0 bg-emerald-50 text-emerald-700 flex items-center gap-1 font-bold rounded-md">
                  <TrendingUp className="w-3 h-3" /> +{metrics.activeDelta}%
                </Tag>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Completed</p>
            {isLoading ? <Skeleton active paragraph={{rows: 1}} title={false} /> : (
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-extrabold text-[#0F172A]">{metrics.completedCount}</h3>
                <Tag color="success" className="mb-1 border-0 bg-emerald-50 text-emerald-700 flex items-center gap-1 font-bold rounded-md">
                  <TrendingUp className="w-3 h-3" /> +{metrics.completedDelta}%
                </Tag>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dropout Rate</p>
            {isLoading ? <Skeleton active paragraph={{rows: 1}} title={false} /> : (
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-extrabold text-[#0F172A]">{metrics.dropoutRate}%</h3>
                {metrics.dropoutRate > 5 && (
                  <Tag color="error" className="mb-1 border-0 bg-red-50 text-red-700 flex items-center gap-1 font-bold rounded-md">
                    <AlertTriangle className="w-3 h-3" /> High Risk
                  </Tag>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cohort Averages</p>
              {isLoading ? <Skeleton active paragraph={{rows: 1}} title={false} /> : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#0F172A]">Score: <span className="text-blue-600">{metrics.avgScore}%</span></p>
                  <p className="text-sm font-semibold text-[#0F172A]">Commits: <span className="text-purple-600">{metrics.avgCommits}/wk</span></p>
                </div>
              )}
            </div>
            {!isLoading && (
              <div className="flex-shrink-0">
                <Progress 
                  type="circle" 
                  percent={metrics.attendance} 
                  size={50} 
                  strokeColor="#10b981" 
                  format={(p) => <span className="text-xs font-bold text-[#0F172A]">{p}%</span>} 
                />
              </div>
            )}
          </div>
        </div>

        {/* TIME CONTROLS */}
        <div className="flex justify-end mb-4">
          <Segmented
            options={['Daily', 'Weekly', 'Monthly']}
            value={timeframe}
            onChange={setTimeframe}
            className="bg-white shadow-sm border border-slate-200 p-1 font-semibold"
          />
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Platform Activity Area Chart */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 p-6 h-[400px] flex flex-col">
            <h3 className="font-bold text-lg text-[#0F172A] mb-4">Platform Activity</h3>
            {isLoading ? <Skeleton active paragraph={{rows: 8}} /> : (
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={platformActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Area type="monotone" dataKey="logins" name="Logins" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLogins)" />
                    <Area type="monotone" dataKey="submissions" name="Task Submissions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSubs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Behavioral Trends Multi-Axis Chart */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 p-6 h-[400px] flex flex-col">
            <h3 className="font-bold text-lg text-[#0F172A] mb-4">Behavioral & Academic Trends</h3>
            {isLoading ? <Skeleton active paragraph={{rows: 8}} /> : (
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={behavioralTrends} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar yAxisId="left" dataKey="completion" name="Completion %" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="left" dataKey="score" name="Avg Score" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="commits" name="Git Commits" stroke="#eab308" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
