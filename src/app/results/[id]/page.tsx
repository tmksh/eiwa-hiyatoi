"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "@/components/ui/status-badge";
import {
  ArrowLeft,
  User,
  Building,
  Truck,
  Clock,
  Calculator,
  RefreshCw,
  CheckCircle,
  History,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockResult = {
  id: "1",
  workDate: new Date("2024-01-28"),
  worker: {
    id: "1",
    name: "山田 太郎",
    employeeCode: "E001",
  },
  company: {
    id: "1",
    name: "A運輸株式会社",
  },
  vehicleType: {
    id: "2",
    name: "4tトラック",
  },
  startTime: "08:00",
  endTime: "19:30",
  breakMinutes: 60,
  isHoliday: false,
  isNightShift: false,
  status: "calculated" as Status,

  // Calculation results
  calculation: {
    workMinutes: 630,
    overtimeMinutes: 150,
    nightMinutes: 0,
    baseWage: 11000,
    overtimeWage: 3750,
    nightWage: 0,
    holidayWage: 0,
    restraintAllowance: 0,
    otherAllowances: 0,
    totalWage: 14750,
    calculatedAt: new Date("2024-01-28T10:30:00"),
    version: 1,
  },

  // Calculation log
  calculationLog: [
    { step: "ルール取得", detail: "A運輸株式会社 / 4tトラック" },
    { step: "実労働時間計算", value: "10.5時間 (630分)" },
    { step: "残業時間計算", value: "2.5時間 (150分)", note: "15分単位・切り捨て" },
    { step: "基本給", value: "¥11,000" },
    { step: "残業代計算", value: "¥3,750", note: "¥1,500/h × 2.5h" },
    { step: "合計", value: "¥14,750" },
  ],
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const result = mockResult; // In real app, fetch by id

  const handleRecalculate = () => {
    toast.success("再計算を実行しました");
  };

  const handleConfirm = () => {
    toast.success("計算結果を確定しました");
  };

  return (
    <MainLayout title="計算結果詳細">
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {format(result.workDate, "yyyy年M月d日（E）", {
                        locale: ja,
                      })}
                    </CardTitle>
                    <CardDescription>日報ID: {id}</CardDescription>
                  </div>
                  <StatusBadge status={result.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">作業員</p>
                      <p className="font-medium">{result.worker.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.worker.employeeCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">派遣先</p>
                      <p className="font-medium">{result.company.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">車種</p>
                      <p className="font-medium">{result.vehicleType.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">勤務時間</p>
                      <p className="font-medium">
                        {result.startTime} 〜 {result.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        休憩 {result.breakMinutes}分
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {result.isHoliday && <Badge variant="outline">休日出勤</Badge>}
                  {result.isNightShift && (
                    <Badge variant="outline">深夜勤務</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Calculation Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  計算詳細
                </CardTitle>
                <CardDescription>
                  計算バージョン: {result.calculation.version} /{" "}
                  {format(result.calculation.calculatedAt, "yyyy/MM/dd HH:mm")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Time breakdown */}
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="font-medium mb-3">時間内訳</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {(result.calculation.workMinutes / 60).toFixed(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          実労働時間
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {(result.calculation.overtimeMinutes / 60).toFixed(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">残業時間</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {(result.calculation.nightMinutes / 60).toFixed(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">深夜時間</p>
                      </div>
                    </div>
                  </div>

                  {/* Wage breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span>基本給</span>
                      <span className="font-mono">
                        {formatCurrency(result.calculation.baseWage)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>残業手当</span>
                      <span className="font-mono">
                        {formatCurrency(result.calculation.overtimeWage)}
                      </span>
                    </div>
                    {result.calculation.nightWage > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span>深夜手当</span>
                        <span className="font-mono">
                          {formatCurrency(result.calculation.nightWage)}
                        </span>
                      </div>
                    )}
                    {result.calculation.holidayWage > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span>休日手当</span>
                        <span className="font-mono">
                          {formatCurrency(result.calculation.holidayWage)}
                        </span>
                      </div>
                    )}
                    {result.calculation.restraintAllowance > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span>拘束手当</span>
                        <span className="font-mono">
                          {formatCurrency(result.calculation.restraintAllowance)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 font-bold text-lg">
                      <span>合計</span>
                      <span className="font-mono text-primary">
                        {formatCurrency(result.calculation.totalWage)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  計算ログ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.calculationLog.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{log.step}</p>
                        {log.value && (
                          <p className="text-muted-foreground">{log.value}</p>
                        )}
                        {log.note && (
                          <p className="text-xs text-muted-foreground">
                            {log.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">アクション</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={handleConfirm}
                  disabled={result.status === "confirmed"}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  確定する
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRecalculate}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  再計算
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(`/daily-reports/${result.id}/edit`)
                  }
                >
                  日報を編集
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">適用ルール</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">基本日給</span>
                  <span className="font-mono">¥11,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">基本時間</span>
                  <span>8時間</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">残業単価</span>
                  <span className="font-mono">¥1,500/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">残業単位</span>
                  <span>15分（切り捨て）</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
