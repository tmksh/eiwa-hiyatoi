"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function MainLayout({ children, title, subtitle, actions }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Sidebar />
      <div className="pl-64">
        <Header title={title} subtitle={subtitle} actions={actions} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
