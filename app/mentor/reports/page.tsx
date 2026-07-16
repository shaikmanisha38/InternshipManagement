"use client";
import MentorReports from '@/components/pages/MentorReports';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorReports />
    </DashboardLayout>
  );
}
