import React from 'react';
import { Table, Button, Card, Space, Tag } from 'antd';
import { FileBadge, Download, Mail, XCircle } from 'lucide-react';

export default function AdminCertificates() {
  const columns = [
    { title: 'Student', dataIndex: 'student', key: 'student' },
    { title: 'Internship', dataIndex: 'internship', key: 'internship' },
    { title: 'Completion Date', dataIndex: 'date', key: 'date' },
    { title: 'Certificate', dataIndex: 'cert', key: 'cert', render: text => <Tag color="purple">{text}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<FileBadge className="w-4 h-4"/>}>Generate</Button>
          <Button type="link" icon={<Download className="w-4 h-4"/>}>Download</Button>
          <Button type="link" icon={<Mail className="w-4 h-4"/>}>Email</Button>
          <Button type="link" danger icon={<XCircle className="w-4 h-4"/>}>Revoke</Button>
        </Space>
      )
    }
  ];

  const data = [];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Certificates Management</h1>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}