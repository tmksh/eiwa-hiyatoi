import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badge?: {
    text: string;
    variant: "warning" | "error" | "success";
  };
  tags?: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
  progress?: {
    current: number;
    total: number;
  };
  variant?: "default" | "primary" | "success" | "warning" | "error";
}

const iconGradients = {
  default: "from-gray-400 to-gray-500",
  primary: "from-violet-400 to-violet-600",
  success: "from-emerald-400 to-emerald-600",
  warning: "from-amber-400 to-amber-500",
  error: "from-orange-400 to-orange-500",
};

const progressColors = {
  default: "bg-gray-400",
  primary: "bg-violet-500",
  success: "bg-emerald-500",
  warning: "bg-rose-400",
  error: "bg-orange-500",
};

const badgeStyles = {
  warning: "bg-amber-100 text-amber-700",
  error: "bg-orange-100 text-orange-700",
  success: "bg-emerald-100 text-emerald-700",
};

export function StatCard({
  title,
  value,
  unit,
  subValue,
  icon: Icon,
  trend,
  badge,
  tags,
  progress,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header: Icon + Trend/Badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
              iconGradients[variant]
            )}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.isPositive ? "text-emerald-600" : "text-rose-500"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {trend.isPositive ? "+" : ""}{trend.value}%
            </div>
          )}
          
          {badge && (
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold",
              badgeStyles[badge.variant]
            )}>
              {badge.text}
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>

        {/* Value */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold text-gray-900">{value}</span>
          {unit && <span className="text-lg text-gray-400">{unit}</span>}
          {subValue && <span className="text-lg text-gray-400">/ {subValue}</span>}
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="mt-4">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", progressColors[variant])}
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium",
                  tag.color || "bg-gray-100 text-gray-600"
                )}
              >
                {tag.label} {tag.value}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
