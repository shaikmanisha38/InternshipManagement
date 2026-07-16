"use client";
import Leaderboard from '@/components/pages/Leaderboard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Leaderboard />
    </DashboardLayout>
  );
}
