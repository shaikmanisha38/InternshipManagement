import React from 'react';
import { Card, Typography, Progress, Table, Tag, Row, Col, Space } from 'antd';
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

// Mock Table Data
const attendanceData = [
  {
    key: '1',
    date: 'Oct 12, 2025',
    loginTime: '08:55 AM',
    logoutTime: '05:30 PM',
    hours: '8.5',
    status: 'Present',
  },
  {
    key: '2',
    date: 'Oct 11, 2025',
    loginTime: '09:15 AM',
    logoutTime: '06:00 PM',
    hours: '8.75',
    status: 'Late',
  },
  {
    key: '3',
    date: 'Oct 10, 2025',
    loginTime: '--:--',
    logoutTime: '--:--',
    hours: '0',
    status: 'Absent',
  },
  {
    key: '4',
    date: 'Oct 09, 2025',
    loginTime: '08:50 AM',
    logoutTime: '05:15 PM',
    hours: '8.4',
    status: 'Present',
  },
  {
    key: '5',
    date: 'Oct 08, 2025',
    loginTime: '09:00 AM',
    logoutTime: '05:00 PM',
    hours: '8.0',
    status: 'Present',
  },
];

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
        <LoginOutlined className="text-emerald-500" /> {text}
      </span>
    ),
  },
  {
    title: <Text className="text-slate-500 font-bold uppercase text-xs tracking-wider">Logout Time</Text>,
    dataIndex: 'logoutTime',
    key: 'logoutTime',
    render: (text) => (
      <span className="flex items-center gap-1.5 text-slate-700 font-medium">
        <LogoutOutlined className="text-rose-500" /> {text}
      </span>
    ),
  },
  {
    title: <Text className="text-slate-500 font-bold uppercase text-xs tracking-wider">Hours Worked</Text>,
    dataIndex: 'hours',
    key: 'hours',
    render: (text) => (
      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
        <ClockCircleOutlined className="text-slate-400" /> {text} Hrs
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
            <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full" bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Overall Attendance</Text>
              <Progress 
                type="dashboard" 
                percent={94} 
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
                <Card className="rounded-2xl border-blue-100 shadow-sm shadow-blue-900/5 bg-blue-50/50 h-full hover:border-blue-300 transition-colors" bodyStyle={{ padding: '32px 24px' }}>
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200 shadow-inner">
                      <UserSwitchOutlined className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                      <Title level={1} className="!text-blue-900 !m-0 !font-black !text-5xl">42</Title>
                      <Text className="text-blue-600 font-bold text-sm uppercase tracking-wider mt-1 block">Present Days</Text>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Late Arrivals */}
              <Col xs={24} sm={8}>
                <Card className="rounded-2xl border-amber-100 shadow-sm shadow-blue-900/5 bg-amber-50/50 h-full hover:border-amber-300 transition-colors" bodyStyle={{ padding: '32px 24px' }}>
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200 shadow-inner">
                      <WarningFilled className="text-amber-500 text-xl" />
                    </div>
                    <div>
                      <Title level={1} className="!text-amber-900 !m-0 !font-black !text-5xl">3</Title>
                      <Text className="text-amber-600 font-bold text-sm uppercase tracking-wider mt-1 block">Late Arrivals</Text>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Absent Days */}
              <Col xs={24} sm={8}>
                <Card className="rounded-2xl border-rose-100 shadow-sm shadow-blue-900/5 bg-rose-50/50 h-full hover:border-rose-300 transition-colors" bodyStyle={{ padding: '32px 24px' }}>
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-200 shadow-inner">
                      <CloseCircleFilled className="text-rose-500 text-xl" />
                    </div>
                    <div>
                      <Title level={1} className="!text-rose-900 !m-0 !font-black !text-5xl">1</Title>
                      <Text className="text-rose-600 font-bold text-sm uppercase tracking-wider mt-1 block">Absent Days</Text>
                    </div>
                  </div>
                </Card>
              </Col>

            </Row>
          </Col>
        </Row>

        {/* ZONE 2: DETAILED ATTENDANCE LOG */}
        <Card 
          className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white overflow-hidden" 
          bodyStyle={{ padding: 0 }}
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <Title level={4} className="!text-slate-900 !m-0">Chronological History</Title>
            <Tag className="m-0 bg-white border border-slate-200 text-slate-500 font-bold px-3 py-1 rounded-full">Current Month</Tag>
          </div>
          
          <div className="overflow-x-auto">
            <Table 
              columns={columns} 
              dataSource={attendanceData} 
              pagination={{ pageSize: 5 }}
              className="[&_.ant-table-thead_th]:bg-white [&_.ant-table-thead_th]:border-b-2 [&_.ant-table-thead_th]:border-slate-100 [&_.ant-table-tbody_td]:border-b [&_.ant-table-tbody_td]:border-slate-50 [&_.ant-table-tbody_tr:hover_td]:bg-blue-50/30 [&_.ant-pagination]:px-6 [&_.ant-pagination]:pb-4"
            />
          </div>
        </Card>

      </div>
    </div>
  );
}
