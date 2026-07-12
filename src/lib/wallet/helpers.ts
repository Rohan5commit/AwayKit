import type { SharedExpense } from "@/types"

export function createExpense(groupId: string, paidBy: string, description: string, amount: number, splitAmong: string[]): SharedExpense {
  const perPerson = splitAmong.length > 0 ? Math.round((amount / splitAmong.length) * 100) / 100 : 0
  return { id: crypto.randomUUID(), groupId, paidBy, description, amount, currency: "USDT", splitAmong, perPerson, settled: false, createdAt: new Date().toISOString() }
}

export function validateAddress(address: string): boolean {
  return /^T[a-zA-Z0-9]{33}$/.test(address)
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return ""
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}
