"use client";
import MentorProjects from '@/components/pages/MentorProjects';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorProjects />
    </DashboardLayout>
  );
}
