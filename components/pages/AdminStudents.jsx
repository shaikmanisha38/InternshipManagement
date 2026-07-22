import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Tag, message } from 'antd';
import { Eye, Edit, UserX, Trash2, Plus } from 'lucide-react';

export default function AdminStudents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/admin/students', { 
          cache: 'no-store',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const students = await res.json();
          setData(students);
        } else {
          message.error("Failed to fetch students");
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("An error occurred while fetching students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Course', dataIndex: 'course', key: 'course' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: text => <Tag color={text === 'ONGOING' ? 'blue' : (text === 'No Internship' ? 'default' : 'green')}>{text}</Tag> },
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

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Students Management</h1>
        <Button type="primary" className="bg-blue-600 rounded-lg" icon={<Plus className="w-4 h-4"/>}>Add Student</Button>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <Table columns={columns} dataSource={data} loading={loading} />
      </Card>
    </div>
  );
}