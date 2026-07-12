import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

const features = [
  {
    icon: "🧠",
    title: "Local AI",
    desc: "QVAC-powered on-device intelligence for translations, checklists, and venue guidance — no cloud required.",
  },
  {
    icon: "🔗",
    title: "P2P Sync",
    desc: "Pears-powered peer-to-peer group coordination. Works even with weak connectivity.",
  },
  {
    icon: "💰",
    title: "Self-Custodial USDt",
    desc: "WDK wallet integration for shared expenses, splits, and settlements — no trusted middleman needed.",
  },
]

const workflow = [
  { step: "1", title: "Plan the Trip", desc: "Create a matchday group, set destination, build a shared checklist." },
  { step: "2", title: "Sync the Group", desc: "Friends join peer-to-peer. Share updates, meetup points, and status." },
  { step: "3", title: "Get AI Help", desc: "Local AI answers venue questions, translates phrases, summarizes plans." },
  { step: "4", title: "Split & Settle", desc: "Track shared costs and settle in USDt with self-custodial wallets." },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pitch-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-pitch-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pitch-500/10 border border-pitch-500/20 text-pitch-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-pitch-400 animate-pulse" />
            Tether Developers Cup 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
            Matchday coordination
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pitch-400 to-pitch-600">for football fans</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            AwayKit helps football fans move together, talk together, and pay together on matchday using <span className="text-pitch-400">on-device AI</span>, <span className="text-tether-400">peer-to-peer sync</span>, and <span className="text-emerald-400">self-custodial USDt</span>.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/demo">
              <Button variant="primary" size="lg" icon="⚡">Try Demo</Button>
            </Link>
            <Link to="/architecture">
              <Button variant="ghost" size="lg">View Architecture</Button>
            </Link>
            <Link to="/demo">
              <Button variant="secondary" size="lg" icon="⚽">See Matchday Flow</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Built for the terraces, not the cloud
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} hover className="text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Plan → Sync → Guide → Split → Settle
        </h2>
        <div className="grid sm:grid-cols-4 gap-6">
          {workflow.map((w, i) => (
            <div key={i} className="relative">
              {i < workflow.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-pitch-500/50 to-transparent z-0" />
              )}
              <Card className="relative z-10 text-center">
                <div className="w-10 h-10 rounded-full bg-pitch-500/20 border border-pitch-500/40 flex items-center justify-center text-pitch-400 font-bold text-lg mx-auto mb-3">
                  {w.step}
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{w.title}</h3>
                <p className="text-xs text-gray-400">{w.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Callout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-3">Privacy by Design</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              AI runs on your device. Chat syncs peer-to-peer. Payments are self-custodial.
              No centralized SaaS backend required for the core experience.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <span className="px-3 py-1.5 rounded-full bg-pitch-500/10 border border-pitch-500/20 text-pitch-400 text-sm">🧠 QVAC Local AI</span>
              <span className="px-3 py-1.5 rounded-full bg-tether-500/10 border border-tether-500/20 text-tether-400 text-sm">🔗 Pears P2P</span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">💰 WDK Self-Custody</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

