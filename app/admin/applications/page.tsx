"use client";
import AdminApplications from '@/components/pages/AdminApplications';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminApplications />
    </DashboardLayout>
  );
}
