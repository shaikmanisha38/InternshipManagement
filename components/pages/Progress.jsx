"use client";
import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Tabs, Progress as AntProgress, Tag, Spin, Alert } from 'antd';
import { 
  CheckCircleFilled, 
  ClockCircleFilled, 
  LockFilled, 
  CloseCircleFilled,
  TrophyFilled,
  ArrowUpOutlined,
  CalendarOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
  LineChart, Line
} from 'recharts';

const { Title, Text } = Typography;

const getHeatmapColor = (intensity) => {
  switch(intensity) {
    case 0: return 'bg-slate-100';
    case 1: return 'bg-blue-200';
    case 2: return 'bg-blue-400';
    case 3: return 'bg-blue-600';
    case 4: return 'bg-blue-800';
    default: return 'bg-slate-100';
  }
};

export default function Progress() {
  const [timeRange, setTimeRange] = useState('weekly');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/student/progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          let errData;
          try {
            errData = await response.json();
          } catch(e) {}
          throw new Error(errData?.message || `Failed to fetch progress analytics: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Spin size="large" /></div>;
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Alert title="Error Loading Progress" description={error} type="error" showIcon className="rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const { taskStats, avgAiScore, progressData, statusData, commitData, scoresData, attendanceGrid } = data;

  const totalTasks = taskStats.total || 1;
  const completionPercent = Math.round((taskStats.completed / totalTasks) * 100) || 0;

  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-6">
        <Title level={2} className="!text-slate-900 !mb-2">Progress Analytics</Title>
        <Text className="text-slate-700 font-medium text-base">Monitor your performance, task completion rates, and learning trajectories.</Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white"  styles={{ body: { padding: '20px' } }}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleFilled className="text-emerald-500 text-lg" />
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completed Tasks</Text>
          </div>
          <Title level={2} className="!text-slate-900 !m-0">{taskStats.completed} <Text className="text-slate-400 text-sm font-medium">/ {taskStats.total}</Text></Title>
          <div className="mt-3 flex items-center gap-2">
            <AntProgress percent={completionPercent} size="small" showInfo={false} strokeColor="#10b981" trailColor="#f1f5f9" className="m-0" />
            <Text className="text-emerald-600 font-bold text-xs">{completionPercent}%</Text>
          </div>
        </Card>

        <Card className="rounded-2xl border-amber-200 shadow-sm shadow-blue-900/5 bg-white border-b-4"  styles={{ body: { padding: '20px' } }}>
          <div className="flex items-center gap-3 mb-2">
            <ClockCircleFilled className="text-amber-500 text-lg" />
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending</Text>
          </div>
          <Title level={2} className="!text-slate-900 !m-0">{taskStats.pending}</Title>
          <Text className="text-amber-600 font-bold text-xs mt-3 block">Currently active tasks</Text>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-slate-50"  styles={{ body: { padding: '20px' } }}>
          <div className="flex items-center gap-3 mb-2">
            <LockFilled className="text-slate-400 text-lg" />
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Locked</Text>
          </div>
          <Title level={2} className="!text-slate-500 !m-0">{taskStats.locked}</Title>
          <Text className="text-slate-500 font-bold text-xs mt-3 block">Future timeline tasks</Text>
        </Card>

        <Card className="rounded-2xl border-red-200 shadow-sm shadow-blue-900/5 bg-red-50/30 border-l-4"  styles={{ body: { padding: '20px' } }}>
          <div className="flex items-center gap-3 mb-2">
            <CloseCircleFilled className="text-red-500 text-lg" />
            <Text className="text-red-800 text-xs font-bold uppercase tracking-wider">Missed / Overdue</Text>
          </div>
          <Title level={2} className="!text-red-900 !m-0">{taskStats.missed}</Title>
          <Tag className="mt-3 bg-red-100 border-red-200 text-red-700 font-bold rounded m-0 border-0">Needs Attention</Tag>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-gradient-to-br from-blue-900 to-indigo-900 text-white"  styles={{ body: { padding: '20px' } }}>
          <div className="flex items-center gap-3 mb-2">
            <TrophyFilled className="text-yellow-400 text-lg" />
            <Text className="text-blue-200 text-xs font-bold uppercase tracking-wider">Avg AI Score</Text>
          </div>
          <Title level={2} className="!text-white !m-0">{avgAiScore}%</Title>
          <div className="mt-3 flex items-center gap-1.5 bg-white/10 w-max px-2 py-1 rounded text-xs font-bold text-emerald-300">
            <ArrowUpOutlined /> Dynamic
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white lg:col-span-2" title={<Text className="text-slate-900 font-bold text-lg" styles={{ body: { padding: '24px' } }}>Completion Velocity</Text>}
          headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
        >
          <div className="h-[300px] w-full mt-4">
            {progressData && progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.05)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="xp" name="XP Earned" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
            )}
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white lg:col-span-1" title={<Text className="text-slate-900 font-bold text-lg" styles={{ body: { padding: '24px' } }}>Task Distribution</Text>}
          headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
        >
          <div className="h-[300px] w-full flex flex-col items-center justify-center relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.05)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-700 font-semibold text-xs ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <Text className="block text-3xl font-black text-slate-900">{taskStats.total}</Text>
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</Text>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white" title={<div className="flex items-center gap-2" styles={{ body: { padding: '24px' } }}><GithubOutlined className="text-slate-800" /><Text className="text-slate-900 font-bold text-base">Git Commits</Text></div>}
          headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
        >
          <div className="h-[200px] w-full mt-2">
            {commitData && commitData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commitData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="commits" name="Commits" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
            )}
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white" title={<Text className="text-slate-900 font-bold text-base" styles={{ body: { padding: '24px' } }}>Score Trends</Text>}
          headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
        >
          <div className="h-[200px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoresData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} domain={[0, 100]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="aiScore" name="AI Score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line yAxisId="left" type="monotone" dataKey="weekScore" name="Assessment" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white" title={<div className="flex items-center gap-2" styles={{ body: { padding: '24px' } }}><CalendarOutlined className="text-slate-800" /><Text className="text-slate-900 font-bold text-base">Attendance</Text></div>}
          headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
        >
          <div className="flex flex-col h-[200px] justify-between mt-2">
            <div className="grid grid-cols-7 gap-2">
              {attendanceGrid && attendanceGrid.map((intensity, idx) => (
                <div 
                  key={idx} 
                  className={`aspect-square rounded-sm ${getHeatmapColor(intensity)} transition-colors hover:ring-2 ring-slate-400 ring-offset-1 cursor-pointer`}
                  title={`Day ${idx + 1}`}
                ></div>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-4">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-800"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
