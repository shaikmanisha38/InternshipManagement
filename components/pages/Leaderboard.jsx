"use client";
import React, { useState } from 'react';
import { Card, Typography, Select, Table, Avatar, Tag, Space, Input, Button } from 'antd';
import { 
  TrophyFilled, 
  CrownFilled,
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  CodeFilled,
  FireFilled,
  CalendarFilled,
  StarFilled,
  RocketFilled
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock Leaderboard Data
const leaderboardData = [
  { key: '1', rank: 1, name: 'Alex Developer', points: 2840, tasks: '38 / 40 Tasks', isCurrentUser: false },
  { key: '2', rank: 2, name: 'Samantha UI', points: 2750, tasks: '37 / 40 Tasks', isCurrentUser: false },
  { key: '3', rank: 3, name: 'David Backend', points: 2610, tasks: '35 / 40 Tasks', isCurrentUser: false },
  { key: '4', rank: 4, name: 'Michael Smith', points: 2450, tasks: '34 / 40 Tasks', isCurrentUser: false },
  { key: '5', rank: 5, name: 'Jessica Chen', points: 2320, tasks: '31 / 40 Tasks', isCurrentUser: true },
  { key: '6', rank: 6, name: 'Robert Johnson', points: 2180, tasks: '28 / 40 Tasks', isCurrentUser: false },
  { key: '7', rank: 7, name: 'Emily Davis', points: 2150, tasks: '28 / 40 Tasks', isCurrentUser: false },
  { key: '8', rank: 8, name: 'William Brown', points: 1980, tasks: '25 / 40 Tasks', isCurrentUser: false },
  { key: '9', rank: 9, name: 'Olivia Taylor', points: 1850, tasks: '22 / 40 Tasks', isCurrentUser: false },
  { key: '10', rank: 10, name: 'James Wilson', points: 1720, tasks: '20 / 40 Tasks', isCurrentUser: false },
];

export default function Leaderboard() {
  const [searchText, setSearchText] = useState('');

  // Render Rank Icon
  const renderRank = (rank) => {
    if (rank === 1) return <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center border border-yellow-300 shadow-sm"><CrownFilled className="text-yellow-500 text-xl" /></div>;
    if (rank === 2) return <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-300 shadow-sm"><TrophyFilled className="text-slate-400 text-xl" /></div>;
    if (rank === 3) return <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center border border-orange-300 shadow-sm"><TrophyFilled className="text-orange-600 text-xl" /></div>;
    return <Text className="text-slate-500 font-bold text-lg ml-3">{rank}</Text>;
  };

  // Render Mini Badges in Table
  const renderMiniBadges = (rank) => {
    return (
      <div className="flex gap-1.5">
        <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm"><CodeFilled className="text-blue-500 text-[11px]" /></div>
        <div className="w-6 h-6 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shadow-sm"><FireFilled className="text-orange-500 text-[11px]" /></div>
        {rank <= 3 && <div className="w-6 h-6 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center shadow-sm"><StarFilled className="text-yellow-500 text-[11px]" /></div>}
        {rank === 1 && <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shadow-sm"><RocketFilled className="text-purple-500 text-[11px]" /></div>}
        <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm"><CalendarFilled className="text-emerald-500 text-[11px]" /></div>
      </div>
    );
  };

  // Table Columns
  const columns = [
    {
      title: <Text className="text-slate-500 font-bold uppercase text-[11px] tracking-widest ml-1">Rank</Text>,
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      render: (rank) => renderRank(rank),
    },
    {
      title: <Text className="text-slate-500 font-bold uppercase text-[11px] tracking-widest">Student</Text>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar size="large" icon={<UserOutlined />} className={`${record.isCurrentUser ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'} shadow-sm`} />
          <Text className={`font-bold text-base ${record.isCurrentUser ? 'text-blue-900' : 'text-slate-900'}`}>{text}</Text>
          {record.isCurrentUser && <Tag color="blue" className="ml-2 border-blue-300 font-bold">You</Tag>}
        </div>
      ),
    },
    {
      title: <Text className="text-slate-500 font-bold uppercase text-[11px] tracking-widest">Points</Text>,
      dataIndex: 'points',
      key: 'points',
      render: (points, record) => <Text className={`${record.isCurrentUser ? 'text-blue-700' : 'text-slate-800'} font-black text-lg`}>{points.toLocaleString()} pts</Text>,
    },
    {
      title: <Text className="text-slate-500 font-bold uppercase text-[11px] tracking-widest">Badges Earned</Text>,
      key: 'badges',
      render: (_, record) => renderMiniBadges(record.rank),
    },
    {
      title: <Text className="text-slate-500 font-bold uppercase text-[11px] tracking-widest">Completed Tasks</Text>,
      dataIndex: 'tasks',
      key: 'tasks',
      render: (tasks, record) => <Text className={`${record.isCurrentUser ? 'text-blue-800' : 'text-slate-600'} font-bold`}>{tasks}</Text>,
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-6">
        <Title level={2} className="!text-slate-900 !mb-2">Global Leaderboard</Title>
        <Text className="text-slate-700 font-medium text-base">Check your standing, compare scores, and compete with your peers.</Text>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white overflow-hidden"  styles={{ body: { padding: 0 } }}>
          {/* GLOBAL FILTER CONTAINER */}
          <div className="p-5 md:p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              {/* Dropdown Filters */}
              <Space wrap size="middle">
                <Select defaultValue="all" className="w-40 [&>.ant-select-selector]:rounded-lg [&>.ant-select-selector]:border-slate-200 font-bold text-slate-700 shadow-sm">
                  <Option value="all">All Colleges</Option>
                  <Option value="mit">MIT</Option>
                  <Option value="stanford">Stanford</Option>
                  <Option value="harvard">Harvard</Option>
                </Select>
                <Select defaultValue="all" className="w-40 [&>.ant-select-selector]:rounded-lg [&>.ant-select-selector]:border-slate-200 font-bold text-slate-700 shadow-sm">
                  <Option value="all">All Departments</Option>
                  <Option value="cs">Computer Science</Option>
                  <Option value="ee">Electrical Eng</Option>
                  <Option value="ds">Data Science</Option>
                </Select>
                <Select defaultValue="2025" className="w-32 [&>.ant-select-selector]:rounded-lg [&>.ant-select-selector]:border-slate-200 font-bold text-slate-700 shadow-sm">
                  <Option value="2025">Batch 2025</Option>
                  <Option value="2026">Batch 2026</Option>
                </Select>
              </Space>

              {/* Search & Reset */}
              <Space size="middle" className="w-full md:w-auto">
                <Input 
                  placeholder="Search students..." 
                  prefix={<SearchOutlined className="text-slate-400" />} 
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="w-full md:w-64 rounded-lg border-slate-200 shadow-sm font-medium"
                />
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => setSearchText('')}
                  className="rounded-lg border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 font-bold shadow-sm"
                >
                  Reset
                </Button>
              </Space>
            </div>
          </div>

          {/* COMPETITIVE RANKING TABLE */}
          <div className="overflow-x-auto">
            <Table 
              columns={columns} 
              dataSource={leaderboardData} 
              pagination={{ pageSize: 8 }}
              rowClassName={(record) => 
                record.isCurrentUser 
                  ? 'bg-blue-50/90 border-l-4 border-l-blue-500 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]' 
                  : 'hover:bg-slate-50/50 transition-colors duration-200'
              }
              className="[&_.ant-table-thead_th]:bg-white [&_.ant-table-thead_th]:border-b-2 [&_.ant-table-thead_th]:border-slate-100 [&_.ant-table-thead_th]:py-4 [&_.ant-table-tbody_td]:border-b [&_.ant-table-tbody_td]:border-slate-100 [&_.ant-table-tbody_td]:py-5 [&_.ant-pagination]:px-6 [&_.ant-pagination]:pb-6 [&_.ant-pagination]:pt-4"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
