"use client";
import React, { useState } from 'react';
import { 
  Card, Input, Select, Table, Drawer, Tabs, Button, Tag, Avatar, Progress, Space 
} from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { 
  Search, Download, CheckCircle, XCircle, AlertTriangle, FileText, Send
} from 'lucide-react';

const { Option } = Select;
const { TabPane } = Tabs;

// --- MOCK DATA ---
const studentData = [
  {
    key: '1',
    name: 'Emily Chen',
    email: 'emily.chen@university.edu',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    college: 'State Tech University',
    department: 'Computer Science',
    week: 4,
    day: 18,
    progress: 75,
    attendance: 92,
    aiScore: 88,
    status: 'Active',
    github: 'emilyc-dev'
  },
  {
    key: '2',
    name: 'Marcus Johnson',
    email: 'mjohnson99@college.edu',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    college: 'National Institute',
    department: 'Information Tech',
    week: 3,
    day: 14,
    progress: 45,
    attendance: 65,
    aiScore: 72,
    status: 'Behind Schedule',
    github: 'marcus-j-codes'
  },
  {
    key: '3',
    name: 'Sarah Williams',
    email: 'swilliams@tech.edu',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    college: 'Global Engineering',
    department: 'Software Eng',
    week: 5,
    day: 25,
    progress: 100,
    attendance: 98,
    aiScore: 95,
    status: 'Completed',
    github: 'sarah-w-eng'
  },
  {
    key: '4',
    name: 'David Kim',
    email: 'dkim@university.edu',
    avatar: 'https://i.pravatar.cc/150?u=david',
    college: 'State Tech University',
    department: 'Computer Science',
    week: 2,
    day: 10,
    progress: 20,
    attendance: 15,
    aiScore: 40,
    status: 'Inactive',
    github: 'dkim-student'
  },
  {
    key: '5',
    name: 'Priya Patel',
    email: 'ppatel@institute.edu',
    avatar: 'https://i.pravatar.cc/150?u=priya',
    college: 'National Institute',
    department: 'Data Science',
    week: 4,
    day: 20,
    progress: 80,
    attendance: 95,
    aiScore: 91,
    status: 'Active',
    github: 'priya-data'
  }
];

export default function MentorStudents() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleRowClick = (record) => {
    setSelectedStudent(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedStudent(null);
  };

  // --- COLUMNS CONFIGURATION ---
  const columns = [
    {
      title: 'Identity',
      key: 'identity',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size="large" />
          <div>
            <div className="font-bold text-[#0F172A]">{record.name}</div>
            <a href={`mailto:${record.email}`} className="text-xs text-blue-600 hover:underline">
              {record.email}
            </a>
          </div>
        </div>
      ),
    },
    {
      title: 'Academic Context',
      key: 'academic',
      render: (_, record) => (
        <div>
          <div className="text-sm font-semibold text-[#334155]">{record.college}</div>
          <div className="text-xs text-[#64748b]">{record.department}</div>
        </div>
      ),
    },
    {
      title: 'Timeline',
      key: 'timeline',
      render: (_, record) => (
        <div className="text-sm text-[#334155]">
          <span className="font-bold">W{record.week}</span> / Day {record.day}
        </div>
      ),
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => (
        <div className="min-w-[150px]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#64748b]">Prog: {record.progress}%</span>
            <span className="text-[#64748b]">Att: {record.attendance}%</span>
          </div>
          <Progress 
            percent={record.progress} 
            showInfo={false} 
            size="small" 
            strokeColor={record.progress === 100 ? '#10b981' : '#3b82f6'} 
          />
          <div className="mt-1 text-xs font-semibold text-[#0F172A]">
            AI Score: <span className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{record.aiScore}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Active' || status === 'Completed') color = 'success';
        if (status === 'Behind Schedule') color = 'warning';
        if (status === 'Inactive') color = 'default';
        
        return (
          <Tag color={color} className="font-medium rounded-full px-3 py-1 border-0">
            {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Students Management</h1>
          <p className="text-[#475569]">Comprehensive directory and tracking for assigned interns.</p>
        </div>

        {/* ZONE 1: GLOBAL CONTROL BAR */}
        <Card className="rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100"  styles={{ body: { padding: '20px' } }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input 
                prefix={<Search className="w-4 h-4 text-slate-400" />} 
                placeholder="Search Student by Name or Email..." 
                size="large"
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select defaultValue="all" size="large" className="w-32" popupMatchSelectWidth={false}>
                <Option value="all">All Batches</Option>
                <Option value="b1">Batch 2024-A</Option>
                <Option value="b2">Batch 2024-B</Option>
              </Select>
              <Select defaultValue="all" size="large" className="w-36" popupMatchSelectWidth={false}>
                <Option value="all">All Depts</Option>
                <Option value="cs">Computer Science</Option>
                <Option value="it">Information Tech</Option>
              </Select>
              <Select defaultValue="all" size="large" className="w-32" popupMatchSelectWidth={false}>
                <Option value="all">Any Status</Option>
                <Option value="active">Active</Option>
                <Option value="behind">Behind Schedule</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </div>
          </div>
        </Card>

        {/* ZONE 2: MASTER STUDENT DIRECTORY */}
        <Card className="rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden"  styles={{ body: { padding: 0 } }}>
          <Table 
            columns={columns} 
            dataSource={studentData} 
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              className: 'cursor-pointer hover:bg-slate-50 transition-colors'
            })}
            size="large"
          />
        </Card>

      </div>

      {/* ZONE 3: DYNAMIC STUDENT PORTFOLIO DRAWER */}
      <Drawer
        title={
          selectedStudent ? (
            <div className="flex items-center gap-3">
              <Avatar src={selectedStudent.avatar} />
              <span className="font-bold text-[#0F172A]">{selectedStudent.name}'s Portfolio</span>
            </div>
          ) : 'Student Portfolio'
        }
        width={700}
        onClose={closeDrawer}
        open={drawerVisible}
        styles={{ body: {} }}
        footer={
          /* ZONE 4: ACTION BANNER FOR MENTORS */
          <div className="flex flex-wrap gap-3 py-2">
            <Button type="primary" className="bg-blue-600 hover:bg-blue-700 font-medium rounded-lg">
              Assign Internship
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-medium rounded-lg icon-btn flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Approve Submission
            </Button>
            <div className="w-px bg-slate-200 mx-1" />
            <Button danger className="font-medium rounded-lg border-red-500 text-red-500 hover:bg-red-50 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Reject
            </Button>
            <Button className="bg-amber-100 hover:bg-amber-200 text-amber-700 border-0 font-medium rounded-lg flex items-center gap-2">
              <Send className="w-4 h-4" /> Send Feedback
            </Button>
            <Button type="text" className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Reset
            </Button>
            <div className="flex-1" />
            <Button icon={<Download className="w-4 h-4" />} className="rounded-lg font-medium text-[#475569]">
              Export
            </Button>
          </div>
        }
      >
        {selectedStudent && (
          <Tabs defaultActiveKey="1" className="mt-4 custom-tabs">
            <TabPane tab="Profile & Integration" key="1">
              <div className="py-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-[#0F172A]">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">GitHub Profile</p>
                    <a href="#" className="text-sm font-medium text-blue-600 flex items-center gap-2 hover:underline">
                      <GithubOutlined className="w-4 h-4" /> @{selectedStudent.github}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">College</p>
                    <p className="text-sm font-medium text-[#0F172A]">{selectedStudent.college}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Department</p>
                    <p className="text-sm font-medium text-[#0F172A]">{selectedStudent.department}</p>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Progress & Roadmap" key="2">
              <div className="py-6">
                <h4 className="font-semibold text-[#0F172A] mb-4">Timeline Track</h4>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-emerald-100 text-emerald-600' : i === 3 ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'bg-slate-100 text-slate-400'}`}>
                        W{i+1}
                      </div>
                      <div className="flex-1 p-3 border border-slate-100 rounded-lg bg-slate-50">
                        <p className="text-sm font-medium text-[#0F172A]">Module {i+1} {i < 3 ? '(Completed)' : i === 3 ? '(In Progress)' : '(Locked)'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabPane>
            <TabPane tab="Tasks & AI Feedback" key="3">
              <div className="py-6">
                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl mb-4">
                  <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Recent Submission: REST API Auth
                  </h4>
                  <p className="text-sm text-[#475569] mb-3">AI Evaluation: Excellent use of JWT tokens. However, error handling middleware could be improved to catch async rejections.</p>
                  <Tag color="blue">Score: 92/100</Tag>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Assessments & Attendance" key="4">
              <div className="py-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-[#0F172A] mb-3">Assessment History</h4>
                  <Table 
                    size="small" 
                    pagination={false}
                    columns={[
                      { title: 'Exam', dataIndex: 'exam' },
                      { title: 'Score', dataIndex: 'score' },
                      { title: 'Status', dataIndex: 'status', render: s => <Tag color="success">{s}</Tag> }
                    ]}
                    dataSource={[
                      { key: 1, exam: 'Week 1 Basics', score: '85%', status: 'Pass' },
                      { key: 2, exam: 'Week 2 Advanced', score: '90%', status: 'Pass' },
                    ]}
                  />
                </div>
              </div>
            </TabPane>
            <TabPane tab="Certificates" key="5">
              <div className="py-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
                  <Award className="w-8 h-8 text-emerald-500" />
                </div>
                <h4 className="font-semibold text-[#0F172A] mb-1">No Certificates Yet</h4>
                <p className="text-sm text-slate-500">Student must complete the internship roadmap to unlock credentials.</p>
              </div>
            </TabPane>
          </Tabs>
        )}
      </Drawer>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-tabs .ant-tabs-nav::before { border-bottom: 1px solid #e2e8f0; }
        .custom-tabs .ant-tabs-tab { color: #64748b; font-weight: 500; }
        .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #0F172A !important; font-weight: 600; }
        .custom-tabs .ant-tabs-ink-bar { background: #3b82f6; }
      `}} />
    </div>
  );
}
