"use client";
import React, { useState } from 'react';
import { Card, Typography, Tag, Button, Progress, Row, Col, Space, Alert, Divider } from 'antd';
import {
  PlayCircleOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  CodeOutlined,
  TrophyOutlined,
  LockOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function Assessment() {
  const [assessmentStatus, setAssessmentStatus] = useState('completed'); // 'pending' or 'completed'

  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <Title level={2} className="!text-slate-900 !mb-2">Weekly Assessment</Title>
          <Text className="text-slate-700 font-medium text-base">Evaluate your conceptual knowledge and practical coding skills.</Text>
        </div>
        <div className="hidden sm:block">
          <Button
            type="dashed"
            onClick={() => setAssessmentStatus(prev => prev === 'pending' ? 'completed' : 'pending')}
            className="text-slate-500 border-slate-300 font-medium"
          >
            Toggle Mock State: {assessmentStatus === 'pending' ? 'Pending' : 'Completed'}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* ZONE 1: ACTIVE ASSESSMENT CARD (The Launchpad) */}
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white relative overflow-hidden"  styles={{ body: { padding: 0 } }}>
          {/* Subtle Decorative Background */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="p-8 md:p-10 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Text className="text-blue-600 font-black text-sm uppercase tracking-widest">Active Exam</Text>
                  {assessmentStatus === 'pending' ? (
                    <Tag className="m-0 bg-amber-50 border border-amber-200 text-amber-700 font-bold px-3 py-0.5 rounded-md flex items-center gap-1.5">
                      <ClockCircleOutlined /> Pending
                    </Tag>
                  ) : (
                    <Tag className="m-0 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-3 py-0.5 rounded-md flex items-center gap-1.5">
                      <CheckCircleFilled className="text-emerald-500" /> Completed
                    </Tag>
                  )}
                </div>
                <Title level={2} className="!text-slate-900 !m-0">Week 3 Evaluation</Title>
              </div>

              {assessmentStatus === 'pending' ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-md shadow-blue-600/20 rounded-xl h-12 px-8 font-bold text-white w-full md:w-auto"
                >
                  Start Assessment
                </Button>
              ) : (
                <Button
                  type="default"
                  size="large"
                  icon={<LockOutlined />}
                  disabled
                  className="rounded-xl h-12 px-8 font-bold bg-slate-50 border-slate-200 text-slate-400 w-full md:w-auto"
                >
                  Assessment Locked
                </Button>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-4">Assessment Breakdown</Text>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                      <QuestionCircleOutlined className="text-indigo-500 text-lg" />
                    </div>
                    <div>
                      <Text className="text-slate-900 font-bold block leading-tight mb-1">Quiz Module</Text>
                      <Text className="text-slate-500 font-medium text-sm">30 Multiple Choice Questions</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0 border border-pink-100">
                      <CodeOutlined className="text-pink-500 text-lg" />
                    </div>
                    <div>
                      <Text className="text-slate-900 font-bold block leading-tight mb-1">Coding Module</Text>
                      <Text className="text-slate-500 font-medium text-sm">2 Algorithmic Problems</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0 border border-yellow-100">
                      <TrophyOutlined className="text-yellow-600 text-lg" />
                    </div>
                    <div>
                      <Text className="text-slate-900 font-bold block leading-tight mb-1">Total Marks</Text>
                      <Text className="text-slate-500 font-medium text-sm">100 Points Available</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>

        {/* ZONE 2: POST-COMPLETION PERFORMANCE DASHBOARD */}
        {assessmentStatus === 'completed' && (
          <div className="animate-fade-in-up space-y-6">
            <Title level={4} className="!text-slate-900 !m-0 !mt-2">Performance Results</Title>

            <Row gutter={[24, 24]}>
              {/* Performance Stats Grid */}
              <Col xs={24} md={10} lg={8}>
                <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full"  styles={{ body: { padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }}>
                  <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Final Score</Text>

                  <Progress
                    type="circle"
                    percent={82}
                    strokeColor={{ '0%': '#10b981', '100%': '#059669' }}
                    strokeWidth={8}
                    size={160}
                    format={(percent) => (
                      <div className="flex flex-col items-center">
                        <span className="text-slate-900 font-black text-4xl">{percent}</span>
                        <span className="text-slate-400 font-bold text-sm border-t border-slate-200 pt-1 mt-1 w-12">100</span>
                      </div>
                    )}
                  />

                  <div className="w-full mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 text-center">
                      <CheckCircleFilled className="text-emerald-500 text-lg mb-1" />
                      <Text className="text-emerald-800 font-bold block text-sm">24 Correct</Text>
                    </div>
                    <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-3 text-center">
                      <CloseCircleFilled className="text-rose-500 text-lg mb-1" />
                      <Text className="text-rose-800 font-bold block text-sm">6 Wrong</Text>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Comprehensive Feedback Block */}
              <Col xs={24} md={14} lg={16}>
                <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full"  styles={{ body: { padding: '32px' } }}>
                  <Title level={4} className="!text-slate-900 !m-0 !mb-6">Assessment Feedback</Title>

                  <Alert
                    title={<Text className="font-bold text-blue-900 text-base">Excellent Performance Overview</Text>}
                    description={<Text className="text-blue-800 font-medium">You have successfully passed the Week 3 evaluation with honors. Your conceptual understanding is solid.</Text>}
                    type="info"
                    showIcon
                    className="rounded-xl border-blue-200 bg-blue-50 mb-6 [&_.ant-alert-icon]:mt-1"
                  />

                  <div className="space-y-6">
                    <div>
                      <Text className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-2">Quiz Module Analysis</Text>
                      <Paragraph className="text-slate-700 font-medium text-sm leading-relaxed mb-0">
                        You scored exceptionally well in the React Lifecycle and Hooks questions. However, you lost minor points in the advanced State Management questions (specifically around Redux middleware). Consider reviewing action dispatching concepts.
                      </Paragraph>
                    </div>

                    <Divider className="my-0 border-slate-100" />

                    <div>
                      <Text className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-2">Coding Module Analysis</Text>
                      <Paragraph className="text-slate-700 font-medium text-sm leading-relaxed mb-0">
                        <ul className="pl-5 m-0 space-y-1">
                          <li><Text className="text-slate-900 font-bold">Algorithm 1 (Array Sorting):</Text> Perfect execution. Optimal time complexity (O(n log n)) was achieved.</li>
                          <li><Text className="text-slate-900 font-bold">Algorithm 2 (Tree Traversal):</Text> The logic was correct, but the recursion depth exceeded limits on large hidden test cases. Iterative BFS is recommended for extreme data sets.</li>
                        </ul>
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}

