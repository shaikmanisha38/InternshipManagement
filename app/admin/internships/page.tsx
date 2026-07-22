"use client";
import AdminInternships from '@/components/pages/AdminInternships';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminInternships />
    </DashboardLayout>
  );
}
