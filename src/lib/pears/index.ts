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

// Helper: convert string to Uint8Array (browser-safe alternative to Buffer.from)
function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(str)
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
    
    // Create topic from groupId (browser-safe)
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
          const decoder = new TextDecoder()
          const text = decoder.decode(data)
          const event: PeerSyncEvent = JSON.parse(text)
          config.onEvent?.(event)
          eventListeners.forEach(fn => fn(event))
        } catch (e) {
          console.error("[Pears] Failed to parse peer message:", e)
        }
      })
      
      socket.on("close", () => {
        connectedPeers.delete(peerId)
        config.onPeerDisconnect?.(peerId)
      })
    })
    
    await swarm.listen()
    console.log("[Pears] Swarm listening for peers on group:", config.groupId)
  } catch (err) {
    console.warn("[Pears] Running in demo mode (SDK not available):", err)
  }
}

export function broadcastEvent(event: PeerSyncEvent): void {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(event))
  connectedPeers.forEach((socket) => {
    try {
      socket.write(data)
    } catch (e) {
      console.error("[Pears] Broadcast error:", e)
    }
  })
}

export function sendToPeer(peerId: string, event: PeerSyncEvent): void {
  const socket = connectedPeers.get(peerId)
  if (socket) {
    const encoder = new TextEncoder()
    const data = encoder.encode(JSON.stringify(event))
    socket.write(data)
  }
}

export function onSyncEvent(listener: (event: PeerSyncEvent) => void): () => void {
  eventListeners.push(listener)
  return () => {
    eventListeners = eventListeners.filter(fn => fn !== listener)
  }
}

export function getConnectedPeers(): string[] {
  return Array.from(connectedPeers.keys())
}

export function getPeerCount(): number {
  return connectedPeers.size
}

export function createSyncEvent(
  type: SyncEventType,
  data: Record<string, any>,
  peerId: string = "local"
): PeerSyncEvent {
  return {
    id: crypto.randomUUID(),
    type,
    data,
    timestamp: new Date().toISOString(),
    peerId,
  }
}

// Local-first state management for offline sync
let localState: Record<string, any> = {}

export function setLocalState(key: string, value: any): void {
  localState[key] = value
  try {
    localStorage.setItem(`pears_${key}`, JSON.stringify(value))
  } catch (e) {
    console.error("[Pears] Local storage error:", e)
  }
}

export function getLocalState<T = any>(key: string): T | null {
  if (localState[key] !== undefined) {
    return localState[key] as T
  }
  try {
    const stored = localStorage.getItem(`pears_${key}`)
    if (stored) {
      localState[key] = JSON.parse(stored)
      return localState[key] as T
    }
  } catch (e) {
    console.error("[Pears] Local storage read error:", e)
  }
  return null
}

export function destroyPears(): void {
  connectedPeers.forEach((socket) => {
    try {
      socket.close()
    } catch (e) { /* ignore */ }
  })
  connectedPeers.clear()
  swarm?.destroy?.()
  corestore = null
  swarm = null
  currentConfig = null
  eventListeners = []
  localState = {}
}
