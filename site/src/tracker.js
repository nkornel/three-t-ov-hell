/**
 * @typedef {import('./store.js').Colleague} Colleague
 * @typedef {import('./store.js').Visit} Visit
 * @typedef {import('./store.js').Store} Store
 * @typedef {{ now: () => Date }} Clock
 * @typedef {Awaited<ReturnType<typeof createTracker>>} Tracker
 */

/** A command the tracker refused; the message is fit to show the operator. */
export class Refused extends Error {}

/** The most characters an alias may have. */
export const MAX_ALIAS_LENGTH = 30;

/**
 * How long an alias counts as being, as typed. Spaces around it do not
 * count, and characters outside the basic plane, such as most emoji, count
 * once each.
 * @param {string} typed
 */
export function aliasLength(typed) {
  return [...typed.trim()].length;
}

/**
 * The month a moment falls in, in the operator's local time, as "YYYY-MM".
 * @param {Date} moment
 */
function monthOf(moment) {
  const month = String(moment.getMonth() + 1).padStart(2, '0');
  return `${moment.getFullYear()}-${month}`;
}

/** @param {Date} moment */
function monthBefore(moment) {
  return monthOf(new Date(moment.getFullYear(), moment.getMonth() - 1, 1));
}

/**
 * A moment as a stored instant. Visits are timed in whole seconds, so the
 * fraction of a second is dropped.
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

  /** @param {Colleague} colleague */
  function refuseIfArchived(colleague) {
    if (colleague.archivedAt) throw new Refused(`${colleague.alias} has been archived.`);
  }

  /**
   * The alias as it will be kept, or a refusal if it breaks a rule.
   * @param {string} typed
   * @param {string} [ownerId] the colleague whose alias this will be, if they exist already
   */
  function acceptedAlias(typed, ownerId) {
    const alias = typed.trim();
    if (alias === '') throw new Refused('Type an alias for the colleague.');
    if (aliasLength(alias) > MAX_ALIAS_LENGTH) {
      throw new Refused(
        `An alias can be at most ${MAX_ALIAS_LENGTH} characters. This one has ${aliasLength(alias)}.`,
      );
    }
    // An archived colleague's alias is free for somebody else to take.
    const taken = colleagues.some(
      (colleague) =>
        colleague.id !== ownerId &&
        !colleague.archivedAt &&
        colleague.alias.toLowerCase() === alias.toLowerCase(),
    );
    if (taken) {
      throw new Refused(
        `“${alias}” is already in use by another colleague. Choose a different alias.`,
      );
    }
    return alias;
  }

  // A visit can still be running from just before midnight on the last day,
  // so last month is loaded along with this one.
  const openedAt = clock.now();
  await visitsIn(monthOf(openedAt));
  await visitsIn(monthBefore(openedAt));

  return {
    /** @param {string} alias */
    async addColleague(alias) {
      const colleague = { id: crypto.randomUUID(), alias: acceptedAlias(alias), archivedAt: null };
      colleagues.push(colleague);
      await store.saveColleagues(colleagues);
      return { ...colleague };
    },

    /**
     * @param {string} colleagueId
     * @param {string} alias
     */
    async renameColleague(colleagueId, alias) {
      const colleague = colleagueWith(colleagueId);
      refuseIfArchived(colleague);
      colleague.alias = acceptedAlias(alias, colleagueId);
      await store.saveColleagues(colleagues);
    },

    /** @param {string} colleagueId */
    async archiveColleague(colleagueId) {
      const colleague = colleagueWith(colleagueId);
      refuseIfArchived(colleague);
      if (runningVisitOf(colleagueId)) {
        throw new Refused(`${colleague.alias} is out. Stop their visit before archiving them.`);
      }
      colleague.archivedAt = toInstant(clock.now());
      await store.saveColleagues(colleagues);
    },

    /** @param {string} colleagueId */
    async startVisit(colleagueId) {
      const colleague = colleagueWith(colleagueId);
      const now = clock.now();
      const month = monthOf(now);
      const visits = await visitsIn(month);
      // Nothing may be awaited between these checks and the push below, or
      // two starts at the same moment would both pass them, and so would a
      // start at the moment the colleague is archived.
      refuseIfArchived(colleague);
      if (runningVisitOf(colleagueId)) {
        throw new Refused(`${colleague.alias} is already out.`);
      }
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

    /**
     * The current month's leaderboard: most time first, with who is leading
     * and who is out. It lists every active colleague, and an archived one
     * only if they have a visit this month.
     */
    leaderboard() {
      const now = clock.now();
      const nowInstant = toInstant(now);
      const visits = visitsByMonth.get(monthOf(now)) ?? [];
      const rows = [];
      for (const colleague of colleagues) {
        const theirs = visits.filter((visit) => visit.colleagueId === colleague.id);
        const archived = Boolean(colleague.archivedAt);
        if (archived && theirs.length === 0) continue;
        let totalSeconds = 0;
        for (const visit of theirs) {
          totalSeconds += secondsBetween(visit.startedAt, visit.endedAt ?? nowInstant);
        }
        rows.push({
          colleagueId: colleague.id,
          alias: colleague.alias,
          totalSeconds,
          out: runningVisitOf(colleague.id) !== null,
          archived,
        });
      }
      rows.sort((a, b) => b.totalSeconds - a.totalSeconds);
      // Whoever has the most time is leading, once anybody has any.
      const most = rows[0]?.totalSeconds ?? 0;
      return rows.map((row) => ({ ...row, leading: most > 0 && row.totalSeconds === most }));
    },

    /** The active colleagues in alias order, each with their running visit if they are out. */
    colleagues() {
      const now = toInstant(clock.now());
      return colleagues
        .filter((colleague) => !colleague.archivedAt)
        .map((colleague) => {
          const running = runningVisitOf(colleague.id);
          return {
            ...colleague,
            runningVisit: running && {
              startedAt: running.startedAt,
              elapsedSeconds: secondsBetween(running.startedAt, now),
            },
          };
        })
        .sort((a, b) => a.alias.localeCompare(b.alias, 'en', { sensitivity: 'base' }));
    },
  };
}
