import { cn } from "@/lib/utils";

export type Status = "draft" | "calculated" | "confirmed" | "paid" | "error";

const statusConfig: Record<Status, { label: string; className: string }> = {
  draft: {
    label: "下書き",
    className: "bg-gray-100 text-gray-700",
  },
  calculated: {
    label: "計算済",
    className: "bg-blue-100 text-blue-700",
  },
  confirmed: {
    label: "確定",
    className: "bg-green-100 text-green-700",
  },
  paid: {
    label: "支払済",
    className: "bg-violet-100 text-violet-700",
  },
  error: {
    label: "エラー",
    className: "bg-red-100 text-red-700",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
