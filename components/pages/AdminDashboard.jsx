"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Briefcase, ClipboardList, Building2, CheckCircle2, Award, 
  Plus, FileText, TrendingUp, BarChart2 
} from 'lucide-react';
import { Card, Button, Row, Col, Statistic, message } from 'antd';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    totalInternships: 0,
    pendingApplications: 0,
    activeInternships: 0,
    completedInternships: 0,
    certificatesIssued: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/admin/stats', { 
          cache: 'no-store',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          console.error("Failed to fetch admin stats");
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: <Users className="w-6 h-6 text-blue-500" />, color: 'border-blue-500' },
    { title: 'Total Mentors', value: stats.totalMentors, icon: <UserCheck className="w-6 h-6 text-indigo-500" />, color: 'border-indigo-500' },
    { title: 'Total Internships', value: stats.totalInternships, icon: <Briefcase className="w-6 h-6 text-emerald-500" />, color: 'border-emerald-500' },
    { title: 'Pending Applications', value: stats.pendingApplications, icon: <ClipboardList className="w-6 h-6 text-amber-500" />, color: 'border-amber-500' },
    { title: 'Active Internships', value: stats.activeInternships, icon: <Building2 className="w-6 h-6 text-teal-500" />, color: 'border-teal-500' },
    { title: 'Completed Internships', value: stats.completedInternships, icon: <CheckCircle2 className="w-6 h-6 text-green-500" />, color: 'border-green-500' },
    { title: 'Certificates Issued', value: stats.certificatesIssued, icon: <Award className="w-6 h-6 text-purple-500" />, color: 'border-purple-500' },
  ];

  // Mock Data for Charts
  const registrationData = [
    { month: 'Jan', students: 120 }, { month: 'Feb', students: 150 },
    { month: 'Mar', students: 180 }, { month: 'Apr', students: 220 },
    { month: 'May', students: 270 }, { month: 'Jun', students: 310 },
  ];

  const categoryData = [
    { name: 'Web Dev', value: 45 }, { name: 'Data Science', value: 25 },
    { name: 'Mobile', value: 20 }, { name: 'Cloud', value: 10 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const applicationData = [
    { name: 'Accepted', value: 450, color: '#10b981' },
    { name: 'Pending', value: 142, color: '#f59e0b' },
    { name: 'Rejected', value: 85, color: '#ef4444' },
  ];

  const completionData = [
    { month: 'Jan', completions: 40 }, { month: 'Feb', completions: 65 },
    { month: 'Mar', completions: 85 }, { month: 'Apr', completions: 110 },
    { month: 'May', completions: 145 }, { month: 'Jun', completions: 180 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">System overview and core metrics.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="primary" className="bg-blue-600 rounded-lg flex items-center gap-2" icon={<Plus className="w-4 h-4"/>}>
            Create Internship
          </Button>
          <Button type="default" className="rounded-lg flex items-center gap-2" icon={<Plus className="w-4 h-4"/>}>
            Add Mentor
          </Button>
          <Button type="default" className="rounded-lg flex items-center gap-2" icon={<Plus className="w-4 h-4"/>}>
            Add Student
          </Button>
          <Button type="dashed" className="rounded-lg flex items-center gap-2" icon={<FileText className="w-4 h-4"/>}>
            View Reports
          </Button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className={`rounded-xl border-l-4 shadow-sm ${stat.color}`} styles={{ body: { padding: '20px' } }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CHARTS */}
      <Row gutter={[24, 24]}>
        {/* Student Registrations */}
        <Col xs={24} lg={12}>
          <Card title={<span className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-500"/> Student Registrations</span>} className="rounded-2xl shadow-sm border-slate-200">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Internships by Category */}
        <Col xs={24} lg={12}>
          <Card title={<span className="flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-500"/> Internships by Category</span>} className="rounded-2xl shadow-sm border-slate-200">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Application Status */}
        <Col xs={24} lg={12}>
          <Card title={<span className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-amber-500"/> Application Status</span>} className="rounded-2xl shadow-sm border-slate-200">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {applicationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Monthly Completions */}
        <Col xs={24} lg={12}>
          <Card title={<span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Monthly Completions</span>} className="rounded-2xl shadow-sm border-slate-200">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
