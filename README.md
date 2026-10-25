# The Bourne

How the house at Oak Lodge, 2B The Bourne works: heating, hot water and power — the state of every system, the open faults, and the next steps, on one page.

Built with [TanStack Start](https://tanstack.com/start/latest) (React 19, TanStack Router, TanStack Query), Tailwind CSS v4, and Radix UI components.

## Prerequisites

- **Node.js** 18+ (ESM)
- **npm**

## Installation

```bash
git clone <repo-url> theborne
cd theborne
npm install
```

## Run locally

```bash
npm run dev
```

Opens at `http://localhost:3000` (or the next available port).

## Build

```bash
npm run build        # production build (Nitro, into .output/)
npm run build:dev    # development build
npm run preview      # preview the production build
```

## Lint & format

```bash
npm run lint
npm run format
```

## Test

```bash
npm test             # vitest run: house data rules + app routing
npm run test:watch   # watch mode
```

## Project structure

```
src/
├── routes/              # file-based routing (TanStack Router)
│   ├── __root.tsx       # app shell / layout, error and 404 components
│   └── index.tsx        # the house page (status board, diagram, components)
├── components/
│   ├── HouseDiagram.tsx # animated SVG diagram of the house systems
│   └── ui/              # shadcn/ui components (Radix-based)
├── data/
│   └── house.json       # every house fact: systems, components, scenarios
├── lib/
│   ├── house.ts         # typed access to house.json (status tones, helpers)
│   ├── error-capture.ts # server error capture for the SSR error wrapper
│   ├── error-page.ts    # static fallback error page
│   └── utils.ts         # class-name helper
├── hooks/
│   └── use-mobile.tsx   # viewport hook
├── test/
│   ├── app-routing.test.tsx
│   └── setup.ts
├── server.ts            # SSR entry (wraps the Start handler, renders error page on 500s)
├── start.ts             # Start instance: error + CSRF middleware
├── router.tsx           # router setup
└── styles.css           # Tailwind + design system
```

## Notes

- **House facts live only in `src/data/house.json`.** The app renders from that
  model; components never hard-code facts. Facts are verified against house
  documents, photos and manufacturer manuals before they go in. To update the
  app, update the JSON.
- The three scenarios in the data (a normal day, a cold morning, today) drive
  the diagram and the status board from the same component states, so the page
  can never contradict itself.
