# The Bourne

A static, animated explainer of how one house works: Oak Lodge, 2B The Bourne, London N14 6QX.

Open `index.html` in any browser. There is no build step and no server-side code. The page draws a cross-section of the house, animates the flows of gas, heating water, hot water and electricity, and lets you switch between three scenarios (a normal day, a morning of back to back baths, and the house as it is today with the underfloor heating fault). Clicking any component explains, in plain words, what it is, how it works, and its current checked status.

## Model first

`data/house.json` is the source of truth, in the same spirit as Yantra: floors, systems, components, states, flows and scenarios all live in the model.

Rule: edit `data/house.json` first, then refresh the copy of the model embedded in `index.html` (the `const HOUSE = ...` block) so the page stays in sync. The page renders everything (components, flows, scenario states, the status board and the open items list) from that model, so a model change is the only change needed when the house changes: a fault fixed, a tariff updated, a new check done.

## Files

- `index.html` — the whole app: markup, styles, script and an embedded copy of the model.
- `data/house.json` — the model, kept separately for clean editing and diffs.

## Facts

Every fact on the page was verified at the house on 24 and 25 October 2026 (boiler readings, meter display figures, the wiring centre investigation, the cylinder and controller behaviour). If a fact cannot be verified, it does not go in the model.
