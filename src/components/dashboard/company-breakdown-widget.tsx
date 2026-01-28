"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const companyBreakdown = [
  { name: "A運輸株式会社", amount: 2150000, workers: 85, color: "from-rose-400 to-rose-500" },
  { name: "B物流株式会社", amount: 1480000, workers: 52, color: "from-violet-400 to-violet-500" },
  { name: "C配送センター", amount: 890000, workers: 35, color: "from-blue-400 to-blue-500" },
  { name: "D運送", amount: 330000, workers: 15, color: "from-emerald-400 to-emerald-500" },
];

const total = companyBreakdown.reduce((sum, c) => sum + c.amount, 0);

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function CompanyBreakdownWidget() {
  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          会社別支給額
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {companyBreakdown.map((company, index) => {
          const percentage = (company.amount / total) * 100;
          return (
            <div key={company.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={cn("h-3 w-3 rounded-full bg-gradient-to-br", company.color)} />
                  <span className="font-medium text-gray-700">{company.name}</span>
                  <span className="text-xs text-gray-400">({company.workers}名)</span>
                </div>
                <span className="font-semibold text-gray-900">¥{formatCurrency(company.amount)}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full bg-gradient-to-r", company.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div className="pt-3 mt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">合計</span>
            <span className="text-lg font-bold text-gray-900">¥{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

