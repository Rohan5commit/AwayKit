import type { MatchGroup, SharedExpense, SettlementRecord, GroupMessage } from "@/types"

export interface DemoScenario {
  name: string
  description: string
  icon: string
  group: MatchGroup
  expenses: SharedExpense[]
  messages: GroupMessage[]
}

export const demoScenarios: DemoScenario[] = [
  {
    name: "Stadium Away Day",
    description: "4 friends traveling to an away match 200km away",
    icon: "⚽",
    group: {
      id: "demo-stadium-001",
      name: "Barcelona Away End",
      match: "Real Madrid vs Barcelona - El Clásico",
      members: [
        { id: "m1", name: "Alex", status: "arrived", walletAddress: "TAlex_demo111", balance: 350 },
        { id: "m2", name: "Sam", status: "traveling", walletAddress: "TSam_demo222", balance: 280 },
        { id: "m3", name: "Jordan", status: "arrived", walletAddress: "TJordan_demo333", balance: 420 },
        { id: "m4", name: "Riley", status: "offline", walletAddress: "TRiley_demo444", balance: 195 },
      ],
      tripPlan: {
        id: "trip-001",
        groupId: "demo-stadium-001",
        destination: "Santiago Bernabéu, Madrid",
        venue: "Santiago Bernabéu Stadium",
        date: "2026-07-15",
        meetingTime: "09:00",
        meetupPoints: [
          { id: "mp1", name: "Central Station - Platform 7", latitude: 40.4072, longitude: -3.6931, address: "Plaza de la Station, Madrid" },
          { id: "mp2", name: "Bar El Clásico (Pre-match meetup)", latitude: 40.4108, longitude: -3.6941, address: "Calle de la Arena, 12, Madrid" },
        ],
        notes: ["Bring scarves and flags", "Train departs 09:15 - dont be late!", "Meeting at Platform 7"] ,
        checklist: [
          { id: "c1", text: "Match tickets (digital)", checked: true },
          { id: "c2", text: "Train tickets booked", checked: true },
          { id: "c3", text: "Team scarves", checked: true },
          { id: "c4", text: "Portable charger", checked: false },
          { id: "c5", text: "Cash + USDT wallet", checked: true },
          { id: "c6", text: "Rain jacket", checked: false },
        ],
      },
      fundBalance: 500,
      currency: "USDT",
      createdAt: "2026-07-10T14:00:00Z",
    },
    expenses: [
      { id: "e1", groupId: "demo-stadium-001", paidBy: "m1", description: "Train tickets (4x)", amount: 120, currency: "USDT", splitAmong: ["m1", "m2", "m3", "m4"], perPerson: 30, settled: true, createdAt: "2026-07-10T15:00:00Z" },
      { id: "e2", groupId: "demo-stadium-001", paidBy: "m3", description: "Pre-match lunch & drinks", amount: 85, currency: "USDT", splitAmong: ["m1", "m2", "m3", "m4"], perPerson: 21.25, settled: true, createdAt: "2026-07-10T16:00:00Z" },
      { id: "e3", groupId: "demo-stadium-001", paidBy: "m2", description: "Taxi to stadium", amount: 45, currency: "USDT", splitAmong: ["m1", "m2", "m3"], perPerson: 15, settled: false, createdAt: "2026-07-10T17:00:00Z" },
      { id: "e4", groupId: "demo-stadium-001", paidBy: "m1", description: "Match program + scarves (extra)", amount: 60, currency: "USDT", splitAmong: ["m1", "m2", "m3", "m4"], perPerson: 15, settled: false, createdAt: "2026-07-10T18:00:00Z" },
    ],
    messages: [
      { id: "msg1", groupId: "demo-stadium-001", senderId: "m1", senderName: "Alex", content: "Alright lads, tickets are loaded! See you at Platform 7 at 9. Dont be late!", timestamp: "2026-07-14T20:00:00Z", type: "text" },
      { id: "msg2", groupId: "demo-stadium-001", senderId: "m2", senderName: "Sam", content: "On my way! ETA 15 mins. Got the snacks covered 🍕", timestamp: "2026-07-15T08:45:00Z", type: "text" },
      { id: "msg3", groupId: "demo-stadium-001", senderId: "m3", senderName: "Jordan", content: "Arrived at Platform 7. Train leaves in 30 mins!", timestamp: "2026-07-15T08:50:00Z", type: "status" },
      { id: "msg4", groupId: "demo-stadium-001", senderId: "m4", senderName: "Riley", content: "Running 10 mins late, save me a seat!", timestamp: "2026-07-15T08:55:00Z", type: "text" },
      { id: "msg5", groupId: "demo-stadium-001", senderId: "system", senderName: "AwayKit", content: "💰 Sam added expense: Taxi to stadium (45 USDT) - 15 USDT each", timestamp: "2026-07-15T11:30:00Z", type: "expense" },
      { id: "msg6", groupId: "demo-stadium-001", senderId: "system", senderName: "AwayKit AI", content: "🛡️ Safety reminder: Stay together near the stadium. Avoid wearing rival colors. Save emergency number: 112 (EU)", timestamp: "2026-07-15T12:00:00Z", type: "ai_response" },
    ],
  },
  {
    name: "Away Fan Meetup",
    description: "Away fans gathering in a new city for a cup match",
    icon: "🏟️",
    group: {
      id: "demo-away-002",
      name: "London Blues in Milan",
      match: "AC Milan vs Chelsea - Champions League",
      members: [
        { id: "m5", name: "Tom", status: "arrived", walletAddress: "TTom_demo555", balance: 500 },
        { id: "m6", name: "Lisa", status: "arrived", walletAddress: "TLisa_demo666", balance: 420 },
        { id: "m7", name: "Marcus", status: "traveling", walletAddress: "TMarcus_demo777", balance: 350 },
      ],
      tripPlan: {
        id: "trip-002",
        groupId: "demo-away-002",
        destination: "San Siro, Milan",
        venue: "Stadio Giuseppe Meazza (San Siro)",
        date: "2026-07-20",
        meetingTime: "18:00",
        meetupPoints: [
          { id: "mp3", name: "Navigli District - Bar Roma", latitude: 45.4464, longitude: 9.1893, address: "Via Naviglio Grande, Milan" },
        ],
        notes: ["Champions League night! Arrive early for atmosphere", "Navigate area has great pre-match bars"] ,
        checklist: [
          { id: "c7", text: "Match tickets", checked: true },
          { id: "c8", text: "Passport (away match)", checked: true },
          { id: "c9", text: "Chelsea scarf", checked: true },
          { id: "c10", text: "Travel adapter (EU)", checked: true },
        ],
      },
      fundBalance: 350,
      currency: "USDT",
      createdAt: "2026-07-15T10:00:00Z",
    },
    expenses: [
      { id: "e5", groupId: "demo-away-002", paidBy: "m5", description: "Airport transfer (3x)", amount: 75, currency: "USDT", splitAmong: ["m5", "m6", "m7"], perPerson: 25, settled: true, createdAt: "2026-07-20T14:00:00Z" },
      { id: "e6", groupId: "demo-away-002", paidBy: "m6", description: "Pre-match dinner at Navigli", amount: 120, currency: "USDT", splitAmong: ["m5", "m6", "m7"], perPerson: 40, settled: false, createdAt: "2026-07-20T16:30:00Z" },
    ],
    messages: [
      { id: "msg7", groupId: "demo-away-002", senderId: "m5", senderName: "Tom", content: "Made it to Milan! The city is buzzing already 🔵⚫", timestamp: "2026-07-19T22:00:00Z", type: "text" },
      { id: "msg8", groupId: "demo-away-002", senderId: "system", senderName: "AwayKit AI", content: "🇮🇹 Translation: Where is San Siro stadium? → Dove si trova lo stadio San Siro?", timestamp: "2026-07-20T10:00:00Z", type: "ai_response" },
    ],
  },
  {
    name: "Watch Party Fund",
    description: "Organizer handling shared expenses for a local watch party",
    icon: "📺",
    group: {
      id: "demo-watch-003",
      name: "Sunday League Watch Party",
      match: "Arsenal vs Tottenham - North London Derby",
      members: [
        { id: "m8", name: "Chris", status: "arrived", walletAddress: "TChris_demo888", balance: 200 },
        { id: "m9", name: "Priya", status: "arrived", walletAddress: "TPriya_demo999", balance: 180 },
        { id: "m10", name: "Jake", status: "arrived", walletAddress: "TJake_demo000", balance: 150 },
        { id: "m11", name: "Emma", status: "arrived", walletAddress: "TEmma_demo111", balance: 220 },
        { id: "m12", name: "Ollie", status: "arrived", walletAddress: "TOllie_demo222", balance: 175 },
      ],
      tripPlan: {
        id: "trip-003",
        groupId: "demo-watch-003",
        destination: "Chriss
