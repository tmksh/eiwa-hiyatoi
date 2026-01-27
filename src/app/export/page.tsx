"use client";

import { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Download,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockCompanies = [
  { id: "all", name: "すべての会社" },
  { id: "1", name: "A運輸株式会社" },
  { id: "2", name: "B物流株式会社" },
  { id: "3", name: "C配送センター" },
];

const exportFormats = [
  { id: "csv", name: "CSV", description: "カンマ区切りテキスト" },
  { id: "xlsx", name: "Excel", description: "Microsoft Excel形式" },
];

export default function ExportPage() {
  const [dateFrom, setDateFrom] = useState<Date>(startOfMonth(new Date()));
  const [dateTo, setDateTo] = useState<Date>(endOfMonth(new Date()));
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [includeDetails, setIncludeDetails] = useState(true);
  const [onlyConfirmed, setOnlyConfirmed] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Mock export data summary
  const exportSummary = {
    totalRecords: 187,
    confirmedRecords: 165,
    totalAmount: 2340000,
  };

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsExporting(false);
    toast.success("ファイルをダウンロードしました", {
      description: `${onlyConfirmed ? exportSummary.confirmedRecords : exportSummary.totalRecords}件のデータをエクスポートしました`,
    });
  };

  return (
    <MainLayout title="CSV出力">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Export Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>出力条件</CardTitle>
                <CardDescription>
                  エクスポートするデータの条件を指定してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Range */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>開始日</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(dateFrom, "yyyy年M月d日", { locale: ja })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={(d) => d && setDateFrom(d)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>終了日</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(dateTo, "yyyy年M月d日", { locale: ja })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={(d) => d && setDateTo(d)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Quick Date Selections */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDateFrom(startOfMonth(new Date()));
                      setDateTo(endOfMonth(new Date()));
                    }}
                  >
                    今月
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lastMonth = subDays(startOfMonth(new Date()), 1);
                      setDateFrom(startOfMonth(lastMonth));
                      setDateTo(endOfMonth(lastMonth));
                    }}
                  >
                    先月
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDateFrom(subDays(new Date(), 7));
                      setDateTo(new Date());
                    }}
                  >
                    過去7日
                  </Button>
                </div>

                {/* Company Filter */}
                <div className="space-y-2">
                  <Label>対象会社</Label>
                  <Select
                    value={selectedCompany}
                    onValueChange={setSelectedCompany}
                  >
                    <SelectTrigger>
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

                {/* Format Selection */}
                <div className="space-y-2">
                  <Label>出力形式</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {exportFormats.map((format) => (
                      <div
                        key={format.id}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                          selectedFormat === format.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                        )}
                        onClick={() => setSelectedFormat(format.id)}
                      >
                        <FileSpreadsheet
                          className={cn(
                            "h-8 w-8",
                            selectedFormat === format.id
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                        <div>
                          <p className="font-medium">{format.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {format.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <Label>オプション</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeDetails"
                        checked={includeDetails}
                        onCheckedChange={(checked) =>
                          setIncludeDetails(checked as boolean)
                        }
                      />
                      <Label htmlFor="includeDetails" className="cursor-pointer">
                        計算詳細を含める（残業内訳、手当内訳など）
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="onlyConfirmed"
                        checked={onlyConfirmed}
                        onCheckedChange={(checked) =>
                          setOnlyConfirmed(checked as boolean)
                        }
                      />
                      <Label htmlFor="onlyConfirmed" className="cursor-pointer">
                        確定済みデータのみ出力
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Summary & Action */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">出力プレビュー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">対象期間</span>
                    <span className="font-medium">
                      {format(dateFrom, "M/d")} 〜 {format(dateTo, "M/d")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">対象件数</span>
                    <span className="font-medium">
                      {onlyConfirmed
                        ? exportSummary.confirmedRecords
                        : exportSummary.totalRecords}
                      件
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">合計金額</span>
                    <span className="font-medium">
                      ¥{exportSummary.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">出力形式</span>
                    <Badge variant="secondary">
                      {selectedFormat.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    "エクスポート中..."
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      ダウンロード
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Export History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">最近のエクスポート</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "2024/01/27 15:30", records: 165, format: "CSV" },
                    { date: "2024/01/20 10:15", records: 180, format: "Excel" },
                    { date: "2024/01/15 09:00", records: 142, format: "CSV" },
                  ].map((history, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{history.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {history.records}件
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {history.format}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
