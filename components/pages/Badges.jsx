"use client";
import React, { useState, useEffect } from 'react';
import { Card, Typography, Progress, Tabs, Row, Col, Tag, Skeleton } from 'antd';
import {
  CodeOutlined,
  FireFilled,
  TrophyFilled,
  RocketFilled,
  CalendarFilled,
  AimOutlined,
  BulbFilled,
  CheckCircleFilled,
  LockFilled,
  StarFilled
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Configuration for mapping backend text to frontend visual elements
const iconMapping = {
  'First Commit': { icon: <CodeOutlined />, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
  '7-Day Streak': { icon: <FireFilled />, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
  'Top Performer': { icon: <TrophyFilled />, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' },
  '100 Commits': { icon: <RocketFilled />, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  'Perfect Attendance': { icon: <CalendarFilled />, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
  'Task Master': { icon: <AimOutlined />, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
  'AI Excellence': { icon: <BulbFilled />, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
  'Default': { icon: <StarFilled />, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' }
};

export default function Badges() {
  const [activeTab, setActiveTab] = useState('all');
  const [badgesData, setBadgesData] = useState([]);
  const [stats, setStats] = useState({ totalBadges: 0, unlockedBadges: 0, progressPercent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch('/api/v1/badges');
        if (res.ok) {
          const json = await res.json();
          setBadgesData(json.data || []);
          setStats(json.stats || { totalBadges: 0, unlockedBadges: 0, progressPercent: 0 });
        }
      } catch (error) {
        console.error("Failed to fetch badges data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  // Filtered dataset
  const displayedBadges = badgesData.filter(badge => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unlocked') return badge.unlocked;
    if (activeTab === 'locked') return !badge.unlocked;
    return true;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 bg-blue-50/50 min-h-full">

      {/* Page Header */}
      <div className="mb-2">
        <Title level={2} className="!text-slate-900 !mb-2">Trophy Room</Title>
        <Text className="text-slate-700 font-medium text-base">Track your milestones, celebrate achievements, and unlock exclusive certifications.</Text>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* ZONE 1: GLOBAL PROGRESS OVERVIEW */}
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white"  styles={{ body: { padding: '32px' } }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-end mb-3">
                <Text className="text-slate-900 font-bold text-lg">Total Badge Progress</Text>
                {loading ? (
                   <Skeleton.Button active size="small" />
                ) : (
                  <Text className="text-blue-700 font-bold">Earned: {stats.unlockedBadges} / {stats.totalBadges} Unlocked</Text>
                )}
              </div>
              <Progress
                percent={stats.progressPercent}
                strokeColor={{ '0%': '#3b82f6', '100%': '#8b5cf6' }}
                trailColor="#f1f5f9"
                strokeWidth={12}
                className="[&_.ant-progress-text]:text-slate-900 [&_.ant-progress-text]:font-bold"
              />
            </div>

            <div className="w-full md:w-auto">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="[&_.ant-tabs-nav]:m-0 [&_.ant-tabs-tab]:font-bold [&_.ant-tabs-tab-active]:text-blue-600"
                items={[
                  { key: 'all', label: 'All Badges' },
                  { key: 'unlocked', label: `Unlocked (${stats.unlockedBadges})` },
                  { key: 'locked', label: `Locked (${stats.totalBadges - stats.unlockedBadges})` }
                ]}
              />
            </div>

          </div>
        </Card>

        {/* ZONE 2: THE ACHIEVEMENT TROPHY GRID */}
        <Row gutter={[24, 24]}>
          {loading ? (
             Array.from({ length: 4 }).map((_, idx) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={`skeleton-${idx}`}>
                   <Card className="h-full rounded-2xl border-slate-200">
                     <Skeleton active avatar={{ shape: 'square', size: 'large' }} paragraph={{ rows: 2 }} />
                   </Card>
                </Col>
             ))
          ) : (
            displayedBadges.map((badge) => {
              const visual = iconMapping[badge.title] || iconMapping['Default'];
              
              return (
                <Col xs={24} sm={12} lg={8} xl={6} key={badge.id}>
                  {badge.unlocked ? (
                    // UNLOCKED STATE
                    <Card className="h-full rounded-2xl border border-slate-200 shadow-sm shadow-blue-900/5 bg-white transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/10 cursor-pointer"  styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' } }}>
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl border ${visual.bg} ${visual.color}`}>
                          {visual.icon}
                        </div>
                        <Tag className="m-0 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircleFilled className="text-emerald-500" /> Unlocked
                        </Tag>
                      </div>

                      <div className="mb-4 flex-1">
                        <Title level={4} className="!text-slate-900 !mb-2 !leading-tight">{badge.title}</Title>
                        <Paragraph className="text-slate-600 font-medium text-sm leading-snug mb-0">
                          {badge.description}
                        </Paragraph>
                      </div>
                    </Card>
                  ) : (
                    // LOCKED STATE
                    <Card className="h-full rounded-2xl border border-slate-100 shadow-none bg-slate-50/60 opacity-60 transition-opacity hover:opacity-80"  styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' } }}>
                      <div className="flex justify-between items-start mb-6 grayscale">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl border bg-slate-200 border-slate-300 text-slate-400">
                          {visual.icon}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                          <LockFilled /> Locked
                        </div>
                      </div>

                      <div className="mb-4 flex-1">
                        <Title level={4} className="!text-slate-500 !mb-2 !leading-tight">{badge.title}</Title>
                        <Paragraph className="text-slate-400 font-medium text-sm leading-snug mb-0">
                          {badge.description}
                        </Paragraph>
                      </div>
                    </Card>
                  )}
                </Col>
              );
            })
          )}

          {!loading && displayedBadges.length === 0 && (
            <Col span={24}>
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
                <Text className="text-slate-500 font-medium text-lg">No badges found in this category.</Text>
              </div>
            </Col>
          )}

        </Row>

      </div>
    </div>
  );
}
