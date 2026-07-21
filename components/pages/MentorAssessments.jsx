"use client";
import React, { useState } from 'react';
import { 
  Table, Tag, Avatar, Button, Drawer, Form, Input, Select, InputNumber, Space, Tooltip, Divider, Card, message, Skeleton
} from 'antd';
import { 
  Plus, Edit3, Trash2, FileText, Code2, Clock, CheckCircle2, AlertCircle, PlusCircle, MinusCircle, LayoutList
} from 'lucide-react';
import useSWR from 'swr';

const { Option } = Select;
const { TextArea } = Input;

const fetcher = (url) => fetch(url).then(res => res.json());

export default function MentorAssessments() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [form] = Form.useForm();

  const { data: assessmentsData, mutate, isLoading } = useSWR('/api/v1/mentor/assessments', fetcher, {
    refreshInterval: 5000
  });

  const assessmentsCatalog = assessmentsData?.data || [];

  const handleCreateSubmit = async (values) => {
    try {
      const res = await fetch('/api/v1/mentor/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        message.success('Assessment created successfully');
        setDrawerVisible(false);
        form.resetFields();
        mutate(); // Re-fetch SWR
      } else {
        message.error('Failed to create assessment');
      }
    } catch (err) {
      message.error('Error creating assessment');
    }
  };

  // Find the selected assessment's submissions
  let activeSubmissions = [];
  if (selectedAssessmentId) {
    const selected = assessmentsCatalog.find(a => a.id === selectedAssessmentId);
    if (selected) activeSubmissions = selected.submissions;
  } else if (assessmentsCatalog.length > 0) {
    // default to first
    activeSubmissions = assessmentsCatalog[0].submissions;
  }

  // --- COLUMNS CONFIGURATION ---
  const columns = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size="large" />
          <div className="font-bold text-[#0F172A]">{record.name}</div>
        </div>
      ),
    },
    {
      title: 'Quiz Score',
      key: 'quizScore',
      render: (_, record) => (
        <div className="text-sm font-semibold text-[#334155]">
          {record.quizScore} <span className="text-slate-400 font-normal">/ {record.maxQuiz}</span>
        </div>
      ),
    },
    {
      title: 'Coding Score',
      key: 'codingScore',
      render: (_, record) => (
        <div className="text-sm font-semibold text-[#334155]">
          {record.codingScore} <span className="text-slate-400 font-normal">/ {record.maxCoding}</span>
        </div>
      ),
    },
    {
      title: 'Total Score',
      key: 'totalScore',
      sorter: (a, b) => a.totalScore - b.totalScore,
      render: (_, record) => {
        const percentage = record.maxTotal > 0 ? (record.totalScore / record.maxTotal) * 100 : 0;
        let color = 'text-[#0F172A]';
        if (percentage >= 90) color = 'text-emerald-600';
        if (percentage <= 50) color = 'text-red-600';
        
        return (
          <div className={`text-base font-extrabold ${color}`}>
            {record.totalScore} <span className="text-slate-400 font-medium text-xs">/ {record.maxTotal}</span>
          </div>
        );
      },
    },
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      sorter: (a, b) => a.rank - b.rank,
      render: (rank) => (
        <div className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
          #{rank}
        </div>
      ),
    },
  ];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Global Filters */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Assessments Management</h1>
            <p className="text-[#475569]">Design curriculums and track granular exam performance.</p>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<Plus className="w-4 h-4" />} 
            className="bg-blue-600 rounded-lg font-semibold"
            onClick={() => setDrawerVisible(true)}
          >
            Create Assessment
          </Button>
        </div>

        {/* ZONE 1: WEEKLY ASSESSMENTS OVERVIEW */}
        {isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentsCatalog.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedAssessmentId(item.id)}
                className={`bg-white rounded-xl p-5 border cursor-pointer transition-all group relative ${selectedAssessmentId === item.id || (!selectedAssessmentId && assessmentsCatalog[0].id === item.id) ? 'border-blue-500 shadow-md shadow-blue-500/10' : 'border-slate-100 shadow-sm shadow-blue-900/5 hover:shadow-md'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-[#0F172A]">{item.title}</h3>
                  <Tag 
                    color={item.status === 'Published' ? 'success' : item.status === 'Scheduled' ? 'processing' : 'default'} 
                    className="rounded-full px-3 py-1 border-0 font-medium m-0"
                  >
                    {item.status}
                  </Tag>
                </div>
                
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#475569] bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <LayoutList className="w-4 h-4 text-blue-500" /> 
                    <span className="font-semibold text-[#0F172A]">{item.metrics.mcqs}</span> MCQs
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#475569] bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <Code2 className="w-4 h-4 text-purple-500" /> 
                    <span className="font-semibold text-[#0F172A]">{item.metrics.coding}</span> Tasks
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {item.duration} Minutes
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ZONE 2: COHORT PERFORMANCE & RESULTS DIRECTORY */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Assessment Results
            </h3>
            <p className="text-sm text-[#475569] mt-1">Granular tracking of student exam performance. Click column headers to sort.</p>
          </div>
          <Table 
            columns={columns} 
            dataSource={activeSubmissions} 
            loading={isLoading}
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            size="large"
            rowClassName="hover:bg-slate-50 transition-colors"
            locale={{ emptyText: 'No submissions or no assessment selected' }}
          />
        </div>

      </div>

      {/* ZONE 3: MENTOR AUTHORING ENGINE (DRAWER) */}
      <Drawer
        title={<span className="font-bold text-xl text-[#0F172A]">Author New Assessment</span>}
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{ body: {} }}
        footer={
          <div className="flex justify-end gap-3 py-2 px-6">
            <Button onClick={() => setDrawerVisible(false)} className="rounded-lg font-medium border-slate-300 text-[#475569]">
              Cancel
            </Button>
            <Button type="primary" onClick={() => form.submit()} className="bg-blue-600 rounded-lg font-semibold px-6">
              Create Assessment
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit} className="p-8">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h3 className="font-bold text-[#0F172A] mb-4 text-base flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Core Metadata</h3>
            
            <Form.Item name="title" label={<span className="font-semibold text-[#334155]">Assessment Title</span>} rules={[{ required: true }]}>
              <Input placeholder="e.g. Week 4 React Fundamentals" size="large" className="rounded-lg" />
            </Form.Item>
            
            <Form.Item name="status" label={<span className="font-semibold text-[#334155]">Status</span>} rules={[{ required: true }]} initialValue="Draft">
              <Select size="large">
                <Option value="Published">Published</Option>
                <Option value="Scheduled">Scheduled</Option>
                <Option value="Draft">Draft</Option>
              </Select>
            </Form.Item>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item name="duration" label={<span className="font-semibold text-[#334155]">Duration (Minutes)</span>} rules={[{ required: true }]}>
                <InputNumber placeholder="60" size="large" className="w-full rounded-lg" />
              </Form.Item>
              <Form.Item name="passingMarks" label={<span className="font-semibold text-[#334155]">Passing Marks</span>} rules={[{ required: true }]}>
                <InputNumber placeholder="50" size="large" className="w-full rounded-lg" />
              </Form.Item>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#0F172A] text-base flex items-center gap-2"><LayoutList className="w-4 h-4 text-emerald-500" /> Assessment Structure</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Form.Item name="mcqs" label={<span className="font-semibold text-[#334155]">Number of MCQs</span>} rules={[{ required: true }]} initialValue={0}>
                <InputNumber min={0} placeholder="30" size="large" className="w-full rounded-lg" />
              </Form.Item>
              <Form.Item name="codingTasks" label={<span className="font-semibold text-[#334155]">Number of Coding Tasks</span>} rules={[{ required: true }]} initialValue={0}>
                <InputNumber min={0} placeholder="2" size="large" className="w-full rounded-lg" />
              </Form.Item>
            </div>
          </div>

        </Form>
      </Drawer>
    </div>
  );
}
