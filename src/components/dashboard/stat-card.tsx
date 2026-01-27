import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "error";
}

const variantStyles = {
  default: "bg-white",
  primary: "bg-primary/10 border-primary/20",
  success: "bg-green-50 border-green-200",
  warning: "bg-amber-50 border-amber-200",
  error: "bg-red-50 border-red-200",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/20 text-primary",
  success: "bg-green-100 text-green-600",
  warning: "bg-amber-100 text-amber-600",
  error: "bg-red-100 text-red-600",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className={cn("border", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              iconVariantStyles[variant]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
