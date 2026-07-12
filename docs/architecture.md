# Architecture

## Overview

AwayKit is a three-layer architecture combining local AI, P2P sync, and self-custodial wallets for football fan matchday coordination.

## System Design

```
┌─────────────────────────────────────────────────┐
│                   UI Layer                       │
│  React + TypeScript + Tailwind CSS               │
│  Pages: Landing, Setup, TripBoard, AI, Split     │
└─────────────────────────────────────────────────┘
         │              │              │
┌────────▼──────┐ ┌────▼────────┐ ┌───▼───────────┐
│  QVAC Layer   │ │ Pears Layer  │ │  WDK Layer    │
│  Local AI     │ │ P2P Sync     │ │  Wallets      │
│  Inference    │ │ Discovery    │ │  USDt         │
└───────────────┘ └──────────────┘ └───────────────┘
         │              │              │
┌────────▼──────────────▼──────────────▼───────────┐
│              Local Storage Layer                   │
│  Zustand Store + localStorage                     │
└─────────────────────────────────────────────────┘
```

## QVAC Local Inference Path

1. User submits query via AI Assistant UI
2. Query is routed to QVAC service layer (`src/lib/qvac/index.ts`)
3. QVAC SDK loads model (LLAMA_3_2_1B_INST_Q4_0) on first use
4. Inference runs locally on device hardware (Metal/Vulkan/CPU)
5. Response is returned to UI without any network call

## Pears P2P Sync Flow

1. User creates or joins a group
2. Pears Hyperswarm discovers peers via topic-based routing
3. Group state is stored in Hypercore append-only logs
4. State changes are broadcast to connected peers
5. Offline changes are queued and synced when peers reconnect

## WDK Wallet Flow

1. Wallet initializes with seed phrase (or generates new)
2. TRON and EVM modules are registered
3. User tops up shared trip fund (USDt transfer)
4. Expenses are recorded with per-person splits
5. Settlement triggers peer-to-peer USDt transfers
6. Transaction hashes are stored for verification

## Expense Settlement Flow

1. Member adds shared expense with description and amount
2. Expense is split among selected group members
3. Balances are calculated across all unsettled expenses
4. Optimal settlement graph minimizes number of transactions
5. WDK executes USDt transfers between wallets
6. Settlement status updates on trip board
