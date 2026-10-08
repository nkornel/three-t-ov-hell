/**
 * @typedef {import('./store.js').Store} Store
 * @typedef {Pick<Storage, 'getItem' | 'setItem'>} KeyValueStorage
 */

const COLLEAGUES_KEY = 'toiletovhell:colleagues';
/** @param {string} month */
const visitsKey = (month) => `toiletovhell:visits-${month}`;

/**
 * A stand-in for the browser's localStorage that forgets everything when
 * it is thrown away.
 *
 * @returns {KeyValueStorage}
 */
export function createMemoryStorage() {
  /** @type {Map<string, string>} */
  const items = new Map();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, value);
    },
  };
}

/**
 * The store used by tests and by the local preview. Pass the browser's
 * localStorage to keep data across reloads; with no argument it keeps
 * everything in memory.
 *
 * @param {KeyValueStorage} [storage]
 * @returns {Store}
 */
export function createLocalStore(storage = createMemoryStorage()) {
  return {
    async loadColleagues() {
      return JSON.parse(storage.getItem(COLLEAGUES_KEY) ?? '[]');
    },
    async saveColleagues(colleagues) {
      storage.setItem(COLLEAGUES_KEY, JSON.stringify(colleagues));
    },
    async loadVisits(month) {
      return JSON.parse(storage.getItem(visitsKey(month)) ?? '[]');
    },
    async saveVisits(month, visits) {
      storage.setItem(visitsKey(month), JSON.stringify(visits));
    },
  };
}
