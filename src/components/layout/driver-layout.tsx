"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, History, User, Truck } from "lucide-react";

const navigation = [
  {
    name: "日報入力",
    href: "/driver/report",
    icon: FileText,
  },
  {
    name: "勤務履歴",
    href: "/driver/history",
    icon: History,
  },
];

interface DriverLayoutProps {
  children: React.ReactNode;
  workerName?: string;
}

export function DriverLayout({ children, workerName = "山田 太郎" }: DriverLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 shadow-lg shadow-slate-300/50">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-gray-900">日報システム</span>
                <p className="text-sm text-gray-500">栄和清運株式会社</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
                <User className="h-5 w-5 text-slate-600" />
                <span className="text-base font-semibold text-slate-700">{workerName}</span>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-slate-200 pb-safe">
        <div className="mx-auto max-w-lg">
          <div className="flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 py-4 text-base font-bold transition-all",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 hover:text-blue-500"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                    isActive
                      ? "bg-slate-800 shadow-lg shadow-slate-300/50"
                      : "bg-gray-100"
                  )}>
                    <item.icon className={cn(
                      "h-6 w-6",
                      isActive ? "text-white" : "text-gray-400"
                    )} />
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
