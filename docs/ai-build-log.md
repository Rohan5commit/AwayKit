# AI Build Log

## Day 1 — Project Setup

- Created GitHub repository
- Set up React + TypeScript + Vite + Tailwind CSS
- Defined data models with Zod schemas
- Built QVAC, Pears, and WDK library layers

## Day 1 — Core Features

- Implemented demo scenarios with 3 matchday cases
- Built shared trip board with member status and expenses
- Created AI assistant with QVAC integration
- Implemented split-and-settle flow with WDK

## Day 1 — UI Components

- Built reusable component library (Button, Card, Modal, Input, StatusBadge)
- Created responsive layout with Header and Footer
- Designed football-native color scheme (pitch green, tether blue, USDT green)

## Day 1 — Documentation

- Wrote comprehensive README
- Created architecture documentation
- Wrote demo script and setup guide
- Added privacy story and judging guide

## Architecture Decisions

- Chose Vite over CRA for faster builds
- Used Zod for runtime schema validation
- Implemented fallback responses for SDK demo mode
- Used localStorage for offline-first state persistence

## Lessons Learned

- QVAC SDK requires careful dynamic imports to avoid bundling issues
- Pears P2P layer works best with topic-based peer discovery
- WDK module registration pattern allows clean chain-specific implementations
- Demo mode with simulated responses enables development without native dependencies
