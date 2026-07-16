"use client";
import MentorLeaderboard from '@/components/pages/MentorLeaderboard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorLeaderboard />
    </DashboardLayout>
  );
}
