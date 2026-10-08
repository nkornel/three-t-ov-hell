/**
 * @typedef {import('./local-store.js').Colleague} Colleague
 * @typedef {import('./local-store.js').Visit} Visit
 * @typedef {import('./local-store.js').Store} Store
 * @typedef {{ now: () => Date }} Clock
 * @typedef {Awaited<ReturnType<typeof createTracker>>} Tracker
 */

/** A command the tracker refused; the message is fit to show the operator. */
export class Refused extends Error {}

/**
 * The month a moment falls in, in the operator's local time, as "YYYY-MM".
 * @param {Date} moment
 */
function monthOf(moment) {
  const month = String(moment.getMonth() + 1).padStart(2, '0');
  return `${moment.getFullYear()}-${month}`;
}

/**
 * Visits are timed in whole seconds.
 * @param {Date} moment
 */
function toInstant(moment) {
  return new Date(Math.floor(moment.getTime() / 1000) * 1000).toISOString();
}

/**
 * @param {string} from
 * @param {string} to
 */
function secondsBetween(from, to) {
  return (new Date(to).getTime() - new Date(from).getTime()) / 1000;
}

/**
 * @param {{ clock: Clock, store: Store }} dependencies
 */
export async function createTracker({ clock, store }) {
  const colleagues = await store.loadColleagues();
  /** @type {Map<string, Visit[]>} */
  const visitsByMonth = new Map();

  /** @param {string} month */
  async function visitsIn(month) {
    let visits = visitsByMonth.get(month);
    if (!visits) {
      visits = await store.loadVisits(month);
      visitsByMonth.set(month, visits);
    }
    return visits;
  }

  /** @param {string} colleagueId */
  function runningVisitOf(colleagueId) {
    for (const visits of visitsByMonth.values()) {
      const running = visits.find(
        (visit) => visit.colleagueId === colleagueId && visit.endedAt === null,
      );
      if (running) return running;
    }
    return null;
  }

  /** @param {string} colleagueId */
  function colleagueWith(colleagueId) {
    const colleague = colleagues.find((candidate) => candidate.id === colleagueId);
    if (!colleague) throw new Refused('No such colleague.');
    return colleague;
  }

  await visitsIn(monthOf(clock.now()));

  return {
    /** @param {string} alias */
    async addColleague(alias) {
      const colleague = { id: crypto.randomUUID(), alias };
      colleagues.push(colleague);
      await store.saveColleagues(colleagues);
      return { ...colleague };
    },

    /** @param {string} colleagueId */
    async startVisit(colleagueId) {
      const colleague = colleagueWith(colleagueId);
      if (runningVisitOf(colleagueId)) {
        throw new Refused(`${colleague.alias} is already out.`);
      }
      const now = clock.now();
      const month = monthOf(now);
      const visits = await visitsIn(month);
      visits.push({
        id: crypto.randomUUID(),
        colleagueId,
        startedAt: toInstant(now),
        endedAt: null,
      });
      await store.saveVisits(month, visits);
    },

    /** @param {string} colleagueId */
    async stopVisit(colleagueId) {
      const colleague = colleagueWith(colleagueId);
      const running = runningVisitOf(colleagueId);
      if (!running) throw new Refused(`${colleague.alias} is not out.`);
      running.endedAt = toInstant(clock.now());
      const month = monthOf(new Date(running.startedAt));
      await store.saveVisits(month, await visitsIn(month));
    },

    /** The current month's leaderboard. */
    leaderboard() {
      const now = clock.now();
      const nowInstant = toInstant(now);
      const visits = visitsByMonth.get(monthOf(now)) ?? [];
      const rows = colleagues.map((colleague) => {
        let totalSeconds = 0;
        for (const visit of visits) {
          if (visit.colleagueId !== colleague.id) continue;
          totalSeconds += secondsBetween(visit.startedAt, visit.endedAt ?? nowInstant);
        }
        return { colleagueId: colleague.id, alias: colleague.alias, totalSeconds };
      });
      return rows.sort((a, b) => b.totalSeconds - a.totalSeconds);
    },

    colleagues() {
      const now = toInstant(clock.now());
      return colleagues.map((colleague) => {
        const running = runningVisitOf(colleague.id);
        return {
          ...colleague,
          runningVisit: running && {
            startedAt: running.startedAt,
            elapsedSeconds: secondsBetween(running.startedAt, now),
          },
        };
      });
    },
  };
}
