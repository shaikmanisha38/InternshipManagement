"use client";
import MentorOverview from '@/components/pages/MentorOverview';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorOverview />
    </DashboardLayout>
  );
}
