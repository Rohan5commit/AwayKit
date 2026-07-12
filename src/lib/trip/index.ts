import type { MatchGroup, SharedExpense, GroupMember } from "@/types"

export function calculateFundBalance(expenses: SharedExpense[]): number {
  return expenses.reduce((sum, exp) => {
    if (!exp.settled) {
      return sum - exp.amount
    }
    return sum
  }, 0)
}

export function calculatePerPersonSplit(amount: number, memberCount: number): number {
  if (memberCount <= 0) return 0
  return Math.round((amount / memberCount) * 100) / 100
}

export function getMemberBalances(
  expenses: SharedExpense[],
  members: GroupMember[]
): Map<string, number> {
  const balances = new Map<string, number>()
  members.forEach(m => balances.set(m.id, 0))
  
  expenses.forEach(exp => {
    // Payer is owed money
    const currentPayerBalance = balances.get(exp.paidBy) || 0
    balances.set(exp.paidBy, currentPayerBalance + exp.amount)
    
    // Each person in split owes their share
    exp.splitAmong.forEach(memberId => {
      if (memberId !== exp.paidBy) {
        const currentBalance = balances.get(memberId) || 0
        balances.set(memberId, currentBalance - exp.perPerson)
      }
    })
  })
  
  return balances
}

export function calculateSettlements(
  expenses: SharedExpense[],
  members: GroupMember[]
): { from: string; to: string; amount: number }[] {
  const balances = getMemberBalances(expenses, members)
  const debtors: { id: string; amount: number }[] = []
  const creditors: { id: string; amount: number }[] = []
  
  balances.forEach((balance, id) => {
    if (balance < 0) {
      debtors.push({ id, amount: Math.abs(balance) })
    } else if (balance > 0) {
      creditors.push({ id, amount: balance })
    }
  })
  
  // Sort to minimize transactions
  debtors.sort((a, b) => b.amount - a.amount)
  creditors.sort((a, b) => b.amount - a.amount)
  
  const settlements: { from: string; to: string; amount: number }[] = []
  
  let i = 0, j = 0
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].amount, creditors[j].amount)
    if (amount > 0.01) { // Ignore micro differences
      settlements.push({
        from: debtors[i].id,
        to: creditors[j].id,
        amount: Math.round(amount * 100) / 100,
      })
    }
    debtors[i].amount -= amount
    creditors[j].amount -= amount
    if (debtors[i].amount < 0.01) i++
    if (creditors[j].amount < 0.01) j++
  }
  
  return settlements
}

export function getStatusColor(status: GroupMember["status"]): string {
  switch (status) {
    case "arrived": return "text-green-400"
    case "traveling": return "text-yellow-400"
    case "offline": return "text-gray-500"
  }
}

export function getStatusIcon(status: GroupMember["status"]): string {
  switch (status) {
    case "arrived": return "✅"
    case "traveling": return "🚶"
    case "offline": return "⚫"
  }
}

export function formatCurrency(amount: number, currency: string = "USDT"): string {
  return `${amount.toFixed(2)} ${currency}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

