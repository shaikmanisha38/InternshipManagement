"use client";
import Badges from '@/components/pages/Badges';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Badges />
    </DashboardLayout>
  );
}
