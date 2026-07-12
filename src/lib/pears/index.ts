import type { PeerSyncEvent } from "@/types"

let swarm: any = null
let corestore: any = null
let connectedPeers: Map<string, any> = new Map()
let eventListeners: ((event: PeerSyncEvent) => void)[] = []

export type SyncEventType = PeerSyncEvent["type"]

export interface PearsConfig {
  groupId: string
  onEvent?: (event: PeerSyncEvent) => void
  onPeerConnect?: (peerId: string) => void
  onPeerDisconnect?: (peerId: string) => void
}

let currentConfig: PearsConfig | null = null

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function initPears(config: PearsConfig): Promise<void> {
  currentConfig = config
  try {
    const { Hyperswarm } = await import("@pear-js/hyperswarm")
    const { Corestore } = await import("@pear-js/core")
    corestore = new Corestore()
    swarm = new Hyperswarm()
    const topicUint8 = stringToUint8Array(config.groupId.padEnd(64, "0").slice(0, 64))
    const topic = new Uint8Array(32)
    topicUint8.forEach((byte, i) => { if (i < 32) topic[i] = byte })
    swarm.join(topic)
    swarm.on("connection", (socket: any, peerInfo: any) => {
      const peerId = peerInfo?.publicKey ? uint8ArrayToHex(new Uint8Array(peerInfo.publicKey)) : "peer-" + Math.random().toString(36).slice(2, 8)
      connectedPeers.set(peerId, socket)
      config.onPeerConnect?.(peerId)
      socket.on("data", (data: Uint8Array) => {
        try {
          const event: PeerSyncEvent = JSON.parse(new TextDecoder().decode(data))
          config.onEvent?.(event)
          eventListeners.forEach(fn => fn(event))
        } catch (e) { console.error("[Pears] Parse error:", e) }
      })
      socket.on("close", () => { connectedPeers.delete(peerId); config.onPeerDisconnect?.(peerId) })
    })
    await swarm.listen()
  } catch (err) { console.warn("[Pears] Demo mode:", err) }
}

export function broadcastEvent(event: PeerSyncEvent): void {
  const data = new TextEncoder().encode(JSON.stringify(event))
  connectedPeers.forEach((socket) => { try { socket.write(data) } catch (e) { console.error("[Pears] Broadcast error:", e) } })
}

export function getConnectedPeers(): string[] { return Array.from(connectedPeers.keys()) }
export function getPeerCount(): number { return connectedPeers.size }

export function setLocalState(key: string, value: any): void {
  try { localStorage.setItem(`pears_${key}`, JSON.stringify(value)) } catch (e) { console.error("[Pears] Storage error:", e) }
}

export function getLocalState<T = any>(key: string): T | null {
  try {
    const stored = localStorage.getItem(`pears_${key}`)
    return stored ? JSON.parse(stored) as T : null
  } catch (e) { return null }
}

export function destroyPears(): void {
  connectedPeers.forEach((s) => { try { s.close() } catch (e) {} })
  connectedPeers.clear()
  swarm?.destroy?.()
  corestore = null; swarm = null; currentConfig = null; eventListeners = []
}
