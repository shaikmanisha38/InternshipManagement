"use client";
import AdminSettings from '@/components/pages/AdminSettings';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminSettings />
    </DashboardLayout>
  );
}
