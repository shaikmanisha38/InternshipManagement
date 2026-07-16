import React from 'react';
import { 
  Table, Tag, Avatar, Select, Progress 
} from 'antd';
import { 
  Trophy, TrendingUp, Zap, CheckCircle2, Medal, Target, Award
} from 'lucide-react';

const { Option } = Select;

// --- MOCK DATA ---
const leaderboardData = [
  {
    key: '1',
    rank: 1,
    name: 'Alexandra Smith',
    email: 'alexandra.s@university.edu',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    points: 4250,
    badges: ['Fast Coder', 'Bug Hunter', 'AI Master'],
    attendance: 100,
    aiScore: 98,
    tasksCompleted: 40,
    totalTasks: 40
  },
  {
    key: '2',
    rank: 2,
    name: 'David Chen',
    email: 'david.c@university.edu',
    avatar: 'https://i.pravatar.cc/150?u=davidchen',
    points: 3980,
    badges: ['Team Player', 'UI Expert'],
    attendance: 98,
    aiScore: 92,
    tasksCompleted: 38,
    totalTasks: 40
  },
  {
    key: '3',
    rank: 3,
    name: 'Maria Garcia',
    email: 'maria.g@university.edu',
    avatar: 'https://i.pravatar.cc/150?u=mariagarcia',
    points: 3850,
    badges: ['Fast Coder'],
    attendance: 95,
    aiScore: 89,
    tasksCompleted: 37,
    totalTasks: 40
  },
  {
    key: '4',
    rank: 4,
    name: 'James Wilson',
    email: 'james.w@university.edu',
    avatar: 'https://i.pravatar.cc/150?u=jamesw',
    points: 3420,
    badges: ['Problem Solver'],
    attendance: 92,
    aiScore: 85,
    tasksCompleted: 35,
    totalTasks: 40
  },
  {
    key: '5',
    rank: 5,
    name: 'Sophia Patel',
    email: 'sophia.p@university.edu',
    avatar: 'https://i.pravatar.cc/150?u=sophiap',
    points: 3100,
    badges: [],
    attendance: 88,
    aiScore: 82,
    tasksCompleted: 30,
    totalTasks: 40
  },
  {
    key: '6',
    rank: 6,
    name: 'Lucas Kim',
    email: 'lucas.k@university.edu',
    avatar: 'https://i.pravatar.cc/150?u=lucask',
    points: 2950,
    badges: ['Bug Hunter'],
    attendance: 85,
    aiScore: 78,
    tasksCompleted: 28,
    totalTasks: 40
  }
];

export default function MentorLeaderboard() {
  
  // --- COLUMNS CONFIGURATION ---
  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      sorter: (a, b) => a.rank - b.rank,
      render: (rank) => {
        if (rank === 1) {
          return (
            <div className="flex justify-center items-center w-8 h-8 rounded-full bg-amber-100 border border-amber-200 shadow-sm shadow-amber-500/20">
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
          );
        }
        if (rank === 2) {
          return (
            <div className="flex justify-center items-center w-8 h-8 rounded-full bg-slate-100 border border-slate-300 shadow-sm shadow-slate-500/20">
              <Trophy className="w-4 h-4 text-slate-500" />
            </div>
          );
        }
        if (rank === 3) {
          return (
            <div className="flex justify-center items-center w-8 h-8 rounded-full bg-orange-50 border border-orange-200 shadow-sm shadow-orange-700/20">
              <Trophy className="w-4 h-4 text-orange-600" />
            </div>
          );
        }
        return (
          <div className="flex justify-center items-center w-8 h-8 font-bold text-[#475569]">
            {rank}
          </div>
        );
      },
    },
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size="large" />
          <div>
            <div className="font-bold text-[#0F172A]">{record.name}</div>
            <a href={`mailto:${record.email}`} className="text-xs text-blue-500 hover:text-blue-700 hover:underline">{record.email}</a>
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
        <div className="font-extrabold text-blue-600 text-base">
          {points.toLocaleString()} <span className="text-xs font-semibold text-blue-400">pts</span>
        </div>
      ),
    },
    {
      title: 'Badges',
      dataIndex: 'badges',
      key: 'badges',
      render: (badges) => (
        <div className="flex gap-1 flex-wrap w-[150px]">
          {badges.length > 0 ? badges.map(badge => (
            <Tag key={badge} className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] m-0 font-semibold px-2">
              {badge}
            </Tag>
          )) : <span className="text-xs text-slate-400 font-medium">None</span>}
        </div>
      ),
    },
    {
      title: 'Attendance',
      dataIndex: 'attendance',
      key: 'attendance',
      sorter: (a, b) => a.attendance - b.attendance,
      render: (attendance) => (
        <div className={`font-bold text-sm ${attendance >= 95 ? 'text-emerald-600' : attendance >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
          {attendance}%
        </div>
      ),
    },
    {
      title: 'AI Score',
      dataIndex: 'aiScore',
      key: 'aiScore',
      sorter: (a, b) => a.aiScore - b.aiScore,
      render: (aiScore) => (
        <div className="font-bold text-[#0F172A] text-sm">
          {aiScore}%
        </div>
      ),
    },
    {
      title: 'Tasks Completed',
      key: 'tasks',
      sorter: (a, b) => a.tasksCompleted - b.tasksCompleted,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-500" />
          <span className="font-bold text-[#0F172A] text-sm">{record.tasksCompleted}</span>
          <span className="text-slate-400 text-xs">/ {record.totalTasks}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Leaderboard & Statistics</h1>
          <p className="text-[#475569]">Monitor top performers and cohort engagement metrics.</p>
        </div>

        {/* ZONE 1: BATCH PERFORMANCE COHORT STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Top Placements */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-amber-500">
              <Medal className="w-32 h-32" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2 relative z-10">
              <Award className="w-4 h-4 text-amber-500" /> Apex Runners
            </p>
            <div className="relative z-10">
              <h2 className="text-2xl font-extrabold text-[#0F172A]">Top 10</h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">Averaging 3,800+ pts</p>
            </div>
          </div>

          {/* Most Improved */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Most Improved
            </p>
            <div className="flex items-center gap-3">
              <Avatar src="https://i.pravatar.cc/150?u=davidchen" size="large" />
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">David Chen</h2>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> Up 15 Ranks
                </span>
              </div>
            </div>
          </div>

          {/* Highest AI Score */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" /> Highest AI Score
            </p>
            <div className="flex items-center gap-3">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="large" />
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">A. Smith</h2>
                <p className="text-xs font-bold text-indigo-600 mt-0.5">98% Evaluation</p>
              </div>
            </div>
          </div>

          {/* Highest Attendance */}
          <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" /> Flawless Record
              </p>
              <h2 className="text-2xl font-extrabold text-[#0F172A]">12 Students</h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">Zero absences</p>
            </div>
            <div className="text-center mr-2">
              <Progress type="circle" percent={100} size={50} strokeColor="#10b981" format={() => <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />} />
            </div>
          </div>

        </div>

        {/* ZONE 2: GRANULAR SYSTEM FILTER TOOLBAR */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-4 border border-slate-100 flex flex-wrap gap-4 items-center">
          <span className="text-sm font-bold text-[#334155] mr-2">Filters:</span>
          <Select defaultValue="all_colleges" className="w-40" size="middle">
            <Option value="all_colleges">All Colleges</Option>
            <Option value="c1">Tech University</Option>
            <Option value="c2">State College</Option>
          </Select>
          <Select defaultValue="all_depts" className="w-40" size="middle">
            <Option value="all_depts">All Departments</Option>
            <Option value="cs">Computer Science</Option>
            <Option value="it">Information Tech</Option>
          </Select>
          <Select defaultValue="b24" className="w-40" size="middle">
            <Option value="all_batches">All Batches</Option>
            <Option value="b24">Batch 2024</Option>
            <Option value="b23">Batch 2023</Option>
          </Select>
          <Select defaultValue="current" className="w-40" size="middle">
            <Option value="current">Current Week</Option>
            <Option value="w3">Week 3</Option>
            <Option value="w2">Week 2</Option>
            <Option value="w1">Week 1</Option>
          </Select>
        </div>

        {/* ZONE 3: MASTER COHORT LEADERBOARD ROSTER */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Master Leaderboard
              </h3>
              <p className="text-sm text-[#475569] mt-1">Live ranking of cohort performance. Click column headers to re-sort.</p>
            </div>
          </div>
          <Table 
            columns={columns} 
            dataSource={leaderboardData} 
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            size="large"
            rowClassName="hover:bg-slate-50 transition-colors"
          />
        </div>

      </div>
    </div>
  );
}
