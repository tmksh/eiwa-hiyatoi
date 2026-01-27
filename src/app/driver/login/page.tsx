"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function DriverLoginPage() {
  const router = useRouter();
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeCode || !password) {
      toast.error("従業員番号とパスワードを入力してください");
      return;
    }

    setIsLoading(true);

    // Mock login - replace with actual authentication
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate successful login
    toast.success("ログインしました");
    router.push("/driver/report");

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">運転手ログイン</CardTitle>
          <CardDescription>
            従業員番号とパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeCode">従業員番号</Label>
              <Input
                id="employeeCode"
                type="text"
                placeholder="例: E001"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="h-12 text-lg"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-lg pr-12"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>パスワードを忘れた場合は</p>
            <p>管理者にお問い合わせください</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
