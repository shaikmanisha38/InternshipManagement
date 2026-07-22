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
                    {mockData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
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
}