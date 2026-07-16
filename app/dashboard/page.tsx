"use client";
import DashboardHome from '@/components/pages/DashboardHome';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <DashboardHome />
    </DashboardLayout>
  );
}
