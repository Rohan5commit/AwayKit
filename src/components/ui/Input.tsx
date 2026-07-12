import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: string
}

export function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3
            text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-pitch-500/50 focus:border-pitch-500
            transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export function Textarea({
  label,
  error,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3
          text-white placeholder-gray-500 resize-none
          focus:outline-none focus:ring-2 focus:ring-pitch-500/50 focus:border-pitch-500
          transition-all duration-200
          ${error ? "border-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

