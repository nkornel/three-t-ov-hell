import { createTracker } from './tracker.js';
import { createLocalStore } from './local-store.js';
import { mountScreen } from './screen.js';

const clock = { now: () => new Date() };
// The local preview keeps the game in this browser. The published app will
// keep it in the operator's Google Drive instead; see ADR 0001.
const store = createLocalStore(window.localStorage);
const tracker = await createTracker({ clock, store });

mountScreen({ tracker, clock, root: document });
