"use client";
import React, { useState, useMemo } from 'react';
import { 
  Table, Tag, Avatar, Select, Skeleton, Tooltip
} from 'antd';
import { 
  Trophy, TrendingUp, Cpu, CheckCircle2, Medal
} from 'lucide-react';
import useSWR from 'swr';

const { Option } = Select;
const fetcher = (url) => fetch(url).then(res => res.json());

export default function MentorLeaderboard() {
  const [collegeFilter, setCollegeFilter] = useState('All Colleges');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [batchFilter, setBatchFilter] = useState('All Batches');
  const [timeframe, setTimeframe] = useState('All Time');

  const queryParams = new URLSearchParams({
    college: collegeFilter,
    dept: deptFilter,
    batch: batchFilter,
    timeframe
  }).toString();

  const { data, isLoading } = useSWR(`/api/v1/mentor/leaderboard?${queryParams}`, fetcher, {
    refreshInterval: 5000
  });

  const roster = data?.data || [];
  const metrics = data?.metrics || {
    apexRunners: { count: 0, avgPoints: 0 },
    mostImproved: { name: 'N/A', jump: 0, avatar: null },
    highestAi: { name: 'N/A', score: 0, avatar: null },
    flawlessCount: 0
  };

  const uniqueColleges = useMemo(() => ['All Colleges', ...new Set(roster.map(r => r.college).filter(Boolean))], [roster]);
  const uniqueDepts = useMemo(() => ['All Departments', ...new Set(roster.map(r => r.department).filter(Boolean))], [roster]);
  const uniqueBatches = useMemo(() => ['All Batches', ...new Set(roster.map(r => r.batch).filter(Boolean))], [roster]);

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      sorter: (a, b) => a.rank - b.rank,
      render: (rank) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500 mx-auto" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-slate-400 mx-auto" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-amber-700 mx-auto" />;
        return <div className="font-bold text-slate-500 text-center">#{rank}</div>;
      },
      align: 'center'
    },
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size="large" />
          <div>
            <div className="font-bold text-[#0F172A]">{record.name}</div>
            <div className="text-xs text-slate-500 font-medium">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      sorter: (a, b) => a.points - b.points,
      render: (points) => (
        <div className="text-base font-extrabold text-blue-600">
          {points.toLocaleString()} pts
        </div>
      ),
    },
    {
      title: 'Badges',
      dataIndex: 'badges',
      key: 'badges',
      render: (badges) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {badges.slice(0, 3).map((badge, idx) => (
            <Tag key={idx} color="processing" className="m-0 border-0 font-semibold">{badge}</Tag>
          ))}
          {badges.length > 3 && <Tag className="m-0 border-0 bg-slate-100">+{badges.length - 3}</Tag>}
        </div>
      ),
    },
    {
      title: 'Attendance',
      dataIndex: 'attendance',
      key: 'attendance',
      sorter: (a, b) => a.attendance - b.attendance,
      render: (val) => (
        <div className={`font-bold ${val >= 90 ? 'text-emerald-600' : val >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
          {val}%
        </div>
      ),
    },
    {
      title: 'AI Score',
      dataIndex: 'aiScore',
      key: 'aiScore',
      sorter: (a, b) => a.aiScore - b.aiScore,
      render: (val) => (
        <div className="font-bold text-[#0F172A]">
          {val}%
        </div>
      ),
    },
    {
      title: 'Tasks',
      key: 'tasks',
      sorter: (a, b) => a.tasksCompleted - b.tasksCompleted,
      render: (_, record) => (
        <div className="text-sm font-semibold text-slate-600">
          {record.tasksCompleted} <span className="text-slate-400 font-normal">/ {record.totalTasks}</span>
        </div>
      ),
    }
  ];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Mentor Leaderboard</h1>
            <p className="text-[#475569]">Monitor performance, AI evaluations, and cohort rankings in real-time.</p>
          </div>
          
          <div className="flex flex-wrap gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <Select value={collegeFilter} onChange={setCollegeFilter} className="w-40" bordered={false}>
              {uniqueColleges.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
            <div className="w-px h-8 bg-slate-200" />
            <Select value={deptFilter} onChange={setDeptFilter} className="w-40" bordered={false}>
              {uniqueDepts.map(d => <Option key={d} value={d}>{d}</Option>)}
            </Select>
            <div className="w-px h-8 bg-slate-200" />
            <Select value={batchFilter} onChange={setBatchFilter} className="w-32" bordered={false}>
              {uniqueBatches.map(b => <Option key={b} value={b}>{b}</Option>)}
            </Select>
            <div className="w-px h-8 bg-slate-200" />
            <Select value={timeframe} onChange={setTimeframe} className="w-32 font-semibold text-blue-600" bordered={false}>
              <Option value="Current Week">Current Week</Option>
              <Option value="All Time">All Time</Option>
            </Select>
          </div>
        </div>

        {/* COHORT ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy className="w-16 h-16 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Apex Runners</p>
            {isLoading ? <Skeleton active paragraph={{rows: 1}} title={false} /> : (
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">Top {metrics.apexRunners.count}</h3>
                <p className="text-sm font-semibold text-blue-600 mt-1">Avg {metrics.apexRunners.avgPoints.toLocaleString()}+ pts</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-16 h-16 text-emerald-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Most Improved</p>
            {isLoading ? <Skeleton active paragraph={{rows: 1}} title={false} /> : (
              <div className="flex items-center gap-3">
                <Avatar src={metrics.mostImproved.avatar} />
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">{metrics.mostImproved.name}</h3>
                  <Tag color="success" className="m-0 mt-1 border-0">+{metrics.mostImproved.jump} pts this week</Tag>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-16 h-16 text-purple-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Highest AI Score</p>
            {isLoading ? <Skeleton active paragraph={{rows: 1}} title={false} /> : (
              <div className="flex items-center gap-3">
                <Avatar src={metrics.highestAi.avatar} />
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">{metrics.highestAi.name}</h3>
                  <p className="text-sm font-semibold text-purple-600 mt-1">{metrics.highestAi.score}% Evaluation</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 className="w-16 h-16 text-amber-500" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Flawless Record</p>
            {isLoading ? <Skeleton active paragraph={{rows: 1}} title={false} /> : (
              <div>
                <h3 className="text-2xl font-extrabold text-[#0F172A]">{metrics.flawlessCount} Students</h3>
                <p className="text-sm font-semibold text-amber-600 mt-1">100% Attendance</p>
              </div>
            )}
          </div>
        </div>

        {/* MASTER LEADERBOARD TABLE */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-500" /> Cohort Standings
              </h3>
              <p className="text-sm text-[#475569] mt-1">Live rankings based on aggregated performance metrics.</p>
            </div>
          </div>
          <Table 
            columns={columns} 
            dataSource={roster} 
            loading={isLoading}
            pagination={{ pageSize: 20, position: ['bottomCenter'] }}
            size="large"
            rowClassName="hover:bg-slate-50 transition-colors"
          />
        </div>

      </div>
    </div>
  );
}
