"use client";
import React, { useState } from 'react';
import { 
  Table, Tag, Avatar, Button, Drawer, Form, Input, Select, InputNumber, Space, Tooltip, Divider, Card 
} from 'antd';
import { 
  Plus, Edit3, Trash2, FileText, Code2, Clock, CheckCircle2, AlertCircle, PlusCircle, MinusCircle, LayoutList
} from 'lucide-react';

const { Option } = Select;
const { TextArea } = Input;

// --- MOCK DATA ---
const assessmentsCatalog = [
  {
    id: 1,
    week: 'Week 1 Assessment',
    metrics: { mcqs: 30, coding: 2 },
    status: 'Published',
    duration: 60,
  },
  {
    id: 2,
    week: 'Week 2 Assessment',
    metrics: { mcqs: 40, coding: 3 },
    status: 'Scheduled',
    duration: 90,
  },
  {
    id: 3,
    week: 'Week 3 Assessment',
    metrics: { mcqs: 25, coding: 1 },
    status: 'Draft',
    duration: 45,
  }
];

const studentResults = [
  {
    key: '1',
    name: 'Emily Chen',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    quizScore: 28,
    maxQuiz: 30,
    codingScore: 48,
    maxCoding: 50,
    totalScore: 76,
    maxTotal: 80,
    rank: 1
  },
  {
    key: '2',
    name: 'Marcus Johnson',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    quizScore: 22,
    maxQuiz: 30,
    codingScore: 35,
    maxCoding: 50,
    totalScore: 57,
    maxTotal: 80,
    rank: 12
  },
  {
    key: '3',
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    quizScore: 29,
    maxQuiz: 30,
    codingScore: 45,
    maxCoding: 50,
    totalScore: 74,
    maxTotal: 80,
    rank: 2
  },
  {
    key: '4',
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/150?u=david',
    quizScore: 15,
    maxQuiz: 30,
    codingScore: 20,
    maxCoding: 50,
    totalScore: 35,
    maxTotal: 80,
    rank: 45
  }
];

export default function MentorAssessments() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreateSubmit = (values) => {
    console.log('New Assessment Configuration:', values);
    setDrawerVisible(false);
  };

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
        const percentage = (record.totalScore / record.maxTotal) * 100;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessmentsCatalog.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-5 border border-slate-100 hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-[#0F172A]">{item.week}</h3>
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
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip title="Edit Layout">
                    <Button type="text" size="small" icon={<Edit3 className="w-4 h-4 text-slate-500 hover:text-blue-600" />} />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button type="text" size="small" icon={<Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />} />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>

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
            dataSource={studentResults} 
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            size="large"
            rowClassName="hover:bg-slate-50 transition-colors"
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
              Cancel / Save Draft
            </Button>
            <Button type="primary" onClick={() => form.submit()} className="bg-blue-600 rounded-lg font-semibold px-6">
              Publish Assessment
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit} className="p-8">
          
          {/* Core Metadata */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h3 className="font-bold text-[#0F172A] mb-4 text-base flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Core Metadata</h3>
            <Form.Item name="title" label={<span className="font-semibold text-[#334155]">Assessment Title</span>} rules={[{ required: true }]}>
              <Input placeholder="e.g. Week 4 React Fundamentals" size="large" className="rounded-lg" />
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

          {/* Quiz Section (Dynamic Form.List) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#0F172A] text-base flex items-center gap-2"><LayoutList className="w-4 h-4 text-emerald-500" /> Multiple Choice Questions</h3>
            </div>
            
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <div className="space-y-6">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                      <Button 
                        type="text" 
                        danger 
                        icon={<Trash2 className="w-4 h-4" />} 
                        onClick={() => remove(name)}
                        className="absolute top-2 right-2"
                      />
                      <Form.Item
                        {...restField}
                        name={[name, 'question']}
                        label={<span className="font-semibold text-[#334155] text-sm">Question {index + 1}</span>}
                        rules={[{ required: true, message: 'Missing question text' }]}
                        className="mb-3 pr-8"
                      >
                        <Input placeholder="Enter question..." />
                      </Form.Item>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Form.Item {...restField} name={[name, 'optionA']} className="mb-0">
                          <Input addonBefore="A" placeholder="Option A" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'optionB']} className="mb-0">
                          <Input addonBefore="B" placeholder="Option B" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'optionC']} className="mb-0">
                          <Input addonBefore="C" placeholder="Option C" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'optionD']} className="mb-0">
                          <Input addonBefore="D" placeholder="Option D" />
                        </Form.Item>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'correct']}
                        label={<span className="font-semibold text-emerald-700 text-xs">Correct Answer</span>}
                        className="mb-0 w-1/3"
                      >
                        <Select placeholder="Select option">
                          <Option value="A">Option A</Option>
                          <Option value="B">Option B</Option>
                          <Option value="C">Option C</Option>
                          <Option value="D">Option D</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusCircle className="w-4 h-4" />} className="bg-slate-50 border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600 h-10">
                    Add Question
                  </Button>
                </div>
              )}
            </Form.List>
          </div>

          {/* Coding Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-[#0F172A] mb-4 text-base flex items-center gap-2"><Code2 className="w-4 h-4 text-purple-500" /> Algorithmic Challenge</h3>
            <p className="text-sm text-[#475569] mb-4">Define the coding task specifications. Interns will submit a GitHub repository link for this section.</p>
            
            <Form.Item name="codingTitle" label={<span className="font-semibold text-[#334155]">Challenge Title</span>}>
              <Input placeholder="e.g. Build a RESTful API" size="large" className="rounded-lg" />
            </Form.Item>
            
            <Form.Item name="codingDesc" label={<span className="font-semibold text-[#334155]">Technical Specifications</span>}>
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <div className="bg-slate-800 px-4 py-2 flex gap-2 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <TextArea 
                  rows={6} 
                  placeholder="// Write the technical requirements, expected inputs, and edge cases here..." 
                  className="bg-slate-50 font-mono text-sm border-0 focus:ring-0 rounded-none p-4 text-[#0F172A]" 
                />
              </div>
            </Form.Item>
          </div>

        </Form>
      </Drawer>

    </div>
  );
}
