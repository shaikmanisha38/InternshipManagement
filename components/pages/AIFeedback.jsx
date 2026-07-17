"use client";
import React, { useState, useEffect } from 'react';
import { Card, Typography, Progress, Row, Col, Tag, Timeline, Skeleton, message, Empty } from 'antd';
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
import Cookies from 'js-cookie';

const { Title, Text, Paragraph } = Typography;

export default function AIFeedback() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/student/ai_feedback', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.hasEvaluation) {
          setData(json);
        } else {
          setData(null);
        }
      } else {
        message.error('Failed to load AI evaluation data');
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to load AI evaluation data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
        <Skeleton active paragraph={{ rows: 2 }} />
        <Card className="rounded-2xl border-slate-200 mt-6"><Skeleton active avatar={{ size: 120, shape: 'circle' }} paragraph={{ rows: 3 }} /></Card>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
          {[...Array(6)].map((_, i) => <Card key={i}><Skeleton active paragraph={{ rows: 1 }} /></Card>)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full flex items-center justify-center">
        <Empty description={<span className="text-slate-500 font-medium">No AI Evaluation found for your recent submissions.</span>} />
      </div>
    );
  }

  const { score = 0, taskTitle, feedback, metrics = {}, strengths = [], weaknesses = [], suggestions = [] } = data;

  // Safe fallback for metrics if DB JSON is incomplete
  const metricValues = {
    completion: metrics?.completion || 0,
    codeQuality: metrics?.codeQuality || 0,
    readability: metrics?.readability || 0,
    documentation: metrics?.documentation || 0,
    naming: metrics?.naming || 0,
    performance: metrics?.performance || 0,
  };

  const metricCards = [
    { label: 'Completion', percent: metricValues.completion, icon: <CheckCircleFilled className="text-emerald-500" />, color: '#10b981' },
    { label: 'Code Quality', percent: metricValues.codeQuality, icon: <CodeOutlined className="text-blue-500" />, color: '#3b82f6' },
    { label: 'Readability', percent: metricValues.readability, icon: <ReadOutlined className="text-indigo-500" />, color: '#6366f1' },
    { label: 'Documentation', percent: metricValues.documentation, icon: <FileTextOutlined className="text-amber-500" />, color: '#f59e0b' },
    { label: 'Naming', percent: metricValues.naming, icon: <FontSizeOutlined className="text-rose-500" />, color: '#f43f5e' },
    { label: 'Performance', percent: metricValues.performance, icon: <DashboardOutlined className="text-violet-500" />, color: '#8b5cf6' }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-6">
        <Title level={2} className="!text-slate-900 !mb-2">AI Feedback & Code Review</Title>
        <Text className="text-slate-700 font-medium text-base">Detailed clinical analysis and scoring of your most recent submission.</Text>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ZONE 1: REVIEW SUMMARY HERO */}
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white overflow-hidden relative" styles={{ body: { padding: 0 } }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-bl-[100px] opacity-5 pointer-events-none"></div>
          <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-2">
                <ThunderboltFilled className="text-blue-600" />
                <Text className="text-blue-800 font-bold text-xs uppercase tracking-wider">Evaluation Complete</Text>
              </div>
              <Title level={1} className="!text-slate-900 !m-0 !text-3xl md:!text-4xl">{taskTitle}</Title>
              <Paragraph className="text-slate-600 font-medium text-lg max-w-2xl">
                {feedback || "Your implementation has been successfully analyzed by our AI evaluation engine."}
              </Paragraph>
            </div>
            <div className="flex flex-col items-center justify-center min-w-[160px] bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
              <Progress 
                type="circle" 
                percent={Math.round(score)} 
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
          {metricCards.map((metric, idx) => (
            <Card key={idx} className="rounded-xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white hover:border-blue-300 transition-colors" styles={{ body: { padding: '20px 16px' } }}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg border border-slate-100">
                  {metric.icon}
                </div>
                <div className="w-full">
                  <Text className="text-slate-800 font-bold text-lg leading-none block mb-1">{Math.round(metric.percent)}%</Text>
                  <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-wider block mb-2 h-6">{metric.label}</Text>
                  <Progress percent={Math.round(metric.percent)} showInfo={false} size="small" strokeColor={metric.color} trailColor="#f1f5f9" className="m-0" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ZONE 3: DIAGNOSTIC & CLINICAL FEEDBACK PANELS */}
        <Row gutter={[24, 24]}>
          
          {/* Strengths & Weaknesses Split Card */}
          <Col xs={24} lg={12}>
            <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full" styles={{ body: { padding: 0 } }}>
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
                      {Array.isArray(strengths) && strengths.length > 0 ? strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700 font-medium text-sm">
                          <CheckOutlined className="text-emerald-500 mt-1 flex-shrink-0" /> {strength}
                        </li>
                      )) : (
                        <Text className="text-slate-500 text-sm">No specific strengths recorded.</Text>
                      )}
                    </ul>
                  </div>

                  {/* Weaknesses (Right) */}
                  <div className="flex-1 bg-rose-50/30 p-6">
                    <Text className="text-rose-800 font-bold uppercase text-xs tracking-wider mb-4 block flex items-center gap-2">
                      <CloseCircleFilled className="text-rose-500 text-base" /> Areas to Improve
                    </Text>
                    <ul className="space-y-3 m-0 p-0 list-none">
                      {Array.isArray(weaknesses) && weaknesses.length > 0 ? weaknesses.map((weakness, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700 font-medium text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></div> 
                          {weakness}
                        </li>
                      )) : (
                        <Text className="text-slate-500 text-sm">No specific weaknesses recorded.</Text>
                      )}
                    </ul>
                  </div>

                </div>
              </div>
            </Card>
          </Col>

          {/* Suggestions & Interactive Code Example */}
          <Col xs={24} lg={12}>
            <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full flex flex-col" styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' } }}>
              <Title level={4} className="!text-slate-900 !mt-0 !mb-6 flex items-center gap-2">Actionable Next Steps</Title>
              
              <div className="mb-6 flex-1">
                {Array.isArray(suggestions) && suggestions.length > 0 ? (
                  <Timeline
                    className="[&_.ant-timeline-item-tail]:border-slate-200"
                    items={suggestions.map((suggestion, idx) => ({
                      color: idx === suggestions.length - 1 ? '#8b5cf6' : '#3b82f6',
                      content: (
                        <Text className="text-slate-700 font-medium">
                          <Text className="font-bold text-slate-900">Step {idx + 1}:</Text> {suggestion}
                        </Text>
                      )
                    }))}
                  />
                ) : (
                  <Text className="text-slate-500">No suggestions provided.</Text>
                )}
              </div>

            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
