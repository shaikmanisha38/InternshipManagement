"use client";
import AdminTasks from '@/components/pages/AdminTasks';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminTasks />
    </DashboardLayout>
  );
}
