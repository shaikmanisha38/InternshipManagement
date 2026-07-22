import React from 'react';
import { Table, Button, Card, Space, Progress } from 'antd';
import { Eye, UserSwitch, CheckCircle } from 'lucide-react';

export default function AdminActiveInternships() {
  const columns = [
    { title: 'Student', dataIndex: 'student', key: 'student' },
    { title: 'Internship', dataIndex: 'internship', key: 'internship' },
    { title: 'Mentor', dataIndex: 'mentor', key: 'mentor' },
    { title: 'Progress', dataIndex: 'progress', key: 'progress', render: val => <Progress percent={val} size="small" /> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<Eye className="w-4 h-4"/>}>View Progress</Button>
          <Button type="link" icon={<UserSwitch className="w-4 h-4"/>}>Transfer Mentor</Button>
          <Button type="link" className="text-green-600" icon={<CheckCircle className="w-4 h-4"/>}>Complete Internship</Button>
        </Space>
      )
    }
  ];

  const data = [];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Internships</h1>
        <p className="text-slate-500">Shows only students currently enrolled and progressing.</p>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}