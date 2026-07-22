import React from 'react';
import { Table, Button, Card, Space, Tag } from 'antd';
import { Eye, Edit, Trash2, Plus, Users } from 'lucide-react';

export default function AdminMentors() {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Expertise', dataIndex: 'expertise', key: 'expertise' },
    { title: 'Students', dataIndex: 'students', key: 'students' },
    { title: 'Active Internships', dataIndex: 'activeInternships', key: 'activeInternships' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => <Tag color="green">{text}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<Edit className="w-4 h-4"/>}>Assign Internship</Button>
          <Button type="link" icon={<Users className="w-4 h-4"/>}>View Students</Button>
          <Button type="link" icon={<Edit className="w-4 h-4"/>}>Edit</Button>
          <Button type="link" danger icon={<Trash2 className="w-4 h-4"/>}>Delete</Button>
        </Space>
      )
    }
  ];

  const data = [];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mentors Management</h1>
        <Button type="primary" className="bg-blue-600 rounded-lg" icon={<Plus className="w-4 h-4"/>}>Add Mentor</Button>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}