"use client";
import GithubIntegration from '@/components/pages/GithubIntegration';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <GithubIntegration />
    </DashboardLayout>
  );
}
