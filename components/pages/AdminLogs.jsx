import React from 'react';
import { Table, Card, Tag } from 'antd';

export default function AdminLogs() {
  const columns = [
    { title: 'User', dataIndex: 'user', key: 'user', render: text => <strong className="text-slate-800">{text}</strong> },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip', render: text => <Tag>{text}</Tag> },
  ];

  const data = [];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Logs</h1>
        <p className="text-slate-500">Track all important actions.</p>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}