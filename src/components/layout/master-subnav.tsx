"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Building2, Truck, DollarSign, Table2, BookOpen } from "lucide-react";

const masterNavItems = [
  { name: "作業員", href: "/master/workers", icon: Users },
  { name: "会社", href: "/master/companies", icon: Building2 },
  { name: "車両", href: "/master/vehicles", icon: Truck },
  { name: "賃金ルール", href: "/master/wage-rules", icon: DollarSign },
  { name: "運賃表", href: "/master/rate-tables", icon: Table2 },
  { name: "各種マスタ", href: "/master/general", icon: BookOpen },
];

export function MasterSubnav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-slate-200/60 bg-white p-1.5">
      {masterNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
              isActive
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
