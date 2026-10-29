/** Synthetic visual fixtures only. No agency attribution, live ingestion, or hazard inference. */
export type Scenario = 'multi' | 'empty' | 'outage';
export type Track = 'A' | 'B';
export type DemoStorm = { id: string; name: 'ALPHA' | 'BRAVO'; position: [number, number]; tracks: Record<Track, [number, number][]> };
export const fixtureIssuedAt = '2026-08-01T00:00:00Z';
export const demoStorms: DemoStorm[] = [
  {id: 'demo-alpha', name: 'ALPHA', position: [129, 19.8], tracks: {
    A: [[129,19.8],[127.5,21],[125.9,22.4],[124.1,23.8],[122.4,25.5],[121.8,27.6]],
    B: [[129,19.8],[128.1,21.3],[127.1,23],[126.3,24.8],[125.9,26.7],[126.3,28.6]],
  }},
  {id: 'demo-bravo', name: 'BRAVO', position: [143, 27], tracks: {
    A: [[143,27],[144.2,28.4],[146,30],[148.3,32.1],[151,34.5]],
    B: [[143,27],[143.6,28.8],[145,30.7],[147,33],[149.2,35.6]],
  }},
];
export function parseScenario(value: string | null): Scenario { return value === 'empty' || value === 'outage' ? value : 'multi'; }
export function availableStorms(scenario: Scenario) { return scenario === 'empty' ? [] : demoStorms; }
export function pointTime(index: number) { return new Date(Date.parse(fixtureIssuedAt) + index * 12 * 3600_000).toISOString(); }
export function selectStorm(scenario: Scenario, selection: string | null) {
  const storms = availableStorms(scenario);
  return storms.find(s => s.id === selection) ?? storms[0] ?? null;
}
