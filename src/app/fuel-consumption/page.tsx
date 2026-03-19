"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, Truck, TrendingUp, Download, Search, Filter, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const fuelRecords = [
  { id: "1", date: "2026-03-19", vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", driver: "山田 太郎", distance: 128.5, fuelAmount: 32.1, fuelEfficiency: 4.0, cost: 5136, station: "出光 川崎SS" },
  { id: "2", date: "2026-03-19", vehicleNumber: "品川 200 い 5678", vehicleType: "10t", driver: "鈴木 一郎", distance: 186.3, fuelAmount: 62.1, fuelEfficiency: 3.0, cost: 9936, station: "ENEOS 品川SS" },
  { id: "3", date: "2026-03-18", vehicleNumber: "品川 300 う 9012", vehicleType: "2t", driver: "佐藤 花子", distance: 85.2, fuelAmount: 14.2, fuelEfficiency: 6.0, cost: 2272, station: "出光 川崎SS" },
  { id: "4", date: "2026-03-18", vehicleNumber: "品川 100 え 3456", vehicleType: "4t", driver: "高橋 健二", distance: 145.0, fuelAmount: 36.3, fuelEfficiency: 4.0, cost: 5808, station: "ENEOS 横浜SS" },
  { id: "5", date: "2026-03-17", vehicleNumber: "品川 200 お 7890", vehicleType: "10t", driver: "田中 次郎", distance: 210.5, fuelAmount: 70.2, fuelEfficiency: 3.0, cost: 11232, station: "コスモ 東京SS" },
  { id: "6", date: "2026-03-17", vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", driver: "山田 太郎", distance: 98.3, fuelAmount: 24.6, fuelEfficiency: 4.0, cost: 3936, station: "出光 川崎SS" },
  { id: "7", date: "2026-03-16", vehicleNumber: "品川 300 う 9012", vehicleType: "2t", driver: "渡辺 三郎", distance: 72.1, fuelAmount: 12.0, fuelEfficiency: 6.0, cost: 1920, station: "ENEOS 品川SS" },
  { id: "8", date: "2026-03-16", vehicleNumber: "品川 200 い 5678", vehicleType: "10t", driver: "鈴木 一郎", distance: 195.8, fuelAmount: 65.3, fuelEfficiency: 3.0, cost: 10448, station: "コスモ 東京SS" },
];

const vehicleSummary = [
  { vehicleNumber: "品川 100 あ 1234", vehicleType: "4t", totalDistance: 1850.2, totalFuel: 462.6, avgEfficiency: 4.0, totalCost: 74016, rank: 1 },
  { vehicleNumber: "品川 200 い 5678", vehicleType: "10t", totalDistance: 3120.5, totalFuel: 1040.2, avgEfficiency: 3.0, totalCost: 166432, rank: 3 },
  { vehicleNumber: "品川 300 う 9012", vehicleType: "2t", totalDistance: 1280.0, totalFuel: 213.3, avgEfficiency: 6.0, totalCost: 34128, rank: 1 },
  { vehicleNumber: "品川 100 え 3456", vehicleType: "4t", totalDistance: 1920.8, totalFuel: 480.2, avgEfficiency: 4.0, totalCost: 76832, rank: 2 },
  { vehicleNumber: "品川 200 お 7890", vehicleType: "10t", totalDistance: 2850.3, totalFuel: 950.1, avgEfficiency: 3.0, totalCost: 152016, rank: 2 },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 }).format(value);
}

export default function FuelConsumptionPage() {
  const [tab, setTab] = useState<"records" | "vehicles">("records");

  const totalFuel = fuelRecords.reduce((sum, r) => sum + r.fuelAmount, 0);
  const totalCost = fuelRecords.reduce((sum, r) => sum + r.cost, 0);
  const totalDistance = fuelRecords.reduce((sum, r) => sum + r.distance, 0);
  const avgEfficiency = totalDistance / totalFuel;

  return (
    <MainLayout title="燃費集計" subtitle="車両別の燃料消費量・燃費の管理・集計">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Fuel className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">今月の燃料使用量</p>
                  <p className="text-2xl font-bold text-slate-900">{totalFuel.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">L</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">平均燃費</p>
                  <p className="text-2xl font-bold text-slate-900">{avgEfficiency.toFixed(1)}<span className="text-sm text-slate-400 ml-0.5">km/L</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Truck className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">総走行距離</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(Math.round(totalDistance))}<span className="text-sm text-slate-400 ml-0.5">km</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Fuel className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">燃料費合計</p>
                  <p className="text-2xl font-bold text-slate-900">¥{formatCurrency(totalCost)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setTab("records")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === "records" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              給油記録
            </button>
            <button
              onClick={() => setTab("vehicles")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === "vehicles" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              車両別集計
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200">
              <Download className="h-3.5 w-3.5" />
              CSV出力
            </Button>
            <Button size="sm" className="gap-1.5 bg-slate-800 hover:bg-slate-900 text-white">
              <Plus className="h-3.5 w-3.5" />
              給油記録追加
            </Button>
          </div>
        </div>

        {/* Records Table */}
        {tab === "records" && (
          <Card className="border-slate-200/60 shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">日付</th>
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">車両番号</th>
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">車種</th>
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">ドライバー</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">走行距離</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">給油量</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">燃費</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">金額</th>
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">給油所</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelRecords.map((record) => (
                      <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 text-slate-700">{record.date}</td>
                        <td className="py-3 text-xs text-slate-600">{record.vehicleNumber}</td>
                        <td className="py-3">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{record.vehicleType}</span>
                        </td>
                        <td className="py-3 font-medium text-slate-900">{record.driver}</td>
                        <td className="py-3 text-right tabular-nums text-slate-700">{record.distance} km</td>
                        <td className="py-3 text-right tabular-nums font-medium text-slate-900">{record.fuelAmount} L</td>
                        <td className="py-3 text-right tabular-nums text-slate-600">{record.fuelEfficiency.toFixed(1)} km/L</td>
                        <td className="py-3 text-right tabular-nums font-medium text-slate-900">¥{formatCurrency(record.cost)}</td>
                        <td className="py-3 text-xs text-slate-500">{record.station}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-200">
                      <td colSpan={4} className="py-3 text-sm font-medium text-slate-700">合計</td>
                      <td className="py-3 text-right tabular-nums font-bold text-slate-900">{totalDistance.toFixed(1)} km</td>
                      <td className="py-3 text-right tabular-nums font-bold text-slate-900">{totalFuel.toFixed(1)} L</td>
                      <td className="py-3 text-right tabular-nums font-medium text-slate-600">{avgEfficiency.toFixed(1)} km/L</td>
                      <td className="py-3 text-right tabular-nums font-bold text-slate-900">¥{formatCurrency(totalCost)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Summary Table */}
        {tab === "vehicles" && (
          <Card className="border-slate-200/60 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">車両別燃費集計（今月）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">車両番号</th>
                      <th className="pb-3 text-left font-medium text-slate-500 text-xs">車種</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">総走行距離</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">総燃料量</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">平均燃費</th>
                      <th className="pb-3 text-right font-medium text-slate-500 text-xs">燃料費</th>
                      <th className="pb-3 text-center font-medium text-slate-500 text-xs">燃費効率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleSummary.map((v) => (
                      <tr key={v.vehicleNumber} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 text-xs font-medium text-slate-700">{v.vehicleNumber}</td>
                        <td className="py-3">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{v.vehicleType}</span>
                        </td>
                        <td className="py-3 text-right tabular-nums text-slate-700">{formatCurrency(Math.round(v.totalDistance))} km</td>
                        <td className="py-3 text-right tabular-nums font-medium text-slate-900">{formatCurrency(Math.round(v.totalFuel))} L</td>
                        <td className="py-3 text-right tabular-nums text-slate-700">{v.avgEfficiency.toFixed(1)} km/L</td>
                        <td className="py-3 text-right tabular-nums font-medium text-slate-900">¥{formatCurrency(v.totalCost)}</td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center">
                            <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-400"
                                style={{ width: `${Math.min((v.avgEfficiency / 7) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
