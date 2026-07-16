"use client";
import DailySubmission from '@/components/pages/DailySubmission';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <DailySubmission />
    </DashboardLayout>
  );
}
