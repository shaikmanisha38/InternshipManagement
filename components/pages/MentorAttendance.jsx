"use client";
import React, { useState } from 'react';
import { Card, Tag, Segmented, Skeleton } from 'antd';
import { Clock, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import useSWR from 'swr';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const fetcher = (url) => fetch(url).then(res => res.json());

export default function MentorAttendance() {
  const [range, setRange] = useState('Today');

  const { data, isLoading } = useSWR(`/api/v1/mentor/attendance?range=${range.toLowerCase()}`, fetcher, {
    refreshInterval: 5000
  });

  const metrics = data?.metrics || {
    presentCount: 0, presentRatio: 0, absentCount: 0, absentRatio: 0, lateCount: 0, avgDelay: 0, avgHours: 0
  };

  const trendData = data?.trendChart || [];
  const distributionData = data?.distributionChart || [];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Controls */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Attendance Management</h1>
            <p className="text-[#475569]">Monitor cohort presence, punctuality, and engagement.</p>
          </div>
          <div>
            <Segmented
              options={['Today', 'Week', 'Month']}
              value={range}
              onChange={setRange}
              size="large"
              className="bg-slate-200/50 p-1 font-semibold"
            />
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Present */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                <UserCheck className="w-5 h-5" />
              </div>
              <Tag color="success" className="font-bold border-0 bg-emerald-50 text-emerald-700">{metrics.presentRatio}%</Tag>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Present Count</p>
            {isLoading ? <Skeleton.Button active block size="small" /> : <h2 className="text-3xl font-extrabold text-[#0F172A]">{metrics.presentCount}</h2>}
          </div>

          {/* Absent */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-50 p-2 rounded-lg text-red-600">
                <UserX className="w-5 h-5" />
              </div>
              <Tag color="error" className="font-bold border-0 bg-red-50 text-red-700">{metrics.absentRatio}%</Tag>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Absent Count</p>
            {isLoading ? <Skeleton.Button active block size="small" /> : <h2 className="text-3xl font-extrabold text-[#0F172A]">{metrics.absentCount}</h2>}
          </div>

          {/* Late */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <Tag color="warning" className="font-bold border-0 bg-amber-50 text-amber-700">Avg {metrics.avgDelay}m late</Tag>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Late Arrivals</p>
            {isLoading ? <Skeleton.Button active block size="small" /> : <h2 className="text-3xl font-extrabold text-[#0F172A]">{metrics.lateCount}</h2>}
          </div>

          {/* Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Clock className="w-5 h-5" />
              </div>
              <Tag color="processing" className="font-bold border-0 bg-blue-50 text-blue-700">Daily Mean</Tag>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Average Hours</p>
            {isLoading ? <Skeleton.Button active block size="small" /> : <h2 className="text-3xl font-extrabold text-[#0F172A]">{metrics.avgHours} <span className="text-base text-slate-400 font-medium">Hrs</span></h2>}
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="mb-6">
              <h3 className="font-bold text-lg text-[#0F172A]">Cohort Attendance Trend</h3>
              <p className="text-xs text-slate-500">Presence trajectory over the selected {range.toLowerCase()}.</p>
            </div>
            <div className="h-[300px] w-full">
              {isLoading ? (
                 <Skeleton active paragraph={{ rows: 6 }} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      dx={-10} 
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
                    />
                    <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="mb-6">
              <h3 className="font-bold text-lg text-[#0F172A]">Login Distribution</h3>
              <p className="text-xs text-slate-500">Hourly student clock-in volume.</p>
            </div>
            <div className="h-[300px] w-full">
              {isLoading ? (
                 <Skeleton active paragraph={{ rows: 6 }} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }} 
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {
                        distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={parseInt(entry.time) >= 9 ? (parseInt(entry.time) > 10 ? '#ef4444' : '#f59e0b') : '#3b82f6'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
