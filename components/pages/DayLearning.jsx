"use client";
import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Alert, Button, Divider, List, Tag } from 'antd';
import { 
  BookOutlined, 
  CheckCircleOutlined,
  ArrowRightOutlined,
  PlayCircleOutlined,
  YoutubeOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

export default function DayLearning() {
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState(null);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const dayParam = searchParams.get('day');
  const weekParam = searchParams.get('week');

  useEffect(() => {
    if (!dayParam || !weekParam) {
      setError('Missing day or week parameters.');
      setLoading(false);
      return;
    }
    fetchDayData();
  }, [dayParam, weekParam]);

  const fetchDayData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/v1/roadmaps/day?day=${dayParam}&week=${weekParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch day learning data.');
      }

      const data = await res.json();
      setDayData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToTask = () => {
    router.push(`/dashboard/task?day=${dayParam}&week=${weekParam}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[600px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert title="Error" description={error} type="error" showIcon />
        <Button className="mt-4" onClick={() => router.push('/dashboard/roadmap')}>Return to Roadmap</Button>
      </div>
    );
  }

  if (!dayData) return null;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Text className="text-blue-600 uppercase text-xs font-bold tracking-wider block mb-1">
            Learning Module
          </Text>
          <Title level={2} className="!m-0 !text-slate-800">
            Week {weekParam} • Day {dayParam}
          </Title>
        </div>
        <Button 
          type="primary" 
          size="large" 
          icon={<ArrowRightOutlined />} 
          className="rounded-xl shadow-md font-semibold"
          onClick={handleProceedToTask}
        >
          Proceed to Task
        </Button>
      </div>

      <Card 
        className="rounded-2xl border-0 shadow-sm overflow-hidden" 
        styles={{ body: { padding: '40px' } }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-2xl">
              <BookOutlined className="text-4xl text-blue-600" />
            </div>
            <div>
              <Title level={3} className="!m-0 !text-slate-900">{dayData.title}</Title>
              <Text className="text-slate-500 font-medium text-base">
                Master the concepts below before attempting the daily task.
              </Text>
            </div>
          </div>

          <Divider className="my-8 border-slate-100" />

          <Title level={4} className="!mb-6 !text-slate-800 flex items-center gap-2">
            <CheckCircleOutlined className="text-emerald-500" /> Topics Covered
          </Title>
          
          <div className="grid grid-cols-1 gap-4 mb-10">
            {dayData.topicsCovered && dayData.topicsCovered.length > 0 ? (
              dayData.topicsCovered.map((topic, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    {index + 1}
                  </div>
                  <Text className="text-slate-700 font-semibold text-lg flex-1">{topic}</Text>
                  
                  {/* Generic external links placeholder for the topics */}
                  <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Button type="text" icon={<YoutubeOutlined className="text-red-500" />} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' programming tutorial')}`} target="_blank" />
                    <Button type="text" icon={<LinkOutlined className="text-blue-500" />} href={`https://www.google.com/search?q=${encodeURIComponent(topic + ' programming tutorial')}`} target="_blank" />
                  </div>
                </div>
              ))
            ) : (
              <Alert type="info" message="No specific topics defined for this day." />
            )}
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
            <Title level={3} className="!text-white !m-0 !mb-2">Ready to apply what you've learned?</Title>
            <Paragraph className="text-blue-200 mb-8 max-w-2xl mx-auto">
              Once you're comfortable with these topics, proceed to the daily task to put your new knowledge into practice and earn your daily streak!
            </Paragraph>
            <Button 
              type="primary" 
              size="large" 
              className="h-14 px-10 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/30"
              icon={<PlayCircleOutlined />}
              onClick={handleProceedToTask}
            >
              Start Daily Task
            </Button>
          </div>

        </div>
      </Card>
    </div>
  );
}
