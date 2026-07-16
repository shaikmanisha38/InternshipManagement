"use client";
import AIFeedback from '@/components/pages/AIFeedback';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <AIFeedback />
    </DashboardLayout>
  );
}
