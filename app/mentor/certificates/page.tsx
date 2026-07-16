"use client";
import MentorCertificates from '@/components/pages/MentorCertificates';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorCertificates />
    </DashboardLayout>
  );
}
