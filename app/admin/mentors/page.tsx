"use client";
import AdminMentors from '@/components/pages/AdminMentors';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminMentors />
    </DashboardLayout>
  );
}
