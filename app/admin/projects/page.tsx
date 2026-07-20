"use client";
import PlaceholderPage from '@/components/pages/PlaceholderPage';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="admin">
      <PlaceholderPage title="Admin projects" />
    </DashboardLayout>
  );
}
