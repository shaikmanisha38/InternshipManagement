"use client";
import AdminDashboard from '@/components/pages/AdminDashboard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminDashboard />
    </DashboardLayout>
  );
}
