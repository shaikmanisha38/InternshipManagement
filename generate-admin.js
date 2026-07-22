const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, 'components/pages');
const APP_DIR = path.join(__dirname, 'app/admin');

const pages = [
  {
    name: 'AdminStudents',
    route: 'students',
    content: `
import React from 'react';
import { Table, Button, Card, Space, Tag } from 'antd';
import { Eye, Edit, UserX, Trash2, Plus } from 'lucide-react';

export default function AdminStudents() {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Course', dataIndex: 'course', key: 'course' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => <Tag color="blue">{text}</Tag> },
    { title: 'Internship', dataIndex: 'internship', key: 'internship' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<Eye className="w-4 h-4"/>}>View Profile</Button>
          <Button type="link" icon={<Edit className="w-4 h-4"/>}>Assign Internship</Button>
          <Button type="link" danger icon={<UserX className="w-4 h-4"/>}>Deactivate</Button>
          <Button type="link" danger icon={<Trash2 className="w-4 h-4"/>}>Delete</Button>
        </Space>
      )
    }
  ];

  const data = [
    { key: '1', name: 'John Doe', email: 'john@example.com', course: 'Computer Science', status: 'Active', internship: 'Web Dev Bootcamp' }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Students Management</h1>
        <Button type="primary" className="bg-blue-600 rounded-lg" icon={<Plus className="w-4 h-4"/>}>Add Student</Button>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}`
  },
  {
    name: 'AdminMentors',
    route: 'mentors',
    content: `
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

  const data = [
    { key: '1', name: 'Dr. Jane Smith', expertise: 'Machine Learning', students: 15, activeInternships: 2, status: 'Active' }
  ];

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
}`
  },
  {
    name: 'AdminUsers',
    route: 'users',
    content: `
import React from 'react';
import { Table, Button, Card, Space, Tag } from 'antd';
import { ShieldAlert, Trash2, Plus, Lock } from 'lucide-react';

export default function AdminUsers() {
  const columns = [
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: text => <Tag color="purple">{text}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => <Tag color="green">{text}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<Lock className="w-4 h-4"/>}>Reset Password</Button>
          <Button type="link" danger icon={<ShieldAlert className="w-4 h-4"/>}>Disable Account</Button>
          <Button type="link" danger icon={<Trash2 className="w-4 h-4"/>}>Delete User</Button>
        </Space>
      )
    }
  ];

  const data = [
    { key: '1', user: 'Admin Main', email: 'admin@system.com', role: 'Admin', status: 'Active' }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Users</h1>
        <Button type="primary" className="bg-blue-600 rounded-lg" icon={<Plus className="w-4 h-4"/>}>Create User</Button>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}`
  },
  {
    name: 'AdminRoles',
    route: 'roles',
    content: `
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

  const data = [
    { key: '1', role: 'Admin', permissions: ['Create Internship', 'Delete Internship', 'Manage Users', 'View Analytics'] },
    { key: '2', role: 'Mentor', permissions: ['Accept Students', 'Create Modules', 'Review Assignments', 'Give Feedback'] },
    { key: '3', role: 'Student', permissions: ['Apply Internship', 'View Modules', 'Submit Assignment', 'Download Certificate'] }
  ];

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
}`
  },
  {
    name: 'AdminInternships',
    route: 'internships',
    content: `
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

  const data = [
    { key: '1', title: 'Full Stack Developer', mentor: 'Dr. Jane Smith', apps: 45, active: 12, status: 'Published' }
  ];

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
}`
  },
  {
    name: 'AdminApplications',
    route: 'applications',
    content: `
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

  const data = [
    { key: '1', student: 'Alice Johnson', internship: 'Web Dev Bootcamp', mentor: 'Dr. Jane Smith', status: 'Pending' }
  ];

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
}`
  },
  {
    name: 'AdminActiveInternships',
    route: 'active-internships',
    content: `
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

  const data = [
    { key: '1', student: 'Alice Johnson', internship: 'Web Dev Bootcamp', mentor: 'Dr. Jane Smith', progress: 65 }
  ];

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
}`
  },
  {
    name: 'AdminModules',
    route: 'modules',
    content: `
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
}`
  },
  {
    name: 'AdminTasks',
    route: 'tasks',
    content: `
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

  const data = [
    { key: '1', student: 'Bob Smith', task: 'Build Login Page', deadline: '2023-10-15', status: 'Submitted' }
  ];

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
}`
  },
  {
    name: 'AdminCertificates',
    route: 'certificates',
    content: `
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

  const data = [
    { key: '1', student: 'Eve Adams', internship: 'Data Science Base', date: '2023-09-01', cert: 'Issued' }
  ];

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
}`
  },
  {
    name: 'AdminAnalytics',
    route: 'analytics',
    content: `
import React from 'react';
import { Card, Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function AdminAnalytics() {
  const mockData = [{ name: 'A', value: 400 }, { name: 'B', value: 300 }, { name: 'C', value: 300 }];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics & Reports</h1>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Applications vs Enrollments" className="rounded-2xl border-slate-200 shadow-sm">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Mentor Performance (Tasks Reviewed)" className="rounded-2xl border-slate-200 shadow-sm">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Completion Rates by Category" className="rounded-2xl border-slate-200 shadow-sm">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {mockData.map((entry, index) => <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}`
  },
  {
    name: 'AdminLogs',
    route: 'logs',
    content: `
import React from 'react';
import { Table, Card, Tag } from 'antd';

export default function AdminLogs() {
  const columns = [
    { title: 'User', dataIndex: 'user', key: 'user', render: text => <strong className="text-slate-800">{text}</strong> },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip', render: text => <Tag>{text}</Tag> },
  ];

  const data = [
    { key: '1', user: 'Admin', action: 'Created internship "Flutter"', date: '2023-10-01 14:22:00', ip: '192.168.1.1' },
    { key: '2', user: 'Mentor Dr. Smith', action: 'Accepted Rahul', date: '2023-10-02 09:15:22', ip: '10.0.0.5' },
    { key: '3', user: 'Student Rahul', action: 'Submitted assignment', date: '2023-10-05 18:45:10', ip: '172.16.0.2' },
  ];

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
}`
  },
  {
    name: 'AdminSettings',
    route: 'settings',
    content: `
import React from 'react';
import { Card, Form, Input, Button, Switch, Divider } from 'antd';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">General Settings</h1>
      
      <Card className="rounded-2xl border-slate-200 shadow-sm max-w-3xl">
        <Form layout="vertical" initialValues={{ companyName: 'CodeCraft Internships', theme: true }}>
          <Form.Item label="Company Name" name="companyName">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Logo URL">
            <Input size="large" placeholder="https://example.com/logo.png" />
          </Form.Item>
          
          <Divider />
          <h3 className="font-bold mb-4 text-lg">Email Settings</h3>
          <Form.Item label="SMTP Server">
            <Input size="large" placeholder="smtp.gmail.com" />
          </Form.Item>
          <Form.Item label="Sender Email">
            <Input size="large" placeholder="noreply@codecraft.com" />
          </Form.Item>
          
          <Divider />
          <h3 className="font-bold mb-4 text-lg">System Preferences</h3>
          <div className="flex items-center justify-between mb-4">
            <span>Dark Theme Enabled (Default)</span>
            <Form.Item name="theme" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span>Strict Password Policy</span>
            <Switch defaultChecked />
          </div>

          <Divider />
          <Button type="primary" className="bg-blue-600" size="large" icon={<Save className="w-4 h-4"/>}>
            Save Settings
          </Button>
        </Form>
      </Card>
    </div>
  );
}`
  }
];

// Write components
pages.forEach(p => {
  fs.writeFileSync(path.join(COMPONENTS_DIR, `${p.name}.jsx`), p.content.trim());
});

// Update page.tsx wrappers
pages.forEach(p => {
  const dirPath = path.join(APP_DIR, p.route);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  const pageContent = `"use client";
import ${p.name} from '@/components/pages/${p.name}';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <${p.name} />
    </DashboardLayout>
  );
}
`;
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), pageContent);
});

console.log('Admin pages generated successfully!');
