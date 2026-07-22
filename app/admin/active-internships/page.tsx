"use client";
import AdminActiveInternships from '@/components/pages/AdminActiveInternships';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminActiveInternships />
    </DashboardLayout>
  );
}
