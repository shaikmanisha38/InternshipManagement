"use client";
import TodaysTask from '@/components/pages/TodaysTask';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <TodaysTask />
    </DashboardLayout>
  );
}
