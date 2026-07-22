import React from 'react';
import { Collapse, Button, Card, Space } from 'antd';
import { Edit, Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';

export default function AdminModules() {
  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Modules Management</h1>
          <p className="text-slate-500">Manage curriculum and learning content.</p>
        </div>
        <Button type="primary" className="bg-blue-600 rounded-lg" icon={<Plus className="w-4 h-4"/>}>Add Module</Button>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm" title="Flutter Internship">
        <Collapse
          items={[
            {
              key: '1',
              label: <strong className="text-lg">Module 1: Flutter Basics</strong>,
              children: (
                <div className="space-y-4">
                  <p>Includes: Videos, PDF Notes, Assignments, Quiz</p>
                  <Space>
                    <Button type="default" icon={<Edit className="w-4 h-4"/>}>Edit Module</Button>
                    <Button danger icon={<Trash2 className="w-4 h-4"/>}>Delete Module</Button>
                    <Button type="dashed" icon={<MoveUp className="w-4 h-4"/>}>Move Up</Button>
                    <Button type="dashed" icon={<MoveDown className="w-4 h-4"/>}>Move Down</Button>
                  </Space>
                </div>
              )
            },
            {
              key: '2',
              label: <strong className="text-lg">Module 2: Widgets</strong>,
              children: <p>Content for Module 2...</p>
            },
          ]}
        />
      </Card>
    </div>
  );
}