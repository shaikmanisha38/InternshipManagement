"use client";
import MyInternship from '@/components/pages/MyInternship';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <MyInternship />
    </DashboardLayout>
  );
}
