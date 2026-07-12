import type { MatchGroup, GroupMember, PeerSyncEvent, GroupMessage } from "@/types"

// Pears P2P sync layer for peer-to-peer group coordination
// Uses Hypercore for data storage, Hyperswarm for peer discovery

let swarm: any = null
let corestore: any = null
let groupCore: any = null
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

export async function initPears(config: PearsConfig): Promise<void> {
  currentConfig = config
  try {
    // Dynamic import for Pears SDK
    const { Hyperswarm } = await import("@pear-js/hyperswarm")
    const { Corestore } = await import("@pear-js/core")
    
    corestore = new Corestore()
    swarm = new Hyperswarm()
    
    // Join a topic based on groupId for group-specific sync
    const topic = Buffer.from(config.groupId.slice(0, 64).padEnd(64, "0"), "hex")
    swarm.join(topic)
    
    swarm.on("connection", (socket: any, peerInfo: any) => {
      const peerId = peerInfo.publicKey?.toString("hex") || "unknown"
      connectedPeers.set(peerId, socket)
      config.onPeerConnect?.(peerId)
      
      socket.on("data", (data: Buffer) => {
        try {
          const event: PeerSyncEvent = JSON.parse(data.toString())
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
  const data = Buffer.from(JSON.stringify(event))
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
    const data = Buffer.from(JSON.stringify(event))
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
  // Persist to localStorage for offline access
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
  groupCore = null
  swarm = null
  currentConfig = null
  eventListeners = []
  localState = {}
}

