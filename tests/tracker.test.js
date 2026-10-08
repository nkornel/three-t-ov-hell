// Europe/Budapest is ahead of UTC, so "local month" and "UTC month" disagree
// around midnight and the tests can tell them apart.
process.env.TZ = 'Europe/Budapest';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTracker } from '../site/src/tracker.js';
import { createLocalStore } from '../site/src/local-store.js';

function fakeClock(iso) {
  let current = new Date(iso).getTime();
  return {
    now: () => new Date(current),
    advance(seconds) {
      current += seconds * 1000;
    },
    set(nextIso) {
      current = new Date(nextIso).getTime();
    },
  };
}

async function setup(iso = '2026-10-08T09:00:00Z') {
  const clock = fakeClock(iso);
  const store = createLocalStore();
  const tracker = await createTracker({ clock, store });
  return { clock, store, tracker };
}

/** The leaderboard as pairs of alias and total seconds, in its order. */
function totals(tracker) {
  return tracker.leaderboard().map((row) => [row.alias, row.totalSeconds]);
}

test('an added colleague is listed by alias', async () => {
  const { tracker } = await setup();

  await tracker.addColleague('Captain Flush');

  assert.deepEqual(
    tracker.colleagues().map((colleague) => colleague.alias),
    ['Captain Flush'],
  );
});

test('an alias is trimmed', async () => {
  const { tracker } = await setup();

  const added = await tracker.addColleague('  Captain Flush  ');

  assert.equal(added.alias, 'Captain Flush');
  assert.equal(tracker.colleagues()[0].alias, 'Captain Flush');
});

test('an empty alias is refused', async () => {
  const { tracker } = await setup();

  await assert.rejects(tracker.addColleague(''), /Type an alias/);
  await assert.rejects(tracker.addColleague('   '), /Type an alias/);

  assert.deepEqual(tracker.colleagues(), []);
});

test('an alias longer than thirty characters is refused', async () => {
  const { tracker } = await setup();
  const thirty = 'The Quiet Kraken of Floor Nine';
  assert.equal(thirty.length, 30);

  await assert.rejects(
    tracker.addColleague(`${thirty}!`),
    /at most 30 characters. This one has 31/,
  );
  await tracker.addColleague(`  ${thirty}  `);

  assert.deepEqual(
    tracker.colleagues().map((colleague) => colleague.alias),
    [thirty],
  );
});

test('an alias already in use is refused, whatever its letter case', async () => {
  const { tracker } = await setup();
  await tracker.addColleague('Captain Flush');

  await assert.rejects(tracker.addColleague('captain FLUSH'), /already in use/);
  await assert.rejects(tracker.addColleague(' Captain Flush '), /already in use/);

  assert.equal(tracker.colleagues().length, 1);
});

test('a changed alias appears everywhere and survives reopening the app', async () => {
  const { clock, store, tracker } = await setup();
  const { id } = await tracker.addColleague('Captian Flush');
  await tracker.startVisit(id);
  clock.advance(60);
  await tracker.stopVisit(id);

  await tracker.renameColleague(id, '  Captain Flush ');

  assert.equal(tracker.colleagues()[0].alias, 'Captain Flush');
  assert.equal(tracker.leaderboard()[0].alias, 'Captain Flush');
  const reopened = await createTracker({ clock, store });
  assert.equal(reopened.colleagues()[0].alias, 'Captain Flush');
});

test('a changed alias follows the same rules, but a colleague may keep their own', async () => {
  const { tracker } = await setup();
  const flush = await tracker.addColleague('Captain Flush');
  await tracker.addColleague('Bones');

  await assert.rejects(tracker.renameColleague(flush.id, 'bones'), /already in use/);
  await assert.rejects(tracker.renameColleague(flush.id, '  '), /Type an alias/);
  await assert.rejects(
    tracker.renameColleague(flush.id, 'Captain Flush of the Seven Seas'),
    /at most 30 characters. This one has 31/,
  );
  assert.equal(tracker.colleagues()[1].alias, 'Captain Flush');

  await tracker.renameColleague(flush.id, 'CAPTAIN FLUSH');
  assert.equal(tracker.colleagues()[1].alias, 'CAPTAIN FLUSH');
});

test('an archived colleague is no longer listed, even after reopening the app', async () => {
  const { clock, store, tracker } = await setup();
  const flush = await tracker.addColleague('Captain Flush');
  await tracker.addColleague('Bones');

  await tracker.archiveColleague(flush.id);

  const aliases = (/** @type {typeof tracker} */ opened) =>
    opened.colleagues().map((colleague) => colleague.alias);
  assert.deepEqual(aliases(tracker), ['Bones']);
  assert.deepEqual(aliases(await createTracker({ clock, store })), ['Bones']);
});

test('a colleague who is out cannot be archived', async () => {
  const { clock, tracker } = await setup();
  const { id } = await tracker.addColleague('Captain Flush');
  await tracker.startVisit(id);
  clock.advance(30);

  await assert.rejects(tracker.archiveColleague(id), /Captain Flush is out/);
  assert.equal(tracker.colleagues().length, 1);

  await tracker.stopVisit(id);
  await tracker.archiveColleague(id);
  assert.equal(tracker.colleagues().length, 0);
});

test('an archived colleague stays on the leaderboard of a month in which they have a visit', async () => {
  const { clock, store, tracker } = await setup('2026-10-20T09:00:00Z');
  const flush = await tracker.addColleague('Captain Flush');
  await tracker.addColleague('Bones');
  const mango = await tracker.addColleague('Mango');
  await tracker.startVisit(flush.id);
  clock.advance(100);
  await tracker.stopVisit(flush.id);

  await tracker.archiveColleague(flush.id);
  await tracker.archiveColleague(mango.id);

  // Mango never had a visit, so only Captain Flush stays.
  assert.deepEqual(
    tracker.leaderboard().map((row) => [row.alias, row.archived]),
    [
      ['Captain Flush', true],
      ['Bones', false],
    ],
  );

  clock.set('2026-11-03T09:00:00Z');
  const inNovember = await createTracker({ clock, store });
  assert.deepEqual(
    inNovember.leaderboard().map((row) => row.alias),
    ['Bones'],
  );
});

test('the alias of an archived colleague can be used again', async () => {
  const { tracker } = await setup();
  const first = await tracker.addColleague('Captain Flush');
  const bones = await tracker.addColleague('Bones');
  await tracker.archiveColleague(first.id);

  await tracker.renameColleague(bones.id, 'captain flush');
  await tracker.renameColleague(bones.id, 'Bones');
  const second = await tracker.addColleague('Captain Flush');

  assert.notEqual(second.id, first.id);
  assert.deepEqual(
    tracker.colleagues().map((colleague) => colleague.alias),
    ['Bones', 'Captain Flush'],
  );
});

test('a visit cannot be started for an archived colleague', async () => {
  const { tracker } = await setup();
  const { id } = await tracker.addColleague('Captain Flush');
  await tracker.archiveColleague(id);

  await assert.rejects(tracker.startVisit(id), /Captain Flush has been archived/);
  assert.deepEqual(tracker.leaderboard(), []);
});

test('an archived colleague cannot be archived again or given a new alias', async () => {
  const { clock, store, tracker } = await setup('2026-10-08T09:00:00Z');
  const { id } = await tracker.addColleague('Captain Flush');
  await tracker.archiveColleague(id);
  clock.advance(60);

  await assert.rejects(tracker.archiveColleague(id), /Captain Flush has been archived/);
  await assert.rejects(tracker.renameColleague(id, 'Admiral Flush'), /has been archived/);

  assert.deepEqual(await store.loadColleagues(), [
    { id, alias: 'Captain Flush', archivedAt: '2026-10-08T09:00:00.000Z' },
  ]);
});

test('an emoji counts as one character of an alias', async () => {
  const { tracker } = await setup();

  await tracker.addColleague('🦜'.repeat(30));
  await assert.rejects(tracker.addColleague('🦜'.repeat(31)), /This one has 31/);

  assert.equal(tracker.colleagues().length, 1);
});

test('a colleague saved before archiving existed is active and can be archived', async () => {
  const clock = fakeClock('2026-10-08T09:00:00Z');
  const store = createLocalStore();
  await store.saveColleagues([{ id: 'c1', alias: 'Captain Flush' }]);
  const tracker = await createTracker({ clock, store });

  assert.equal(tracker.colleagues()[0].alias, 'Captain Flush');
  await assert.rejects(tracker.addColleague('captain flush'), /already in use/);
  await tracker.startVisit('c1');
  clock.advance(30);
  await tracker.stopVisit('c1');

  await tracker.archiveColleague('c1');
  assert.deepEqual(tracker.colleagues(), []);
});

test('colleagues are listed by alias, whatever order they were added in', async () => {
  const { tracker } = await setup();
  await tracker.addColleague('Mango');
  await tracker.addColleague('bones');
  await tracker.addColleague('Captain Flush');

  assert.deepEqual(
    tracker.colleagues().map((colleague) => colleague.alias),
    ['bones', 'Captain Flush', 'Mango'],
  );
});

test('a started visit runs and its timer follows the clock', async () => {
  const { clock, tracker } = await setup();
  const { id } = await tracker.addColleague('Captain Flush');

  await tracker.startVisit(id);
  clock.advance(75);

  const [colleague] = tracker.colleagues();
  assert.equal(colleague.runningVisit?.elapsedSeconds, 75);
});

test('a colleague who is not out has no running visit', async () => {
  const { tracker } = await setup();
  await tracker.addColleague('Captain Flush');

  const [colleague] = tracker.colleagues();
  assert.equal(colleague.runningVisit, null);
});

test('a stopped visit is no longer running and counts toward the leaderboard', async () => {
  const { clock, tracker } = await setup();
  const { id } = await tracker.addColleague('Captain Flush');

  await tracker.startVisit(id);
  clock.advance(240);
  await tracker.stopVisit(id);
  clock.advance(600);

  assert.equal(tracker.colleagues()[0].runningVisit, null);
  assert.deepEqual(totals(tracker), [['Captain Flush', 240]]);
});

test('the leaderboard puts the most time first and counts running visits', async () => {
  const { clock, tracker } = await setup();
  const flush = await tracker.addColleague('Captain Flush');
  const bones = await tracker.addColleague('Bones');
  const mango = await tracker.addColleague('Mango');

  await tracker.startVisit(flush.id);
  clock.advance(120);
  await tracker.stopVisit(flush.id);

  await tracker.startVisit(bones.id);
  clock.advance(60);
  await tracker.startVisit(mango.id);
  clock.advance(300);
  await tracker.stopVisit(bones.id);
  clock.advance(10);

  // Bones 360 s finished; Mango 310 s and still out; Flush 120 s finished.
  assert.deepEqual(totals(tracker), [
    ['Bones', 360],
    ['Mango', 310],
    ['Captain Flush', 120],
  ]);
});

test('the leaderboard shows who is out', async () => {
  const { clock, tracker } = await setup();
  const flush = await tracker.addColleague('Captain Flush');
  await tracker.addColleague('Bones');

  await tracker.startVisit(flush.id);
  clock.advance(30);

  assert.deepEqual(
    tracker.leaderboard().map((row) => [row.alias, row.out]),
    [
      ['Captain Flush', true],
      ['Bones', false],
    ],
  );

  await tracker.stopVisit(flush.id);
  assert.equal(tracker.leaderboard()[0].out, false);
});

test('whoever has the most time is leading, and nobody leads before any time is recorded', async () => {
  const { clock, tracker } = await setup();
  const flush = await tracker.addColleague('Captain Flush');
  const bones = await tracker.addColleague('Bones');
  const leaders = () =>
    tracker
      .leaderboard()
      .filter((row) => row.leading)
      .map((row) => row.alias);

  assert.deepEqual(leaders(), []);

  await tracker.startVisit(flush.id);
  clock.advance(60);
  await tracker.stopVisit(flush.id);
  await tracker.startVisit(bones.id);
  clock.advance(20);
  assert.deepEqual(leaders(), ['Captain Flush']);

  // Bones is still out and overtakes at 61 seconds.
  clock.advance(41);
  assert.deepEqual(leaders(), ['Bones']);
});

test('a colleague who is already out cannot start a second visit', async () => {
  const { clock, tracker } = await setup();
  const { id } = await tracker.addColleague('Captain Flush');
  await tracker.startVisit(id);
  clock.advance(30);

  await assert.rejects(tracker.startVisit(id), /already out/);

  clock.advance(30);
  await tracker.stopVisit(id);
  assert.equal(tracker.leaderboard()[0].totalSeconds, 60);
});

test('a visit cannot be stopped for a colleague who is not out', async () => {
  const { tracker } = await setup();
  const { id } = await tracker.addColleague('Captain Flush');

  await assert.rejects(tracker.stopVisit(id), /not out/);
});

test('a visit cannot be started for someone who is not a colleague', async () => {
  const { tracker } = await setup();

  await assert.rejects(tracker.startVisit('nobody'), /No such colleague/);
});

test('reopening the app keeps colleagues, finished visits and running visits', async () => {
  const { clock, store, tracker } = await setup();
  const flush = await tracker.addColleague('Captain Flush');
  const bones = await tracker.addColleague('Bones');
  await tracker.startVisit(flush.id);
  clock.advance(90);
  await tracker.stopVisit(flush.id);
  await tracker.startVisit(bones.id);
  clock.advance(20);

  const reopened = await createTracker({ clock, store });
  clock.advance(40);

  assert.deepEqual(totals(reopened), [
    ['Captain Flush', 90],
    ['Bones', 60],
  ]);
  const out = reopened.colleagues().find((colleague) => colleague.id === bones.id);
  assert.equal(out?.runningVisit?.elapsedSeconds, 60);
});

test('a visit is stored under the month it started in, in local time', async () => {
  // 23:30 UTC on 31 October is already 00:30 on 1 November in Budapest.
  const { clock, store, tracker } = await setup('2026-10-31T23:30:00Z');
  const { id } = await tracker.addColleague('Captain Flush');

  await tracker.startVisit(id);
  clock.advance(60);
  await tracker.stopVisit(id);

  assert.deepEqual(await store.loadVisits('2026-10'), []);
  const november = await store.loadVisits('2026-11');
  assert.equal(november.length, 1);
  assert.equal(november[0].startedAt, '2026-10-31T23:30:00.000Z');
  assert.equal(november[0].endedAt, '2026-10-31T23:31:00.000Z');
});

test('the leaderboard covers only the current month', async () => {
  const { clock, store, tracker } = await setup('2026-10-20T09:00:00Z');
  const { id } = await tracker.addColleague('Captain Flush');
  await tracker.startVisit(id);
  clock.advance(500);
  await tracker.stopVisit(id);

  clock.set('2026-11-03T09:00:00Z');
  const inNovember = await createTracker({ clock, store });
  await inNovember.startVisit(id);
  clock.advance(45);
  await inNovember.stopVisit(id);

  assert.equal(inNovember.leaderboard()[0].totalSeconds, 45);
});

test('visits are timed in whole seconds', async () => {
  const { clock, tracker } = await setup('2026-10-08T09:00:00.700Z');
  const { id } = await tracker.addColleague('Captain Flush');

  await tracker.startVisit(id);
  clock.advance(10.6);
  await tracker.stopVisit(id);

  // Started in second :00 and stopped in second :11.
  assert.equal(tracker.leaderboard()[0].totalSeconds, 11);
});

test('a visit still running after the month changes survives reopening the app', async () => {
  // 23:50 on 31 October in Budapest.
  const { clock, store, tracker } = await setup('2026-10-31T22:50:00Z');
  const { id } = await tracker.addColleague('Captain Flush');
  await tracker.startVisit(id);

  clock.advance(20 * 60);
  const reopened = await createTracker({ clock, store });

  assert.equal(reopened.colleagues()[0].runningVisit?.elapsedSeconds, 1200);
  await assert.rejects(reopened.startVisit(id), /already out/);
  await reopened.stopVisit(id);
  assert.equal(reopened.colleagues()[0].runningVisit, null);
});

test('two starts at the same moment create only one visit', async () => {
  const { clock, tracker } = await setup();
  const { id } = await tracker.addColleague('Captain Flush');

  const outcomes = await Promise.allSettled([tracker.startVisit(id), tracker.startVisit(id)]);
  clock.advance(30);
  await tracker.stopVisit(id);

  assert.deepEqual(
    outcomes.map((outcome) => outcome.status),
    ['fulfilled', 'rejected'],
  );
  assert.equal(tracker.colleagues()[0].runningVisit, null);
  assert.equal(tracker.leaderboard()[0].totalSeconds, 30);
});
