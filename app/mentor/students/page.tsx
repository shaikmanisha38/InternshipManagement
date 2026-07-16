"use client";
import MentorStudents from '@/components/pages/MentorStudents';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorStudents />
    </DashboardLayout>
  );
}
