import { createTracker } from './tracker.js';
import { createLocalStore } from './local-store.js';
import { mountScreen } from './screen.js';

const clock = { now: () => new Date() };
const store = createLocalStore(window.localStorage);
const tracker = await createTracker({ clock, store });

mountScreen({ tracker, clock, root: document });
