import React from "react"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: string
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-pitch-500 hover:bg-pitch-600 text-white shadow-lg shadow-pitch-500/20",
  secondary: "bg-tether-600 hover:bg-tether-700 text-white shadow-lg shadow-tether-600/20",
  ghost: "bg-transparent hover:bg-white/10 text-gray-300 border border-gray-600",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20",
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200 ease-out
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </button>
  )
}

