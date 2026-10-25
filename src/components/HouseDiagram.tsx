import { HOUSE, type Scenario } from "@/lib/house";
import { cn } from "@/lib/utils";

type C = (typeof HOUSE.components)[number] & { x: number; y: number; w?: number };
type F = (typeof HOUSE.flows)[number] & { points: number[][] };

const SKY: Record<string, { a: string; b: string; sun: [number, number, number] }> = {
  normal: { a: "var(--sky-day-a)", b: "var(--sky-day-b)", sun: [860, 120, 0.9] },
  baths: { a: "var(--sky-dawn-a)", b: "var(--sky-dawn-b)", sun: [930, 230, 0.75] },
  today: { a: "var(--sky-grey-a)", b: "var(--sky-grey-b)", sun: [840, 140, 0.25] },
};

export function HouseDiagram({
  scen, selected, onSelect,
}: { scen: Scenario; selected: string; onSelect: (id: string) => void }) {
  const st = (id: string) => scen.components[id] ?? "ok";
  const sky = SKY[scen.id] ?? SKY["normal"]!;
  const cyl = st("cyl");
  const tank = cyl === "reheat" ? 0.45 : cyl === "ok" ? 0.82 : 0.6;
  const cc = HOUSE.components.find((c) => c.id === "cyl") as C;

  return (
    <svg viewBox="0 0 1000 760" className="hd block h-auto w-full" role="img" aria-label="Cross-section of the house and its systems">
      <defs>
        <linearGradient id="skygrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: sky.a, transition: "stop-color 1.2s" }} />
          <stop offset="1" style={{ stopColor: sky.b, transition: "stop-color 1.2s" }} />
        </linearGradient>
        <radialGradient id="sunglow">
          <stop offset="0" stopColor="var(--sun)" stopOpacity=".6" />
          <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="cylclip">
          <rect x={cc.x - 62} y={cc.y - 22} width={124} height={44} rx={10} />
        </clipPath>
      </defs>
      <rect width="1000" height="700" fill="url(#skygrad)" />
      <g className="hd-sun" style={{ transform: `translate(${sky.sun[0]}px, ${sky.sun[1]}px)`, opacity: sky.sun[2] }}>
        <circle r="88" fill="url(#sunglow)" />
        <circle r="25" className="fill-[var(--sun)]" />
      </g>

      <rect className="hd-ground" x="0" y="700" width="1000" height="60" />
      <line className="hd-groundline" x1="0" y1="700" x2="1000" y2="700" />
      <rect className="hd-band2" x="250" y="190" width="540" height="160" />
      <rect className="hd-band1" x="250" y="350" width="540" height="160" />
      <rect className="hd-band0" x="250" y="510" width="540" height="190" />
      <rect className={cn("hd-warm", st("rad2") === "heating" && "on")} x="250" y="190" width="540" height="160" />
      <rect className={cn("hd-warm", st("rads") === "heating" && "on")} x="250" y="350" width="540" height="160" />
      <rect className={cn("hd-warm", st("loops") === "heating" && "on")} x="250" y="510" width="540" height="190" />
      {st("loops") === "cold" && <rect className="hd-cold" x="250" y="510" width="540" height="190" />}
      <path className="hd-roof" d="M238,196 L520,92 L802,196" strokeWidth="5" />
      <rect className="hd-walls" x="250" y="190" width="540" height="510" />
      <line className="hd-slab" x1="250" y1="350" x2="790" y2="350" />
      <line className="hd-slab" x1="250" y1="510" x2="790" y2="510" />
      <rect className="hd-garage" x="812" y="500" width="168" height="200" />
      <path className="hd-roof" d="M804,502 L896,450 L988,502" strokeWidth="4" />
      <rect className={cn("hd-win", st("rad2") === "heating" && "lit")} x="259" y="266" width="26" height="48" rx="3" />
      <rect className={cn("hd-win", st("rads") === "heating" && "lit")} x="259" y="424" width="26" height="48" rx="3" />

      {[["SECOND FLOOR", 262, 212], ["FIRST FLOOR", 262, 372], ["GROUND FLOOR", 262, 532], ["GARAGE", 824, 524]].map(([t, x, y]) => (
        <text key={t as string} className="hd-floor" x={x} y={y}>{t}</text>
      ))}
      {[
        ["Kitchen", 300, 548], ["Reception room", 596, 524], ["Utility room", 706, 524],
        ["Entrance hall + WC", 258, 688], ["Bedrooms", 322, 490], ["En-suite", 648, 478],
        ["Bedroom", 452, 338], ["Study", 430, 232], ["Balcony", 806, 248], ["Garden (behind)", 824, 724],
      ].map(([t, x, y]) => (
        <text key={t as string} className="hd-room" x={x} y={y}>{t}</text>
      ))}

      {[["Gas supply", "E.ON Next", 538], ["Grid", "electricity", 612]].map(([a, b, y]) => (
        <g key={a as string}>
          <rect className="hd-util" x="15" y={y} width="110" height="56" rx="8" />
          <text className="hd-utiltext" x="70" y={(y as number) + 24}>{a}</text>
          <text className="hd-utiltext sub" x="70" y={(y as number) + 42}>{b}</text>
        </g>
      ))}

      <g>
        {(HOUSE.flows as F[]).map((f) => (
          <path key={f.id} className={cn("hd-flow", f.kind, scen.flows[f.id] ?? "off")}
            d={"M" + f.points.map((p) => p.join(",")).join(" L")}>
            <title>{f.label}</title>
          </path>
        ))}
      </g>

      <g>
        {(HOUSE.components as C[]).map((c) => {
          const w = c.w ?? 124, h = 44, x = c.x - w / 2, y = c.y - h / 2;
          const s = st(c.id);
          return (
            <g key={c.id} className={cn("hd-comp", `s-${s}`, c.id === selected && "sel")}
              onClick={() => onSelect(c.id)} role="button" tabIndex={0} aria-label={c.name}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(c.id)}>
              <rect className="pulse" x={x - 5} y={y - 5} width={w + 10} height={h + 10} rx="13" />
              <rect className="body" x={x} y={y} width={w} height={h} rx="10" />
              {c.id === "cyl" && (
                <rect className={cn("tankfill", cyl === "reheat" && "filling")} clipPath="url(#cylclip)"
                  x={x} y={y} width={w} height={h} style={cyl === "reheat" ? undefined : { transform: `scaleY(${tank})` }} />
              )}
              {c.id === "boiler" && (
                <g className="shimmer" transform={`translate(${c.x},${y - 3})`}>
                  <path d="M-17,0 q4,-7 0,-14" /><path d="M0,-1 q4,-7 0,-14" /><path d="M17,0 q4,-7 0,-14" />
                </g>
              )}
              <text className="t1" x={c.x - 5} y={c.y - 1} textLength={Math.min(w - 26, c.label[0]!.length * 6.6)} lengthAdjust="spacingAndGlyphs">{c.label[0]}</text>
              <text className="t2" x={c.x - 5} y={c.y + 15}>{c.label[1] ?? ""}</text>
              <circle className="dot" cx={x + w - 11} cy={y + 11} r="5.5" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
