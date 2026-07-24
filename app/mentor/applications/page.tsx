"use client";
import MentorApplications from '@/components/pages/MentorApplications';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorApplications />
    </DashboardLayout>
  );
}
