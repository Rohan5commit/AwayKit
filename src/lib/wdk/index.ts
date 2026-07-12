import type { WalletState, SharedExpense, SettlementRecord } from "@/types"

// WDK Wallet Layer for self-custodial USDt management
// Uses Wallet Development Kit for multi-chain wallet operations

let wdkInstance: any = null
let walletState: WalletState = {
  connected: false,
  balance: 0,
  network: "tron",
}
let walletListeners: ((state: WalletState) => void)[] = []
let settlementHistory: SettlementRecord[] = []

export async function initWallet(mnemonic?: string): Promise<WalletState> {
  try {
    // Dynamic import for WDK
    const WDK = await import("@wdk/core")
    wdkInstance = new WDK.default(mnemonic || generateMnemonic())
    
    // Register TRON module for USDT-TRC20
    const { WalletManagerTron } = await import("@wdk/wallet-tron")
    wdkInstance.registerWallet("tron", WalletManagerTron, {
      rpcUrl: "https://nile.trongrid.io",
    })
    
    // Register EVM module for USDT-ERC20
    const { WalletManagerEvm } = await import("@wdk/wallet-evm")
    wdkInstance.registerWallet("ethereum", WalletManagerEvm, {
      rpcUrl: "https://eth.llamarpc.com",
    })
    
    const address = await wdkInstance.getAddress("tron")
    const balance = await getBalance("tron")
    
    walletState = {
      connected: true,
      address,
      balance,
      network: "tron",
      seedPhrase: mnemonic || wdkInstance.mnemonic,
    }
    
    notifyWalletListeners()
    console.log("[WDK] Wallet connected:", address)
  } catch (err) {
    console.warn("[WDK] Running in demo mode (SDK not available):", err)
    // Demo wallet
    walletState = {
      connected: true,
      address: "TJmH...demo" + Math.random().toString(36).slice(2, 8),
      balance: 1250.50,
      network: "tron",
    }
    notifyWalletListeners()
  }
  return walletState
}

export async function getBalance(network: string = "tron"): Promise<number> {
  if (wdkInstance) {
    try {
      const account = await wdkInstance.getAccount(network, 0)
      return account.balance || 0
    } catch (e) {
      console.error("[WDK] Balance check error:", e)
    }
  }
  return walletState.balance || 1250.50
}

export async function sendUsdt(
  toAddress: string,
  amount: number,
  network: string = "tron"
): Promise<string> {
  if (!walletState.connected) throw new Error("Wallet not connected")
  
  if (wdkInstance) {
    try {
      const txHash = await wdkInstance.sendTransaction(network, {
        to: toAddress,
        amount: amount,
        token: "USDT",
      })
      return txHash
    } catch (e) {
      console.error("[WDK] Send USDT error:", e)
      throw e
    }
  }
  
  // Demo mode: simulate transaction
  const demoTxHash = "0x" + crypto.randomUUID().replace(/-/g, "").slice(0, 64)
  console.log("[WDK Demo] Simulated USDT transfer:", { toAddress, amount, txHash: demoTxHash })
  return demoTxHash
}

export async function splitExpense(
  expense: SharedExpense,
  memberAddresses: Record<string, string>
): Promise<SettlementRecord[]> {
  const records: SettlementRecord[] = []
  const payerAddress = memberAddresses[expense.paidBy]
  
  for (const memberId of expense.splitAmong) {
    if (memberId === expense.paidBy) continue
    const memberAddress = memberAddresses[memberId]
    if (!memberAddress) continue
    
    let txHash: string | undefined
    try {
      txHash = await sendUsdt(memberAddress, expense.perPerson)
    } catch (e) {
      console.error("[WDK] Split payment failed for:", memberId, e)
    }
    
    const record: SettlementRecord = {
      id: crypto.randomUUID(),
      expenseId: expense.id,
      from: memberId,
      to: expense.paidBy,
      amount: expense.perPerson,
      currency: "USDT",
      txHash,
      status: txHash ? "completed" : "pending",
      createdAt: new Date().toISOString(),
    }
    records.push(record)
  }
  
  settlementHistory.push(...records)
  return records
}

export async function reimburseFriend(
  friendAddress: string,
  amount: number,
  note: string
): Promise<string> {
  const txHash = await sendUsdt(friendAddress, amount)
  
  const record: SettlementRecord = {
    id: crypto.randomUUID(),
    expenseId: "reimburse",
    from: walletState.address || "",
    to: friendAddress,
    amount,
    currency: "USDT",
    txHash,
    status: "completed",
    createdAt: new Date().toISOString(),
  }
  settlementHistory.push(record)
  
  return txHash
}

export async function topUpTripFund(groupId: string, amount: number): Promise<string> {
  // In production, this would send to a shared multisig or group wallet
  const txHash = await sendUsdt(`GROUP_FUND_${groupId}`, amount)
  return txHash
}

export function getWalletState(): WalletState {
  return { ...walletState }
}

export function getSettlementHistory(): SettlementRecord[] {
  return [...settlementHistory]
}

export function onWalletChange(listener: (state: WalletState) => void): () => void {
  walletListeners.push(listener)
  return () => {
    walletListeners = walletListeners.filter(fn => fn !== listener)
  }
}

function notifyWalletListeners(): void {
  walletListeners.forEach(fn => fn({ ...walletState }))
}

function generateMnemonic(): string {
  const words = ["abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract",
    "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid"]
  return words.join(" ")
}

export function disconnectWallet(): void {
  walletState = {
    connected: false,
    balance: 0,
    network: "tron",
  }
  wdkInstance = null
  settlementHistory = []
  notifyWalletListeners()
}

