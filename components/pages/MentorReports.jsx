"use client";
import React, { useState } from 'react';
import { 
  Card, Button, Select, Checkbox, Progress, Tag, message, Spin, Empty 
} from 'antd';
import { 
  FileSpreadsheet, FileText, Download, TrendingUp, Clock, CheckCircle2, 
  BrainCircuit, Layout, UserSearch, Target, Users, AlertCircle, Award
} from 'lucide-react';
import useSWR from 'swr';

const { Option } = Select;

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

export default function MentorReports() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedVectors, setSelectedVectors] = useState([]);
  const [generatingCustom, setGeneratingCustom] = useState(false);

  // SWR for students list
  const { data: studentsData, isLoading: studentsLoading } = useSWR('/api/v1/mentor/students', fetcher);
  const studentsList = studentsData?.data || [];

  // SWR for weekly snapshot
  const { data: snapshotData, isLoading: snapshotLoading } = useSWR('/api/v1/mentor/reports/snapshot', fetcher, { refreshInterval: 5000 });

  const reportTypes = [
    {
      id: 'student-progress',
      title: 'Student Progress',
      desc: 'Overall completion tracking logs',
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      color: 'blue'
    },
    {
      id: 'attendance',
      title: 'Attendance Report',
      desc: 'Clock-in and active hours matrices',
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      color: 'emerald'
    },
    {
      id: 'assessments',
      title: 'Assessment Report',
      desc: 'Quiz marks and code execution ratings',
      icon: <CheckCircle2 className="w-5 h-5 text-indigo-500" />,
      color: 'indigo'
    },
    {
      id: 'ai-performance',
      title: 'AI Performance',
      desc: 'Qualitative automated feedback aggregates',
      icon: <BrainCircuit className="w-5 h-5 text-purple-500" />,
      color: 'purple'
    },
    {
      id: 'projects',
      title: 'Project Completion',
      desc: 'Internship milestone data tracks',
      icon: <Layout className="w-5 h-5 text-amber-500" />,
      color: 'amber'
    }
  ];

  const handleExport = (type, format) => {
    window.open(`/api/v1/mentor/reports/export?type=${type}&format=${format}`, '_blank');
  };

  const handleGenerateCustom = async () => {
    if (!selectedStudent) {
      return message.error('Please select a student first');
    }
    if (selectedVectors.length === 0) {
      return message.error('Please select at least one data vector');
    }

    setGeneratingCustom(true);
    try {
      const res = await fetch('/api/v1/mentor/reports/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent,
          vectors: selectedVectors
        })
      });

      if (!res.ok) throw new Error('Failed to generate report');
      
      const data = await res.json();
      
      // Create a downloadable JSON file
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `custom_report_${selectedStudent}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      message.success('Custom report generated successfully');
    } catch (err) {
      message.error('An error occurred while generating the report');
    } finally {
      setGeneratingCustom(false);
    }
  };

  return (
    <div className="-m-8 p-8 bg-[#F0F4F8] min-h-[calc(100vh-5rem)] font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Reports & Exports Center</h1>
          <p className="text-[#475569]">Package and extract granular program data and analytics.</p>
        </div>

        {/* MODULE 1: BULK CURRICULUM COHORT GENERATOR */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" /> Bulk Cohort Generator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {reportTypes.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className={`w-10 h-10 rounded-lg bg-${report.color}-50 border border-${report.color}-100 flex items-center justify-center mb-4`}>
                    {report.icon}
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-1">{report.title}</h3>
                  <p className="text-xs text-slate-500 leading-snug">{report.desc}</p>
                </div>
                <div className="bg-slate-50 border-t border-slate-100 p-2 flex justify-between items-center px-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Export As:</span>
                  <div className="flex gap-1">
                    <Button onClick={() => handleExport(report.id, 'xlsx')} type="text" size="small" className="text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-bold text-[10px] px-2 h-6" icon={<FileSpreadsheet className="w-3 h-3" />}>
                      XLSX
                    </Button>
                    <Button onClick={() => handleExport(report.id, 'csv')} type="text" size="small" className="text-slate-600 hover:bg-slate-200 hover:text-slate-700 font-bold text-[10px] px-2 h-6" icon={<FileText className="w-3 h-3" />}>
                      CSV
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* MODULE 2: GRANULAR INDIVIDUAL STUDENT LEDGER */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <UserSearch className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-lg text-[#0F172A]">Custom Student Report Builder</h2>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#334155] mb-2">Select Student</label>
                <Select 
                  showSearch
                  placeholder="Search by name, email, or ID..."
                  size="large"
                  className="w-full"
                  loading={studentsLoading}
                  value={selectedStudent}
                  onChange={setSelectedStudent}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  options={studentsList.map(s => ({ value: s.studentId, label: `${s.name} (${s.email})` }))}
                />
              </div>

              <div className="mb-8 flex-1">
                <label className="block text-sm font-bold text-[#334155] mb-4">Select Data Vectors</label>
                <Checkbox.Group className="w-full flex flex-col gap-3" value={selectedVectors} onChange={setSelectedVectors}>
                  <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <Checkbox value="profile" className="font-semibold text-[#0F172A]">
                      Profile Overview & Final Score <span className="block text-xs font-normal text-[#475569] mt-0.5 ml-6">Primary student identity markers and aggregate grade.</span>
                    </Checkbox>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <Checkbox value="attendance" className="font-semibold text-[#0F172A]">
                      Attendance Logs & GitHub Activity Stream <span className="block text-xs font-normal text-[#475569] mt-0.5 ml-6">Active engagement records and code commit history.</span>
                    </Checkbox>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <Checkbox value="progress" className="font-semibold text-[#0F172A]">
                      AI Feedback Diagnostics & Assessment Breakdown <span className="block text-xs font-normal text-[#475569] mt-0.5 ml-6">Granular code review notes and quiz results.</span>
                    </Checkbox>
                  </div>
                </Checkbox.Group>
              </div>

              <Button onClick={handleGenerateCustom} loading={generatingCustom} type="primary" size="large" className="bg-blue-600 w-full h-12 font-bold text-base shadow-md shadow-blue-600/20" icon={<FileText className="w-5 h-5" />}>
                Generate Custom JSON Report
              </Button>
            </div>
          </div>

          {/* MODULE 3: SYSTEMIC WEEKLY SNAPSHOT AUDIT */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm shadow-blue-900/5 border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg text-[#0F172A]">Weekly Snapshot Summary</h2>
                <p className="text-xs text-[#475569] mt-1">Live systemic performance cycle audit.</p>
              </div>
              {snapshotLoading && <Spin size="small" />}
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-6">
              
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Tasks Completed
                </p>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-extrabold text-[#0F172A] text-xl">{snapshotData?.tasksCompleted || 0}</span>
                  <span className="text-sm font-semibold text-slate-400">/ {snapshotData?.tasksTarget || 200} This Week</span>
                </div>
                <Progress percent={Math.round(((snapshotData?.tasksCompleted || 0)/(snapshotData?.tasksTarget || 200))*100)} showInfo={false} strokeColor="#3b82f6" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" /> Students Active
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-[#0F172A] text-2xl">{snapshotData?.studentsActive || 0}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Current Session</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Pending Reviews
                </p>
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex justify-between items-center">
                  <span className="font-extrabold text-amber-600 text-xl">{snapshotData?.pendingReviews || 0}</span>
                  <span className="text-xs font-bold text-amber-700">Immediate Action Required</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" /> Certificates Issued
                </p>
                <Tag color="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5 rounded-full font-bold text-sm m-0">
                  {snapshotData?.certificatesIssued || 0} Completions This Week
                </Tag>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
