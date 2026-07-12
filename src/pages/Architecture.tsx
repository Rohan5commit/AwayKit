import React from "react"
import { Link } from "react-router-dom"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { StatusBadge } from "@/components/ui/StatusBadge"

const layers = [
  {
    name: "QVAC Local AI",
    color: "pitch",
    icon: "🧠",
    description: "On-device AI inference framework by Tether",
    what: "Runs LLMs, translation, and understanding models locally on the user device.",
    why: "No cloud dependency. Privacy by default. Works offline.",
    usage: ["Matchday checklist generation","Travel phrase translation","Venue Q&A and local guidance","Safety tip generation","Group plan summarization","Ticket/sign understanding"],
    npm: "@qvac/sdk",
  },
  {
    name: "Pears P2P Sync",
    color: "tether",
    icon: "🔗",
    description: "Peer-to-peer runtime by Holepunch",
    what: "Enables direct device-to-device communication and state sync without servers.",
    why: "No centralized backend. Works with poor connectivity. Data stays on devices.",
    usage: ["Group room creation and membership","Real-time member presence/status","Shared itinerary updates","Meetup point synchronization","Offline-first local state","Low-bandwidth peer messaging"],
    npm: "@pear-js/core + @pear-js/hyperswarm",
  },
  {
    name: "WDK Wallets",
    color: "emerald",
    icon: "💰",
    description: "Wallet Development Kit by Tether",
    what: "Self-custodial multi-chain wallet SDK for USDt and digital assets.",
    why: "No trusted organizer holding money. Users control their own funds. Trustless settlements.",
    usage: ["Self-custodial wallet creation/connect","USDt balance management","Shared trip fund contributions","Expense splitting transactions","Direct peer reimbursements","Settlement history on-chain"],
    npm: "@wdk/core + @wdk/wallet-evm + @wdk/wallet-tron",
  },
]

const comparisons = [
  { feature: "Chat & Coordination", traditional: "Cloud chat apps (WhatsApp, Telegram)", awaykit: "P2P sync via Pears - no server needed" },
  { feature: "AI Assistance", traditional: "Cloud AI APIs (OpenAI, etc.)", awaykit: "Local inference via QVAC - private, offline" },
  { feature: "Money Splitting", traditional: "Centralized apps (Splitwise, Venmo)", awaykit: "Self-custodial USDt via WDK - trustless" },
  { feature: "Data Storage", traditional: "Cloud databases", awaykit: "Local-first + peer-synced state" },
  { feature: "Connectivity Required", traditional: "Always online", awaykit: "Works offline, syncs when peers connect" },
  { feature: "Privacy", traditional: "Server sees all data", awaykit: "Data never leaves devices" },
]

const flowSteps = [
  { step: "1", title: "Create Group", desc: "User opens AwayKit and creates a matchday group. Local state is initialized." },
  { step: "2", title: "P2P Join", desc: "Friends discover and join the group via Pears Hyperswarm. Room state syncs peer-to-peer." },
  { step: "3", title: "Plan Trip", desc: "Group sets destination, meeting points, and checklist. QVAC generates suggestions locally." },
  { step: "4", title: "Live Coordination", desc: "Members update status, share notes, and sync meetup info via Pears - works offline too." },
  { step: "5", title: "AI Guidance", desc: "QVAC provides translations, venue tips, safety reminders, and plan summaries on-device." },
  { step: "6", title: "Expense Splitting", desc: "One person pays, the group confirms shares. WDK records and executes USDt settlements." },
  { step: "7", title: "Settlement", desc: "WDK processes self-custodial USDT transfers between wallets. No middleman needed." },
  { step: "8", title: "Trip Complete", desc: "Final summary shows private AI used, P2P coordination, and self-custodial settlement." },
]

export default function Architecture() {
  return (
    <div className="min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">🏗️ Architecture</h1>
          <p className="text-gray-400 mt-2">How AwayKit combines local AI, P2P sync, and self-custodial wallets</p>
        </div>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800">
          <CardTitle className="mb-6">Three-Layer Architecture</CardTitle>
          <div className="space-y-6">
            {layers.map((layer, i) => (
              <div key={i} className={`p-4 rounded-xl border ${layer.color === "pitch" ? "bg-pitch-500/5 border-pitch-500/20" : layer.color === "tether" ? "bg-tether-500/5 border-tether-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{layer.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{layer.name}</h3>
                    <p className="text-sm text-gray-400">{layer.description}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">What it does</p>
                    <p className="text-gray-300">{layer.what}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Why it matters</p>
                    <p className="text-gray-300">{layer.why}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">How we use it</p>
                  <div className="flex flex-wrap gap-2">
                    {layer.usage.map((u, j) => (
                      <span key={j} className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-400">{u}</span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600">Package: {layer.npm}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Why this product needs all three</CardTitle>
          <CardContent className="mt-4 space-y-4 text-gray-300 text-sm leading-relaxed">
            <p><strong className="text-white">Fan coordination is fragmented.</strong> Today, fans use WhatsApp for chat, Google Maps for navigation, Splitwise for expenses, and Google Translate for languages. None of these work well together, none are offline-capable, and all require centralized servers.</p>
            <p><strong className="text-white">AwayKit unifies this into one workflow.</strong> QVAC provides the intelligence layer (translations, guidance, summaries), Pears provides the coordination layer (group sync, presence, messaging), and WDK provides the financial layer (shared funds, splits, settlements).</p>
            <p><strong className="text-white">Together, they enable a matchday experience that works even when connectivity fails.</strong> Fans at a crowded stadium often lose signal. Pears keeps the group synced locally. QVAC keeps AI available offline. WDK keeps funds self-custodial.</p>
          </CardContent>
        </Card>
        <Card>
          <CardTitle>AwayKit vs Traditional Solutions</CardTitle>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 text-gray-500">Feature</th>
                  <th className="text-left py-3 text-gray-500">Traditional</th>
                  <th className="text-left py-3 text-pitch-400">AwayKit</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="py-3 text-white font-medium">{c.feature}</td>
                    <td className="py-3 text-gray-400">{c.traditional}</td>
                    <td className="py-3 text-pitch-300">{c.awaykit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <CardTitle>End-to-End Flow</CardTitle>
          <CardContent className="mt-4">
            <div className="space-y-4">
              {flowSteps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-pitch-500/20 border border-pitch-500/40 flex items-center justify-center text-pitch-400 font-bold text-sm flex-shrink-0">{s.step}</div>
                    {i < flowSteps.length - 1 && <div className="w-0.5 flex-1 bg-pitch-500/20 my-1" />}
                  </div>
                  <div className="pb-4">
                    <h4 className="text-white font-medium">{s.title}</h4>
                    <p className="text-sm text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pitch-500/5 to-emerald-500/5 border-pitch-500/20">
          <CardTitle>🔒 Privacy & Self-Custody Story</CardTitle>
          <CardContent className="mt-4 space-y-3 text-sm text-gray-300">
            <p><strong className="text-pitch-400">AI runs locally.</strong> Your questions, translations, and trip data never leave your device. No cloud AI provider sees your data.</p>
            <p><strong className="text-tether-400">Chat syncs peer-to-peer.</strong> Group messages and status updates go directly between devices. No server stores your conversations.</p>
            <p><strong className="text-emerald-400">Payments are self-custodial.</strong> You control your wallet. Shared funds are managed through smart contracts, not a trusted third party.</p>
            <p className="text-gray-500 mt-4">This is not just a privacy feature - it is a product advantage. When the stadium WiFi crashes, AwayKit still works.</p>
          </CardContent>
        </Card>
        <Link to="/" className="block">
          <Button variant="ghost" fullWidth>← Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
