"use client";
import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { 
  Card, Input, Select, Table, Drawer, Tabs, Button, Tag, Avatar, Progress, Spin
} from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { 
  Search, Download, CheckCircle, XCircle, AlertTriangle, FileText, Send, Award
} from 'lucide-react';

const { Option } = Select;
const { TabPane } = Tabs;

const fetcher = (url) => fetch(url, {
  headers: {
    // Optionally extract from localStorage or cookies. 
    // In this project, cookie parsing for JWT is already handled by the backend.
  }
}).then(res => res.json());

export default function MentorStudents() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Build SWR URL with query parameters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (batchFilter !== 'all') params.append('batch', batchFilter);
    if (deptFilter !== 'all') params.append('dept', deptFilter);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    return `/api/v1/mentor/students?${params.toString()}`;
  }, [searchQuery, batchFilter, deptFilter, statusFilter]);

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    refreshInterval: 10000, // Poll every 10 seconds
  });

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
          <div className="text-xs text-[#64748b]">{record.department} {record.year ? `(Batch ${record.year})` : ''}</div>
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
            <span className="text-[#64748b]">Prog: {Math.round(record.progress)}%</span>
            <span className="text-[#64748b]">Att: {record.attendance}%</span>
          </div>
          <Progress 
            percent={record.progress} 
            showInfo={false} 
            size="small" 
            strokeColor={record.progress === 100 ? '#10b981' : (record.status === 'Behind Schedule' ? '#f59e0b' : '#3b82f6')} 
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select 
                value={batchFilter} 
                onChange={setBatchFilter} 
                size="large" 
                className="w-32" 
                popupMatchSelectWidth={false}
              >
                <Option value="all">All Batches</Option>
                <Option value="2024">Batch 2024</Option>
                <Option value="2025">Batch 2025</Option>
                <Option value="2026">Batch 2026</Option>
                <Option value="2027">Batch 2027</Option>
              </Select>
              <Select 
                value={deptFilter} 
                onChange={setDeptFilter} 
                size="large" 
                className="w-44" 
                popupMatchSelectWidth={false}
              >
                <Option value="all">All Depts</Option>
                <Option value="Computer Science">Computer Science</Option>
                <Option value="Information Tech">Information Tech</Option>
                <Option value="Software Eng">Software Engineering</Option>
                <Option value="Data Science">Data Science</Option>
              </Select>
              <Select 
                value={statusFilter} 
                onChange={setStatusFilter} 
                size="large" 
                className="w-36" 
                popupMatchSelectWidth={false}
              >
                <Option value="all">Any Status</Option>
                <Option value="active">Active</Option>
                <Option value="behind">Behind Schedule</Option>
                <Option value="completed">Completed</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </div>
          </div>
        </Card>

        {/* ZONE 2: MASTER STUDENT DIRECTORY */}
        <Card className="rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden min-h-[400px]"  styles={{ body: { padding: 0 } }}>
          {error || (data && data.message) ? (
             <div className="p-8 text-center text-red-500 font-medium flex flex-col items-center justify-center">
               <AlertTriangle className="w-8 h-8 mb-2" />
               Failed to load students. You may not be authorized.
             </div>
          ) : (
            <Table 
              columns={columns} 
              dataSource={data ? data.data : []} 
              loading={{ indicator: <Spin size="large" />, spinning: isLoading }}
              pagination={{ pageSize: 10, position: ['bottomCenter'] }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                className: 'cursor-pointer hover:bg-slate-50 transition-colors'
              })}
              size="large"
            />
          )}
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
                    {selectedStudent.github ? (
                      <a href={`https://github.com/${selectedStudent.github}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 flex items-center gap-2 hover:underline">
                        <GithubOutlined className="w-4 h-4" /> @{selectedStudent.github}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500">Not Connected</span>
                    )}
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedStudent.week > i+1 ? 'bg-emerald-100 text-emerald-600' : selectedStudent.week === i+1 ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'bg-slate-100 text-slate-400'}`}>
                        W{i+1}
                      </div>
                      <div className="flex-1 p-3 border border-slate-100 rounded-lg bg-slate-50">
                        <p className="text-sm font-medium text-[#0F172A]">Module {i+1} {selectedStudent.week > i+1 ? '(Completed)' : selectedStudent.week === i+1 ? '(In Progress)' : '(Locked)'}</p>
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
                    <FileText className="w-4 h-4 text-blue-600" /> Recent Submission: AI Analysis
                  </h4>
                  <p className="text-sm text-[#475569] mb-3">AI Evaluation: Overall satisfactory approach. Maintain clean architecture principles.</p>
                  <Tag color="blue">Average Score: {selectedStudent.aiScore}/100</Tag>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Assessments & Attendance" key="4">
              <div className="py-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-[#0F172A] mb-3">Attendance Stats</h4>
                  <p className="text-sm text-slate-600">Overall Attendance: <span className="font-bold text-blue-600">{selectedStudent.attendance}%</span></p>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Certificates" key="5">
              <div className="py-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
                  <Award className="w-8 h-8 text-emerald-500" />
                </div>
                <h4 className="font-semibold text-[#0F172A] mb-1">{selectedStudent.status === 'Completed' ? 'Certificate Issued' : 'No Certificates Yet'}</h4>
                <p className="text-sm text-slate-500">{selectedStudent.status === 'Completed' ? 'This student has successfully completed the roadmap.' : 'Student must complete the internship roadmap to unlock certificates.'}</p>
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
