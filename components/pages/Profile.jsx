import React from 'react';
import { Card, Typography, Avatar, Tag, Button, Descriptions, Space, Badge, Divider } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  GithubOutlined, 
  EditOutlined, 
  SafetyCertificateOutlined,
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  LinkOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Profile() {
  
  // Mock Skills Array
  const skills = ['React.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Ant Design', 'Git', 'Python'];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-6">
        <Title level={2} className="!text-slate-900 !mb-2">User Profile</Title>
        <Text className="text-slate-700 font-medium text-base">Manage your personal information, academic credentials, and active tech stack.</Text>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white overflow-hidden"  styles={{ body: { padding: 0 } }}>
          {/* Decorative Top Accent Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative">
            <div className="absolute inset-0 bg-white/10 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwem0xMCAxMGE1IDUgMCAxIDAgMC0xMCA1IDUgMCAwIDAgMCAxMHoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] mix-blend-overlay"></div>
          </div>

          <div className="px-8 pb-8">
            
            {/* ZONE 1: PROFILE SUMMARY HERO */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-10 relative z-10">
              <div className="relative">
                <Badge 
                  dot 
                  color="#10b981" 
                  offset={[-15, 110]} 
                  className="[&_.ant-badge-dot]:w-5 [&_.ant-badge-dot]:h-5 [&_.ant-badge-dot]:border-4 [&_.ant-badge-dot]:border-white [&_.ant-badge-dot]:shadow-sm"
                >
                  <Avatar 
                    size={140} 
                    icon={<UserOutlined />} 
                    className="bg-slate-200 text-slate-400 border-4 border-white shadow-md text-6xl"
                  />
                </Badge>
              </div>
              <div className="text-center sm:text-left pb-2 flex-1">
                <Title level={2} className="!text-slate-900 !m-0 !tracking-tight">Jessica Chen</Title>
                <Text className="text-slate-500 font-medium text-lg block mt-1">Software Engineering Intern</Text>
              </div>
              <div className="pb-4">
                <Tag className="m-0 bg-blue-50 border border-blue-200 text-blue-700 font-bold px-4 py-1.5 rounded-full uppercase tracking-widest text-xs shadow-sm">
                  Active Member
                </Tag>
              </div>
            </div>

            {/* ZONE 2: STRUCTURED PERSONAL & ACADEMIC DATA GRID */}
            <div className="mb-10">
              <Title level={4} className="!text-slate-900 !mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <UserOutlined className="text-blue-500" /> General Information
              </Title>
              <Descriptions 
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} 
                labelStyle={{ fontWeight: 'bold', color: '#64748b', width: '140px' }}
                contentStyle={{ fontWeight: '600', color: '#0f172a' }}
                colon={false}
              >
                {/* Contact Information */}
                <Descriptions.Item label={<span className="flex items-center gap-2"><MailOutlined /> Email</span>}>
                  <a href="mailto:jessica.chen@university.edu" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5">
                    jessica.chen@university.edu
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label={<span className="flex items-center gap-2"><PhoneOutlined /> Phone</span>}>
                  +1 (555) 123-4567
                </Descriptions.Item>

                {/* Academic Context */}
                <Descriptions.Item label={<span className="flex items-center gap-2"><BankOutlined /> College</span>}>
                  Massachusetts Institute of Technology
                </Descriptions.Item>
                <Descriptions.Item label={<span className="flex items-center gap-2"><BookOutlined /> Department</span>}>
                  Computer Science & Engineering
                </Descriptions.Item>
                <Descriptions.Item label={<span className="flex items-center gap-2"><CalendarOutlined /> Year</span>}>
                  <Tag className="m-0 bg-slate-100 border border-slate-200 text-slate-600 font-bold">Senior (2026)</Tag>
                </Descriptions.Item>

                {/* Developer Integrations */}
                <Descriptions.Item label={<span className="flex items-center gap-2"><GithubOutlined className="text-slate-800" /> GitHub</span>}>
                  <a href="https://github.com/jessicachen-dev" target="_blank" rel="noreferrer" className="text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1.5 font-bold">
                    @jessicachen-dev <LinkOutlined className="text-xs text-slate-400" />
                  </a>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* ZONE 3: TECH STACK & SKILLS CHIP BANK */}
            <div className="mb-10">
              <Title level={4} className="!text-slate-900 !mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <CodeOutlined className="text-blue-500" /> Skills & Core Competencies
              </Title>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <Tag key={skill} className="m-0 px-4 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm shadow-sm transition-colors hover:bg-blue-100">
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>

            {/* ZONE 4: SYSTEM ADMINISTRATION MANAGEMENT BUTTONS */}
            <div className="pt-6 border-t border-slate-100">
              <Space size="middle" wrap className="w-full flex justify-end">
                <Button 
                  icon={<SafetyCertificateOutlined />} 
                  size="large"
                  className="rounded-xl font-bold bg-white border-slate-300 text-slate-600 hover:text-slate-800 hover:border-slate-400 h-12 px-6 shadow-sm"
                >
                  Change Password
                </Button>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-md shadow-blue-600/20 rounded-xl font-bold text-white h-12 px-8"
                >
                  Edit Profile
                </Button>
              </Space>
            </div>

          </div>
        </Card>

      </div>
    </div>
  );
}

// Ensure CodeOutlined icon is imported appropriately for the Skills section header
import { CodeOutlined } from '@ant-design/icons';
