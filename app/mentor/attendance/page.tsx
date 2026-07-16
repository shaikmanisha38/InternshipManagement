"use client";
import MentorAttendance from '@/components/pages/MentorAttendance';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout role="mentor">
      <MentorAttendance />
    </DashboardLayout>
  );
}
