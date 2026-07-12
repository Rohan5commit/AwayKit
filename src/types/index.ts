import { z } from "zod"

// --- Data Models / Schemas ---

export const MemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  status: z.enum(["offline", "traveling", "arrived"]),
  walletAddress: z.string().optional(),
  balance: z.number().default(0),
})
export type GroupMember = z.infer<typeof MemberSchema>

export const MeetupPointSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  arrivalWindow: z.string().optional(),
})
export type MeetupPoint = z.infer<typeof MeetupPointSchema>

export const TripPlanSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  destination: z.string(),
  venue: z.string().optional(),
  date: z.string(),
  meetingTime: z.string(),
  meetupPoints: z.array(MeetupPointSchema),
  notes: z.array(z.string()).default([]),
  checklist: z.array(z.object({
    id: z.string(),
    text: z.string(),
    checked: z.boolean().default(false),
  })).default([]),
})
export type TripPlan = z.infer<typeof TripPlanSchema>

export const MatchGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  match: z.string(),
  members: z.array(MemberSchema),
  tripPlan: TripPlanSchema.optional(),
  fundBalance: z.number().default(0),
  currency: z.string().default("USDT"),
  createdAt: z.string(),
})
export type MatchGroup = z.infer<typeof MatchGroupSchema>

export const SharedExpenseSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  paidBy: z.string(),
  description: z.string(),
  amount: z.number(),
  currency: z.string().default("USDT"),
  splitAmong: z.array(z.string()),
  perPerson: z.number(),
  settled: z.boolean().default(false),
  createdAt: z.string(),
})
export type SharedExpense = z.infer<typeof SharedExpenseSchema>

export const SettlementRecordSchema = z.object({
  id: z.string(),
  expenseId: z.string(),
  from: z.string(),
  to: z.string(),
  amount: z.number(),
  currency: z.string().default("USDT"),
  txHash: z.string().optional(),
  status: z.enum(["pending", "completed"]),
  createdAt: z.string(),
})
export type SettlementRecord = z.infer<typeof SettlementRecordSchema>

export const WalletStateSchema = z.object({
  connected: z.boolean().default(false),
  address: z.string().optional(),
  balance: z.number().default(0),
  network: z.string().default("tron"),
  seedPhrase: z.string().optional(),
})
export type WalletState = z.infer<typeof WalletStateSchema>

export const PeerSyncEventSchema = z.object({
  id: z.string(),
  type: z.enum(["member_update", "trip_update", "expense_added", "settlement", "chat_message", "meetup_status"]),
  data: z.record(z.any()),
  timestamp: z.string(),
  peerId: z.string(),
})
export type PeerSyncEvent = z.infer<typeof PeerSyncEventSchema>

export const LocalAiResponseSchema = z.object({
  id: z.string(),
  query: z.string(),
  response: z.string(),
  type: z.enum(["checklist", "translation", "qa", "summary", "safety", "ocr"]),
  language: z.string().optional(),
  createdAt: z.string(),
})
export type LocalAiResponse = z.infer<typeof LocalAiResponseSchema>

export const MatchdaySummarySchema = z.object({
  groupId: z.string(),
  membersAttended: z.number(),
  totalExpenses: z.number(),
  totalSettled: z.number(),
  aiUsed: z.boolean(),
  p2pSyncUsed: z.boolean(),
  selfCustodialUsed: z.boolean(),
  highlights: z.array(z.string()),
})
export type MatchdaySummary = z.infer<typeof MatchdaySummarySchema>

export const GroupMessageSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  content: z.string(),
  timestamp: z.string(),
  type: z.enum(["text", "status", "expense", "ai_response"]).default("text"),
})
export type GroupMessage = z.infer<typeof GroupMessageSchema>

