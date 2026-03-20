"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, Receipt, User, HardHat } from "lucide-react";

const navigation = [
  {
    name: "日報入力",
    href: "/employee/report",
    icon: FileText,
  },
  {
    name: "支払明細",
    href: "/employee/payslip",
    icon: Receipt,
  },
];

interface EmployeeLayoutProps {
  children: React.ReactNode;
  workerName?: string;
}

export function EmployeeLayout({ children, workerName = "山田 太郎" }: EmployeeLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 shadow-lg shadow-slate-300/50">
                <HardHat className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base text-gray-900">従業員ポータル</span>
                <p className="text-xs text-gray-500">栄和清運株式会社</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5">
              <User className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">{workerName}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-slate-200 pb-safe">
        <div className="mx-auto max-w-lg">
          <div className="flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1.5 py-3 text-sm font-bold transition-all",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 hover:text-blue-500"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                    isActive
                      ? "bg-slate-800 shadow-lg shadow-slate-300/50"
                      : "bg-gray-100"
                  )}>
                    <item.icon className={cn(
                      "h-5 w-5",
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
