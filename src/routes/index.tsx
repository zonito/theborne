import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { HOUSE, stateLabel, toneOf, floorOf, type Tone } from "@/lib/house";
import { cn } from "@/lib/utils";
import { HouseDiagram } from "@/components/HouseDiagram";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Bourne · House systems at a glance" },
      { name: "description", content: "Heating, hot water and power at Oak Lodge, The Bourne: status, faults and next steps." },
      { property: "og:title", content: "The Bourne · House systems at a glance" },
      { property: "og:description", content: "Every system in the house, its status and the next action, in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const DOT: Record<Tone, string> = { good: "bg-good", idle: "bg-idle", warn: "bg-warn", bad: "bg-bad pulse-bad" };
const PILL: Record<Tone, string> = {
  good: "bg-good-soft text-good", idle: "bg-muted text-muted-foreground",
  warn: "bg-warn-soft text-foreground", bad: "bg-bad-soft text-bad",
};
const LEGEND = [["bg-gas", "Gas"], ["bg-heat", "Heating"], ["bg-water", "Hot water"], ["bg-elec", "Electricity"], ["bg-bad", "Stopped"]];

const firstSentence = (s = "") => s.split(/(?<=\.)\s/)[0] ?? s;

function Info({ title, children, label = "More info" }: { title: string; children: ReactNode; label?: string }) {
  return (
    <Popover>
      <PopoverTrigger aria-label={label}
        className="inline-grid size-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold italic text-muted-foreground transition hover:border-primary hover:text-primary">
        i
      </PopoverTrigger>
      <PopoverContent className="w-80 text-sm leading-relaxed">
        <div className="mb-1 font-semibold">{title}</div>
        <div className="text-muted-foreground">{children}</div>
      </PopoverContent>
    </Popover>
  );
}

function Index() {
  const [scenId, setScenId] = useState("today");
  const [openId, setOpenId] = useState<string | null>(null);
  const scen = HOUSE.scenarios.find((s) => s.id === scenId)!;
  const stateOf = (id: string) => scen.components[id] ?? "ok";
  const comp = HOUSE.components.find((c) => c.id === openId);

  const issues = useMemo(
    () => HOUSE.components.filter((c) => ["bad", "warn"].includes(toneOf(stateOf(c.id)))),
    [scenId],
  );

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-3">
          <div className="grid size-9 place-items-center rounded-lg bg-ink font-display text-lg text-ink-foreground">B</div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">{HOUSE.meta.name}</div>
            <div className="text-xs text-muted-foreground">{HOUSE.meta.house}</div>
          </div>
          <div className="ml-auto">
            <Info title="About the house">
              <ul className="list-disc pl-4">{HOUSE.meta.facts.map((f) => <li key={f}>{f}</li>)}</ul>
              <p className="mt-2">{HOUSE.meta.verified}</p>
            </Info>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-6 px-5 py-6">
        {/* Summary strip */}
        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl bg-ink p-6 text-ink-foreground">
            <h1 className="text-3xl font-semibold">
              {issues.length === 0 ? "All systems running" : `${issues.length} ${issues.length === 1 ? "needs" : "need"} attention`}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {issues.map((c) => (
                <button key={c.id} onClick={() => setOpenId(c.id)}
                  className="flex items-center gap-2 rounded-full bg-ink-foreground/10 px-3 py-1.5 text-sm hover:bg-ink-foreground/20">
                  <span className={cn("size-2 rounded-full", DOT[toneOf(stateOf(c.id))])} />
                  {c.label[0]} · {stateLabel(stateOf(c.id))}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Next steps</h2>
            <ol className="mt-3 space-y-2.5">
              {HOUSE.openItems.map((o, i) => (
                <li key={o.title} className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                  <span className="flex-1 font-medium">{o.title}</span>
                  <Info title={o.title}>{o.detail}</Info>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Diagram */}
        <section className="rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div role="tablist" className="inline-flex rounded-full bg-muted p-1">
              {HOUSE.scenarios.map((s) => (
                <button key={s.id} role="tab" aria-selected={s.id === scenId} onClick={() => setScenId(s.id)}
                  className={cn("rounded-full px-4 py-2 text-sm font-semibold transition",
                    s.id === scenId ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {s.name}
                </button>
              ))}
            </div>
            <p className="flex flex-1 items-center gap-2 text-sm">
              <span>{firstSentence(scen.explanation[0])}</span>
              <Info title={scen.name}>
                {scen.explanation.map((p, i) => <p key={i} className="mb-2 last:mb-0">{p}</p>)}
              </Info>
            </p>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border"><div className="min-w-[760px]">
            <HouseDiagram scen={scen} selected={openId ?? ""} onSelect={setOpenId} /></div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            {LEGEND.map(([c, l]) => (
              <span key={l} className="flex items-center gap-1.5"><span className={cn("h-1 w-5 rounded-full", c)} />{l}</span>
            ))}
            <span className="sm:ml-auto">Tap any box to learn more</span>
          </div>
        </section>

        {/* Status board */}
        <section className="grid gap-4 md:grid-cols-3">
          {HOUSE.statusBoard.map((g) => (
            <div key={g.group} className="rounded-2xl border bg-card p-5">
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-full", g.kind === "fault" ? "bg-bad" : g.kind === "off" ? "bg-idle" : "bg-good")} />
                <h3 className="font-semibold">{g.group}</h3>
                <span className="ml-auto text-xs text-muted-foreground">{g.items.length}</span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {g.items.map((it) => (
                  <li key={it.label} className="flex justify-between gap-3">
                    <span>
                      {it.label.split(":")[0]}
                      {it.label.includes(":") && <span className="text-muted-foreground"> · {it.label.split(":").slice(1).join(":").trim()}</span>}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{it.date.replace(" 2026", "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>

      <Dialog open={!!comp} onOpenChange={(o) => !o && setOpenId(null)}>
        {comp && (
          <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
            <DialogHeader>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{floorOf(comp)} · {comp.room}</p>
              <DialogTitle className="font-display text-2xl">{comp.name}</DialogTitle>
              <DialogDescription asChild>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", PILL[toneOf(stateOf(comp.id))])}>
                    {stateLabel(stateOf(comp.id))}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs">Checked {comp.status.date}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm leading-relaxed">{comp.what}</p>
            <div className="divide-y rounded-xl border text-sm">
              <Row title="How it works">{comp.how}</Row>
              <Row title="Latest check">{comp.detail}</Row>
              {comp.drive && comp.drive.length > 0 && (
                <Row title={`Documents (${comp.drive.length})`}>
                  <ul className="space-y-1">
                    {comp.drive.map((d) => (
                      <li key={d.url}>
                        <a href={d.url} target="_blank" rel="noopener" className="text-primary hover:underline">
                          {d.label.replace(" (Drive)", "")} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                </Row>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
        {title}
        <span className="text-muted-foreground transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-2 leading-relaxed text-muted-foreground">{children}</div>
    </details>
  );
}
