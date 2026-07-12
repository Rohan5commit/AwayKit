import React, { useState, useEffect, useRef } from "react"
import { Card, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Input"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { groupStore } from "@/lib/trip/store"
import { initQvac, generateChecklist, translatePhrase, answerVenueQuestion, generateSafetyTips, summarizeGroupPlan, understandTicketInfo } from "@/lib/qvac"
import type { MatchGroup, LocalAiResponse } from "@/types"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  type: string
  timestamp: string
}

const quickPrompts = [
  { label: "📋 Checklist", prompt: "Generate a matchday checklist for our trip" },
  { label: "🗣️ Translate", prompt: "How do I say \"Where is the stadium?\" in Spanish?" },
  { label: "📝 Summarize", prompt: "Summarize the group plan for everyone" },
  { label: "🛡️ Safety Tips", prompt: "Give me safety tips for the venue" },
  { label: "❓ Venue Q&A", prompt: "What should we know about the venue?" },
]

export default function AIAssistant() {
  const [group, setGroup] = useState<MatchGroup | null>(groupStore.get())
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiReady, setAiReady] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsub = groupStore.subscribe(setGroup)
    initQvac().then(() => setAiReady(true))
    return unsub
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      type: "user",
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const lower = text.toLowerCase()
      let response = ""
      let type = "qa"

      if (lower.includes("checklist") || lower.includes("bring")) {
        const venue = group?.tripPlan?.venue || group?.tripPlan?.destination || "the stadium"
        response = await generateChecklist("away match", venue)
        type = "checklist"
      } else if (lower.includes("translat") || lower.includes("say") || lower.includes("spanish") || lower.includes("french") || lower.includes("italian")) {
        const lang = lower.includes("spanish") ? "Spanish" : lower.includes("french") ? "French" : lower.includes("italian") ? "Italian" : "Spanish"
        response = await translatePhrase(text, lang)
        type = "translation"
      } else if (lower.includes("summarize") || lower.includes("plan")) {
        const planData = group ? JSON.stringify({ destination: group.tripPlan?.destination, members: group.members.map(m => m.name), match: group.match, notes: group.tripPlan?.notes }) : "No trip data"
        response = await summarizeGroupPlan(planData)
        type = "summary"
      } else if (lower.includes("safety") || lower.includes("risk")) {
        const venue = group?.tripPlan?.venue || "the stadium"
        response = await generateSafetyTips(venue, "the city")
        type = "safety"
      } else if (lower.includes("venue") || lower.includes("stadium")) {
        const context = `Venue: ${group?.tripPlan?.venue || "Unknown"}, Destination: ${group?.tripPlan?.destination || "Unknown"}`
        response = await answerVenueQuestion(text, context)
        type = "qa"
      } else {
        response = `I can help with:
- 📋 Matchday checklist generation
- 🗣️ Travel phrase translation
- 📝 Group plan summarization
- 🛡️ Safety and venue tips
- ❓ Venue Q&A

Try one of the quick prompts below, or ask me anything about your matchday trip!"
      }

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        type,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        type: "error",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">🧠 Local AI Assistant</h1>
          <p className="text-gray-400 mt-1">Powered by QVAC — runs entirely on your device</p>
          <div className="mt-2">
            <StatusBadge variant={aiReady ? "success" : "warning"}>
              {aiReady ? "QVAC Ready" : "Loading QVAC..."}
            </StatusBadge>
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="h-[50vh] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">⚽</div>
                <p className="text-gray-400">Ask me anything about your matchday trip!</p>
                <p className="text-xs text-gray-600 mt-2">All responses generated locally via QVAC</p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-pitch-500/20 border border-pitch-500/30"
                    : "bg-gray-800/50 border border-gray-700/50"
                }`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🧠</span>
                      <span className="text-xs text-gray-500">QVAC Local AI</span>
                      <StatusBadge variant="info" dot={false}>{msg.type}</StatusBadge>
                    </div>
                  )}
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(msg.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pitch-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-pitch-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-pitch-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs text-gray-500 ml-1">Thinking locally...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 justify-center">
          {quickPrompts.map((qp, i) => (
            <Button key={i} variant="ghost" size="sm" onClick={() => handleSend(qp.prompt)}>
              {qp.label}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your trip, translate a phrase, get venue tips..."
            className="flex-1"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          />
          <Button
            variant="primary"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="self-end"
          >
            Send
          </Button>
        </div>

        <p className="text-center text-xs text-gray-600">
          🔒 All AI processing happens locally on your device via QVAC. No data leaves your phone.
        </p>
      </div>
    </div>
  )
}

