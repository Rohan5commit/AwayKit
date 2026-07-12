import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { setGroup } from "@/lib/trip/store"
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

  const handleCreate = () => {
    if (!groupName || !match) return
    const newGroup: MatchGroup = {
      id: "group-" + crypto.randomUUID().slice(0, 8),
      name: groupName,
      match,
      members: [
        { id: "me", name: "You", status: "offline", balance: 500 },
      ],
      tripPlan: destination ? {
        id: "trip-" + Date.now(),
        groupId: "group-" + crypto.randomUUID().slice(0, 8),
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
    setGroup(newGroup)
    navigate("/trip")
  }

  const handleJoin = () => {
    if (!inviteCode) return
    // In production, this would connect via Pears to the group
    const scenario = demoScenarios[0]
    setGroup(scenario.group)
    navigate("/trip")
  }

  const handleDemoSelect = (index: number) => {
    const scenario = demoScenarios[index]
    setGroup(scenario.group)
    navigate("/trip")
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-lg mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Matchday Setup</h1>
          <p className="text-gray-400 mt-2">Create a group or join friends for matchday</p>
        </div>

        {/* Quick Demo */}
        <Card className="border-pitch-500/30 bg-pitch-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">⚡ Quick Demo</h3>
              <p className="text-sm text-gray-400 mt-1">Jump into a pre-built matchday scenario</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowDemo(true)}>Try</Button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={mode === "new" ? "primary" : "ghost"}
            fullWidth
            onClick={() => setMode(mode === "new" ? null : "new")}
            icon="➕"
          >
            Create Group
          </Button>
          <Button
            variant={mode === "join" ? "primary" : "ghost"}
            fullWidth
            onClick={() => setMode(mode === "join" ? null : "join")}
            icon="🔗"
          >
            Join Group
          </Button>
        </div>

        {/* Create Form */}
        {mode === "new" && (
          <Card>
            <CardTitle>Create Matchday Group</CardTitle>
            <CardContent className="space-y-4">
              <Input
                label="Group Name"
                placeholder="e.g. Barcelona Away End"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                icon="👥"
              />
              <Input
                label="Match"
                placeholder="e.g. Real Madrid vs Barcelona"
                value={match}
                onChange={(e) => setMatch(e.target.value)}
                icon="⚽"
              />
              <Input
                label="Destination (optional)"
                placeholder="e.g. Santiago Bernabéu, Madrid"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                icon="📍"
              />
              <Button
                variant="primary"
                fullWidth
                onClick={handleCreate}
                disabled={!groupName || !match}
              >
                Create Group & Plan Trip
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Join Form */}
        {mode === "join" && (
          <Card>
            <CardTitle>Join Existing Group</CardTitle>
            <CardContent className="space-y-4">
              <Input
                label="Invite Code"
                placeholder="Enter group invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                icon="🔑"
              />
              <Button
                variant="secondary"
                fullWidth
                onClick={handleJoin}
                disabled={!inviteCode}
              >
                Join via P2P
              </Button>
              <p className="text-xs text-gray-500 text-center">
                In production, this connects peer-to-peer via Pears
              </p>
            </CardContent>
          </Card>
        )}

        {/* Demo Selection Modal */}
        <Modal
          isOpen={showDemo}
          onClose={() => setShowDemo(false)}
          title="Choose a Demo Scenario"
        >
          <div className="space-y-3">
            {demoScenarios.map((scenario, i) => (
              <button
                key={i}
                onClick={() => handleDemoSelect(i)}
                className="w-full text-left p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-pitch-500/50 hover:bg-gray-800 transition-all"
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

