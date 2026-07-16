"use client";
import Assessment from '@/components/pages/Assessment';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Assessment />
    </DashboardLayout>
  );
}
