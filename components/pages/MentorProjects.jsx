"use client";
import React, { useState } from 'react';
import { 
  Table, Drawer, Tabs, Tag, Avatar, Progress, Button, Modal, Form, Input, Select, Tooltip, Skeleton, message 
} from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { 
  Calendar, CheckCircle2, Edit3, Trash2, Plus, FileText, Video, Link as LinkIcon, BookOpen, Clock, Activity, Target
} from 'lucide-react';
import useSWR, { mutate } from 'swr';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

export default function MentorProjects() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // SWR Fetching
  const { data: projects, error: projectsError, isLoading: projectsLoading } = useSWR('/api/v1/mentor/projects', fetcher, { refreshInterval: 5000 });
  const { data: studentsData, isLoading: studentsLoading } = useSWR('/api/v1/mentor/students', fetcher);
  
  const studentsList = studentsData?.data || [];

  const handleRowClick = (record) => {
    setSelectedProject(record);
    setDrawerVisible(true);
  };

  const openProjectModal = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleProjectSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/mentor/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          durationWeeks: values.durationWeeks,
          status: values.status,
          studentIds: values.studentIds || []
        }),
      });
      if (res.ok) {
        message.success('Project created successfully');
        setModalVisible(false);
        mutate('/api/v1/mentor/projects');
      } else {
        const data = await res.json();
        message.error(data.message || 'Failed to create project');
      }
    } catch (err) {
      message.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
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
          {record.students && record.students.map((student, i) => (
            <Tooltip title={student.name} key={i}>
              <Avatar src={student.avatar} />
            </Tooltip>
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
            {status === 'Completed' ? <><CheckCircle2 className="w-3 h-3 inline mr-1" />{status}</> : status}
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
          <Button type="primary" size="large" icon={<Plus className="w-4 h-4" />} className="bg-blue-600 rounded-lg" onClick={openProjectModal}>
            New Project
          </Button>
        </div>

        {/* SECTION 1: MASTER PROJECT REPOSITORY */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden">
          {projectsLoading ? (
             <div className="p-8">
               <Skeleton active paragraph={{ rows: 5 }} />
             </div>
          ) : (
            <Table 
              columns={columns} 
              dataSource={projects} 
              rowKey="id"
              pagination={false}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                className: 'cursor-pointer hover:bg-slate-50 transition-colors'
              })}
              size="large"
            />
          )}
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
                      <Tag color="warning" className="border-0 px-3 py-1 font-semibold rounded-md">Intermediate</Tag>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                      <Avatar src={selectedProject.mentor.avatar} size={50} />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-0.5">Lead Mentor</p>
                        <p className="text-sm font-bold text-[#0F172A]">{selectedProject.mentor.name}</p>
                        <p className="text-xs text-blue-600">Mentor</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </TabPane>
          </Tabs>
        )}
      </Drawer>

      {/* PROJECT CREATE MODAL */}
      <Modal
        title={<span className="text-[#0F172A] font-bold">Create New Project</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleProjectSubmit} className="mt-4">
          <Form.Item name="title" label="Project Title / Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Full Stack E-Commerce Platform" size="large" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="durationWeeks" label="Duration (Weeks)" rules={[{ required: true }]}>
              <Select placeholder="Select Duration" size="large">
                <Option value="4">4 Weeks</Option>
                <Option value="6">6 Weeks</Option>
                <Option value="8">8 Weeks</Option>
                <Option value="12">12 Weeks</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Select Status" size="large">
                <Option value="Active">Active</Option>
                <Option value="Draft">Draft</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="studentIds" label="Cohort Assignment (Select Students)">
            <Select 
              mode="multiple" 
              placeholder="Assign students to this track" 
              size="large"
              loading={studentsLoading}
              optionFilterProp="children"
            >
              {studentsList.map(s => (
                <Option key={s.studentId} value={s.studentId}>{s.name} ({s.email})</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={() => setModalVisible(false)} className="mr-3">Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600" loading={submitting}>Create Project</Button>
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
