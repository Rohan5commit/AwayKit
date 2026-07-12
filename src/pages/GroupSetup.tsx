import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { setGroup } from "@/lib/trip/store"
import { initPears } from "@/lib/pears"
import { initWallet } from "@/lib/wdk"
import { demoScenarios } from "@/lib/demo/scenarios"
import type { MatchGroup } from "@/types"

export default function GroupSetup() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<"new" | "join" | null>(null)
  const [groupName, setGroupName] = useState("")
  const [match, setMatch] = useState("")
  const [destination, setDestination] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [showDemo, setShowDemo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!groupName || !match) return
    setLoading(true)
    setError(null)
    try {
      const groupId = "group-" + crypto.randomUUID().slice(0, 8)
      const newGroup: MatchGroup = {
        id: groupId,
        name: groupName,
        match,
        members: [
          { id: "me", name: "You", status: "offline", balance: 500 },
        ],
        tripPlan: destination ? {
          id: "trip-" + Date.now(),
          groupId,
          destination,
          date: new Date().toISOString().split("T")[0],
          meetingTime: "14:00",
          meetupPoints: [],
          notes: [],
          checklist: [],
        } : undefined,
        fundBalance: 0,
        currency: "USDT",
        createdAt: new Date().toISOString(),
      }
      await initPears({ groupId })
      await initWallet()
      setGroup(newGroup)
      navigate("/trip")
    } catch (err) {
      setError("Failed to create group. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!inviteCode) return
    setLoading(true)
    setError(null)
    try {
      await initPears({ groupId: inviteCode })
      await initWallet()
      const scenario = demoScenarios[0]
      setGroup(scenario.group)
      navigate("/trip")
    } catch (err) {
      setError("Failed to join group. Check the invite code and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoSelect = async (index: number) => {
    setLoading(true)
    setError(null)
    try {
      const scenario = demoScenarios[index]
      await initPears({ groupId: scenario.group.id })
      await initWallet()
      setGroup(scenario.group)
      navigate("/trip")
    } catch (err) {
      setError("Failed to load demo. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-lg mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Matchday Setup</h1>
          <p className="text-gray-400 mt-2">Create a group or join friends for matchday</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <Card className="border-pitch-500/30 bg-pitch-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">⚡ Quick Demo</h3>
              <p className="text-sm text-gray-400 mt-1">Jump into a pre-built matchday scenario</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowDemo(true)} disabled={loading}>Try</Button>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button variant={mode === "new" ? "primary" : "ghost"} fullWidth onClick={() => setMode(mode === "new" ? null : "new")} icon="➕" disabled={loading}>Create Group</Button>
          <Button variant={mode === "join" ? "primary" : "ghost"} fullWidth onClick={() => setMode(mode === "join" ? null : "join")} icon="🔗" disabled={loading}>Join Group</Button>
        </div>

        {mode === "new" && (
          <Card>
            <CardTitle>Create Matchday Group</CardTitle>
            <CardContent className="space-y-4">
              <Input label="Group Name" placeholder="e.g. Barcelona Away End" value={groupName} onChange={(e) => setGroupName(e.target.value)} icon="👥" />
              <Input label="Match" placeholder="e.g. Real Madrid vs Barcelona" value={match} onChange={(e) => setMatch(e.target.value)} icon="⚽" />
              <Input label="Destination (optional)" placeholder="e.g. Santiago Bernabeu, Madrid" value={destination} onChange={(e) => setDestination(e.target.value)} icon="📍" />
              <Button variant="primary" fullWidth onClick={handleCreate} disabled={!groupName || !match || loading} loading={loading}>
                {loading ? "Creating..." : "Create Group & Plan Trip"}
              </Button>
            </CardContent>
          </Card>
        )}

        {mode === "join" && (
          <Card>
            <CardTitle>Join Existing Group</CardTitle>
            <CardContent className="space-y-4">
              <Input label="Invite Code" placeholder="Enter group invite code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} icon="🔑" />
              <Button variant="secondary" fullWidth onClick={handleJoin} disabled={!inviteCode || loading} loading={loading}>
                {loading ? "Joining..." : "Join via P2P"}
              </Button>
              <p className="text-xs text-gray-500 text-center">In production, this connects peer-to-peer via Pears</p>
            </CardContent>
          </Card>
        )}

        <Modal isOpen={showDemo} onClose={() => !loading && setShowDemo(false)} title="Choose a Demo Scenario">
          <div className="space-y-3">
            {demoScenarios.map((scenario, i) => (
              <button
                key={i}
                onClick={() => handleDemoSelect(i)}
                disabled={loading}
                className={`w-full text-left p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:border-pitch-500/50 hover:bg-gray-800"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{scenario.icon}</span>
                  <div>
                    <p className="text-white font-medium">{scenario.name}</p>
                    <p className="text-sm text-gray-400">{scenario.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <StatusBadge variant="info" dot={false}>{scenario.group.members.length} members</StatusBadge>
                  <StatusBadge variant="success" dot={false}>{scenario.group.match.split(" - ")[0]}</StatusBadge>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  )
}
