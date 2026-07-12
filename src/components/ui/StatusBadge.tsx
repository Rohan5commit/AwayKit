import React from "react"

type BadgeVariant = "success" | "warning" | "info" | "danger" | "neutral"

interface StatusBadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  danger: "bg-red-500/20 text-red-400 border-red-500/30",
  neutral: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

const dotClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  info: "bg-blue-400",
  danger: "bg-red-400",
  neutral: "bg-gray-400",
}

export function StatusBadge({ variant, children, dot = true }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        border ${variantClasses[variant]}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  )
}

