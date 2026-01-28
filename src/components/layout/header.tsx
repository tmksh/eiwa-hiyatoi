"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Bell, User, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const today = format(new Date(), "yyyy年M月d日（E）", { locale: ja });

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white/80 backdrop-blur-md px-6 border-b border-gray-100">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-xl font-bold text-gray-900">{title}</h1>}
        <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm text-amber-700">
          <CalendarDays className="h-4 w-4" />
          {today}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-amber-50">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[10px] font-bold text-white shadow-sm">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-amber-50">
          <User className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </header>
  );
}
