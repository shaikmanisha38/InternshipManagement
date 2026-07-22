"use client";
import React, { useState } from 'react';
import { 
  Table, Drawer, Tabs, Tag, Avatar, Progress, Button, Modal, Form, Input, Select, Tooltip 
} from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { 
  Calendar, CheckCircle2, Edit3, Trash2, Plus, FileText, Video, Link as LinkIcon, BookOpen, Clock, Activity, Target
} from 'lucide-react';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// --- MOCK DATA ---
const projectData = [
  {
    key: '1',
    name: 'Full Stack E-Commerce Platform',
    duration: '8 Weeks',
    students: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3', 'https://i.pravatar.cc/150?u=4'],
    completion: 65,
    status: 'Active',
    difficulty: 'Advanced',
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    outcomes: ['Build scalable REST APIs', 'Implement JWT Authentication', 'State management with Redux', 'Deploy to AWS'],
    mentor: { name: 'Dr. Alan Turing', role: 'Senior Architect', avatar: 'https://i.pravatar.cc/150?u=mentor1' },
    roadmap: [
      {
        week: 1,
        days: [
          { day: 1, title: 'Environment Setup', output: 'GitHub Repo Initialized', difficulty: 'Beginner', desc: 'Install Node, React, and setup Tailwind CSS.' },
          { day: 2, title: 'Database Design', output: 'ERD Diagram', difficulty: 'Intermediate', desc: 'Design the MongoDB schema for Users and Products.' }
        ]
      }
    ]
  },
  {
    key: '2',
    name: 'Machine Learning Data Pipeline',
    duration: '6 Weeks',
    students: ['https://i.pravatar.cc/150?u=5', 'https://i.pravatar.cc/150?u=6'],
    completion: 10,
    status: 'Draft',
    difficulty: 'Intermediate',
    techStack: ['Python', 'TensorFlow', 'Pandas', 'AWS S3'],
    outcomes: ['Data cleaning workflows', 'Model training and validation', 'API serving with FastAPI'],
    mentor: { name: 'Ada Lovelace', role: 'Data Scientist', avatar: 'https://i.pravatar.cc/150?u=mentor2' },
    roadmap: []
  },
  {
    key: '3',
    name: 'UI/UX Design System',
    duration: '4 Weeks',
    students: ['https://i.pravatar.cc/150?u=7', 'https://i.pravatar.cc/150?u=8', 'https://i.pravatar.cc/150?u=9'],
    completion: 100,
    status: 'Completed',
    difficulty: 'Beginner',
    techStack: ['Figma', 'Storybook', 'React', 'CSS'],
    outcomes: ['Component library creation', 'Design token architecture', 'Interactive prototyping'],
    mentor: { name: 'Steve Jobs', role: 'Design Lead', avatar: 'https://i.pravatar.cc/150?u=mentor3' },
    roadmap: []
  }
];

export default function MentorProjects() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleRowClick = (record) => {
    setSelectedProject(record);
    setDrawerVisible(true);
  };

  const openTaskModal = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleTaskSubmit = (values) => {
    console.log('New Task:', values);
    setModalVisible(false);
  };

  // --- COLUMNS CONFIGURATION ---
  const columns = [
    {
      title: 'Project Name',
      key: 'name',
      render: (_, record) => (
        <div className="font-bold text-[#0F172A] text-base">{record.name}</div>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => (
        <div className="flex items-center gap-2 text-sm text-[#475569]">
          <Calendar className="w-4 h-4 text-blue-500" /> {record.duration}
        </div>
      ),
    },
    {
      title: 'Students Assigned',
      key: 'students',
      render: (_, record) => (
        <Avatar.Group maxCount={3} maxStyle={{ color: '#fff', backgroundColor: '#3b82f6' }}>
          {record.students.map((url, i) => (
            <Avatar key={i} src={url} />
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Completion %',
      key: 'completion',
      render: (_, record) => (
        <div className="min-w-[150px]">
          <Progress 
            percent={record.completion} 
            size="small" 
            strokeColor={record.completion === 100 ? '#10b981' : '#3b82f6'} 
          />
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Active') color = 'success';
        if (status === 'Draft') color = 'default';
        if (status === 'Completed') color = 'processing';
        
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
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Projects Management</h1>
            <p className="text-[#475569]">Design and manage internship tracks and curriculums.</p>
          </div>
          <Button type="primary" size="large" icon={<Plus className="w-4 h-4" />} className="bg-blue-600 rounded-lg">
            New Project
          </Button>
        </div>

        {/* SECTION 1: MASTER PROJECT REPOSITORY */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden">
          <Table 
            columns={columns} 
            dataSource={projectData} 
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              className: 'cursor-pointer hover:bg-slate-50 transition-colors'
            })}
            size="large"
          />
        </div>

      </div>

      {/* SECTION 2: DEEP CURRICULUM WORKSPACE (DRAWER) */}
      <Drawer
        title={
          selectedProject ? (
            <div className="flex items-center justify-between pr-8">
              <span className="font-bold text-lg text-[#0F172A]">{selectedProject.name}</span>
              <Tag color={selectedProject.status === 'Active' ? 'success' : selectedProject.status === 'Completed' ? 'processing' : 'default'} className="rounded-full border-0">
                {selectedProject.status}
              </Tag>
            </div>
          ) : 'Project Workspace'
        }
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{ body: {} }}
      >
        {selectedProject && (
          <Tabs defaultActiveKey="1" className="mt-4 custom-tabs">
            {/* TAB A: PROJECT DETAILS OVERVIEW */}
            <TabPane tab="Project Details" key="1">
              <div className="py-6 space-y-8">
                
                {/* 2-Column Description Architecture */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] mb-2 flex items-center gap-2"><Target className="w-4 h-4 text-blue-500"/> Core Description</h4>
                      <p className="text-sm text-[#475569] leading-relaxed">
                        This track guides interns through building a complete, scalable application from scratch, heavily focusing on modern industry practices and architecture.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500"/> Difficulty Level</h4>
                      <Tag color="warning" className="border-0 px-3 py-1 font-semibold rounded-md">{selectedProject.difficulty}</Tag>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] mb-3">Technology Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.techStack.map(tech => (
                          <Tag key={tech} className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-md text-xs font-semibold">
                            {tech}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="text-sm font-bold text-[#0F172A] mb-3">Learning Outcomes</h4>
                      <ul className="space-y-3">
                        {selectedProject.outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-[#475569]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                      <Avatar src={selectedProject.mentor.avatar} size={50} />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-0.5">Lead Mentor</p>
                        <p className="text-sm font-bold text-[#0F172A]">{selectedProject.mentor.name}</p>
                        <p className="text-xs text-blue-600">{selectedProject.mentor.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </TabPane>

            {/* TAB B: INTERACTIVE MODULE & DAILY LESSON BUILDER */}
            <TabPane tab="Curriculum & Lessons" key="2">
              <div className="bg-slate-50 p-6 border-b border-slate-200">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                  <h3 className="font-bold text-lg text-[#0F172A]">Module Builder</h3>
                  <Button type="primary" className="bg-blue-600 rounded-lg" icon={<Plus className="w-4 h-4" />} onClick={openTaskModal}>
                    Add Lesson
                  </Button>
                </div>

                {selectedProject.roadmap.length > 0 ? selectedProject.roadmap.map(week => (
                  <div key={week.week} className="mb-8">
                    <h4 className="font-extrabold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                      Week {week.week}
                    </h4>
                    <div className="space-y-4">
                      {week.days.map(day => (
                        <div key={day.day} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group relative">
                          {/* Lesson Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-xs">Day {day.day}</span>
                              <h4 className="font-bold text-[#0F172A] m-0 text-base">{day.title}</h4>
                            </div>
                            <div className="flex gap-2">
                              <Tooltip title="Edit Lesson">
                                <Button type="text" size="small" icon={<Edit3 className="w-4 h-4 text-slate-400" />} />
                              </Tooltip>
                              <Tooltip title="Delete Lesson">
                                <Button size="small" type="text" danger icon={<Trash2 className="w-4 h-4" />} />
                              </Tooltip>
                            </div>
                          </div>
                          
                          {/* Task Description & Output */}
                          <p className="text-sm text-[#475569] mb-4">{day.desc}</p>
                          <div className="flex items-center gap-4 text-xs font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="flex items-center gap-1 text-[#0F172A]"><Target className="w-4 h-4 text-blue-500"/> Output: {day.output}</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-amber-600">Difficulty: {day.difficulty}</span>
                          </div>

                          {/* Upload Resources Panel */}
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Attached Resources</p>
                            <div className="flex gap-3">
                              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-blue-100 transition-colors">
                                <Video className="w-4 h-4" /> Walkthrough.mp4
                              </div>
                              <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-200 transition-colors">
                                <GithubOutlined className="w-4 h-4" /> Repository
                              </div>
                              <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-200 transition-colors">
                                <BookOpen className="w-4 h-4" /> Docs.pdf
                              </div>
                              <div className="flex items-center gap-2 bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border border-dashed border-slate-300 hover:border-blue-400 hover:text-blue-500 transition-colors">
                                <Plus className="w-4 h-4" /> Add Resource
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-[#0F172A] font-bold">No lessons created yet</h3>
                    <p className="text-slate-500 text-sm mb-4">Start building your module by adding a new lesson.</p>
                    <Button type="primary" className="bg-blue-600 rounded-lg" onClick={openTaskModal}>Add First Lesson</Button>
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        )}
      </Drawer>

      {/* LESSON CREATE/EDIT MODAL */}
      <Modal 
        title={<span className="text-[#0F172A] font-bold">Create New Lesson</span>}
        open={modalVisible} 
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleTaskSubmit} className="mt-4">
          <div className="flex gap-4">
            <Form.Item name="week" label="Module/Week Number" rules={[{ required: true }]} className="flex-1">
              <Select placeholder="Select Module" size="large">
                <Option value={1}>Module 1</Option>
                <Option value={2}>Module 2</Option>
                <Option value={3}>Module 3</Option>
                <Option value={4}>Module 4</Option>
              </Select>
            </Form.Item>
            <Form.Item name="day" label="Lesson Day" rules={[{ required: true }]} className="flex-1">
              <Input type="number" placeholder="e.g. 1" size="large" />
            </Form.Item>
          </div>

          <Form.Item name="title" label="Lesson Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Setting up the Development Environment" size="large" />
          </Form.Item>
          
          <Form.Item name="desc" label="Lesson Description">
            <TextArea rows={4} placeholder="Detailed instructions for the intern..." />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="output" label="Expected Output" rules={[{ required: true }]}>
              <Input placeholder="e.g. GitHub URL" size="large" />
            </Form.Item>
            <Form.Item name="difficulty" label="Difficulty Level">
              <Select placeholder="Select Level" size="large">
                <Option value="Beginner">Beginner</Option>
                <Option value="Intermediate">Intermediate</Option>
                <Option value="Advanced">Advanced</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={() => setModalVisible(false)} className="mr-3">Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">Save Task</Button>
          </Form.Item>
        </Form>
      </Modal>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-tabs .ant-tabs-nav::before { border-bottom: 1px solid #e2e8f0; }
        .custom-tabs .ant-tabs-tab { color: #64748b; font-weight: 500; }
        .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #0F172A !important; font-weight: 600; }
        .custom-tabs .ant-tabs-ink-bar { background: #3b82f6; }
      `}} />
    </div>
  );
}
