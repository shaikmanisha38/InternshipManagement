"use client";
import DayLearning from '@/components/pages/DayLearning';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <DayLearning />
    </DashboardLayout>
  );
}
