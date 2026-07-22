import React from 'react';
import { Table, Button, Card, Space, Tag } from 'antd';
import { Edit, UserPlus, Power, Trash2, Plus } from 'lucide-react';

export default function AdminInternships() {
  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', render: text => <span className="font-bold">{text}</span> },
    { title: 'Mentor', dataIndex: 'mentor', key: 'mentor' },
    { title: 'Applications', dataIndex: 'apps', key: 'apps' },
    { title: 'Active Students', dataIndex: 'active', key: 'active' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => <Tag color="blue">{text}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<Edit className="w-4 h-4"/>}>Edit</Button>
          <Button type="link" icon={<UserPlus className="w-4 h-4"/>}>Assign Mentor</Button>
          <Button type="link" icon={<Power className="w-4 h-4"/>}>Publish/Close</Button>
          <Button type="link" danger icon={<Trash2 className="w-4 h-4"/>}>Delete</Button>
        </Space>
      )
    }
  ];

  const data = [];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Internship Management</h1>
          <p className="text-slate-500">Core internship catalog.</p>
        </div>
        <Button type="primary" className="bg-blue-600 rounded-lg" icon={<Plus className="w-4 h-4"/>}>Create Internship</Button>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}