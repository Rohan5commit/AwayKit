import React from "react"
import { Button } from "./Button"
import { StatusBadge } from "./StatusBadge"

interface SettlementCardProps {
  from: string
  to: string
  amount: number
  currency?: string
  settled?: boolean
  onSettle?: () => void
}

export function SettlementCard({
  from,
  to,
  amount,
  currency = "USDT",
  settled = false,
  onSettle,
}: SettlementCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">{from}</span>
            <span className="text-gray-600">→</span>
            <span className="text-sm text-pitch-400 font-medium">{to}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white">
            {amount.toFixed(2)} {currency}
          </span>
          {settled ? (
            <StatusBadge variant="success">Done</StatusBadge>
          ) : onSettle ? (
            <Button variant="primary" size="sm" onClick={onSettle}>
              Settle
            </Button>
          ) : (
            <StatusBadge variant="warning">Pending</StatusBadge>
          )}
        </div>
      </div>
    </div>
  )
}

