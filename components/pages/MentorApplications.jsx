import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Button, Space, message, Popconfirm, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function MentorApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/mentor/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        message.error('Failed to fetch pending applications');
      }
    } catch (e) {
      console.error(e);
      message.error('Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id, status) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/mentor/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        message.success(`Application ${status.toLowerCase()} successfully!`);
        fetchApplications();
      } else {
        const err = await res.json();
        message.error(err.message || 'Action failed');
      }
    } catch (e) {
      console.error(e);
      message.error('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      title: 'Student Name',
      dataIndex: ['student', 'name'],
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Email',
      dataIndex: ['student', 'email'],
      key: 'email',
    },
    {
      title: 'Applied Internship',
      dataIndex: ['internship', 'title'],
      key: 'internship',
    },
    {
      title: 'Applied Date',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date) => (
        <span>
          <ClockCircleOutlined className="mr-1 text-slate-400" />
          {dayjs(date).format('MMM D, YYYY h:mm A')}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Approve Application"
            description="Are you sure you want to approve this student? This will instantly enroll them."
            onConfirm={() => handleAction(record.id, 'ACCEPTED')}
            okText="Yes, Approve"
            cancelText="Cancel"
          >
            <Button 
              type="primary" 
              className="bg-green-500 hover:bg-green-600 border-none"
              icon={<CheckCircleOutlined />}
              loading={actionLoading === record.id}
            >
              Approve
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Reject Application"
            description="Are you sure you want to reject this application?"
            onConfirm={() => handleAction(record.id, 'REJECTED')}
            okText="Yes, Reject"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger 
              icon={<CloseCircleOutlined />}
              loading={actionLoading === record.id}
            >
              Reject
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <Title level={2} className="!mb-1">Pending Applications</Title>
        <Text className="text-slate-500">
          Review and approve students who have requested to join your internships.
        </Text>
      </div>

      <Card className="rounded-xl shadow-sm border-slate-200">
        <Table 
          columns={columns} 
          dataSource={applications} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'No pending applications found.' }}
        />
      </Card>
    </div>
  );
}
