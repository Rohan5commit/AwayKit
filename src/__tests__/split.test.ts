import { describe, it, expect } from "vitest"
import { calculatePerPersonSplit, calculateSettlements, calculateFundBalance } from "@/lib/trip"
import { validateAddress, truncateAddress, createExpense } from "@/lib/wallet/helpers"
import type { SharedExpense, GroupMember } from "@/types"

describe("Expense Splitting Math", () => {
  it("calculates per person split correctly", () => {
    expect(calculatePerPersonSplit(100, 4)).toBe(25)
    expect(calculatePerPersonSplit(100, 3)).toBe(33.33)
    expect(calculatePerPersonSplit(0, 4)).toBe(0)
    expect(calculatePerPersonSplit(100, 0)).toBe(0)
  })

  it("calculates fund balance from expenses", () => {
    const expenses: SharedExpense[] = [
      { id: "1", groupId: "g1", paidBy: "m1", description: "Food", amount: 50, currency: "USDT", splitAmong: ["m1", "m2"], perPerson: 25, settled: false, createdAt: "" },
      { id: "2", groupId: "g1", paidBy: "m2", description: "Drinks", amount: 30, currency: "USDT", splitAmong: ["m1", "m2"], perPerson: 15, settled: true, createdAt: "" },
    ]
    expect(calculateFundBalance(expenses)).toBe(-50)
  })

  it("calculates optimal settlements", () => {
    const members: GroupMember[] = [
      { id: "m1", name: "Alex", status: "arrived", balance: 0 },
      { id: "m2", name: "Sam", status: "traveling", balance: 0 },
      { id: "m3", name: "Jordan", status: "arrived", balance: 0 },
    ]
    const expenses: SharedExpense[] = [
      { id: "1", groupId: "g1", paidBy: "m1", description: "Food", amount: 90, currency: "USDT", splitAmong: ["m1", "m2", "m3"], perPerson: 30, settled: false, createdAt: "" },
    ]
    const settlements = calculateSettlements(expenses, members)
    expect(settlements.length).toBe(2)
    expect(settlements[0].from).toBe("m2")
    expect(settlements[0].to).toBe("m1")
    expect(settlements[0].amount).toBe(30)
    expect(settlements[1].from).toBe("m3")
    expect(settlements[1].to).toBe("m1")
    expect(settlements[1].amount).toBe(30)
  })
})

describe("Wallet Helpers", () => {
  it("validates TRON addresses correctly", () => {
    expect(validateAddress("TJmH123456789012345678901234567890123")).toBe(true)
    expect(validateAddress("TJmH123456789012345678901234567890")).toBe(false)
    expect(validateAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(false)
    expect(validateAddress("")).toBe(false)
  })

  it("truncates addresses correctly", () => {
    expect(truncateAddress("TJmH123456789012345678901234567890123", 4)).toBe("TJmH...8901")
    expect(truncateAddress("", 4)).toBe("")
  })

  it("creates expense with correct per person split", () => {
    const expense = createExpense("g1", "m1", "Dinner", 100, ["m1", "m2", "m3"])
    expect(expense.amount).toBe(100)
    expect(expense.splitAmong).toHaveLength(3)
    expect(expense.perPerson).toBe(33.33)
    expect(expense.settled).toBe(false)
    expect(expense.currency).toBe("USDT")
  })
})
