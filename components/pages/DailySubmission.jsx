import React from 'react';
import { Card, Form, Input, Select, Button, Typography, Row, Col, Tag, Timeline, Divider, Space } from 'antd';
import {
  GithubOutlined,
  BranchesOutlined,
  PushpinOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  UploadOutlined,
  WarningFilled,
  LinkOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function DailySubmission() {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log('Form submitted:', values);
  };

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
                  <ClockCircleOutlined /> Week 2 • Day 8
                </Tag>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 pt-2">
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Repository</Text>
                  <Text className="text-slate-900 font-bold flex items-center gap-2"><GithubOutlined className="text-slate-400" /> frontend-ecommerce</Text>
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Branch</Text>
                  <Text className="text-slate-900 font-bold flex items-center gap-2"><BranchesOutlined className="text-slate-400" /> feature/auth</Text>
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Commit Hash</Text>
                  <Text className="text-indigo-700 font-mono bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-sm font-bold">a1b2c3d</Text>
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Time Logged</Text>
                  <Text className="text-slate-900 font-bold">3h 15m</Text>
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Validation Status</Text>
                  <Tag className="m-0 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded px-3">Ready</Tag>
                </div>
                <div>
                  <Text className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Current Score</Text>
                  <Text className="text-slate-900 font-bold text-lg leading-none">+150 XP</Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Interactive Submission Form Card */}
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white" title={<Title level={4} className="!text-slate-900 !m-0" styles={{ body: { padding: '32px' } }}>Submit Day 8 Progress</Title>}
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
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<UploadOutlined />}
                  className="h-12 px-8 rounded-lg font-bold bg-indigo-600 hover:bg-indigo-700 border-indigo-600 shadow-sm text-white"
                >
                  Submit
                </Button>
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
              <Timeline
                className="[&_.ant-timeline-item-tail]:border-slate-200"
                items={[
                  {
                    dot: <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-emerald-500 flex items-center justify-center z-10 relative"><Text className="text-emerald-700 font-bold text-xs">D3</Text></div>,
                    content: (
                      <div className="pl-4 pb-8 -mt-1.5">
                        <div className="flex justify-between items-start mb-2">
                          <Text className="font-bold text-slate-900 text-base">Day 3 Submission</Text>
                          <Text className="text-slate-400 text-xs font-semibold">Jul 03, 2026</Text>
                        </div>
                        <Tag className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded m-0 flex items-center gap-1.5 w-max mb-3">
                          <CheckCircleFilled className="text-emerald-500" /> Accepted
                        </Tag>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <Text className="text-slate-600 font-medium text-sm"><Text className="font-bold text-slate-900">Feedback:</Text> Excellent architecture. API routes are structured perfectly according to REST standards.</Text>
                        </div>
                      </div>
                    ),
                  },
                  {
                    dot: <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-red-500 flex items-center justify-center z-10 relative"><Text className="text-red-700 font-bold text-xs">D2</Text></div>,
                    content: (
                      <div className="pl-4 pb-8 -mt-1.5">
                        <div className="flex justify-between items-start mb-2">
                          <Text className="font-bold text-slate-900 text-base">Day 2 Submission</Text>
                          <Text className="text-slate-400 text-xs font-semibold">Jul 02, 2026</Text>
                        </div>
                        <Space size={[8, 8]} wrap className="mb-3">
                          <Tag className="px-3 py-1 bg-red-50 border border-red-200 text-red-800 font-bold rounded m-0 flex items-center gap-1.5">
                            <CloseCircleFilled className="text-red-500" /> Rejected
                          </Tag>
                          <Tag className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-bold rounded m-0 flex items-center gap-1.5">
                            <WarningFilled className="text-amber-500" /> Needs Retry
                          </Tag>
                        </Space>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <Text className="text-slate-600 font-medium text-sm"><Text className="font-bold text-slate-900">Feedback:</Text> Middleware implementation fails on edge cases. Missing error handlers for unauthenticated routes.</Text>
                        </div>
                      </div>
                    ),
                  },
                  {
                    dot: <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-emerald-500 flex items-center justify-center z-10 relative"><Text className="text-emerald-700 font-bold text-xs">D1</Text></div>,
                    content: (
                      <div className="pl-4 pb-2 -mt-1.5">
                        <div className="flex justify-between items-start mb-2">
                          <Text className="font-bold text-slate-900 text-base">Day 1 Submission</Text>
                          <Text className="text-slate-400 text-xs font-semibold">Jul 01, 2026</Text>
                        </div>
                        <Tag className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded m-0 flex items-center gap-1.5 w-max">
                          <CheckCircleFilled className="text-emerald-500" /> Accepted
                        </Tag>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
