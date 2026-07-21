import React from 'react';
import useSWR from 'swr';
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

const fetcher = (url) => fetch(url, {
  headers: {
    // Optionally extract from localStorage or cookies. 
    // In this project, cookie parsing for JWT is already handled by the backend.
  }
}).then(res => res.json());

function timeAgo(dateParam) {
  if (!dateParam) return '';
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} seconds ago`;
  else if (minutes < 60) return `${minutes} mins ago`;
  else if (hours < 24) return `${hours} hours ago`;
  else return `${days} days ago`;
}

export default function MentorOverview() {
  const { data: overviewData, error: overviewError, isLoading: isOverviewLoading } = useSWR('/api/v1/mentor/overview', fetcher, {
    refreshInterval: 10000, // Poll every 10 seconds
  });

  const { data: trendsData, error: trendsError, isLoading: isTrendsLoading } = useSWR('/api/v1/mentor/activity-trends', fetcher, {
    refreshInterval: 5000, // Poll every 5 seconds
  });

  if (isOverviewLoading || isTrendsLoading) {
    return (
      <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Spin size="large" tip="Loading Dashboard Metrics..." />
      </div>
    );
  }

  if (overviewError || (overviewData && overviewData.message) || trendsError || (trendsData && trendsData.message)) {
    const errorMessage = (overviewData?.message) || (trendsData?.message) || 'Error loading dashboard metrics.';
    return (
      <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200 flex items-center gap-3">
          <AlertCircle />
          <span>{errorMessage === 'Internal server error' ? 'Database connection failed or internal error occurred.' : errorMessage}</span>
        </div>
      </div>
    );
  }

  const { metrics, pipeline } = overviewData;
  const { weeklyPerformance, recentLogs } = trendsData;

  const totalPipeline = pipeline.total || 1; // Prevent division by zero
  const getPercent = (val) => Math.round((val / totalPipeline) * 100);

  const progressData = [
    { name: 'Completed', value: pipeline.completed, color: '#10b981' },
    { name: 'In Progress', value: pipeline.inProgress, color: '#3b82f6' },
    { name: 'Inactive', value: pipeline.inactive, color: '#94a3b8' },
    { name: 'Behind Schedule', value: pipeline.behindSchedule, color: '#f59e0b' },
  ];

  const getTimelineIcon = (type) => {
    switch(type) {
      case 'TASK_SUBMISSION': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'AI_EVALUATION': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'CERTIFICATE': return <Award className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getTimelineColor = (type) => {
    switch(type) {
      case 'TASK_SUBMISSION': return 'green';
      case 'AI_EVALUATION': return 'blue';
      case 'CERTIFICATE': return 'purple';
      default: return 'orange';
    }
  };

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
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{metrics.totalStudents}</h2>
              <p className="text-xs font-medium text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded-md inline-block">{metrics.activeUsers} Active Users</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Card 2: Completion */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#475569] mb-1">Completed Internships</p>
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{metrics.completedInternships}</h2>
              <p className="text-xs font-medium text-emerald-600 mt-2 bg-emerald-50 px-2 py-1 rounded-md inline-block">{metrics.certificatesIssued} Certificates Issued</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          {/* Card 3: Action Items */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#475569] mb-1">Pending Reviews</p>
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{metrics.pendingReviews}</h2>
              <p className="text-xs font-medium text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded-md inline-block">{metrics.todaysSubmissions} Today's Submissions</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>

          {/* Card 4: Performance */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#475569] mb-1">Avg AI Score</p>
              <h2 className="text-3xl font-extrabold text-[#0F172A]">{metrics.avgAiScore}%</h2>
              <p className="text-xs font-medium text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded-md inline-block">{metrics.avgAttendance}% Avg Attendance</p>
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
              <div>
                <div className="flex justify-between text-sm font-semibold text-[#334155] mb-2">
                  <span>Completed</span>
                  <span>{pipeline.completed} ({getPercent(pipeline.completed)}%)</span>
                </div>
                <Progress percent={getPercent(pipeline.completed)} strokeColor="#10b981" showInfo={false} size="default" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold text-[#334155] mb-2">
                  <span>In Progress</span>
                  <span>{pipeline.inProgress} ({getPercent(pipeline.inProgress)}%)</span>
                </div>
                <Progress percent={getPercent(pipeline.inProgress)} strokeColor="#3b82f6" showInfo={false} size="default" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold text-[#334155] mb-2">
                  <span>Inactive</span>
                  <span>{pipeline.inactive} ({getPercent(pipeline.inactive)}%)</span>
                </div>
                <Progress percent={getPercent(pipeline.inactive)} strokeColor="#94a3b8" showInfo={false} size="default" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold text-[#334155] mb-2">
                  <span>Behind Schedule</span>
                  <span>{pipeline.behindSchedule} ({getPercent(pipeline.behindSchedule)}%)</span>
                </div>
                <Progress percent={getPercent(pipeline.behindSchedule)} strokeColor="#f59e0b" showInfo={false} size="default" />
              </div>
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
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {recentLogs && recentLogs.length > 0 ? (
                <Timeline
                  items={recentLogs.map((log) => ({
                    color: getTimelineColor(log.type),
                    dot: getTimelineIcon(log.type),
                    content: (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-[#0F172A]">{log.title}</p>
                        <p className="text-xs text-[#64748b]">{log.subtitle} • {timeAgo(log.timestamp)}</p>
                      </div>
                    ),
                  }))}
                />
              ) : (
                <div className="text-sm text-slate-500 italic">No recent activity found.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
