import React from 'react';
import { Table, Button, Card, Space, Tag } from 'antd';
import { Check, X, ArrowRight } from 'lucide-react';

export default function AdminApplications() {
  const columns = [
    { title: 'Student', dataIndex: 'student', key: 'student' },
    { title: 'Internship', dataIndex: 'internship', key: 'internship' },
    { title: 'Mentor', dataIndex: 'mentor', key: 'mentor' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => <Tag color="orange">{text}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button type="primary" className="bg-green-600" size="small" icon={<Check className="w-4 h-4"/>}>Accept</Button>
          <Button danger size="small" icon={<X className="w-4 h-4"/>}>Reject</Button>
          <Button type="default" size="small" icon={<ArrowRight className="w-4 h-4"/>}>Forward to Mentor</Button>
        </Space>
      )
    }
  ];

  const data = [];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Internship Applications</h1>
        <p className="text-slate-500">Global oversight of all student applications.</p>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}