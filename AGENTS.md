# The Bourne — repo notes

A single-page house-systems app for Oak Lodge, 2B The Bourne: how the heating,
hot water and power work, what state each part is in, and what needs doing next.
TanStack Start (React 19) + Tailwind CSS v4, server-rendered, built with Vite + Nitro.

## The one rule

House facts live **only** in `src/data/house.json`. It is the single source of
truth: components read it through `src/lib/house.ts` and never carry facts of
their own. To change a fact (a setting, a status, a model number), edit the JSON
and nothing else. Facts in the JSON are verified against house documents,
photos and manufacturer manuals — never invent one.

## Run and verify

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest: data rules + routing
npm run build    # production build into .output/
```

A change is not done until build and tests pass.

## History

The project was de-Lovabled on 2026-10-25: the hosted editor integration was
removed and the build is now a plain hand-written `vite.config.ts`. Do not
re-add `@lovable.dev/*` packages or the `.lovable/` directory.
