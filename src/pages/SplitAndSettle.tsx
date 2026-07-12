import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { SettlementCard } from "@/components/ui/SettlementCard"
import { Modal } from "@/components/ui/Modal"
import { groupStore, expensesStore, addExpense } from "@/lib/trip/store"
import { calculateSettlements, formatCurrency } from "@/lib/trip"
import { createExpense } from "@/lib/wallet/helpers"
import { splitExpense, getWalletState } from "@/lib/wdk"
import type { MatchGroup, SharedExpense, WalletState } from "@/types"

export default function SplitAndSettle() {
  const navigate = useNavigate()
  const [group, setGroup] = useState<MatchGroup | null>(groupStore.get())
  const [expenses, setExpenses] = useState<SharedExpense[]>(expensesStore.get())
  const [wallet, setWallet] = useState<WalletState>(getWalletState())
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [settling, setSettling] = useState<string | null>(null)
  const [showResult, setShowResult] = useState<{ success: boolean; message: string } | null>(null)
  const [addingExpense, setAddingExpense] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!group) {
      navigate("/setup")
      return
    }
    setSelectedMembers(group.members.map(m => m.id))
    const unsubGroup = groupStore.subscribe(setGroup)
    const unsubExpenses = expensesStore.subscribe(setExpenses)
    return () => { unsubGroup(); unsubExpenses() }
  }, [])

  const settlements = group ? calculateSettlements(expenses, group.members) : []
  const unsettledExpenses = expenses.filter(e => !e.settled)

  const handleAddExpense = async () => {
    if (!group || !description || !amount) return
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount")
      return
    }
    setAddingExpense(true)
    setError(null)
    try {
      const expense = createExpense(group.id, "me", description, amt, selectedMembers)
      addExpense(expense)
      setShowAddExpense(false)
      setDescription("")
      setAmount("")
    } catch (err) {
      setError("Failed to add expense. Please try again.")
    } finally {
      setAddingExpense(false)
    }
  }

  const handleSettle = async (from: string, to: string, settleAmount: number) => {
    const fromMember = group?.members.find(m => m.id === from)
    const toMember = group?.members.find(m => m.id === to)
    if (!fromMember || !toMember) return
    setSettling(`${from}-${to}`)
    setError(null)
    try {
      await splitExpense(
        {
          id: crypto.randomUUID(),
          groupId: group!.id,
          paidBy: from,
          description: `Settlement from ${fromMember.name} to ${toMember.name}`,
          amount: settleAmount,
          currency: "USDT",
          splitAmong: [from],
          perPerson: settleAmount,
          settled: true,
          createdAt: new Date().toISOString(),
        },
        { [from]: fromMember.walletAddress || "", [to]: toMember.walletAddress || "" }
      )
      setShowResult({ success: true, message: `${settleAmount} USDT sent from ${fromMember.name} to ${toMember.name}!` })
    } catch (err) {
      setShowResult({ success: false, message: "Settlement failed. Please try again." })
    } finally {
      setSettling(null)
    }
  }

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  if (!group) return null

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">💰 Split & Settle</h1>
          <p className="text-gray-400 mt-1">Manage shared expenses and settle in USDt</p>
          <div className="mt-2">
            <StatusBadge variant={wallet.connected ? "success" : "warning"}>
              {wallet.connected ? `Wallet: ${wallet.address?.slice(0,10)}...` : "Wallet not connected"}
            </StatusBadge>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-gray-400">Total Expenses</p>
            <p className="text-2xl font-bold text-white mt-1">{formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-400">Pending Settlements</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{settlements.length}</p>
          </Card>
        </div>

        <Button variant="primary" fullWidth onClick={() => setShowAddExpense(true)} icon="➕">Add Shared Expense</Button>

        <Card>
          <CardHeader>
            <CardTitle>Unsettled Expenses</CardTitle>
            <StatusBadge variant="warning" dot={false}>{unsettledExpenses.length}</StatusBadge>
          </CardHeader>
          <CardContent className="space-y-3">
            {unsettledExpenses.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">All expenses settled! 🎉</p>
            ) : unsettledExpenses.map(exp => {
              const payer = group.members.find(m => m.id === exp.paidBy)
              return (
                <div key={exp.id} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{exp.description}</p>
                      <p className="text-sm text-gray-400">Paid by {payer?.name}</p>
                    </div>
                    <p className="text-lg font-bold text-white">{exp.amount} USDT</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/50">
                    <span className="text-xs text-gray-500">{exp.perPerson} per person x {exp.splitAmong.length}</span>
                    <StatusBadge variant="warning" dot={false}>Pending</StatusBadge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settlements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {settlements.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No settlements needed</p>
            ) : settlements.map((s, i) => {
              const fromMember = group.members.find(m => m.id === s.from)
              const toMember = group.members.find(m => m.id === s.to)
              const isSettling = settling === `${s.from}-${s.to}`
              return (
                <SettlementCard
                  key={i}
                  from={fromMember?.name || s.from}
                  to={toMember?.name || s.to}
                  amount={s.amount}
                  onSettle={() => handleSettle(s.from, s.to, s.amount)}
                />
              )
            })}
          </CardContent>
        </Card>

        <Link to="/trip">
          <Button variant="ghost" fullWidth>← Back to Trip Board</Button>
        </Link>

        <Modal isOpen={showAddExpense} onClose={() => !addingExpense && setShowAddExpense(false)} title="Add Shared Expense">
          <div className="space-y-4">
            <Input label="Description" placeholder="e.g. Taxi to stadium" value={description} onChange={e => setDescription(e.target.value)} icon="📝" />
            <Input label="Amount (USDT)" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} icon="💰" />
            <div>
              <p className="text-sm text-gray-300 mb-2">Split among:</p>
              <div className="flex flex-wrap gap-2">
                {group.members.map(m => (
                  <button key={m.id} onClick={() => toggleMember(m.id)} className={`px-3 py-1.5 rounded-full text-sm border transition-all ${selectedMembers.includes(m.id) ? "bg-pitch-500/20 border-pitch-500 text-pitch-400" : "bg-gray-800 border-gray-700 text-gray-400"}`}>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            {amount && selectedMembers.length > 0 && (
              <p className="text-sm text-gray-400">
                {formatCurrency(parseFloat(amount) / selectedMembers.length)} per person
              </p>
            )}
            <Button variant="primary" fullWidth onClick={handleAddExpense} disabled={!description || !amount || selectedMembers.length === 0 || addingExpense} loading={addingExpense}>
              {addingExpense ? "Adding..." : "Add Expense & Record on WDK"}
            </Button>
          </div>
        </Modal>

        <Modal isOpen={!!showResult} onClose={() => setShowResult(null)} title={showResult?.success ? "✅ Settlement Complete" : "❌ Settlement Failed"}>
          <div className="text-center space-y-4">
            <p className="text-gray-300">{showResult?.message}</p>
            <p className="text-xs text-gray-500">Settlement processed via WDK self-custodial wallet</p>
          </div>
        </Modal>
      </div>
    </div>
  )
}
