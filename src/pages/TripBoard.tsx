import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { ExpenseCard } from "@/components/ui/ExpenseCard"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { groupStore, expensesStore, messagesStore, setGroup } from "@/lib/trip/store"
import { demoScenarios } from "@/lib/demo/scenarios"
import { getStatusIcon, formatCurrency } from "@/lib/trip"
import { topUpTripFund } from "@/lib/wdk"
import type { MatchGroup } from "@/types"

export default function TripBoard() {
  const [group, setGroupState] = useState<MatchGroup | null>(groupStore.get())
  const [expenses, setExpenses] = useState(expensesStore.get())
  const [messages, setMessages] = useState(messagesStore.get())
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")
  const [activeTab, setActiveTab] = useState<"board" | "chat" | "checklist">("board")

  useEffect(() => {
    if (!group) {
      const scenario = demoScenarios[0]
      setGroup(scenario.group)
      setGroupState(scenario.group)
      expensesStore.set(scenario.expenses)
      setExpenses(scenario.expenses)
      messagesStore.set(scenario.messages)
      setMessages(scenario.messages)
    }
    const unsubGroup = groupStore.subscribe(setGroupState)
    const unsubExpenses = expensesStore.subscribe(setExpenses)
    const unsubMessages = messagesStore.subscribe(setMessages)
    return () => { unsubGroup(); unsubExpenses(); unsubMessages() }
  }, [])

  const handleTopUp = async () => {
    if (!topUpAmount || !group) return
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) return
    await topUpTripFund(group.id, amount)
    setGroup({ ...group, fundBalance: group.fundBalance + amount })
    setShowTopUp(false)
    setTopUpAmount("")
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No matchday group found</p>
          <Link to="/setup"><Button>Create a Group</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{group.name}</h1>
          <p className="text-gray-400 mt-1">{group.match}</p>
        </div>

        <Card className="bg-gradient-to-r from-emerald-500/10 to-pitch-500/10 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Shared Trip Fund</p>
              <p className="text-3xl font-bold text-white mt-1">{formatCurrency(group.fundBalance, group.currency)}</p>
            </div>
            <Button variant="success" onClick={() => setShowTopUp(true)} icon="💰">Top Up</Button>
          </div>
        </Card>

        <div className="flex gap-2 bg-gray-900/50 p-1 rounded-xl">
          {(["board", "chat", "checklist"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-pitch-500 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
              {tab === "board" ? "👥 Board" : tab === "chat" ? "💬 Chat" : "✅ Checklist"}
            </button>
          ))}
        </div>

        {activeTab === "board" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Members</CardTitle>
                <StatusBadge variant="info">{group.members.length} members</StatusBadge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pitch-500 to-pitch-600 flex items-center justify-center text-white font-bold">
                          {member.name[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.walletAddress || "No wallet"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">{getStatusIcon(member.status)} {member.status}</span>
                        <span className="text-sm text-pitch-400">{member.balance} USDT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {group.tripPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>Trip Plan</CardTitle>
                  <StatusBadge variant="success">Active</StatusBadge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300"><span>📍</span><span>{group.tripPlan.destination}</span></div>
                  <div className="flex items-center gap-2 text-gray-300"><span>📅</span><span>{group.tripPlan.date} at {group.tripPlan.meetingTime}</span></div>
                  {group.tripPlan.venue && <div className="flex items-center gap-2 text-gray-300"><span>🏟️</span><span>{group.tripPlan.venue}</span></div>}
                  {group.tripPlan.notes.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Notes</p>
                      {group.tripPlan.notes.map((note, i) => <p key={i} className="text-sm text-gray-300">• {note}</p>)}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
                <Link to="/split"><Button variant="ghost" size="sm">Split & Settle →</Button></Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No expenses yet</p>
                  ) : (
                    expenses.map(expense => {
                      const payer = group.members.find(m => m.id === expense.paidBy)
                      return <ExpenseCard key={expense.id} expense={expense} payerName={payer?.name || "Unknown"} />
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "chat" && (
          <Card>
            <CardTitle>Group Chat</CardTitle>
            <CardContent className="space-y-3 mt-4">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No messages yet</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.senderId === "system" ? "justify-center" : ""}`}>
                    {msg.senderId !== "system" && (
                      <div className="w-8 h-8 rounded-full bg-pitch-500/20 flex items-center justify-center text-pitch-400 text-sm font-bold flex-shrink-0">{msg.senderName[0]}</div>
                    )}
                    <div className={`${msg.senderId === "system" ? "max-w-md" : "max-w-xs"} ${msg.type === "ai_response" ? "bg-pitch-500/10 border border-pitch-500/20" : "bg-gray-800/50 border border-gray-700/50"} rounded-xl p-3`}>
                      {msg.senderId !== "system" && <p className="text-xs text-gray-500 mb-1">{msg.senderName}</p>}
                      <p className="text-sm text-gray-300">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "checklist" && (
          <Card>
            <CardTitle>Matchday Checklist</CardTitle>
            <CardContent className="space-y-2 mt-4">
              {group.tripPlan && group.tripPlan.checklist.length > 0 ? (
                group.tripPlan.checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.checked ? "bg-pitch-500 border-pitch-500" : "border-gray-600"}`}>
                      {item.checked && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${item.checked ? "text-gray-500 line-through" : "text-gray-300"}`}>{item.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No checklist items yet. Create a trip plan to add items.</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/ai"><Button variant="ghost" fullWidth icon="🧠">AI Help</Button></Link>
          <Link to="/split"><Button variant="ghost" fullWidth icon="💰">Split Bills</Button></Link>
          <Button variant="ghost" fullWidth icon="📍">Meetup Point</Button>
          <Button variant="ghost" fullWidth icon="🔄">Sync Status</Button>
        </div>

        <Modal isOpen={showTopUp} onClose={() => setShowTopUp(false)} title="Top Up Trip Fund">
          <div className="space-y-4">
            <Input label="Amount (USDT)" type="number" placeholder="Enter amount" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} icon="💰" />
            <p className="text-xs text-gray-500">Current balance: {formatCurrency(group.fundBalance, group.currency)}</p>
            <Button variant="success" fullWidth onClick={handleTopUp} disabled={!topUpAmount}>Confirm Top Up</Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
