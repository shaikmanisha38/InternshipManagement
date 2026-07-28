"use client";
import DayLearning from '@/components/pages/DayLearning';
import DashboardLayout from '@/components/layouts/DashboardLayout';

import { Suspense } from 'react';

export default function Page() {
  return (
    <DashboardLayout role="student">
      <Suspense fallback={<div>Loading...</div>}>
        <DayLearning />
      </Suspense>
    </DashboardLayout>
  );
}
