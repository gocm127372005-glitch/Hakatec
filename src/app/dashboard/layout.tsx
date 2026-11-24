import { Suspense } from "react";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AuthBanner } from "@/components/dashboard/AuthBanner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell banner={<Suspense fallback={null}><AuthBanner /></Suspense>}>
      {children}
    </DashboardShell>
  );
}
