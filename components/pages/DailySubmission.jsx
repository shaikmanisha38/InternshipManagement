"use client";

import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Typography, Row, Col, Tag, Timeline, Divider, Space, Spin, Result, message } from 'antd';
import {
  GithubOutlined,
  BranchesOutlined,
  PushpinOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  UploadOutlined,
  WarningFilled,
  LinkOutlined,
  RobotOutlined
} from '@ant-design/icons';
import Cookies from 'js-cookie';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function DailySubmission() {
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assigned, setAssigned] = useState(true);
  const [workspace, setWorkspace] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const token = Cookies.get('token') || localStorage.getItem('token');
        const res = await fetch('/api/v1/student/workspace', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch workspace data');
        
        const data = await res.json();
        
        if (!data.assigned) {
          setAssigned(false);
        } else {
          setAssigned(true);
          setWorkspace(data.workspace);
          setHistory(data.history || []);
          
          form.setFieldsValue({
            repoUrl: data.workspace.repoName !== 'Not Connected' ? data.workspace.repoName : ''
          });
        }
      } catch (err) {
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [form]);

  const handleFinish = async (values) => {
    if (!workspace?.taskId) {
      message.error("Cannot submit: No active task found for today's session.");
      return;
    }

    setSubmitting(true);
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      const res = await fetch('/api/v1/submissions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          taskId: workspace.taskId,
          repositoryUrl: values.repoUrl,
          branch: values.branch,
          commitHash: values.commitHash,
          notes: values.notes
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      const newSubmission = await res.json();
      message.success('Progress submitted successfully!');
      
      // Update history in real-time
      setHistory(prev => [newSubmission, ...prev]);
      
      // Reset specific fields
      form.resetFields(['commitHash', 'notes']);
      
    } catch (err) {
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderTimelineItems = () => {
    return history.map((sub, index) => {
      const isAccepted = sub.status === 'VERIFIED';
      const isPending = sub.status === 'PENDING';
      const isFailed = sub.status === 'FAILED';
      
      // Calculate Day format for icon (D1, D2 etc). Just arbitrary based on history length if we don't have the day from task
      // In real scenario we get day from sub.task.roadmapDay.dayNumber
      const dayNum = sub.task?.roadmapDay?.dayNumber || (history.length - index);
      const submittedDate = new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

      return {
        key: sub.id,
        dot: (
          <div className={`w-8 h-8 rounded-full bg-slate-50 border-2 ${isAccepted ? 'border-emerald-500' : isFailed ? 'border-red-500' : 'border-blue-500'} flex items-center justify-center z-10 relative`}>
            <Text className={`${isAccepted ? 'text-emerald-700' : isFailed ? 'text-red-700' : 'text-blue-700'} font-bold text-xs`}>D{dayNum}</Text>
          </div>
        ),
        content: (
          <div className="pl-4 pb-8 -mt-1.5">
            <div className="flex justify-between items-start mb-2">
              <Text className="font-bold text-slate-900 text-base">Day {dayNum} Submission</Text>
              <Text className="text-slate-400 text-xs font-semibold">{submittedDate}</Text>
            </div>
            
            <Space size={[8, 8]} wrap className="mb-3">
              {isAccepted && (
                <Tag className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded m-0 flex items-center gap-1.5 w-max">
                  <CheckCircleFilled className="text-emerald-500" /> Accepted
                </Tag>
              )}
              {isFailed && (
                <>
                  <Tag className="px-3 py-1 bg-red-50 border border-red-200 text-red-800 font-bold rounded m-0 flex items-center gap-1.5">
                    <CloseCircleFilled className="text-red-500" /> Rejected
                  </Tag>
                  <Tag className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-bold rounded m-0 flex items-center gap-1.5">
                    <WarningFilled className="text-amber-500" /> Needs Retry
                  </Tag>
                </>
              )}
              {isPending && (
                <Tag className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 font-bold rounded m-0 flex items-center gap-1.5 w-max">
                  <ClockCircleOutlined className="text-blue-500" /> Pending Review
                </Tag>
              )}
            </Space>
            
            {(sub.aiEvaluation?.feedback || sub.notes) && (
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex flex-col gap-2">
                {sub.aiEvaluation?.feedback && (
                  <Text className="text-slate-600 font-medium text-sm">
                    <Text className="font-bold text-slate-900">AI Feedback: </Text>
                    {sub.aiEvaluation.feedback}
                  </Text>
                )}
                {sub.notes && (
                  <Text className="text-slate-600 font-medium text-sm">
                    <Text className="font-bold text-slate-900">Your Notes: </Text>
                    {sub.notes}
                  </Text>
                )}
              </div>
            )}
          </div>
        ),
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[600px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!assigned) {
    return (
      <div className="p-4 md:p-8 bg-slate-50 min-h-full flex items-center justify-center">
        <Result
          status="info"
          title={<span className="text-slate-900 font-bold tracking-tight">No Active Internship</span>}
          subTitle={<span className="text-slate-600 font-medium text-base">You are not currently assigned to an active internship. Your daily submission workspace and log will appear here once your internship begins.</span>}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div className="mb-6">
        <Title level={2} className="!text-slate-900 !mb-2 tracking-tight">Daily Submission</Title>
        <Text className="text-slate-600 font-medium text-base">Log your daily development progress and monitor validation history.</Text>
      </div>

      <Row gutter={[32, 32]}>

        {/* LEFT COLUMN: ACTIVE WORK SUBMISSION */}
        <Col xs={24} lg={14} xl={15} className="space-y-6">

          {/* Active Submission Read-Only Overview */}
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white"  styles={{ body: { padding: '24px 32px' } }}>
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <Text className="text-indigo-600 uppercase text-xs font-bold tracking-widest block">Active Workspace Session</Text>
                <Tag className="px-3 py-1.5 m-0 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded flex items-center gap-1.5">
                  <ClockCircleOutlined /> Week {workspace?.currentWeek || 1} • Day {workspace?.currentDay || 1}
                </Tag>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 pt-2">
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Repository</Text>
                  <Text className="text-slate-900 font-bold flex items-center gap-2">
                    <GithubOutlined className="text-slate-400" /> 
                    {workspace?.repoName || 'Not Connected'}
                  </Text>
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Branch</Text>
                  <Text className="text-slate-900 font-bold flex items-center gap-2">
                    <BranchesOutlined className="text-slate-400" /> 
                    {history.length > 0 && history[0].branch ? history[0].branch : 'feature/auth'}
                  </Text>
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Commit Hash</Text>
                  <Text className="text-indigo-700 font-mono bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-sm font-bold">
                    {history.length > 0 && history[0].commitHash ? history[0].commitHash.substring(0, 7) : 'a1b2c3d'}
                  </Text>
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Time Logged</Text>
                  <Text className="text-slate-900 font-bold">--</Text>
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Validation Status</Text>
                  {history.length > 0 && history[0].status === 'VERIFIED' ? (
                     <Tag className="m-0 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded px-3">Verified</Tag>
                  ) : history.length > 0 && history[0].status === 'PENDING' ? (
                     <Tag className="m-0 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded px-3">Pending</Tag>
                  ) : (
                     <Tag className="m-0 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded px-3">Ready</Tag>
                  )}
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Current Score</Text>
                  <Text className="text-slate-900 font-bold text-lg leading-none">
                    {history.length > 0 && history[0].aiEvaluation?.score ? `+${history[0].aiEvaluation.score} XP` : '+0 XP'}
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Interactive Submission Form Card */}
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white" title={<Title level={4} className="!text-slate-900 !m-0" styles={{ body: { padding: '32px' } }}>Submit Day {workspace?.currentDay || 1} Progress</Title>}
            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '24px 32px 16px 32px', minHeight: 'auto' }}
          >
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={handleFinish}
              className="mt-2"
            >
              <Form.Item
                label={<Text className="font-bold text-slate-700">Repository URL</Text>}
                name="repoUrl"
                rules={[{ required: true, message: 'Please enter repository URL' }]}
              >
                <Input
                  prefix={<LinkOutlined className="text-slate-400 mr-1" />}
                  placeholder="https://github.com/username/frontend-ecommerce"
                  className="rounded-lg h-12 border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-medium hover:border-indigo-400 focus:border-indigo-500"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="font-bold text-slate-700">Target Branch</Text>}
                    name="branch"
                    rules={[{ required: true, message: 'Please select branch' }]}
                    initialValue="main"
                  >
                    <Select
                      placeholder="Select branch"
                      className="h-12 w-full [&>.ant-select-selector]:rounded-lg [&>.ant-select-selector]:border-slate-300 [&>.ant-select-selector]:bg-slate-50 font-medium"
                      dropdownStyle={{ borderRadius: '8px' }}
                    >
                      <Option value="main">main</Option>
                      <Option value="feature/auth">feature/auth</Option>
                      <Option value="develop">develop</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="font-bold text-slate-700">Commit ID / Hash</Text>}
                    name="commitHash"
                    rules={[{ required: true, message: 'Please enter commit hash' }]}
                  >
                    <Input
                      prefix={<PushpinOutlined className="text-slate-400 mr-1" />}
                      placeholder="e.g. 7f8a9b2"
                      className="rounded-lg h-12 border-slate-300 bg-slate-50 focus:bg-white font-mono text-slate-900 hover:border-indigo-400 focus:border-indigo-500"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={<Text className="font-bold text-slate-700">Developer Notes & Context</Text>}
                name="notes"
              >
                <TextArea
                  rows={4}
                  placeholder="Describe your implementation logic, architectural decisions, or highlight specific code blocks for the AI reviewer..."
                  className="rounded-lg border-slate-300 bg-slate-50 focus:bg-white p-4 text-slate-900 font-medium hover:border-indigo-400 focus:border-indigo-500"
                />
              </Form.Item>

              <Divider className="my-6 border-slate-100" />

              <Form.Item className="mb-0 text-right">
                <Space size="middle">
                  <Button
                    type="default"
                    size="large"
                    icon={<RobotOutlined />}
                    className="h-12 px-6 rounded-lg font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => message.info('Running AI static analysis on your code...')}
                  >
                    AI Pre-Flight Check
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    icon={<UploadOutlined />}
                    className="h-12 px-8 rounded-lg font-bold bg-indigo-600 hover:bg-indigo-700 border-indigo-600 shadow-sm text-white"
                  >
                    Submit
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* RIGHT COLUMN: SUBMISSION HISTORY */}
        <Col xs={24} lg={10} xl={9}>
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white h-full" title={<Title level={4} className="!text-slate-900 !m-0" styles={{ body: { padding: '24px 32px' } }}>Validation Log</Title>}
            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '24px 32px 16px 32px', minHeight: 'auto' }}
          >
            <div className="pt-4">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <Text className="text-slate-400 font-medium">No submissions yet.</Text>
                </div>
              ) : (
                <Timeline
                  className="[&_.ant-timeline-item-tail]:border-slate-200"
                  items={renderTimelineItems()}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
