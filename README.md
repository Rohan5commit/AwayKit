# ⚽ AwayKit

**Private matchday coordination for football fans — local AI, peer-to-peer rooms, self-custodial USDt.**

AwayKit helps football fans move together, talk together, and pay together on matchday using on-device AI, peer-to-peer sync, and self-custodial USDt.

## 🏆 Tether Developers Cup 2026

AwayKit is built for the Tether Developers Cup, combining three Tether technologies into one football-native product:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 🧠 AI | **QVAC** | On-device LLM inference for translations, checklists, and venue guidance |
| 🔗 Sync | **Pears** | Peer-to-peer group coordination without servers |
| 💰 Wallet | **WDK** | Self-custodial USDt wallets for shared expenses and settlements |

## 🎯 Why AwayKit?

Fan coordination tools are fragmented and cloud-dependent. Matchday groups often have poor connectivity and privacy concerns. AwayKit solves this:

- **Local AI** — QVAC runs translations, safety tips, and plan summaries on your device
- **P2P Sync** — Pears keeps your group synced even with weak connectivity
- **Self-Custodial** — WDK wallets mean no trusted organizer holding everyone's money

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Rohan5commit/AwayKit.git
cd AwayKit

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Demo Flow

1. **Landing Page** — See the value proposition and architecture overview
2. **Try Demo** — Click to select a pre-built matchday scenario
3. **Trip Board** — View group members, expenses, chat, and checklist
4. **AI Assistant** — Ask for translations, checklists, or venue tips (runs locally)
5. **Split & Settle** — Add expenses and settle in USDt via WDK

## 🏗️ Architecture

```
AwayKit
├── src/
│   ├── app/           # Application entry points
│   ├── components/    # Reusable UI components
│   │   ├── ui/        # Button, Card, Modal, StatusBadge, etc.
│   │   └── layout/    # Header, Footer
│   ├── lib/
│   │   ├── qvac/      # QVAC local AI layer
│   │   ├── pears/     # Pears P2P sync layer
│   │   ├── wdk/       # WDK wallet layer
│   │   ├── trip/      # Trip state management
│   │   └── demo/      # Seeded demo scenarios
│   ├── pages/         # Landing, GroupSetup, TripBoard, AI, Split, Architecture
│   └── types/         # TypeScript models and Zod schemas
```

## 🔧 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Build:** Vite
- **AI:** QVAC SDK (`@qvac/sdk`)
- **P2P:** Pears (`@pear-js/core`, `@pear-js/hyperswarm`)
- **Wallets:** WDK (`@wdk/core`, `@wdk/wallet-evm`, `@wdk/wallet-tron`)
- **Validation:** Zod

## 📖 Documentation

- [Architecture](docs/architecture.md) — System design and component interactions
- [Demo Script](docs/demo-script.md) — 2-4 minute demo narration
- [Setup Guide](docs/setup.md) — Installation and configuration
- [Privacy Story](docs/privacy-story.md) — Why local-first matters
- [Judging Guide](docs/judging-hook.md) — Why this scores strongly
- [Prompts Used](docs/prompts-used.md) — AI prompts used during build
- [Build Log](docs/ai-build-log.md) — Development journal
- [Credits](docs/credits.md) — Frameworks and assets

## 🧪 What We Build

| Feature | How It Works |
|---------|-------------|
| Matchday Groups | Create or join groups with invite codes (P2P) |
| Shared Trip Board | Live view of members, status, expenses, and notes |
| Local AI Assistant | QVAC-powered translations, checklists, and venue Q&A |
| Expense Splitting | Add shared costs, calculate per-person splits |
| USDt Settlement | Self-custodial wallet-to-wallet transfers via WDK |
| Offline Support | Local-first state with P2P sync when peers connect |

## ⚠️ Limitations

- QVAC model loading requires sufficient device memory
- P2P peer discovery depends on network conditions
- USDt transactions require network confirmation
- Demo mode simulates SDK responses when native modules unavailable

## 🔮 Future Work

- Native mobile builds via Tauri or React Native
- Map integration for meetup points
- Push notifications for peer status changes
- Multi-currency support beyond USDT
- Integration with football APIs for live match data

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

Built for the Tether Developers Cup 2026 🏆
