import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { 
  CheckCircleFilled, 
  PlayCircleFilled, 
  LockFilled,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Roadmap() {
  
  const StatusCard = ({ day, title, status, desc }) => {
    let bgClass = '';
    let textClass = '';
    let borderClass = '';
    let icon = null;

    if (status === 'completed') {
      bgClass = 'bg-emerald-50 hover:bg-emerald-100/80';
      borderClass = 'border-emerald-200';
      textClass = 'text-emerald-900';
      icon = <CheckCircleFilled className="text-2xl text-emerald-600" />;
    } else if (status === 'unlocked') {
      bgClass = 'bg-blue-50 hover:bg-blue-100/80';
      borderClass = 'border-blue-300 border-2 shadow-sm';
      textClass = 'text-slate-900';
      icon = <PlayCircleFilled className="text-2xl text-blue-600 animate-pulse" />;
    } else if (status === 'locked') {
      bgClass = 'bg-slate-100';
      borderClass = 'border-slate-200 opacity-70';
      textClass = 'text-slate-500';
      icon = <LockFilled className="text-2xl text-slate-400" />;
    }

    return (
      <div className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${bgClass} ${borderClass}`}>
        <div className="shrink-0">{icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <Text className={`font-bold uppercase tracking-wider text-xs ${status === 'completed' ? 'text-emerald-700' : status === 'unlocked' ? 'text-blue-700' : 'text-slate-400'}`}>
              Day {day}
            </Text>
          </div>
          <Title level={5} className={`!m-0 font-bold ${textClass}`}>{title}</Title>
          <Text className={`block mt-1 font-medium text-sm ${status === 'completed' ? 'text-emerald-800' : status === 'unlocked' ? 'text-slate-700' : 'text-slate-500'}`}>
            {desc}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Title level={2} className="!text-slate-900 !mb-2">Internship Roadmap</Title>
          <Text className="text-slate-700 font-medium text-base">Track your progress and upcoming milestones.</Text>
        </div>
        <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <CalendarOutlined className="text-blue-600 text-xl" />
          <div>
            <Text className="text-xs uppercase font-bold text-slate-500 tracking-wider block leading-tight">Current Focus</Text>
            <Text className="text-slate-900 font-bold leading-tight">Week 2, Day 8</Text>
          </div>
        </div>
      </div>

      {/* Timeline Layout */}
      <Row gutter={[48, 32]} className="relative">
        
        {/* Vertical Timeline Line (Desktop) */}
        <div className="hidden lg:block absolute left-[30px] top-6 bottom-0 w-1 bg-slate-200 rounded-full z-0"></div>

        {/* WEEK 1 */}
        <Col span={24} className="relative z-10">
          <div className="flex items-start gap-8">
            <div className="hidden lg:flex shrink-0 w-16 h-16 bg-slate-900 rounded-2xl items-center justify-center border-4 border-slate-50 shadow-sm">
              <Text className="text-white font-black text-xl">W1</Text>
            </div>
            
            <div className="flex-1 space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm bg-white"  styles={{ body: { padding: '32px' } }}>
                <Title level={4} className="!text-slate-900 !mb-2">Week 1: Foundations & Architecture</Title>
                <Text className="text-slate-700 font-medium block mb-6">Mastering the basics of API design and environment setup.</Text>
                
                <div className="space-y-4">
                  <StatusCard 
                    day="1" 
                    title="Environment Setup & Node.js Basics" 
                    desc="Initialize project, install dependencies, and create a basic server."
                    status="completed" 
                  />
                  <StatusCard 
                    day="2" 
                    title="Express.js Routing" 
                    desc="Set up application routes, middleware, and error handling."
                    status="completed" 
                  />
                  <StatusCard 
                    day="3" 
                    title="Database Integration (MongoDB)" 
                    desc="Connect to MongoDB using Mongoose and define schemas."
                    status="completed" 
                  />
                  <StatusCard 
                    day="4" 
                    title="Weekly Assessment & Review" 
                    desc="Complete the Week 1 quiz and push all code to GitHub."
                    status="locked" 
                  />
                </div>
              </Card>
            </div>
          </div>
        </Col>

        {/* WEEK 2 */}
        <Col span={24} className="relative z-10">
          <div className="flex items-start gap-8">
            <div className="hidden lg:flex shrink-0 w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center border-4 border-slate-50 shadow-md">
              <Text className="text-white font-black text-xl">W2</Text>
            </div>
            
            <div className="flex-1 space-y-6">
              <Card className="rounded-2xl border-blue-200 shadow-md bg-white ring-1 ring-blue-100"  styles={{ body: { padding: '32px' } }}>
                <div className="flex justify-between items-center mb-2">
                  <Title level={4} className="!text-slate-900 !m-0">Week 2: Authentication & Security</Title>
                  <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-md">Current Week</span>
                </div>
                <Text className="text-slate-700 font-medium block mb-6">Implementing secure JWT authentication flows and role-based access control.</Text>
                
                <div className="space-y-4">
                  <StatusCard 
                    day="8" 
                    title="Build Login API (JWT Authentication)" 
                    desc="Validate credentials, hash passwords, and issue access tokens."
                    status="unlocked" 
                  />
                  <StatusCard 
                    day="9" 
                    title="Role-Based Access Control (RBAC)" 
                    desc="Create middleware to protect routes based on user roles."
                    status="locked" 
                  />
                </div>
              </Card>
            </div>
          </div>
        </Col>

      </Row>
    </div>
  );
}
