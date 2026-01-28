"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Bell,
  Shield,
  Database,
  Users,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

// Mock admin users
const mockAdminUsers = [
  { id: "1", email: "admin@example.com", name: "管理者", role: "admin", isActive: true },
  { id: "2", email: "operator1@example.com", name: "担当者A", role: "operator", isActive: true },
  { id: "3", email: "operator2@example.com", name: "担当者B", role: "operator", isActive: false },
];

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("栄和清運株式会社");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("daily");

  const handleSave = () => {
    toast.success("設定を保存しました");
  };

  return (
    <MainLayout title="設定">
      <div className="space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="gap-2">
              <Building className="h-4 w-4" />
              基本設定
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              通知
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              ユーザー管理
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Database className="h-4 w-4" />
              システム
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>基本設定</CardTitle>
                <CardDescription>
                  システムの基本情報を設定します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="companyName">会社名</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="fiscalYearStart">年度開始月</Label>
                  <Select defaultValue="4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}月
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoCalculate"
                    checked={autoCalculate}
                    onCheckedChange={(checked) =>
                      setAutoCalculate(checked as boolean)
                    }
                  />
                  <Label htmlFor="autoCalculate">
                    日報入力時に自動で計算を実行する
                  </Label>
                </div>

                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>
                  メールやシステム通知の設定を行います
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">メール通知</p>
                      <p className="text-sm text-muted-foreground">
                        計算完了時などにメールで通知を受け取る
                      </p>
                    </div>
                    <Checkbox
                      checked={emailNotifications}
                      onCheckedChange={(checked) =>
                        setEmailNotifications(checked as boolean)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">エラー通知</p>
                      <p className="text-sm text-muted-foreground">
                        計算エラー発生時に通知を受け取る
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">日次レポート</p>
                      <p className="text-sm text-muted-foreground">
                        毎日のサマリーをメールで受け取る
                      </p>
                    </div>
                    <Checkbox />
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>ユーザー管理</CardTitle>
                    <CardDescription>
                      管理画面にアクセスできるユーザーを管理します
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    ユーザー追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAdminUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role === "admin" ? "管理者" : "オペレーター"}
                        </Badge>
                        <Badge
                          variant={user.isActive ? "outline" : "secondary"}
                        >
                          {user.isActive ? "有効" : "無効"}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>データベース</CardTitle>
                  <CardDescription>
                    バックアップと復元の設定
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2 max-w-md">
                    <Label>自動バックアップ頻度</Label>
                    <Select
                      value={backupFrequency}
                      onValueChange={setBackupFrequency}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">毎日</SelectItem>
                        <SelectItem value="weekly">毎週</SelectItem>
                        <SelectItem value="monthly">毎月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Database className="mr-2 h-4 w-4" />
                      今すぐバックアップ
                    </Button>
                    <Button variant="outline">復元</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>セキュリティ</CardTitle>
                  <CardDescription>
                    セキュリティ関連の設定
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">2要素認証</p>
                      <p className="text-sm text-muted-foreground">
                        ログイン時に追加の認証を要求する
                      </p>
                    </div>
                    <Checkbox />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">セッションタイムアウト</p>
                      <p className="text-sm text-muted-foreground">
                        非アクティブ時に自動ログアウト（30分）
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>システム情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">バージョン</dt>
                      <dd className="font-mono">1.0.0</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">最終バックアップ</dt>
                      <dd>2024/01/28 03:00</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">データベースサイズ</dt>
                      <dd className="font-mono">245 MB</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
