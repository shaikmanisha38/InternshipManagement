"use client";
import MentorAssessments from '@/components/pages/MentorAssessments';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorAssessments />
    </DashboardLayout>
  );
}
