"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const pendingApprovals = [
  {
    id: "1",
    workerName: "山田 太郎",
    company: "A運輸",
    submittedAt: "19:35",
    startTime: "08:00",
    endTime: "19:30",
  },
  {
    id: "2",
    workerName: "鈴木 一郎",
    company: "A運輸",
    submittedAt: "18:05",
    startTime: "07:00",
    endTime: "18:00",
  },
  {
    id: "3",
    workerName: "佐藤 花子",
    company: "B物流",
    submittedAt: "20:10",
    startTime: "06:00",
    endTime: "20:00",
  },
];

export function PendingApprovalsWidget() {
  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
          承認待ち日報
        </CardTitle>
        <Link href="/daily-reports?status=submitted">
          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1">
            すべて表示
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingApprovals.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">承認待ちの日報はありません</p>
        ) : (
          pendingApprovals.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-gradient-to-br from-amber-200 to-amber-300">
                  <AvatarFallback className="text-amber-700 font-medium">
                    {item.workerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{item.workerName}</p>
                  <p className="text-xs text-gray-500">
                    {item.company} • {item.startTime}〜{item.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{item.submittedAt}提出</span>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-100">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

