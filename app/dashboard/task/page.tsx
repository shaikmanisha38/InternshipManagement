"use client";
import TodaysTask from '@/components/pages/TodaysTask';
import DashboardLayout from '@/components/layouts/DashboardLayout';

import { Suspense } from 'react';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Suspense fallback={<div>Loading task...</div>}>
        <TodaysTask />
      </Suspense>
    </DashboardLayout>
  );
}
