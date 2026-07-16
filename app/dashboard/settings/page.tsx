"use client";
import Settings from '@/components/pages/Settings';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Settings />
    </DashboardLayout>
  );
}
