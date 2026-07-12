import React from "react"

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/50 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>⚽</span>
            <span>AwayKit — Matchday coordination for football fans</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pitch-500" />
              QVAC Local AI
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tether-500" />
              Pears P2P
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              WDK Wallets
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

