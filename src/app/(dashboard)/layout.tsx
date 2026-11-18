"use client";

import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ScrollProgressBar } from "@/components/layout/scroll-progress-bar";
import { QuickActionsFab } from "@/components/layout/quick-actions-fab";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F7FA]">
      <ScrollProgressBar />
      <Header onMenuToggle={() => {}} />
      <main className="flex-1 overflow-y-auto px-4 lg:px-6 pt-20 pb-20 lg:pb-8 scroll-smooth">
        {children}
      </main>
      <MobileNav />
      <QuickActionsFab />
    </div>
  );
}
