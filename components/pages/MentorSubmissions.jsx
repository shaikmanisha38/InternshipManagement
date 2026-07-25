"use client";
import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Avatar, Segmented, message, Skeleton } from 'antd';
import { 
  CheckCircle, Clock, TrendingUp, UserCheck, CheckSquare, UploadCloud, FileText, AlertCircle, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';

export default function MentorSubmissions() {
  const [filter, setFilter] = useState('Today');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    submissions: [],
    metrics: { totalSubmissions: 0, submissionRate: 0, pendingReviews: 0, activeInternsCount: 0 },
    chartData: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/mentor/submissions?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        message.error('Failed to load submissions data');
      }
    } catch (e) {
      console.error(e);
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  // Custom Tooltip for Recharts
  const PremiumTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg shadow-blue-900/10">
          <p className="font-bold text-[#0F172A] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              Submissions: {entry.value}
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
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.user.profileImage} size="large" className="bg-indigo-100 text-indigo-600">
            {record.user.name?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-bold text-[#0F172A]">{record.user.name}</div>
            <div className="text-xs text-[#64748b]">{record.user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Task Completed',
      key: 'task',
      render: (_: any, record: any) => (
        <div>
          <div className="font-semibold text-slate-800">{record.task.title}</div>
          <div className="text-xs text-slate-500 font-medium">Week {record.task.week} / Day {record.task.day}</div>
        </div>
      ),
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => (
        <div className="flex items-center gap-2 text-sm text-[#334155]">
          <Clock className="w-4 h-4 text-slate-400" /> {dayjs(date).format('MMM D, h:mm A')}
        </div>
      ),
    },
    {
      title: 'GitHub Link',
      dataIndex: 'repositoryUrl',
      key: 'repositoryUrl',
      render: (url: string, record: any) => (
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
            View Repo
          </a>
        ) : (
          <span className="text-slate-400 italic">No link</span>
        )
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let colorClass = 'bg-slate-100 text-slate-700';
        if (status === 'EVALUATED') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (status === 'PENDING') colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
        if (status === 'REJECTED') colorClass = 'bg-red-50 text-red-700 border-red-200';
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Global Filters */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Daily Submissions</h1>
            <p className="text-[#475569]">Monitor student task completion and review pending submissions.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <Segmented 
              options={['Today', 'Week', 'Month']} 
              value={filter} 
              onChange={setFilter}
              className="bg-slate-200 p-1 font-medium"
            />
          </div>
        </div>

        {/* ZONE 1: SUMMARY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-500" /> Total Submissions
            </p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{loading ? <Skeleton.Button active size="small" /> : data.metrics.totalSubmissions}</h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm shadow-emerald-900/5 p-5 border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-500" /> Submission Rate
            </p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{loading ? <Skeleton.Button active size="small" /> : `${data.metrics.submissionRate}%`}</h2>
              <span className="text-sm font-medium text-slate-400 mb-1">
                of {data.metrics.activeInternsCount} interns
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm shadow-amber-900/5 p-5 border border-amber-50 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertCircle className="w-16 h-16 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Pending Reviews
            </p>
            <div className="flex items-end gap-3 relative z-10">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{loading ? <Skeleton.Button active size="small" /> : data.metrics.pendingReviews}</h2>
            </div>
          </div>

        </div>

        {/* ZONE 2: SUBMISSION TRENDS */}
        <Card className="rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 mb-6" styles={{ body: { padding: '24px' } }}>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#0F172A]">Submission Volume ({filter})</h3>
            <p className="text-sm text-[#475569]">Number of tasks submitted over the selected time period.</p>
          </div>
          
          <div className="h-64">
            {loading ? (
               <div className="w-full h-full flex items-center justify-center">
                 <Skeleton active paragraph={{ rows: 4 }} />
               </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip content={<PremiumTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSubmissions)" 
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* ZONE 3: SUBMISSIONS ROSTER */}
        <Card className="rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden" styles={{ body: { padding: 0 } }}>
          <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Recent Submissions</h3>
              <p className="text-sm text-[#64748b]">Live feed of student task completions.</p>
            </div>
          </div>
          <Table 
            columns={columns} 
            dataSource={data.submissions}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="[&_.ant-table-thead_th]:bg-slate-50 [&_.ant-table-thead_th]:text-slate-500 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:uppercase [&_.ant-table-thead_th]:text-xs [&_.ant-table-thead_th]:tracking-wider"
          />
        </Card>

      </div>
    </div>
  );
}
