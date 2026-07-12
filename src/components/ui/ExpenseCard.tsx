import React from "react"
import type { SharedExpense } from "@/types"
import { StatusBadge } from "./StatusBadge"

interface ExpenseCardProps {
  expense: SharedExpense
  payerName: string
}

export function ExpenseCard({ expense, payerName }: ExpenseCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white font-medium">{expense.description}</p>
          <p className="text-sm text-gray-400 mt-1">
            Paid by <span className="text-pitch-400">{payerName}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{expense.amount} <span className="text-sm text-gray-400">{expense.currency}</span></p>
          <p className="text-xs text-gray-500">
            {expense.perPerson} per person
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
        <span className="text-xs text-gray-500">
          Split among {expense.splitAmong.length} members
        </span>
        <StatusBadge variant={expense.settled ? "success" : "warning"}>
          {expense.settled ? "Settled" : "Pending"}
        </StatusBadge>
      </div>
    </div>
  )
}

