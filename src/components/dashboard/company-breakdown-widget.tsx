"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const companyBreakdown = [
  { name: "A運輸株式会社", amount: 2150000, workers: 85, color: "bg-slate-700" },
  { name: "B物流株式会社", amount: 1480000, workers: 52, color: "bg-blue-400" },
  { name: "C配送センター", amount: 890000, workers: 35, color: "bg-slate-400" },
  { name: "D運送", amount: 330000, workers: 15, color: "bg-blue-200" },
];

const total = companyBreakdown.reduce((sum, c) => sum + c.amount, 0);

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function CompanyBreakdownWidget() {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
          <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center">
            <Building2 className="h-3.5 w-3.5 text-slate-600" />
          </div>
          会社別支給額
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {companyBreakdown.map((company) => {
          const percentage = (company.amount / total) * 100;
          return (
            <div key={company.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className={cn("h-2 w-2 rounded-full", company.color)} />
                  <span className="font-medium text-slate-700">{company.name}</span>
                  <span className="text-slate-400">({company.workers}名)</span>
                </div>
                <span className="font-semibold text-slate-900 tabular-nums">¥{formatCurrency(company.amount)}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", company.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="pt-2.5 mt-2.5 border-t border-white/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">合計</span>
            <span className="text-sm font-bold text-slate-900">¥{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
