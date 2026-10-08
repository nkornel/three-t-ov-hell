import { test } from 'node:test';
import assert from 'node:assert/strict';

/**
 * The behaviour every store adapter must have. Call it from an adapter's
 * test file with a function that returns a fresh, empty store.
 *
 * @param {string} name
 * @param {() => import('../site/src/store.js').Store | Promise<import('../site/src/store.js').Store>} createEmptyStore
 */
export function describeStoreContract(name, createEmptyStore) {
  const visit = {
    id: 'v1',
    colleagueId: 'c1',
    startedAt: '2026-10-08T09:00:00.000Z',
    endedAt: '2026-10-08T09:04:00.000Z',
  };
  const runningVisit = {
    id: 'v2',
    colleagueId: 'c2',
    startedAt: '2026-11-02T10:00:00.000Z',
    endedAt: null,
  };

  test(`${name}: an empty store has no colleagues and no visits`, async () => {
    const store = await createEmptyStore();

    assert.deepEqual(await store.loadColleagues(), []);
    assert.deepEqual(await store.loadVisits('2026-10'), []);
  });

  test(`${name}: saved colleagues are loaded back`, async () => {
    const store = await createEmptyStore();
    const colleagues = [
      { id: 'c1', alias: 'Captain Flush' },
      { id: 'c2', alias: 'Bones' },
    ];

    await store.saveColleagues(colleagues);

    assert.deepEqual(await store.loadColleagues(), colleagues);
  });

  test(`${name}: saving colleagues replaces what was there`, async () => {
    const store = await createEmptyStore();
    await store.saveColleagues([{ id: 'c1', alias: 'Captain Flush' }]);

    await store.saveColleagues([{ id: 'c2', alias: 'Bones' }]);

    assert.deepEqual(await store.loadColleagues(), [{ id: 'c2', alias: 'Bones' }]);
  });

  test(`${name}: saved visits are loaded back, running ones included`, async () => {
    const store = await createEmptyStore();

    await store.saveVisits('2026-11', [runningVisit]);

    assert.deepEqual(await store.loadVisits('2026-11'), [runningVisit]);
  });

  test(`${name}: each month's visits are kept apart`, async () => {
    const store = await createEmptyStore();

    await store.saveVisits('2026-10', [visit]);
    await store.saveVisits('2026-11', [runningVisit]);

    assert.deepEqual(await store.loadVisits('2026-10'), [visit]);
    assert.deepEqual(await store.loadVisits('2026-11'), [runningVisit]);
    assert.deepEqual(await store.loadVisits('2026-12'), []);
  });

  test(`${name}: changing what was loaded does not change the store`, async () => {
    const store = await createEmptyStore();
    await store.saveVisits('2026-10', [visit]);

    const loaded = await store.loadVisits('2026-10');
    loaded.pop();

    assert.deepEqual(await store.loadVisits('2026-10'), [visit]);
  });
}
