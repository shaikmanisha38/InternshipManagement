"use client";
import Certificates from '@/components/pages/Certificates';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Certificates />
    </DashboardLayout>
  );
}
