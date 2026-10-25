import { describe, expect, it } from "vitest";
import { toneOf, HOUSE } from "./house";

describe("status rules", () => {
  it("treats no power, faulty and cold as problems", () => {
    expect(["dead", "fault", "cold", "stopped"].map(toneOf)).toEqual(["bad", "bad", "bad", "bad"]);
  });
  it("treats off and idle as not a problem", () => {
    expect(toneOf("off")).toBe("idle");
    expect(toneOf("idle")).toBe("idle");
  });
  it("today has the wiring centre with no power", () => {
    expect(HOUSE.scenarios.find((s) => s.id === "today")!.components["wiring"]).toBe("dead");
  });
});
