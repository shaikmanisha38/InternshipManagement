import React, { useState, useEffect } from 'react';
import { Card, Progress, Avatar, Tag, Typography, Row, Col, Tooltip, Button, Timeline, Badge, Space, Spin, Alert } from 'antd';
import { 
  FireFilled, 
  TrophyOutlined, 
  CheckCircleFilled,
  ClockCircleOutlined,
  GithubOutlined,
  BulbOutlined,
  WarningFilled,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function DashboardHome() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/v1/student/dashboard/summary', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          let errMsg = 'Failed to fetch dashboard data';
          try {
             const errData = await response.json();
             errMsg = errData.message || errMsg;
          } catch(e) {}
          throw new Error(`${response.status}: ${errMsg}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spin size="large" /></div>;
  }

  if (error) {
    return <div className="p-8"><Alert message="Error" description={error} type="error" showIcon /></div>;
  }

  if (!data) return null;

  const { user, internship, weeklyAssessment, todaysTask, githubStatus, aiFeedback, recentActivities } = data;
  const currentWeek = internship ? `Week ${internship.currentWeek}` : 'N/A';

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      
      {/* 1. TOP SUMMARY BANNER (Quick Stats) */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden" bodyStyle={{ padding: 0 }}>
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-6 text-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <Title level={3} className="!text-white !mb-1 !mt-0">Welcome back, {user.name}!</Title>
            <Text className="text-blue-200 text-sm">
              {currentDate} <span className="mx-2">•</span> <strong className="text-white">{currentWeek}</strong>
            </Text>
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Avatar src={user.profileImage || "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"} size={48} className="bg-white p-1" />
              <div>
                <Text className="block text-xs text-blue-200 uppercase tracking-wider font-bold">Internship</Text>
                <Text className="text-white font-semibold">{internship ? internship.title : 'Not Enrolled'}</Text>
              </div>
            </div>

            <div className="h-10 w-px bg-white/20 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/30">
                <TrophyOutlined className="text-xl text-amber-400" />
              </div>
              <div>
                <Text className="block text-xs text-blue-200 uppercase tracking-wider font-bold">Rank</Text>
                <Text className="text-white font-bold text-lg leading-tight">#{user.rank}</Text>
              </div>
            </div>

            <div className="h-10 w-px bg-white/20 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30">
                <FireFilled className="text-xl text-red-500 animate-pulse" />
              </div>
              <div>
                <Text className="block text-xs text-blue-200 uppercase tracking-wider font-bold">Streak</Text>
                <Text className="text-white font-bold text-lg leading-tight">{user.streak} Days</Text>
              </div>
            </div>

            <div className="h-10 w-px bg-white/20 hidden xl:block"></div>

            <div>
              <Text className="block text-xs text-blue-200 uppercase tracking-wider font-bold mb-2">Badges Earned</Text>
              <div className="flex gap-2">
                {user.badges && user.badges.length > 0 ? user.badges.map(badge => (
                  <Tooltip title={badge.name} key={badge.id}>
                    <Avatar size={28} style={{ backgroundColor: '#108ee9' }} className="cursor-pointer border border-white/20 shadow-sm flex items-center justify-center">
                      <span className="text-sm">{badge.icon}</span>
                    </Avatar>
                  </Tooltip>
                )) : <Text className="text-blue-200 text-xs">No badges yet</Text>}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* GRID LAYOUT: MAIN CONTENT vs SIDEBAR */}
      <Row gutter={[24, 24]}>
        
        {/* 2. MAIN CONTENT AREA (Core Progress & Active Work) */}
        <Col xs={24} lg={16} className="space-y-6">
          
          {/* Progress & Assessment Row */}
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card className="h-full rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow" bodyStyle={{ padding: '24px' }}>
                <Text className="text-slate-500 uppercase text-xs font-bold tracking-wider block mb-4">Overall Progress</Text>
                <div className="flex items-center gap-6">
                  <Progress 
                    type="circle" 
                    percent={internship ? internship.progress.percent : 0} 
                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                    strokeWidth={10}
                    size={100}
                    format={(percent) => <span className="font-bold text-xl">{percent}%</span>}
                  />
                  <div>
                    <Title level={4} className="!mb-1 !mt-0 text-slate-800">
                      {internship ? `${internship.progress.completed} / ${internship.progress.total}` : '0 / 0'}
                    </Title>
                    <Text className="text-slate-500 font-medium">Tasks Completed</Text>
                    <div className="mt-3">
                      <Tag color="green" className="rounded-md px-3 font-medium">On Track</Tag>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card className="h-full rounded-2xl border-emerald-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-teal-50/30" bodyStyle={{ padding: '24px' }}>
                <div className="flex justify-between items-start mb-4">
                  <Text className="text-emerald-700 uppercase text-xs font-bold tracking-wider">Weekly Assessment</Text>
                  {weeklyAssessment ? (
                    <Tag color="success" className="rounded-md m-0 border-emerald-200 bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircleFilled /> {weeklyAssessment.status}
                    </Tag>
                  ) : (
                    <Tag color="default" className="rounded-md m-0">Pending</Tag>
                  )}
                </div>
                <Title level={4} className="!mb-5 !mt-0 text-slate-800">
                  {weeklyAssessment ? weeklyAssessment.title : 'No Assessment Found'}
                </Title>
                {weeklyAssessment && (
                  <div className="flex items-baseline gap-2 bg-white/80 p-4 rounded-xl inline-block border border-emerald-100 shadow-sm">
                    <span className="text-4xl font-black text-emerald-600 leading-none">{weeklyAssessment.marks}</span>
                    <Text className="text-emerald-600 font-bold">Marks</Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Today's Task Card */}
          <Card className="rounded-2xl border-slate-200 shadow-sm border-l-4 border-l-blue-500" bodyStyle={{ padding: '32px 24px' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <Text className="text-blue-500 uppercase text-xs font-bold tracking-wider block mb-3">Today's Task</Text>
                <Title level={3} className="!mb-4 !mt-0 text-slate-800">
                  {todaysTask ? todaysTask.title : 'No Task for Today'}
                </Title>
                
                {todaysTask && (
                  <Space size={[12, 12]} wrap>
                    <Tag color="warning" className="px-3 py-1.5 text-sm rounded-md border-orange-200 bg-orange-50 text-orange-600 font-semibold m-0">
                      Difficulty: {todaysTask.difficulty}
                    </Tag>
                    <Tag className="px-3 py-1.5 text-sm rounded-md border-slate-200 bg-slate-50 text-slate-600 flex items-center gap-1.5 font-semibold m-0">
                      <ClockCircleOutlined /> {todaysTask.estimatedTime} Est.
                    </Tag>
                    <Tag color={todaysTask.status === 'APPROVED' ? 'green' : 'blue'} className="px-3 py-1.5 text-sm rounded-md font-semibold m-0">
                      {todaysTask.status}
                    </Tag>
                    <Tag color="error" className="px-3 py-1.5 text-sm rounded-md border-red-200 bg-red-50 text-red-600 font-semibold m-0">
                      Deadline: Today 11:59 PM
                    </Tag>
                  </Space>
                )}
              </div>
              
              <div className="w-full md:w-auto flex-shrink-0">
                <Button type="primary" size="large" disabled={!todaysTask || todaysTask.status === 'APPROVED'} className="w-full md:w-auto h-12 px-8 rounded-xl font-bold text-base shadow-lg shadow-blue-500/30">
                  {todaysTask && todaysTask.status === 'APPROVED' ? 'Completed' : 'Start Task'}
                </Button>
              </div>
            </div>
          </Card>

        </Col>

        {/* 3. SIDEBAR / SECONDARY COLUMN (Integrations & Logs) */}
        <Col xs={24} lg={8} className="space-y-6">
          
          {/* GitHub Status Card */}
          <Card className="rounded-2xl border-slate-200 shadow-sm" bodyStyle={{ padding: '24px' }}>
            <div className="flex items-center gap-2 mb-6">
              <GithubOutlined className="text-2xl text-slate-700" />
              <Title level={5} className="!m-0 text-slate-800">GitHub Status</Title>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <Text className="text-slate-500 font-medium">Repository Connected</Text>
                <div className="flex items-center gap-2">
                  <Badge status={githubStatus.isConnected ? "success" : "default"} /> 
                  <Text className="font-bold text-slate-700">{githubStatus.isConnected ? 'Yes' : 'No'}</Text>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <Text className="text-slate-500 font-medium">Latest Commit</Text>
                <Text className="font-bold text-slate-700">
                  {githubStatus.lastCommitTime ? new Date(githubStatus.lastCommitTime).toLocaleTimeString() : 'N/A'}
                </Text>
              </div>
              <div className="flex justify-between items-center pt-1">
                <Text className="text-slate-500 font-medium">Last Submission</Text>
                {githubStatus.lastSubmissionStatus ? (
                  <Tag color={githubStatus.lastSubmissionStatus === 'APPROVED' ? 'success' : 'processing'} className="m-0 border-green-200 bg-green-50 text-green-700 rounded-md font-bold px-3 py-1">
                    {githubStatus.lastSubmissionStatus}
                  </Tag>
                ) : (
                  <Text className="font-bold text-slate-700">None</Text>
                )}
              </div>
            </div>
          </Card>

          {/* AI Feedback Summary */}
          <Card className="rounded-2xl border-slate-200 shadow-sm" bodyStyle={{ padding: '24px' }}>
            <div className="flex items-center gap-2 mb-5">
              <BulbOutlined className="text-2xl text-amber-500" />
              <Title level={5} className="!m-0 text-slate-800">AI Feedback</Title>
            </div>
            
            <div className="bg-slate-50/80 p-4 rounded-xl mb-6 flex items-center justify-between border border-slate-100">
              <Text className="font-semibold text-slate-600">Average Score</Text>
              <div className="flex items-center gap-3">
                <Progress type="dashboard" percent={aiFeedback.averageScore} size={42} strokeWidth={14} strokeColor="#8b5cf6" format={() => ''} />
                <span className="text-2xl font-black text-violet-600">{aiFeedback.averageScore}%</span>
              </div>
            </div>

            <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4 block">Last Feedback</Text>
            {aiFeedback.lastFeedback ? (
              <ul className="space-y-3 m-0 p-0">
                {aiFeedback.lastFeedback.strengths.map((str, idx) => (
                  <li key={`str-${idx}`} className="flex items-start gap-3">
                    <CheckCircleFilled className="text-green-500 text-lg mt-0.5" />
                    <Text className="text-slate-700 font-medium">{str}</Text>
                  </li>
                ))}
                {aiFeedback.lastFeedback.weaknesses.map((wk, idx) => (
                  <li key={`wk-${idx}`} className="flex items-start gap-3">
                    <WarningFilled className="text-amber-500 text-lg mt-0.5" />
                    <Text className="text-slate-700 font-medium">{wk}</Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Text className="text-slate-500">No feedback available yet.</Text>
            )}
          </Card>

          {/* Recent Activities Timeline */}
          <Card 
            className="rounded-2xl border-slate-200 shadow-sm" 
            bodyStyle={{ padding: '24px 24px 8px 24px' }} 
            title={<Text className="text-slate-800 font-bold text-lg">Recent Activities</Text>} 
            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
          >
            {recentActivities && recentActivities.length > 0 ? (
              <Timeline
                className="pt-2"
                items={recentActivities.map((act, index) => ({
                  color: index === 0 ? 'green' : 'blue',
                  children: (
                    <div className="pb-4">
                      <Text className="font-semibold text-slate-700 block">{act.activity}</Text>
                      <Text className="text-xs text-slate-400 font-medium mt-1 block">
                        {new Date(act.createdAt).toLocaleString()}
                      </Text>
                    </div>
                  ),
                }))}
              />
            ) : (
              <Text className="text-slate-500">No recent activities.</Text>
            )}
          </Card>

        </Col>
      </Row>
    </div>
  );
}
