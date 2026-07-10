import React from 'react';
import { Card, Progress, Avatar, Tag, Typography, Row, Col, List, Divider, Space } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  CheckCircleFilled,
  MailOutlined,
  BankOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function MyInternship() {
  const internshipData = {
    name: 'Full-Stack E-Commerce Architecture',
    description: 'An intensive, hands-on internship focused on designing, building, and deploying a scalable, modern e-commerce platform from scratch. You will gain enterprise-level experience in system design, API development, and responsive frontend interfaces.',
    duration: '8 Weeks',
    startDate: 'July 1, 2026',
    endDate: 'August 26, 2026',
    currentWeek: 4,
    currentDay: 18,
    completionPercent: 45,
    learningOutcomes: [
      'Architect scalable RESTful APIs with Node.js and Express',
      'Build dynamic, highly-responsive user interfaces using React',
      'Implement robust state management and component composition',
      'Design and query MongoDB databases securely and efficiently',
      'Set up authentication flows using JWT and secure cookies',
      'Deploy applications using Docker and modern CI/CD pipelines',
    ],
    technologies: [
      { name: 'React', color: 'blue' },
      { name: 'Node.js', color: 'green' },
      { name: 'Express', color: 'cyan' },
      { name: 'MongoDB', color: 'success' },
      { name: 'Git', color: 'orange' },
      { name: 'Docker', color: 'geekblue' },
    ],
    mentor: {
      name: 'Sarah Jenkins',
      email: 's.jenkins@techcorp.edu',
      department: 'Senior Engineering Group',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=b6e3f4'
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">

      {/* 1. INTERNSHIP HERO BANNER */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden" bodyStyle={{ padding: 0 }}>
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>

          <div className="relative z-10">
            <div className="mb-6 max-w-4xl">
              <Title level={2} className="!text-white !mb-3">{internshipData.name}</Title>
              <Paragraph className="text-blue-100 text-base leading-relaxed max-w-3xl">
                {internshipData.description}
              </Paragraph>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <Tag className="px-3 py-1.5 bg-white/10 border-white/20 text-white rounded-md flex items-center gap-2 text-sm font-medium backdrop-blur-sm">
                <ClockCircleOutlined /> Duration: {internshipData.duration}
              </Tag>
              <Tag className="px-3 py-1.5 bg-white/10 border-white/20 text-white rounded-md flex items-center gap-2 text-sm font-medium backdrop-blur-sm">
                <CalendarOutlined /> Started: {internshipData.startDate}
              </Tag>
              <Tag className="px-3 py-1.5 bg-white/10 border-white/20 text-white rounded-md flex items-center gap-2 text-sm font-medium backdrop-blur-sm">
                <FlagOutlined /> Ends: {internshipData.endDate}
              </Tag>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 max-w-2xl shadow-inner">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <Text className="text-blue-200 uppercase text-xs font-bold tracking-wider block mb-1">Live Progress</Text>
                  <Text className="text-white font-medium">
                    Week {internshipData.currentWeek} <span className="mx-2 opacity-50">|</span> Day {internshipData.currentDay}
                  </Text>
                </div>
                <div className="text-right">
                  <Text className="text-white font-bold text-xl">{internshipData.completionPercent}%</Text>
                  <Text className="text-blue-200 uppercase text-xs font-bold tracking-wider block">Completed</Text>
                </div>
              </div>
              <Progress
                percent={internshipData.completionPercent}
                showInfo={false}
                strokeColor={{ '0%': '#60a5fa', '100%': '#34d399' }}
                trailColor="rgba(255,255,255,0.2)"
                strokeWidth={10}
                className="!m-0"
              />
            </div>
          </div>
        </div>
      </Card>

      <Row gutter={[32, 32]}>

        {/* 2. MAIN CONTENT AREA */}
        <Col xs={24} lg={16} className="space-y-8">

          {/* Learning Outcomes */}
          <Card
            className="rounded-2xl border-slate-200 shadow-sm"
            bodyStyle={{ padding: '32px' }}
          >
            <Title level={4} className="!mb-6 text-slate-800">What will you learn?</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {internshipData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircleFilled className="text-blue-500 text-lg mt-0.5 shrink-0" />
                  <Text className="text-slate-600 font-medium leading-relaxed">{outcome}</Text>
                </div>
              ))}
            </div>
          </Card>

          {/* Technologies Stack */}
          <Card
            className="rounded-2xl border-slate-200 shadow-sm"
            bodyStyle={{ padding: '32px' }}
          >
            <Title level={4} className="!mb-6 text-slate-800">Technologies</Title>
            <div className="flex flex-wrap gap-3">
              {internshipData.technologies.map((tech, index) => (
                <Tag
                  key={index}
                  color={tech.color}
                  className="px-4 py-2 text-sm rounded-lg font-semibold border-opacity-50 m-0 hover:scale-105 transition-transform cursor-default"
                >
                  {tech.name}
                </Tag>
              ))}
            </div>
          </Card>

        </Col>

        {/* 3. MENTOR PROFILE CARD */}
        <Col xs={24} lg={8}>
          <Card
            className="rounded-2xl border-slate-200 shadow-sm sticky top-8"
            bodyStyle={{ padding: 0 }}
          >
            <div className="bg-slate-100 p-6 flex flex-col items-center justify-center border-b border-slate-200 rounded-t-2xl">
              <Avatar
                size={96}
                src={internshipData.mentor.avatar}
                icon={<UserOutlined />}
                className="shadow-md border-4 border-white mb-4"
              />
              <Tag color="blue" className="rounded-full px-3 uppercase tracking-wider text-xs font-bold border-blue-200 mb-2">Assigned Mentor</Tag>
              <Title level={4} className="!mb-1 text-slate-800 text-center">{internshipData.mentor.name}</Title>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1 block">Email Address</Text>
                <div className="flex items-center gap-2">
                  <MailOutlined className="text-slate-400" />
                  <a href={`mailto:${internshipData.mentor.email}`} className="text-blue-600 font-medium hover:underline">
                    {internshipData.mentor.email}
                  </a>
                </div>
              </div>

              <Divider className="my-0 border-slate-100" />

              <div>
                <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1 block">Department</Text>
                <div className="flex items-center gap-2">
                  <BankOutlined className="text-slate-400" />
                  <Text className="text-slate-700 font-medium">{internshipData.mentor.department}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
