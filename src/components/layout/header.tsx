"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onMenuToggle?: () => void;
}

export function Header({ title, subtitle, actions, onMenuToggle }: HeaderProps) {
  const today = format(new Date(), "yyyy年M月d日（E）", { locale: ja });

  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuToggle}
            className="rounded-xl p-1.5 text-slate-500 hover:bg-white/50 hover:text-slate-700 lg:hidden transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {title && (
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">{title}</h1>
              {subtitle && <p className="text-xs text-slate-400 truncate hidden sm:block">{subtitle}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="mr-2 text-xs text-slate-400 hidden sm:inline">{today}</span>

          <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-xl text-slate-500 hover:bg-white/50 hover:text-slate-700">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white/50" />
          </Button>
          <div className="ml-1.5 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-600/80 flex items-center justify-center ring-2 ring-white/40 shadow-sm">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-slate-700 leading-tight">管理者</p>
              <p className="text-[11px] text-slate-400 leading-tight">admin@eiwa.co.jp</p>
            </div>
          </div>

          {actions && <div className="ml-3 flex items-center gap-2 max-sm:hidden">{actions}</div>}
        </div>
      </div>
      {/* Mobile actions row */}
      {actions && (
        <div className="flex items-center gap-2 px-4 pb-3 sm:hidden">
          {actions}
        </div>
      )}
    </header>
  );
}
