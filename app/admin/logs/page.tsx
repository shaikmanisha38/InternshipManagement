"use client";
import AdminLogs from '@/components/pages/AdminLogs';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminLogs />
    </DashboardLayout>
  );
}
