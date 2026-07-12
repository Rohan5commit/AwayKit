import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import Landing from "./pages/Landing"
import GroupSetup from "./pages/GroupSetup"
import TripBoard from "./pages/TripBoard"
import AIAssistant from "./pages/AIAssistant"
import SplitAndSettle from "./pages/SplitAndSettle"
import Architecture from "./pages/Architecture"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-950">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/setup" element={<GroupSetup />} />
            <Route path="/demo" element={<GroupSetup />} />
            <Route path="/trip" element={<TripBoard />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/split" element={<SplitAndSettle />} />
            <Route path="/architecture" element={<Architecture />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

