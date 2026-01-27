"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data
const mockCompanies = [
  { id: "all", name: "すべての会社" },
  { id: "1", name: "A運輸株式会社" },
  { id: "2", name: "B物流株式会社" },
  { id: "3", name: "C配送センター" },
];

interface CalculationResult {
  total: number;
  success: number;
  failed: number;
  errors: { workerName: string; reason: string }[];
}

export default function CalculationsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Mock data for preview
  const previewData = {
    total: 187,
    calculable: 182,
    errors: 5,
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    setProgress(0);
    setResult(null);

    // Simulate calculation progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress(i);
    }

    // Mock result
    setResult({
      total: 182,
      success: 177,
      failed: 5,
      errors: [
        { workerName: "佐藤 花子", reason: "賃金ルール未設定（C社・10t）" },
        { workerName: "高橋 健二", reason: "退勤時間が出勤より前" },
        { workerName: "渡辺 裕子", reason: "車種未設定" },
        { workerName: "中村 達也", reason: "会社情報なし" },
        { workerName: "小林 誠", reason: "賃金ルール期限切れ" },
      ],
    });

    setIsCalculating(false);
    toast.success("一括計算が完了しました");
  };

  return (
    <MainLayout title="一括計算">
      <div className="space-y-6">
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>計算対象を選択</CardTitle>
            <CardDescription>
              計算する日報の日付と対象会社を選択してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">対象日</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date
                        ? format(date, "yyyy年M月d日", { locale: ja })
                        : "日付を選択"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">対象会社</label>
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>対象データ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">対象件数</p>
                <p className="text-3xl font-bold">{previewData.total}</p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-600">計算可能</p>
                <p className="text-3xl font-bold text-green-700">
                  {previewData.calculable}
                </p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-600">エラー（要確認）</p>
                <p className="text-3xl font-bold text-amber-700">
                  {previewData.errors}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button
                size="lg"
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full sm:w-auto"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    計算中... {progress}%
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    一括計算を実行
                  </>
                )}
              </Button>
            </div>

            {/* Progress bar */}
            {isCalculating && (
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {Math.floor((progress / 100) * previewData.calculable)} /{" "}
                  {previewData.calculable} 件処理中
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                計算完了
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Badge variant="secondary" className="text-base px-4 py-2">
                  処理件数: {result.total}
                </Badge>
                <Badge
                  variant="default"
                  className="text-base px-4 py-2 bg-green-500"
                >
                  成功: {result.success}
                </Badge>
                {result.failed > 0 && (
                  <Badge variant="destructive" className="text-base px-4 py-2">
                    失敗: {result.failed}
                  </Badge>
                )}
              </div>

              {result.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>エラー一覧</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 space-y-1">
                      {result.errors.map((error, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">{error.workerName}</span>
                          : {error.reason}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setResult(null)}>
                  閉じる
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = "/results";
                  }}
                >
                  計算結果を確認
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
