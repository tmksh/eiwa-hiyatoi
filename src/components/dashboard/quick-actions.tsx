"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calculator, ClipboardList, Download } from "lucide-react";

const actions = [
  {
    name: "日報入力",
    description: "本日の日報を入力",
    href: "/daily-reports/new",
    icon: FileText,
    variant: "default" as const,
  },
  {
    name: "一括計算",
    description: "選択した日報を計算",
    href: "/calculations",
    icon: Calculator,
    variant: "default" as const,
  },
  {
    name: "結果確認",
    description: "計算結果を確認・修正",
    href: "/results",
    icon: ClipboardList,
    variant: "default" as const,
  },
  {
    name: "CSV出力",
    description: "給与データをエクスポート",
    href: "/export",
    icon: Download,
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">クイックアクション</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Button
                variant={action.variant}
                className="h-auto w-full flex-col gap-2 py-4"
              >
                <action.icon className="h-6 w-6" />
                <span className="font-medium">{action.name}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {action.description}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
