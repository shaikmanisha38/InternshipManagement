import React, { useState } from 'react';
import { Card, Typography, Tag, Tabs, Button, Checkbox, Row, Col, Space, Divider, Avatar } from 'antd';
import {
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  GithubOutlined,
  CodeOutlined,
  UploadOutlined,
  RobotOutlined,
  FilePdfOutlined,
  PlaySquareOutlined,
  LinkOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function TodaysTask() {
  const [checklist, setChecklist] = useState({
    read: true,
    clone: false,
    complete: false,
    commit: false,
    push: false,
    submit: false
  });

  const handleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const contentTabs = [
    {
      key: '1',
      label: <Text className="font-semibold text-slate-800">Objectives & Requirements</Text>,
      children: (
        <div className="space-y-4 pt-2">
          <Paragraph className="text-slate-600 text-base leading-relaxed font-medium">
            Your primary objective today is to build a robust Login API using Node.js, Express, and JSON Web Tokens (JWT). You will establish a secure authentication route that validates user credentials against a MongoDB database and issues an access token upon successful verification.
          </Paragraph>

          <Title level={5} className="!text-slate-900 !mb-2">Key Requirements:</Title>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium">
            <li>Create a <code className="bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-100">POST /api/auth/login</code> endpoint.</li>
            <li>Accept <code className="bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-100">email</code> and <code className="bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-100">password</code> in the request body.</li>
            <li>Validate the email exists in the database.</li>
            <li>Compare the hashed password securely using bcrypt.</li>
            <li>Generate a JWT payload containing the user ID and role, signed with a secure secret.</li>
            <li>Return the token and basic user info (excluding password).</li>
          </ul>
        </div>
      ),
    },
    {
      key: '2',
      label: <Text className="font-semibold text-slate-800">Expected Output</Text>,
      children: (
        <div className="space-y-4 pt-2">
          <Paragraph className="text-slate-600 font-medium">
            Upon successful login, your API should respond with a <code className="bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-100">200 OK</code> status code and the following JSON structure:
          </Paragraph>
          <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto shadow-inner border border-slate-800">
            <pre className="text-blue-300 font-mono text-sm m-0">
              {`{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ecb8b392d700153f3a1f",
      "email": "student@example.com",
      "role": "student"
    }
  }
}`}
            </pre>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <Row gutter={[32, 32]}>

        {/* LEFT COLUMN (Documentation & Content) */}
        <Col xs={24} lg={16} className="space-y-6">

          {/* Task Header Banner */}
          <Card className="rounded-2xl border-0 shadow-sm bg-slate-900" bodyStyle={{ padding: '32px' }}>
            <div className="flex flex-col gap-4">
              <div>
                <Text className="text-blue-300 uppercase text-xs font-bold tracking-wider block mb-2">Today's Task • Day 18</Text>
                <Title level={2} className="!text-white !mb-4 !mt-0">Build Login API (JWT Authentication)</Title>
                <Paragraph className="text-white/90 text-base leading-relaxed max-w-3xl font-medium m-0">
                  Implement secure stateless authentication by issuing JSON Web Tokens. Ensure standard security practices like bcrypt hashing and hiding sensitive data in responses.
                </Paragraph>
              </div>

              <Space size={[12, 12]} wrap className="mt-4 pt-4 border-t border-white/10">
                <Tag className="px-3 py-1.5 text-sm rounded-md border-amber-500/30 bg-amber-500/20 text-amber-300 font-bold m-0 flex items-center gap-1.5">
                  <ExclamationCircleOutlined /> Difficulty: Medium
                </Tag>
                <Tag className="px-3 py-1.5 text-sm rounded-md border-blue-400/30 bg-blue-500/20 text-blue-200 flex items-center gap-1.5 font-bold m-0">
                  <ClockCircleOutlined /> 3 Hours Est.
                </Tag>
                <Tag className="px-3 py-1.5 text-sm rounded-md border-red-500/30 bg-red-500/20 text-red-300 font-bold m-0 flex items-center gap-1.5">
                  <ClockCircleOutlined /> Deadline: Today 11:59 PM
                </Tag>
              </Space>
            </div>
          </Card>

          {/* Tabs Section */}
          <Card className="rounded-2xl border-slate-200 shadow-sm bg-white" bodyStyle={{ padding: '16px 32px 32px 32px' }}>
            <Tabs defaultActiveKey="1" items={contentTabs} size="large" />
          </Card>

          {/* Attachments Panel */}
          <Card
            className="rounded-2xl border-slate-200 shadow-sm bg-white"
            bodyStyle={{ padding: '24px' }}
            title={<Text className="text-slate-900 font-bold text-lg">Resources & Attachments</Text>}
            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <Avatar size={40} icon={<FilePdfOutlined />} className="bg-red-100 text-red-600" />
                <div className="flex-1">
                  <Text className="block text-slate-900 font-bold group-hover:text-blue-700 transition-colors">API Architecture Guide</Text>
                  <Text className="text-xs text-slate-500 font-medium">PDF Document • 2.4 MB</Text>
                </div>
              </a>

              <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <Avatar size={40} icon={<PlaySquareOutlined />} className="bg-blue-100 text-blue-700" />
                <div className="flex-1">
                  <Text className="block text-slate-900 font-bold group-hover:text-blue-700 transition-colors">JWT Setup Walkthrough</Text>
                  <Text className="text-xs text-slate-500 font-medium">Video • 12 Mins</Text>
                </div>
              </a>

              <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <Avatar size={40} icon={<GithubOutlined />} className="bg-slate-200 text-slate-800" />
                <div className="flex-1">
                  <Text className="block text-slate-900 font-bold group-hover:text-blue-700 transition-colors">Starter Repository</Text>
                  <Text className="text-xs text-slate-500 font-medium">GitHub Link</Text>
                </div>
              </a>

              <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <Avatar size={40} icon={<LinkOutlined />} className="bg-emerald-100 text-emerald-700" />
                <div className="flex-1">
                  <Text className="block text-slate-900 font-bold group-hover:text-blue-700 transition-colors">Bcrypt Documentation</Text>
                  <Text className="text-xs text-slate-500 font-medium">External Reference</Text>
                </div>
              </a>
            </div>
          </Card>

        </Col>

        {/* RIGHT COLUMN (Action Center) */}
        <Col xs={24} lg={8} className="space-y-6">

          {/* Action Button Bar */}
          <Card className="rounded-2xl border-slate-200 shadow-sm bg-white" bodyStyle={{ padding: '24px' }}>
            <div className="flex flex-col gap-3">
              <Button type="primary" icon={<UploadOutlined />} className="w-full h-12 rounded-xl font-bold text-base bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-md shadow-blue-600/20 text-white mb-2">
                Submit Task
              </Button>
              <Button icon={<RobotOutlined />} className="w-full h-11 rounded-xl font-bold bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-300">
                View AI Feedback
              </Button>
              <Divider className="my-2 border-slate-100" />
              <Button icon={<CodeOutlined />} className="w-full h-11 rounded-xl font-bold border-blue-200 text-blue-800 bg-blue-50 hover:bg-blue-100 hover:border-blue-300">
                Open VS Code
              </Button>
              <Button icon={<GithubOutlined />} className="w-full h-11 rounded-xl font-bold border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 bg-slate-50">
                View Repository
              </Button>
            </div>
          </Card>

          {/* Task Checklist Card */}
          <Card
            className="rounded-2xl border-slate-200 shadow-sm bg-white sticky top-8"
            bodyStyle={{ padding: '24px' }}
            title={<Text className="text-slate-900 font-bold text-lg">Task Workflow</Text>}
            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
          >
            <div className="space-y-3 mt-2">
              {[
                { key: 'read', label: 'Read Problem Statement' },
                { key: 'clone', label: 'Clone Repository' },
                { key: 'complete', label: 'Complete Task Logic' },
                { key: 'commit', label: 'Commit Changes' },
                { key: 'push', label: 'Push to Remote' },
                { key: 'submit', label: 'Submit for Evaluation' }
              ].map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer select-none ${checklist[item.key] ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}
                  onClick={() => handleCheck(item.key)}
                >
                  <Checkbox checked={checklist[item.key]} className="scale-110 pointer-events-none" />
                  <span className={`font-semibold ${checklist[item.key] ? 'line-through opacity-60' : 'text-slate-800'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <Divider className="my-5 border-slate-100" />

            <div className="flex items-center justify-between">
              <Text className="text-slate-700 font-bold">Progress</Text>
              <Text className="text-blue-700 font-black text-lg">
                {Object.values(checklist).filter(Boolean).length} / 6
              </Text>
            </div>
          </Card>

        </Col>
      </Row>
    </div>
  );
}
