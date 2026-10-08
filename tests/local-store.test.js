import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLocalStore } from '../site/src/local-store.js';
import { describeStoreContract } from './store-contract.js';

describeStoreContract('local store', () => createLocalStore());

/** A stand-in for the browser's localStorage. */
function fakeBrowserStorage() {
  /** @type {Map<string, string>} */
  const items = new Map();
  return {
    getItem: (/** @type {string} */ key) => items.get(key) ?? null,
    setItem: (/** @type {string} */ key, /** @type {string} */ value) => {
      items.set(key, value);
    },
  };
}

test('local store: data outlives the store when given browser storage', async () => {
  const storage = fakeBrowserStorage();
  const before = createLocalStore(storage);
  await before.saveColleagues([{ id: 'c1', alias: 'Captain Flush' }]);
  await before.saveVisits('2026-10', [
    { id: 'v1', colleagueId: 'c1', startedAt: '2026-10-08T09:00:00.000Z', endedAt: null },
  ]);

  const after = createLocalStore(storage);

  assert.deepEqual(await after.loadColleagues(), [{ id: 'c1', alias: 'Captain Flush' }]);
  assert.equal((await after.loadVisits('2026-10')).length, 1);
});

test('local store: without browser storage every store starts empty', async () => {
  await createLocalStore().saveColleagues([{ id: 'c1', alias: 'Captain Flush' }]);

  assert.deepEqual(await createLocalStore().loadColleagues(), []);
});
