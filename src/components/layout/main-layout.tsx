"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
      <Sidebar />
      <div className="pl-72">
        <Header title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
