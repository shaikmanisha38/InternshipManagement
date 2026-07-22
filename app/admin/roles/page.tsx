"use client";
import AdminRoles from '@/components/pages/AdminRoles';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminRoles />
    </DashboardLayout>
  );
}
