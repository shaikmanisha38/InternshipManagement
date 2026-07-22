"use client";
import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Spin, Alert, message } from 'antd';
import { 
  CheckCircleFilled, 
  PlayCircleFilled, 
  LockFilled,
  CalendarOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function Roadmap() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [weeksDetails, setWeeksDetails] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // 1. Fetch current roadmap summary
        const res = await fetch('http://localhost:3000/api/v1/roadmaps/current', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch roadmap data. Make sure you are assigned to an internship.');
        }

        const data = await res.json();
        setRoadmapData(data);

        // 2. Fetch days for each week concurrently
        if (data.weeks && data.weeks.length > 0) {
          const weeksPromises = data.weeks.map(week => 
            fetch(`http://localhost:3000/api/v1/roadmaps/week/${data.id}?weekNumber=${week.weekNumber}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json())
          );

          const weeksData = await Promise.all(weeksPromises);
          
          // Sort weeks by weekNumber just to be safe
          weeksData.sort((a, b) => a.week.weekNumber - b.week.weekNumber);
          setWeeksDetails(weeksData);
        }

      } catch (err) {
        setError(err.message);
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [router]);

  const StatusCard = ({ day, title, status, desc }) => {
    let bgClass = '';
    let textClass = '';
    let borderClass = '';
    let icon = null;

    if (status === 'completed') {
      bgClass = 'bg-emerald-50 hover:bg-emerald-100/80';
      borderClass = 'border-emerald-200';
      textClass = 'text-emerald-900';
      icon = <CheckCircleFilled className="text-2xl text-emerald-600" />;
    } else if (status === 'unlocked') {
      bgClass = 'bg-blue-50 hover:bg-blue-100/80';
      borderClass = 'border-blue-300 border-2 shadow-sm';
      textClass = 'text-slate-900';
      icon = <PlayCircleFilled className="text-2xl text-blue-600 animate-pulse" />;
    } else {
      // Locked default
      bgClass = 'bg-slate-100';
      borderClass = 'border-slate-200 opacity-70';
      textClass = 'text-slate-500';
      icon = <LockFilled className="text-2xl text-slate-400" />;
    }

    return (
      <div className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${bgClass} ${borderClass}`}>
        <div className="shrink-0">{icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <Text className={`font-bold uppercase tracking-wider text-xs ${status === 'completed' ? 'text-emerald-700' : status === 'unlocked' ? 'text-blue-700' : 'text-slate-400'}`}>
              Day {day}
            </Text>
          </div>
          <Title level={5} className={`!m-0 font-bold ${textClass}`}>{title}</Title>
          <Text className={`block mt-1 font-medium text-sm ${status === 'completed' ? 'text-emerald-800' : status === 'unlocked' ? 'text-slate-700' : 'text-slate-500'}`}>
            {desc}
          </Text>
        </div>
      </div>
    );
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
      </div>
    );
  }

  if (!roadmapData) return null;

  // Assume current focus is the first day of the first week that is not completed.
  // We'll just hardcode Week 1 Day 1 if no logic exists, or use data if available.
  const currentWeekDisplay = roadmapData.weeks && roadmapData.weeks.length > 0 ? roadmapData.weeks[0].weekNumber : 1;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Title level={2} className="!text-slate-900 !mb-2">Internship Roadmap</Title>
          <Text className="text-slate-700 font-medium text-base">
            Track your progress for <strong className="text-blue-700">{roadmapData.title}</strong>
          </Text>
        </div>
        <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <CalendarOutlined className="text-blue-600 text-xl" />
          <div>
            <Text className="text-xs uppercase font-bold text-slate-500 tracking-wider block leading-tight">Current Focus</Text>
            <Text className="text-slate-900 font-bold leading-tight">Week {currentWeekDisplay}</Text>
          </div>
        </div>
      </div>

      {/* Timeline Layout */}
      <Row gutter={[48, 32]} className="relative">
        
        {/* Vertical Timeline Line (Desktop) */}
        {weeksDetails.length > 0 && (
          <div className="hidden lg:block absolute left-[30px] top-6 bottom-0 w-1 bg-slate-200 rounded-full z-0"></div>
        )}

        {weeksDetails.length === 0 && (
           <Col span={24}>
             <Alert title="No roadmap data available for this internship track yet." type="info" showIcon />
           </Col>
        )}

        {weeksDetails.map((weekDetail, index) => {
          const { week, days } = weekDetail;
          const isCurrentWeek = index === 0; // Just mock current week as first for now

          return (
            <Col span={24} className="relative z-10" key={week.id}>
              <div className="flex items-start gap-8">
                <div className={`hidden lg:flex shrink-0 w-16 h-16 rounded-2xl items-center justify-center border-4 border-slate-50 shadow-md ${isCurrentWeek ? 'bg-blue-600' : 'bg-slate-900'}`}>
                  <Text className="text-white font-black text-xl">W{week.weekNumber}</Text>
                </div>
                
                <div className="flex-1 space-y-6">
                  <Card 
                    className={`rounded-2xl shadow-md bg-white ${isCurrentWeek ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'}`} 
                    bodyStyle={{ padding: '32px' }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <Title level={4} className="!text-slate-900 !m-0">Week {week.weekNumber}: {week.title}</Title>
                      {isCurrentWeek && (
                        <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-md">Current Week</span>
                      )}
                    </div>
                    <Text className="text-slate-700 font-medium block mb-6">{week.description}</Text>
                    
                    <div className="space-y-4">
                      {days.map((day, dayIndex) => {
                        // Determine mock status based on week/day for visual demonstration
                        let status = 'locked';
                        if (index === 0 && dayIndex === 0) status = 'completed';
                        if (index === 0 && dayIndex === 1) status = 'unlocked';
                        
                        return (
                          <StatusCard 
                            key={day.id}
                            day={day.dayNumber} 
                            title={`Day ${day.dayNumber}`} 
                            desc={day.topicsCovered ? day.topicsCovered.join(', ') : 'Topics not listed'}
                            status={status} 
                          />
                        );
                      })}
                      {days.length === 0 && (
                        <Text type="secondary">No days specified for this week yet.</Text>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </Col>
          );
        })}

      </Row>
    </div>
  );
}
