"use client";
import Attendance from '@/components/pages/Attendance';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Attendance />
    </DashboardLayout>
  );
}
