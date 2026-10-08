/**
 * The store port: what the tracker needs from wherever the game is kept.
 * Adapters implement it; this module holds only the types.
 *
 * @typedef {object} Colleague
 * @property {string} id
 * @property {string} alias
 * @property {string | null} [archivedAt] The instant they were archived. Empty while they are active, and missing from colleagues saved before archiving existed.
 *
 * @typedef {{ id: string, colleagueId: string, startedAt: string, endedAt: string | null }} Visit
 *
 * @typedef {object} Store
 * @property {() => Promise<Colleague[]>} loadColleagues
 * @property {(colleagues: Colleague[]) => Promise<void>} saveColleagues
 * @property {(month: string) => Promise<Visit[]>} loadVisits Visits that started in a month, given as "YYYY-MM".
 * @property {(month: string, visits: Visit[]) => Promise<void>} saveVisits
 */

export {};
