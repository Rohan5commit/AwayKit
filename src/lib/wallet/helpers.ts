import type { SharedExpense } from "@/types"

export function createExpense(
  groupId: string,
  paidBy: string,
  description: string,
  amount: number,
  splitAmong: string[]
): SharedExpense {
  const perPerson = splitAmong.length > 0 
    ? Math.round((amount / splitAmong.length) * 100) / 100 
    : 0
  
  return {
    id: crypto.randomUUID(),
    groupId,
    paidBy,
    description,
    amount,
    currency: "USDT",
    splitAmong,
    perPerson,
    settled: false,
    createdAt: new Date().toISOString(),
  }
}

export function calculateTotalOwed(expenses: SharedExpense[], memberId: string): number {
  let total = 0
  expenses.forEach(exp => {
    if (exp.paidBy === memberId && !exp.settled) {
      total += exp.amount - exp.perPerson
    }
  })
  return Math.round(total * 100) / 100
}

export function calculateTotalOwing(expenses: SharedExpense[], memberId: string): number {
  let total = 0
  expenses.forEach(exp => {
    if (exp.splitAmong.includes(memberId) && exp.paidBy !== memberId && !exp.settled) {
      total += exp.perPerson
    }
  })
  return Math.round(total * 100) / 100
}

export function validateAddress(address: string): boolean {
  // Basic TRON address validation
  return /^T[a-zA-Z0-9]{33}$/.test(address)
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return ""
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function getNetworkName(networkId: string): string {
  const networks: Record<string, string> = {
    tron: "TRON (TRC-20)",
    ethereum: "Ethereum (ERC-20)",
    polygon: "Polygon",
    bsc: "BNB Chain",
  }
  return networks[networkId] || networkId
}

