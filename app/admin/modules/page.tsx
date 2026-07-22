"use client";
import AdminModules from '@/components/pages/AdminModules';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminModules />
    </DashboardLayout>
  );
}
