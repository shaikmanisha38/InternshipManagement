"use client";
import Roadmap from '@/components/pages/Roadmap';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Roadmap />
    </DashboardLayout>
  );
}
