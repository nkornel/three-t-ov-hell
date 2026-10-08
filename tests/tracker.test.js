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

test('an added colleague is listed by alias', async () => {
  const { tracker } = await setup();

  await tracker.addColleague('Captain Flush');

  assert.deepEqual(
    tracker.colleagues().map((colleague) => colleague.alias),
    ['Captain Flush'],
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
  assert.deepEqual(tracker.leaderboard(), [
    { colleagueId: id, alias: 'Captain Flush', totalSeconds: 240 },
  ]);
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
  assert.deepEqual(tracker.leaderboard(), [
    { colleagueId: bones.id, alias: 'Bones', totalSeconds: 360 },
    { colleagueId: mango.id, alias: 'Mango', totalSeconds: 310 },
    { colleagueId: flush.id, alias: 'Captain Flush', totalSeconds: 120 },
  ]);
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

  assert.deepEqual(reopened.leaderboard(), [
    { colleagueId: flush.id, alias: 'Captain Flush', totalSeconds: 90 },
    { colleagueId: bones.id, alias: 'Bones', totalSeconds: 60 },
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
