"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const today = format(new Date(), "yyyy年M月d日（E）", { locale: ja });

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {title && (
            <div>
              <h1 className="text-lg font-bold text-slate-900">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="mr-2 text-xs text-slate-400">{today}</span>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-500" />
          </Button>
          <div className="ml-1.5 h-7 w-7 rounded-full bg-slate-700 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-white" />
          </div>

          {actions && <div className="ml-3 flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
