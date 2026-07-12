# Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Installation

```bash
git clone https://github.com/Rohan5commit/AwayKit.git
cd AwayKit
npm install
```

## Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm run preview
```

## Wallet Setup

1. Click "Top Up" on the Trip Board
2. In demo mode, wallets are pre-configured with test USDt
3. For production, connect a real TRON or Ethereum wallet

## Demo Scenarios

Three pre-built scenarios are available:

1. **Stadium Away Day** — 4 friends at El Clasico
2. **Away Fan Meetup** — Champions League in Milan
3. **Watch Party Fund** — North London Derby at home

Select any scenario from the Group Setup page.

## Dependencies

| Package | Purpose |
|---------|--------|
| react, react-dom | UI framework |
| react-router-dom | Client-side routing |
| @qvac/sdk | Local AI inference |
| @pear-js/core, @pear-js/hyperswarm | P2P sync |
| @wdk/core, @wdk/wallet-evm, @wdk/wallet-tron | Wallet integration |
| zod | Schema validation |
| tailwindcss | Styling |
| vite | Build tool |
