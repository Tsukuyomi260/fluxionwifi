"use client";

import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F7FA]">
      <Header onMenuToggle={() => {}} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
