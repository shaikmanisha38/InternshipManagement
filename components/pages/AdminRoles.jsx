import React from 'react';
import { Card, Table, Tag } from 'antd';

export default function AdminRoles() {
  const columns = [
    { title: 'Role', dataIndex: 'role', key: 'role', render: text => <strong className="text-slate-800">{text}</strong> },
    { title: 'Permissions', dataIndex: 'permissions', key: 'permissions', render: perms => (
      <div className="flex flex-wrap gap-2">
        {perms.map(p => <Tag key={p} color="blue">{p}</Tag>)}
      </div>
    )}
  ];

  const data = [];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Roles & Permissions</h1>
        <p className="text-slate-500">View system roles and their allowed actions.</p>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
  );
}