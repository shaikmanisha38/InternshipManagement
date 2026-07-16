"use client";
import Profile from '@/components/pages/Profile';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Profile />
    </DashboardLayout>
  );
}
