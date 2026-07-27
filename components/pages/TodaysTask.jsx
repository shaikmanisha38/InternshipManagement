"use client";
import React, { useState, useEffect } from 'react';
import { Card, Typography, Tabs, Tag, Space, Checkbox, Divider, Avatar, Button, Spin, Alert, message, Modal, Row, Col } from 'antd';
import { 
  ExclamationCircleOutlined, 
  ClockCircleOutlined, 
  FilePdfOutlined, 
  PlaySquareOutlined,
  GithubOutlined,
  LinkOutlined,
  UploadOutlined,
  RobotOutlined,
  CodeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

export default function TodaysTask() {
  const [checklist, setChecklist] = useState({
    read: false, code: false, commit: false, push: false
  });
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAiModalVisible, setIsAiModalVisible] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchTaskData();
  }, [searchParams]);

  const fetchTaskData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // 1. Fetch current task
      const dayParam = searchParams.get('day');
      const weekParam = searchParams.get('week');
      let url = '/api/v1/tasks/today';
      if (dayParam && weekParam) {
        url += `?day=${dayParam}&week=${weekParam}`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch today\'s task.');
      }

      const tasksArray = await res.json();
      if (!tasksArray || tasksArray.length === 0) {
        throw new Error('No task available for today.');
      }
      const data = tasksArray[0];
      setTaskData(data);

      // 2. Fetch latest submission for this task
      if (data && data.id) {
        fetchLatestSubmission(data.id, token);
      }

    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestSubmission = async (taskId, token) => {
    try {
      const subRes = await fetch(`/api/v1/submissions/task/${taskId}/latest`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmission(subData);
        if (subData) {
          // If already submitted, update checklist automatically
          setChecklist({ read: true, code: true, commit: true, push: true });
        }
      }
    } catch (err) {
      console.log('No previous submission found or error fetching it');
    }
  };

  const handleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };



  const handleOpenVSCode = () => {
    // Open VS Code generically since task specific repository URL is not present
    window.location.href = 'vscode://';
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[600px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="p-8">
        <Alert title="No Task Available" description="There is no task assigned for today." type="info" showIcon />
      </div>
    );
  }

  const contentTabs = [
    {
      key: '1',
      label: 'Problem Statement',
      children: (
        <div className="prose prose-slate max-w-none">
          <Paragraph className="text-slate-700 text-base leading-relaxed">
            Based on today's learning topics, your task is to practice and implement what you've learned regarding: <strong>{taskData.title.replace('Task: ', '')}</strong>.
          </Paragraph>
          <Paragraph className="text-slate-700 text-base leading-relaxed">
            {taskData.description}
          </Paragraph>
          <Title level={4} className="!text-slate-900 !mt-6 !mb-3">Requirements</Title>
          <ul className="space-y-2 text-slate-700">
            <li>Create a new repository or use your existing internship repository.</li>
            <li>Write the code implementing today's concepts in your local VS Code.</li>
            <li>Commit your changes and push them to GitHub today.</li>
            <li>Go to the Daily Submission page and verify your GitHub link to submit.</li>
          </ul>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Starter Code',
      children: (
        <div className="bg-slate-900 rounded-xl p-4 overflow-hidden">
          <pre className="text-slate-300 font-mono text-sm m-0">
            <code>
{`// Starter template
function solveTask() {
  // Your code here
}

module.exports = solveTask;`}
            </code>
          </pre>
        </div>
      ),
    },
  ];

  const hasSubmission = !!submission;
  const isApproved = submission?.status === 'APPROVED';
  const hasFeedback = !!submission?.aiEvaluation;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
      <Row gutter={[32, 32]}>
        {/* LEFT COLUMN */}
        <Col xs={24} lg={16} className="space-y-6">
          {/* Header Card */}
          <Card 
            className="rounded-2xl border-0 shadow-md bg-gradient-to-br from-slate-900 to-blue-900 overflow-hidden relative"
            styles={{ body: { padding: '40px' } }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <Text className="text-blue-300 uppercase text-xs font-bold tracking-wider block mb-2">
                  Today's Task • Day {taskData.currentDay}
                </Text>
                <Title level={2} className="!text-white !mb-4 !mt-0">{taskData.title}</Title>
                <Paragraph className="text-white/90 text-base leading-relaxed max-w-3xl font-medium m-0">
                  {taskData.description}
                </Paragraph>
              </div>

              <Space size={[12, 12]} wrap className="mt-4 pt-4 border-t border-white/10">
                <Tag className="px-3 py-1.5 text-sm rounded-md border-amber-500/30 bg-amber-500/20 text-amber-300 font-bold m-0 flex items-center gap-1.5">
                  <ExclamationCircleOutlined /> Difficulty: {taskData.difficulty}
                </Tag>
                <Tag className="px-3 py-1.5 text-sm rounded-md border-blue-400/30 bg-blue-500/20 text-blue-200 flex items-center gap-1.5 font-bold m-0">
                  <ClockCircleOutlined /> {taskData.estimatedTime || 'N/A'} Est.
                </Tag>
              </Space>
            </div>
          </Card>

          {/* Tabs Section */}
          <Card className="rounded-2xl border-slate-200 shadow-sm bg-white"  styles={{ body: { padding: '16px 32px 32px 32px' } }}>
            <Tabs defaultActiveKey="1" items={contentTabs} size="large" />
          </Card>

          {/* Attachments Panel */}
          <Card className="rounded-2xl border-slate-200 shadow-sm bg-white" title={<Text className="text-slate-900 font-bold text-lg" styles={{ body: { padding: '24px' } }}>Resources & Attachments</Text>}
            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {taskData.resources?.map((res) => (
                <a key={res.id} href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <Avatar size={40} icon={<LinkOutlined />} className="bg-emerald-100 text-emerald-700" />
                  <div className="flex-1">
                    <Text className="block text-slate-900 font-bold group-hover:text-blue-700 transition-colors">{res.title}</Text>
                    <Text className="text-xs text-slate-500 font-medium">{res.type}</Text>
                  </div>
                </a>
              ))}
              {(!taskData.resources || taskData.resources.length === 0) && (
                <Text type="secondary">No resources attached to this task.</Text>
              )}
            </div>
          </Card>
        </Col>

        {/* RIGHT COLUMN (Action Center) */}
        <Col xs={24} lg={8} className="space-y-6">

          {/* Action Button Bar */}
          <Card className="rounded-2xl border-slate-200 shadow-sm bg-white"  styles={{ body: { padding: '24px' } }}>
            <div className="flex flex-col gap-3">
              {isApproved && (
                <Tag color="success" icon={<CheckCircleOutlined />} className="w-full text-center py-2 text-sm font-bold m-0 mb-3 rounded-lg">
                  Task Approved
                </Tag>
              )}
              {hasSubmission && !isApproved && (
                <Tag color="processing" icon={<UploadOutlined />} className="w-full text-center py-2 text-sm font-bold m-0 mb-3 rounded-lg">
                  Task Submitted (Pending)
                </Tag>
              )}

              <Button 
                icon={<CodeOutlined />} 
                className="w-full h-11 rounded-xl font-bold border-blue-200 text-blue-800 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 mt-2"
                onClick={handleOpenVSCode}
              >
                Open VS Code
              </Button>
            </div>
          </Card>

          {/* Task Checklist Card */}
          <Card className="rounded-2xl border-slate-200 shadow-sm bg-white sticky top-8" title={<Text className="text-slate-900 font-bold text-lg" styles={{ body: { padding: '24px' } }}>Task Workflow</Text>}
            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px', minHeight: 'auto' }}
          >
            <div className="space-y-3 mt-2">
              {[
                { key: 'read', label: 'Read Problem Statement' },
                { key: 'code', label: 'Write Code Locally' },
                { key: 'commit', label: 'Commit Changes' },
                { key: 'push', label: 'Push to Remote' }
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
                {Object.values(checklist).filter(Boolean).length} / 4
              </Text>
            </div>

            {!isApproved && !hasSubmission && (
              <Button 
                type="primary" 
                icon={<UploadOutlined />} 
                className={`w-full h-12 rounded-xl font-bold text-base shadow-md mt-6 ${
                  Object.values(checklist).filter(Boolean).length === 4 
                    ? 'bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-blue-600/20' 
                    : 'bg-slate-300 text-slate-500 border-slate-300 shadow-none'
                }`}
                onClick={() => {
                  sessionStorage.setItem('canSubmitTask', 'true');
                  router.push('/dashboard/submission');
                }}
                disabled={Object.values(checklist).filter(Boolean).length !== 4}
              >
                Proceed to Submission
              </Button>
            )}
          </Card>

        </Col>
      </Row>

      <Modal
        title={
          <div className="flex items-center gap-2 text-violet-700">
            <RobotOutlined className="text-2xl" />
            <span className="text-lg font-bold">AI Evaluation Result</span>
          </div>
        }
        visible={isAiModalVisible}
        onCancel={() => setIsAiModalVisible(false)}
        footer={[
          <Button key="close" type="primary" className="bg-violet-600 hover:bg-violet-700" onClick={() => setIsAiModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {submission?.aiEvaluation ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center bg-violet-50 p-4 rounded-xl border border-violet-200">
              <Text className="font-bold text-violet-900">Overall Score</Text>
              <Text className="font-black text-2xl text-violet-700">{submission.aiEvaluation.score}/100</Text>
            </div>
            <div>
              <Text className="font-bold text-slate-800 block mb-1">Feedback</Text>
              <Paragraph className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {submission.aiEvaluation.feedback}
              </Paragraph>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Spin />
            <Text className="block mt-4 text-slate-500">AI is still generating feedback...</Text>
          </div>
        )}
      </Modal>
    </div>
  );
}
