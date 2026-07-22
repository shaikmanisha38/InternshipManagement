"use client";
import AdminCertificates from '@/components/pages/AdminCertificates';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <AdminCertificates />
    </DashboardLayout>
  );
}
