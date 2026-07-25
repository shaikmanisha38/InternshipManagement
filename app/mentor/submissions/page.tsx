"use client";
import MentorSubmissions from '@/components/pages/MentorSubmissions';
import DashboardLayout from '@/components/layouts/DashboardLayout';



export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorSubmissions />
    </DashboardLayout>
  );
}
