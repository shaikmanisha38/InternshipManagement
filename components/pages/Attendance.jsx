"use client";
import React, { useState, useEffect } from 'react';
import { Card, Typography, Progress, Table, Tag, Row, Col, Spin, Alert } from 'antd';
import { 
  CheckCircleFilled, 
  CloseCircleFilled, 
  WarningFilled,
  CalendarOutlined,
  LoginOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Table Columns Configuration
const columns = [
  {
    title: <Text className="text-slate-500 font-bold uppercase text-xs tracking-wider">Date</Text>,
    dataIndex: 'date',
    key: 'date',
    render: (text) => (
      <span className="flex items-center gap-2">
        <CalendarOutlined className="text-blue-400" />
        <Text className="text-slate-900 font-bold whitespace-nowrap">{text}</Text>
      </span>
    ),
  },
  {
    title: <Text className="text-slate-500 font-bold uppercase text-xs tracking-wider">Login Time</Text>,
    dataIndex: 'loginTime',
    key: 'loginTime',
    render: (text) => (
      <span className="flex items-center gap-1.5 text-slate-700 font-medium">
        <LoginOutlined className="text-emerald-500" /> {text || '--:--'}
      </span>
    ),
  },
  {
    title: <Text className="text-slate-500 font-bold uppercase text-xs tracking-wider">Logout Time</Text>,
    dataIndex: 'logoutTime',
    key: 'logoutTime',
    render: (text) => (
      <span className="flex items-center gap-1.5 text-slate-700 font-medium">
        <LogoutOutlined className="text-rose-500" /> {text || '--:--'}
      </span>
    ),
  },
  {
    title: <Text className="text-slate-500 font-bold uppercase text-xs tracking-wider">Hours Worked</Text>,
    dataIndex: 'hours',
    key: 'hours',
    render: (text) => (
      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
        <ClockCircleOutlined className="text-slate-400" /> {text || '0'} Hrs
      </span>
    ),
  },
  {
    title: <Text className="text-slate-500 font-bold uppercase text-xs tracking-wider">Status</Text>,
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = '';
      let bg = '';
      let icon = null;
      
      if (status === 'Present') {
        color = 'text-emerald-700';
        bg = 'bg-emerald-50 border-emerald-200';
        icon = <CheckCircleFilled className="text-emerald-500" />;
      } else if (status === 'Late') {
        color = 'text-amber-700';
        bg = 'bg-amber-50 border-amber-200';
        icon = <WarningFilled className="text-amber-500" />;
      } else if (status === 'Absent') {
        color = 'text-rose-700';
        bg = 'bg-rose-50 border-rose-200';
        icon = <CloseCircleFilled className="text-rose-500" />;
      } else {
        // Fallback
        color = 'text-emerald-700';
        bg = 'bg-emerald-50 border-emerald-200';
        icon = <CheckCircleFilled className="text-emerald-500" />;
      }

      return (
        <Tag className={`px-3 py-1 m-0 border font-bold rounded-md flex items-center gap-1.5 w-max ${bg} ${color}`}>
          {icon} {status}
        </Tag>
      );
    },
  },
];

export default function Attendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const res = await fetch('/api/v1/attendance/summary');
        if (!res.ok) {
           const errData = await res.json().catch(() => ({}));
           throw new Error(errData.message || 'Failed to fetch attendance data');
        }
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
        setError(error.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Spin size="large" tip="Loading Attendance..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <Alert
          message="Error Loading Attendance"
          description={error || "No data received from the server."}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const { summary, history } = data;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-blue-50/50 min-h-full">
      
      {/* Header */}
      <div className="mb-2">
        <Title level={2} className="!text-slate-900 !mb-2">Attendance Tracker</Title>
        <Text className="text-slate-700 font-medium text-base">Monitor your daily login streaks, cumulative working hours, and session punctuality.</Text>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ZONE 1: ATTENDANCE SUMMARY BANNER */}
        <Row gutter={[24, 24]}>
          
          {/* Percentage Card */}
          <Col xs={24} md={12} lg={6}>
            <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full"  styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }}>
              <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Overall Attendance</Text>
              <Progress 
                type="dashboard" 
                percent={summary.overallPercentage} 
                strokeColor={{ '0%': '#3b82f6', '100%': '#10b981' }} 
                strokeWidth={10}
                size={140}
                format={(percent) => (
                  <div className="flex flex-col items-center">
                    <span className="text-slate-900 font-black text-3xl">{percent}%</span>
                  </div>
                )}
              />
            </Card>
          </Col>

          {/* Metric Cards Container */}
          <Col xs={24} md={12} lg={18}>
            <Row gutter={[24, 24]} className="h-full">
              
              {/* Present Days */}
              <Col xs={24} sm={8}>
                <Card className="rounded-2xl border-blue-100 shadow-sm shadow-blue-900/5 bg-blue-50/50 h-full hover:border-blue-300 transition-colors"  styles={{ body: { padding: '32px 24px' } }}>
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200 shadow-inner">
                      <UserSwitchOutlined className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                      <Title level={1} className="!text-blue-900 !m-0 !font-black !text-5xl">{summary.presentCount}</Title>
                      <Text className="text-blue-600 font-bold text-sm uppercase tracking-wider mt-1 block">Present Days</Text>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Late Arrivals */}
              <Col xs={24} sm={8}>
                <Card className="rounded-2xl border-amber-100 shadow-sm shadow-blue-900/5 bg-amber-50/50 h-full hover:border-amber-300 transition-colors"  styles={{ body: { padding: '32px 24px' } }}>
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200 shadow-inner">
                      <WarningFilled className="text-amber-500 text-xl" />
                    </div>
                    <div>
                      <Title level={1} className="!text-amber-900 !m-0 !font-black !text-5xl">{summary.lateCount}</Title>
                      <Text className="text-amber-600 font-bold text-sm uppercase tracking-wider mt-1 block">Late Arrivals</Text>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Absent Days */}
              <Col xs={24} sm={8}>
                <Card className="rounded-2xl border-rose-100 shadow-sm shadow-blue-900/5 bg-rose-50/50 h-full hover:border-rose-300 transition-colors"  styles={{ body: { padding: '32px 24px' } }}>
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-200 shadow-inner">
                      <CloseCircleFilled className="text-rose-500 text-xl" />
                    </div>
                    <div>
                      <Title level={1} className="!text-rose-900 !m-0 !font-black !text-5xl">{summary.absentCount}</Title>
                      <Text className="text-rose-600 font-bold text-sm uppercase tracking-wider mt-1 block">Absent Days</Text>
                    </div>
                  </div>
                </Card>
              </Col>

            </Row>
          </Col>
        </Row>

        {/* ZONE 2: DETAILED ATTENDANCE LOG */}
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white overflow-hidden"  styles={{ body: { padding: 0 } }}>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <Title level={4} className="!text-slate-900 !m-0">Chronological History</Title>
            <Tag className="m-0 bg-white border border-slate-200 text-slate-500 font-bold px-3 py-1 rounded-full">Current Month</Tag>
          </div>
          
          <div className="overflow-x-auto">
            {history && history.length > 0 ? (
              <Table 
                columns={columns} 
                dataSource={history} 
                pagination={{ pageSize: 5 }}
                className="[&_.ant-table-thead_th]:bg-white [&_.ant-table-thead_th]:border-b-2 [&_.ant-table-thead_th]:border-slate-100 [&_.ant-table-tbody_td]:border-b [&_.ant-table-tbody_td]:border-slate-50 [&_.ant-table-tbody_tr:hover_td]:bg-blue-50/30 [&_.ant-pagination]:px-6 [&_.ant-pagination]:pb-4"
              />
            ) : (
              <div className="flex items-center justify-center p-8 text-slate-400">No attendance records found.</div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
