"use client";
import React, { useState } from 'react';
import { 
  Table, Tag, Avatar, Button, Card, Skeleton, message, Tooltip, Popconfirm
} from 'antd';
import { 
  CheckCircle2, Clock, RotateCw, Mail, Eye, Award, FileBadge
} from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

export default function MentorCertificates() {
  const [generating, setGenerating] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);

  const { data, mutate, isLoading } = useSWR('/api/v1/mentor/certificates', fetcher, {
    refreshInterval: 5000
  });

  const roster = data?.data || [];
  const metrics = data?.metrics || { issuedCount: 0, pendingCount: 0 };

  const handleGenerate = async (studentId = null) => {
    try {
      if (studentId) setGeneratingId(studentId);
      else setGenerating(true);

      const payload = studentId ? { studentId } : { bulk: true };

      const res = await fetch('/api/v1/mentor/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        message.success(studentId ? 'Certificate issued successfully' : 'Bulk certificates issued successfully');
        mutate();
      } else {
        message.error('Failed to issue certificates');
      }
    } catch (err) {
      message.error('An error occurred while generating certificates');
    } finally {
      setGenerating(false);
      setGeneratingId(null);
    }
  };

  const columns = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size="large" />
          <div>
            <div className="font-bold text-[#0F172A]">{record.name}</div>
            <div className="text-xs text-slate-500 font-medium">{record.batch}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Final Score',
      key: 'finalScore',
      render: (_, record) => (
        <div className="text-sm font-bold text-[#0F172A]">
          {record.finalScore}% <span className="text-slate-400 font-normal">Overall</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        let color = 'default';
        let bg = 'bg-slate-50';
        let text = 'text-slate-600';
        let icon = null;

        if (record.status === 'ISSUED') {
          color = 'success';
          bg = 'bg-emerald-50';
          text = 'text-emerald-700';
          icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline-block" />;
        } else if (record.status === 'PENDING') {
          color = 'warning';
          bg = 'bg-amber-50';
          text = 'text-amber-700';
          icon = <Clock className="w-3.5 h-3.5 mr-1 inline-block" />;
        }

        return (
          <Tag color={color} className={`px-3 py-1 border-0 font-bold ${bg} ${text} rounded-full m-0`}>
            {icon}
            {record.status.replace('_', ' ')}
          </Tag>
        );
      },
    },
    {
      title: 'Issued Date',
      key: 'issuedAt',
      render: (_, record) => (
        <div className="text-sm font-semibold text-slate-600">
          {record.issuedAt ? new Date(record.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }) : '--'}
        </div>
      ),
    },
    {
      title: 'Operations',
      key: 'operations',
      render: (_, record) => {
        if (record.status === 'ISSUED') {
          return (
            <div className="flex gap-2">
              <Tooltip title="Preview PDF">
                <Button type="text" icon={<Eye className="w-4 h-4 text-blue-600" />} className="bg-blue-50 hover:bg-blue-100 border-0" />
              </Tooltip>
              <Tooltip title="Email Certificate">
                <Button type="text" icon={<Mail className="w-4 h-4 text-purple-600" />} className="bg-purple-50 hover:bg-purple-100 border-0" />
              </Tooltip>
              <Popconfirm title="Regenerate this certificate?" onConfirm={() => handleGenerate(record.studentId)}>
                <Tooltip title="Revoke & Regenerate">
                  <Button type="text" loading={generatingId === record.studentId} icon={<RotateCw className="w-4 h-4 text-slate-600" />} className="bg-slate-100 hover:bg-slate-200 border-0" />
                </Tooltip>
              </Popconfirm>
            </div>
          );
        } else {
          return (
            <Button 
              type="primary" 
              className="bg-blue-600 font-bold px-6 rounded-lg"
              loading={generatingId === record.studentId}
              onClick={() => handleGenerate(record.studentId)}
            >
              Generate
            </Button>
          );
        }
      },
    },
  ];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Global Filters */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Certificates Console</h1>
            <p className="text-[#475569]">Automate verifiable credential issuance for completing cohorts.</p>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<FileBadge className="w-5 h-5" />} 
            className="bg-blue-600 rounded-lg font-semibold h-12 px-6 shadow-md shadow-blue-600/20"
            loading={generating}
            onClick={() => handleGenerate()}
            disabled={metrics.pendingCount === 0}
          >
            Bulk Generate Certificates
          </Button>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Issued</p>
              {isLoading ? <Skeleton.Button active size="small" /> : <h2 className="text-4xl font-extrabold text-[#0F172A]">{metrics.issuedCount}</h2>}
            </div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pending Approval</p>
              {isLoading ? <Skeleton.Button active size="small" /> : <h2 className="text-4xl font-extrabold text-[#0F172A]">{metrics.pendingCount}</h2>}
            </div>
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* MASTER ROSTER TABLE */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Master Roster Table
            </h3>
            <p className="text-sm text-[#475569] mt-1">Review finalized grades and issue credentials.</p>
          </div>
          <Table 
            columns={columns} 
            dataSource={roster} 
            loading={isLoading}
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            size="large"
            rowClassName="hover:bg-slate-50 transition-colors"
          />
        </div>

      </div>
    </div>
  );
}
