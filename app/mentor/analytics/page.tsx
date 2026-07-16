"use client";
import MentorAnalytics from '@/components/pages/MentorAnalytics';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorAnalytics />
    </DashboardLayout>
  );
}
