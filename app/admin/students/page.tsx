"use client";
import AdminStudents from '@/components/pages/AdminStudents';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminStudents />
    </DashboardLayout>
  );
}
