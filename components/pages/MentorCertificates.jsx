"use client";
import React, { useState } from 'react';
import { 
  Table, Tag, Avatar, Button, Drawer, Tooltip 
} from 'antd';
import { 
  Award, CheckCircle2, Clock, Minus, Mail, RotateCcw, CopyPlus, Eye, Download, FileCheck, AlertCircle
} from 'lucide-react';

// --- MOCK DATA ---
const credentialData = [
  {
    key: '1',
    name: 'Alexandra Smith',
    batch: 'Batch 2024-A',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    finalScore: 94,
    status: 'Issued',
    issuedDate: 'July 05, 2026'
  },
  {
    key: '2',
    name: 'David Chen',
    batch: 'Batch 2024-B',
    avatar: 'https://i.pravatar.cc/150?u=davidchen',
    finalScore: 88,
    status: 'Pending',
    issuedDate: '--'
  },
  {
    key: '3',
    name: 'Maria Garcia',
    batch: 'Batch 2024-A',
    avatar: 'https://i.pravatar.cc/150?u=mariagarcia',
    finalScore: 92,
    status: 'Issued',
    issuedDate: 'July 01, 2026'
  },
  {
    key: '4',
    name: 'James Wilson',
    batch: 'Batch 2024-C',
    avatar: 'https://i.pravatar.cc/150?u=jamesw',
    finalScore: 78,
    status: 'Not Generated',
    issuedDate: '--'
  },
  {
    key: '5',
    name: 'Sophia Patel',
    batch: 'Batch 2024-B',
    avatar: 'https://i.pravatar.cc/150?u=sophiap',
    finalScore: 85,
    status: 'Pending',
    issuedDate: '--'
  }
];

export default function MentorCertificates() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const openPreview = (student) => {
    setSelectedStudent(student);
    setDrawerVisible(true);
  };

  // --- COLUMNS CONFIGURATION ---
  const columns = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size="large" />
          <div>
            <div className="font-bold text-[#0F172A]">{record.name}</div>
            <div className="text-xs text-[#64748b]">{record.batch}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Final Score',
      dataIndex: 'finalScore',
      key: 'finalScore',
      sorter: (a, b) => a.finalScore - b.finalScore,
      render: (score) => (
        <div className="font-extrabold text-[#0F172A] text-base">
          {score}% <span className="text-xs font-medium text-[#475569]">Overall</span>
        </div>
      ),
    },
    {
      title: 'Certificate Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Issued', value: 'Issued' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Not Generated', value: 'Not Generated' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        if (status === 'Issued') {
          return (
            <Tag color="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full font-bold flex items-center gap-1 w-max">
              <CheckCircle2 className="w-3.5 h-3.5" /> Issued
            </Tag>
          );
        }
        if (status === 'Pending') {
          return (
            <Tag color="warning" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1 rounded-full font-bold flex items-center gap-1 w-max">
              <Clock className="w-3.5 h-3.5" /> Pending
            </Tag>
          );
        }
        return (
          <Tag color="default" className="bg-slate-100 text-slate-600 border-slate-300 px-3 py-1 rounded-full font-bold flex items-center gap-1 w-max">
            <Minus className="w-3.5 h-3.5" /> Not Generated
          </Tag>
        );
      },
    },
    {
      title: 'Issued Date',
      dataIndex: 'issuedDate',
      key: 'issuedDate',
      render: (date) => (
        <div className="text-sm font-medium text-[#64748b]">
          {date}
        </div>
      ),
    },
    {
      title: 'Operations',
      key: 'operations',
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          {record.status === 'Issued' ? (
            <>
              <Tooltip title="Preview & Audit">
                <Button type="text" size="middle" className="text-blue-600 hover:bg-blue-50" icon={<Eye className="w-4 h-4" />} onClick={() => openPreview(record)} />
              </Tooltip>
              <Tooltip title="Email Certificate">
                <Button type="text" size="middle" className="text-slate-500 hover:bg-slate-100 border border-slate-200" icon={<Mail className="w-4 h-4" />} />
              </Tooltip>
              <Tooltip title="Reissue">
                <Button type="text" size="middle" className="text-orange-500 hover:bg-orange-50 border border-orange-200" icon={<RotateCcw className="w-4 h-4" />} />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Preview Template">
                <Button type="text" size="middle" className="text-slate-400 hover:bg-slate-100" icon={<Eye className="w-4 h-4" />} onClick={() => openPreview(record)} />
              </Tooltip>
              <Button type="primary" size="middle" className="bg-blue-600 font-semibold shadow-sm" icon={<Award className="w-4 h-4" />}>
                Generate
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ZONE 1: ACTIONS & METRICS OVERVIEW */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 p-6 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" /> Certificates Console
              </h1>
              <p className="text-[#475569] text-sm mt-1">Manage and provision official internship certificates.</p>
            </div>
            
            <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
            
            <div className="flex gap-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> Total Issued
                </p>
                <h2 className="text-xl font-extrabold text-[#0F172A]">142</h2>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Pending
                </p>
                <h2 className="text-xl font-extrabold text-[#0F172A]">24</h2>
              </div>
            </div>
          </div>

          <Button type="primary" size="large" className="bg-blue-600 rounded-lg font-semibold shadow-md shadow-blue-600/20 px-6" icon={<CopyPlus className="w-4 h-4" />}>
            Bulk Generate Certificates
          </Button>
        </div>

        {/* ZONE 2: MASTER CREDENTIAL MANAGEMENT DIRECTORY */}
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h3 className="font-bold text-lg text-[#0F172A]">Master Roster</h3>
            <p className="text-sm text-[#475569] mt-1">Granular tracking of document states. Click 'Generate' to provision a new credential.</p>
          </div>
          <Table 
            columns={columns} 
            dataSource={credentialData} 
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            size="large"
            rowClassName="hover:bg-slate-50 transition-colors"
          />
        </div>

      </div>

      {/* ZONE 3: CREDENTIAL AUDIT & PREVIEW CONSOLE */}
      <Drawer
        title={<span className="font-bold text-xl text-[#0F172A]">Certificate Verification Workspace</span>}
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{ body: {} }}
      >
        {/* Top Half: Visual Certificate Canvas */}
        <div className="flex-1 p-8 flex items-center justify-center overflow-auto bg-slate-100">
          
          <div className="w-full max-w-[700px] aspect-[1.414/1] bg-white shadow-2xl shadow-slate-400/30 border-[12px] border-[#0F172A] relative flex flex-col justify-between p-12 overflow-hidden">
            
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Award className="w-96 h-96 text-blue-900" />
            </div>

            {/* Certificate Header */}
            <div className="text-center relative z-10">
              <h1 className="text-4xl font-black text-[#0F172A] tracking-widest uppercase font-serif mb-2">Certificate of Completion</h1>
              <div className="w-32 h-1 bg-amber-500 mx-auto mb-6"></div>
              <p className="text-lg text-slate-500 italic font-serif">This is to proudly certify that</p>
            </div>

            {/* Student Name */}
            <div className="text-center relative z-10 my-8">
              <h2 className="text-5xl font-bold text-blue-900 font-serif italic mb-4">
                {selectedStudent ? selectedStudent.name : 'Student Name'}
              </h2>
              <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
                Has successfully completed the intensive internship program with a final aggregate score of 
                <strong className="text-[#0F172A] mx-1">{selectedStudent ? selectedStudent.finalScore : '--'}%</strong> 
                and has demonstrated exceptional professional capabilities.
              </p>
            </div>

            {/* Footer Signatures */}
            <div className="flex justify-between items-end relative z-10 mt-12">
              <div className="text-center">
                <div className="w-48 h-px bg-slate-400 mb-2"></div>
                <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Program Director</p>
              </div>
              
              <div className="w-24 h-24 rounded-full border-4 border-amber-500 flex items-center justify-center bg-amber-50 transform rotate-12">
                <div className="text-center">
                  <Award className="w-8 h-8 text-amber-500 mx-auto mb-1" />
                  <p className="text-[8px] font-black text-amber-700 uppercase tracking-widest">Official<br/>Seal</p>
                </div>
              </div>

              <div className="text-center">
                <div className="w-48 h-px bg-slate-400 mb-2"></div>
                <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Lead Mentor</p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Half: Utility Control Strip */}
        <div className="bg-white border-t border-slate-200 p-6 flex justify-between items-center shadow-lg">
          <div>
            <p className="text-sm font-bold text-[#0F172A]">Document Status: {selectedStudent?.status}</p>
            <p className="text-xs text-slate-500">ID: CERT-2026-{selectedStudent?.key.padStart(4, '0')}</p>
          </div>
          <div className="flex gap-4">
            <Button size="large" icon={<Eye className="w-4 h-4" />} className="font-semibold text-[#475569] border-slate-300">
              View Full Screen
            </Button>
            <Button type="primary" size="large" icon={<Download className="w-4 h-4" />} className="bg-[#0F172A] font-semibold">
              Download Archive
            </Button>
          </div>
        </div>
      </Drawer>

    </div>
  );
}
