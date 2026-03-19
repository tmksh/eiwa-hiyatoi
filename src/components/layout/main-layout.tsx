"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function MainLayout({ children, title, subtitle, actions }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div
        className="transition-all duration-300"
        style={{ paddingLeft: collapsed ? "3.5rem" : "16rem" }}
      >
        <Header
          title={title}
          subtitle={subtitle}
          actions={actions}
          onMenuToggle={() => setMobileOpen((prev) => !prev)}
        />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
