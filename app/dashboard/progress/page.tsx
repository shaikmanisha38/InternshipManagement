"use client";
import Progress from '@/components/pages/Progress';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Progress />
    </DashboardLayout>
  );
}
