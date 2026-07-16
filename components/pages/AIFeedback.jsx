import React from 'react';
import { Card, Typography, Progress, Row, Col, Tag, Timeline, Space, Divider } from 'antd';
import { 
  CheckCircleFilled, 
  CloseCircleFilled, 
  BulbOutlined, 
  CodeOutlined,
  CheckOutlined,
  ThunderboltFilled,
  FileTextOutlined,
  FontSizeOutlined,
  DashboardOutlined,
  ReadOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Mock Metric Data
const metrics = [
  { label: 'Completion', percent: 100, icon: <CheckCircleFilled className="text-emerald-500" />, color: '#10b981' },
  { label: 'Code Quality', percent: 85, icon: <CodeOutlined className="text-blue-500" />, color: '#3b82f6' },
  { label: 'Readability', percent: 90, icon: <ReadOutlined className="text-indigo-500" />, color: '#6366f1' },
  { label: 'Documentation', percent: 70, icon: <FileTextOutlined className="text-amber-500" />, color: '#f59e0b' },
  { label: 'Naming', percent: 65, icon: <FontSizeOutlined className="text-rose-500" />, color: '#f43f5e' },
  { label: 'Performance', percent: 95, icon: <DashboardOutlined className="text-violet-500" />, color: '#8b5cf6' }
];

export default function AIFeedback() {
  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-6">
        <Title level={2} className="!text-slate-900 !mb-2">AI Feedback & Code Review</Title>
        <Text className="text-slate-700 font-medium text-base">Detailed clinical analysis and scoring of your most recent submission.</Text>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ZONE 1: REVIEW SUMMARY HERO */}
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white overflow-hidden relative"  styles={{ body: { padding: 0 } }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-bl-[100px] opacity-5 pointer-events-none"></div>
          <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-2">
                <ThunderboltFilled className="text-blue-600" />
                <Text className="text-blue-800 font-bold text-xs uppercase tracking-wider">Evaluation Complete</Text>
              </div>
              <Title level={1} className="!text-slate-900 !m-0 !text-3xl md:!text-4xl">Authentication API Setup</Title>
              <Paragraph className="text-slate-600 font-medium text-lg max-w-2xl">
                <Text className="font-bold text-slate-800">Good Work!</Text> Your implementation successfully handles the core authentication flows. The routing logic is solid, though there are a few architectural refinements needed.
              </Paragraph>
            </div>
            <div className="flex flex-col items-center justify-center min-w-[160px] bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
              <Progress 
                type="circle" 
                percent={84} 
                strokeColor={{ '0%': '#3b82f6', '100%': '#8b5cf6' }} 
                strokeWidth={10}
                size={120}
                format={(percent) => (
                  <div className="flex flex-col items-center">
                    <span className="text-slate-900 font-black text-3xl">{percent}%</span>
                  </div>
                )}
              />
              <Text className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-4">Overall Score</Text>
            </div>
          </div>
        </Card>

        {/* ZONE 2: COGNITIVE SCORE BREAKDOWN */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="rounded-xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white hover:border-blue-300 transition-colors"  styles={{ body: { padding: '20px 16px' } }}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg border border-slate-100">
                  {metric.icon}
                </div>
                <div className="w-full">
                  <Text className="text-slate-800 font-bold text-lg leading-none block mb-1">{metric.percent}%</Text>
                  <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-wider block mb-2 h-6">{metric.label}</Text>
                  <Progress percent={metric.percent} showInfo={false} size="small" strokeColor={metric.color} trailColor="#f1f5f9" className="m-0" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ZONE 3: DIAGNOSTIC & CLINICAL FEEDBACK PANELS */}
        <Row gutter={[24, 24]}>
          
          {/* Strengths & Weaknesses Split Card */}
          <Col xs={24} lg={12}>
            <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full"  styles={{ body: { padding: 0 } }}>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-100">
                  <Title level={4} className="!text-slate-900 !m-0 flex items-center gap-2"><BulbOutlined className="text-blue-500" /> Diagnostic Review</Title>
                </div>
                <div className="flex flex-col sm:flex-row flex-1">
                  
                  {/* Strengths (Left) */}
                  <div className="flex-1 bg-emerald-50/50 p-6 sm:border-r border-b sm:border-b-0 border-slate-100">
                    <Text className="text-emerald-800 font-bold uppercase text-xs tracking-wider mb-4 block flex items-center gap-2">
                      <CheckCircleFilled className="text-emerald-500 text-base" /> Core Strengths
                    </Text>
                    <ul className="space-y-3 m-0 p-0 list-none">
                      <li className="flex items-start gap-2 text-slate-700 font-medium text-sm">
                        <CheckOutlined className="text-emerald-500 mt-1 flex-shrink-0" /> Payload validation logic is thorough and secure.
                      </li>
                      <li className="flex items-start gap-2 text-slate-700 font-medium text-sm">
                        <CheckOutlined className="text-emerald-500 mt-1 flex-shrink-0" /> Excellent use of asynchronous middleware for database queries.
                      </li>
                      <li className="flex items-start gap-2 text-slate-700 font-medium text-sm">
                        <CheckOutlined className="text-emerald-500 mt-1 flex-shrink-0" /> Proper RESTful status codes implemented (200, 201, 401).
                      </li>
                    </ul>
                  </div>

                  {/* Weaknesses (Right) */}
                  <div className="flex-1 bg-rose-50/30 p-6">
                    <Text className="text-rose-800 font-bold uppercase text-xs tracking-wider mb-4 block flex items-center gap-2">
                      <CloseCircleFilled className="text-rose-500 text-base" /> Areas to Improve
                    </Text>
                    <ul className="space-y-3 m-0 p-0 list-none">
                      <li className="flex items-start gap-2 text-slate-700 font-medium text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></div> 
                        Naming conventions need improvement. `handleReq` is not descriptive enough.
                      </li>
                      <li className="flex items-start gap-2 text-slate-700 font-medium text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></div> 
                        Missing JSDoc or inline comments explaining complex token signing logic.
                      </li>
                      <li className="flex items-start gap-2 text-slate-700 font-medium text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></div> 
                        Duplicate error handling logic found across multiple controller methods.
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </Card>
          </Col>

          {/* Suggestions & Interactive Code Example */}
          <Col xs={24} lg={12}>
            <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full flex flex-col"  styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' } }}>
              <Title level={4} className="!text-slate-900 !mt-0 !mb-6 flex items-center gap-2">Actionable Next Steps</Title>
              
              <div className="mb-6">
                <Timeline
                  className="[&_.ant-timeline-item-tail]:border-slate-200"
                  items={[
                    {
                      color: '#3b82f6',
                      content: <Text className="text-slate-700 font-medium"><Text className="font-bold text-slate-900">Step 1:</Text> Add comments where business logic is complex, specifically inside the `auth.middleware.js` file.</Text>,
                    },
                    {
                      color: '#3b82f6',
                      content: <Text className="text-slate-700 font-medium"><Text className="font-bold text-slate-900">Step 2:</Text> Avoid duplicate code segments by modularizing your error response payloads into a dedicated helper utility.</Text>,
                    },
                    {
                      color: '#8b5cf6',
                      content: <Text className="text-slate-700 font-medium"><Text className="font-bold text-slate-900">Step 3:</Text> Refactor variable names like `uDat` to `userData` for enhanced readability.</Text>,
                    }
                  ]}
                />
              </div>

              {/* IDE Code Snippet Panel */}
              <div className="mt-auto bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
                <div className="bg-slate-800/80 px-4 py-2 flex items-center gap-2 border-b border-slate-700/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  </div>
                  <Text className="text-slate-400 text-xs font-mono ml-2">utils/errorHandler.js - Proposed Refactor</Text>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono leading-relaxed m-0">
                    <code className="text-slate-300">
<span className="text-purple-400">export const</span> <span className="text-blue-400">sendError</span> = (res, status, message) =&gt; {'{'}
<br />
{'  '}<span className="text-emerald-400">return</span> res.<span className="text-blue-300">status</span>(status).<span className="text-blue-300">json</span>({'{'}
<br />
{'    '}success: <span className="text-orange-400">false</span>,
<br />
{'    '}error: message
<br />
{'  }'});
<br />
{'}'};
<br />
<br />
<span className="text-slate-500 italic">// Usage:</span>
<br />
<span className="text-emerald-400">if</span> (!user) <span className="text-emerald-400">return</span> <span className="text-blue-400">sendError</span>(res, <span className="text-orange-400">404</span>, <span className="text-green-300">"User not found"</span>);
                    </code>
                  </pre>
                </div>
              </div>

            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
