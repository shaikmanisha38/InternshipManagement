import React from 'react';
import { Table, Button, Card, Space, Tag } from 'antd';
import { Eye, Check, RefreshCcw, MessageSquare } from 'lucide-react';

export default function AdminTasks() {
  const columns = [
    { title: 'Student', dataIndex: 'student', key: 'student' },
    { title: 'Task', dataIndex: 'task', key: 'task' },
    { title: 'Deadline', dataIndex: 'deadline', key: 'deadline' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => <Tag color="blue">{text}</Tag> },
    {
      title: 'Mentor Actions (Oversight)',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<Eye className="w-4 h-4"/>}>Review</Button>
          <Button type="link" className="text-green-600" icon={<Check className="w-4 h-4"/>}>Approve</Button>
          <Button type="link" className="text-orange-600" icon={<RefreshCcw className="w-4 h-4"/>}>Return</Button>
          <Button type="link" icon={<MessageSquare className="w-4 h-4"/>}>Give Feedback</Button>
        </Space>
      )
    }
  ];

  const data = [];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Management</h1>
        <p className="text-slate-500">Track student work and submissions globally.</p>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}