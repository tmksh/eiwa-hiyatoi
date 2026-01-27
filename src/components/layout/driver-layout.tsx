"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, History, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                永
              </div>
              <span className="font-semibold">日報システム</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{workerName}</span>
              </div>
              <Link href="/driver/login">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white pb-safe">
        <div className="mx-auto max-w-lg">
          <div className="flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
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
