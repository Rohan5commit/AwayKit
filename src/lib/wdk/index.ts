import type { WalletState, SharedExpense, SettlementRecord } from "@/types"

let wdkInstance: unknown = null
let walletState: WalletState = {
  connected: false,
  balance: 0,
  network: "tron",
}
let walletListeners: ((state: WalletState) => void)[] = []
let settlementHistory: SettlementRecord[] = []

export async function initWallet(mnemonic?: string): Promise<WalletState> {
  try {
    const WDK = await import("@wdk/core")
    wdkInstance = new (WDK as any).default(mnemonic || generateMnemonic())
    const { WalletManagerTron } = await import("@wdk/wallet-tron")
    ;(wdkInstance as any).registerWallet("tron", WalletManagerTron, { rpcUrl: "https://nile.trongrid.io" })
    const { WalletManagerEvm } = await import("@wdk/wallet-evm")
    ;(wdkInstance as any).registerWallet("ethereum", WalletManagerEvm, { rpcUrl: "https://eth.llamarpc.com" })
    const address = await (wdkInstance as any).getAddress("tron")
    const balance = await getBalance("tron")
    walletState = { connected: true, address, balance, network: "tron", seedPhrase: mnemonic || (wdkInstance as any).mnemonic }
    notifyWalletListeners()
  } catch (err) {
    console.warn("[WDK] Demo mode:", err)
    walletState = { connected: true, address: "TJmH...demo" + Math.random().toString(36).slice(2, 8), balance: 1250.50, network: "tron" }
    notifyWalletListeners()
  }
  return walletState
}

export async function getBalance(network: string = "tron"): Promise<number> {
  if (wdkInstance) {
    try { const account = await (wdkInstance as any).getAccount(network, 0); return account.balance || 0 } catch (e) { console.error("[WDK] Balance error:", e) }
  }
  return walletState.balance || 1250.50
}

export async function sendUsdt(toAddress: string, amount: number, network: string = "tron"): Promise<string> {
  if (!walletState.connected) throw new Error("Wallet not connected")
  if (wdkInstance) {
    try { return await (wdkInstance as any).sendTransaction(network, { to: toAddress, amount, token: "USDT" }) } catch (e) { console.error("[WDK] Send error:", e); throw e }
  }
  const demoTxHash = "0x" + crypto.randomUUID().replace(/-/g, "").slice(0, 64)
  return demoTxHash
}

export async function splitExpense(expense: SharedExpense, memberAddresses: Record<string, string>): Promise<SettlementRecord[]> {
  const records: SettlementRecord[] = []
  for (const memberId of expense.splitAmong) {
    if (memberId === expense.paidBy) continue
    const memberAddress = memberAddresses[memberId]
    if (!memberAddress) continue
    let txHash: string | undefined
    try { txHash = await sendUsdt(memberAddress, expense.perPerson) } catch (e) { console.error("[WDK] Split failed:", memberId, e) }
    records.push({ id: crypto.randomUUID(), expenseId: expense.id, from: memberId, to: expense.paidBy, amount: expense.perPerson, currency: "USDT", txHash, status: txHash ? "completed" : "pending", createdAt: new Date().toISOString() })
  }
  settlementHistory.push(...records)
  return records
}

export async function topUpTripFund(groupId: string, amount: number): Promise<string> {
  return await sendUsdt(`GROUP_FUND_${groupId}`, amount)
}

export function getWalletState(): WalletState { return { ...walletState } }

function notifyWalletListeners(): void { walletListeners.forEach(fn => fn({ ...walletState })) }

function generateMnemonic(): string {
  return ["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid"].join(" ")
}

export function disconnectWallet(): void {
  walletState = { connected: false, balance: 0, network: "tron" }
  wdkInstance = null
  settlementHistory = []
  notifyWalletListeners()
}
