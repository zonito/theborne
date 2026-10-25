import raw from "@/data/house.json";

export type Doc = { label: string; url: string };
export type Component = {
  id: string;
  name: string;
  label: string[];
  floor: string;
  room: string;
  what: string;
  how: string;
  detail: string;
  drive?: Doc[];
  status: { date: string; kind: string; label: string };
};
export type Scenario = {
  id: string;
  name: string;
  caption: string;
  explanation: string[];
  components: Record<string, string>;
  flows: Record<string, string>;
};
export type Flow = { id: string; kind: "gas" | "heat" | "water" | "elec"; label: string };

export const HOUSE = raw as unknown as {
  components: Component[];
  floors: { id: string; name: string; rooms: string }[];
  flows: Flow[];
  meta: {
    name: string;
    house: string;
    summary: string;
    facts: string[];
    verified: string;
    drive?: Doc;
  };
  openItems: { title: string; detail: string }[];
  scenarios: Scenario[];
  statusBoard: { group: string; kind: string; items: { date: string; label: string }[] }[];
};

export type SystemKey = "heat" | "water" | "power";
export const SYSTEM_OF: Record<string, SystemKey> = {
  boiler: "heat", ctrl: "heat", rads: "heat", rad2: "heat", manifold: "heat", loops: "heat",
  stats: "heat", wiring: "heat", dimplex: "heat", bath2: "heat", bathF: "heat", bathE: "heat",
  cyl: "water", sink: "water",
  consumer: "power", consumer2: "power", meters: "power", elecmeter: "power", wallbox: "power", car: "power",
};
export const SYSTEMS: { key: SystemKey; name: string; blurb: string }[] = [
  { key: "heat", name: "Heating", blurb: "Boiler, radiators, underfloor and electric floors" },
  { key: "water", name: "Hot water", blurb: "The 210 litre tank and the sink heater" },
  { key: "power", name: "Power", blurb: "Meters, fuse boards and car charging" },
];

export type Tone = "good" | "idle" | "warn" | "bad";
export function toneOf(state: string): Tone {
  if (["fault", "dead", "cold", "stopped"].includes(state)) return "bad";
  if (["warn"].includes(state)) return "warn";
  if (["idle", "off", "dim"].includes(state)) return "idle";
  return "good";
}
const STATE_LABEL: Record<string, string> = {
  working: "Working", ok: "OK", heating: "Heating", charging: "Charging", reheat: "Reheating",
  calling: "Calling for heat", idle: "Idle", off: "Off", warn: "Needs attention", fault: "Faulty",
  dead: "No power", cold: "Cold",
};
export const stateLabel = (s: string) => STATE_LABEL[s] ?? s;

export const floorOf = (c: Component) => (c.floor === "Upstairs" ? "Second floor" : c.floor);
