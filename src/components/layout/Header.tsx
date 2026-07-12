import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/Button"
import { StatusBadge } from "../ui/StatusBadge"
import { getWalletState } from "@/lib/wdk"
import { useState, useEffect } from "react"
import type { WalletState } from "@/types"

export function Header() {
  const location = useLocation()
  const [wallet, setWallet] = useState<WalletState>(getWalletState())

  useEffect(() => {
    const update = () => setWallet(getWalletState())
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const isHome = location.pathname === "/"

  return (
    <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <span className="text-xl font-bold text-white">
              Away<span className="text-pitch-500">Kit</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {wallet.connected && (
              <StatusBadge variant="success">
                <span className="hidden sm:inline">{wallet.balance?.toFixed(2)} USDT</span>
                <span className="sm:hidden">$</span>
              </StatusBadge>
            )}
            
            {!isHome && (
              <Link to="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

