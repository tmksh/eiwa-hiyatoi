"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const today = format(new Date(), "yyyy年M月d日（E）", { locale: ja });

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
        <span className="text-sm text-muted-foreground">{today}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
