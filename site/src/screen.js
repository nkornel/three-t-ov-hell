import { Refused } from './tracker.js';

/**
 * @typedef {import('./tracker.js').Tracker} Tracker
 * @typedef {import('./tracker.js').Clock} Clock
 */

/**
 * A length of time as hours, minutes and seconds: 3725 becomes "1:02:05".
 * @param {number} totalSeconds
 */
export function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/** @param {{ elapsedSeconds: number } | null} runningVisit */
function timerText(runningVisit) {
  return runningVisit ? formatDuration(runningVisit.elapsedSeconds) : '';
}

/**
 * @template {HTMLElement} T
 * @param {ParentNode} root
 * @param {string} selector
 * @returns {T}
 */
function find(root, selector) {
  const found = root.querySelector(selector);
  if (!found) throw new Error(`The page is missing ${selector}`);
  return /** @type {T} */ (found);
}

/**
 * @param {string} tag
 * @param {string} className
 * @param {string} text
 */
function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

/**
 * Draws the tracker on the page and turns clicks into tracker commands.
 *
 * @param {{ tracker: Tracker, clock: Clock, root: ParentNode }} options
 */
export function mountScreen({ tracker, clock, root }) {
  const colleagueList = find(root, '#colleagues');
  const noColleagues = find(root, '#no-colleagues');
  const leaderboardList = find(root, '#leaderboard');
  const noLeaderboard = find(root, '#no-leaderboard');
  const monthLabel = find(root, '#month');
  const message = find(root, '#message');
  /** @type {HTMLFormElement} */
  const addForm = find(root, '#add-colleague');
  /** @type {HTMLInputElement} */
  const aliasInput = find(root, '#alias');
  const monthFormat = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });

  function renderColleagues() {
    const colleagues = tracker.colleagues();
    noColleagues.hidden = colleagues.length > 0;
    colleagueList.replaceChildren(
      ...colleagues.map((colleague) => {
        const running = colleague.runningVisit;
        const row = document.createElement('li');
        row.classList.toggle('running', running !== null);
        const timer = element('span', 'timer', timerText(running));
        timer.dataset.colleagueId = colleague.id;
        const action = running ? 'Stop' : 'Start';
        const button = element('button', '', action);
        button.setAttribute('type', 'button');
        button.dataset.action = action.toLowerCase();
        button.dataset.colleagueId = colleague.id;
        button.setAttribute('aria-label', `${action} ${colleague.alias}`);
        row.append(element('span', 'alias', colleague.alias), timer, button);
        return row;
      }),
    );
  }

  function renderTimers() {
    const running = new Map(
      tracker.colleagues().map((colleague) => [colleague.id, colleague.runningVisit]),
    );
    for (const timer of colleagueList.querySelectorAll('.timer')) {
      const visit = running.get(/** @type {HTMLElement} */ (timer).dataset.colleagueId ?? '');
      timer.textContent = timerText(visit ?? null);
    }
  }

  function renderLeaderboard() {
    const rows = tracker.leaderboard();
    monthLabel.textContent = monthFormat.format(clock.now());
    noLeaderboard.hidden = rows.length > 0;
    leaderboardList.replaceChildren(
      ...rows.map((row, index) => {
        const item = document.createElement('li');
        item.append(
          element('span', 'place', String(index + 1)),
          element('span', 'alias', row.alias),
          element('span', 'total', formatDuration(row.totalSeconds)),
        );
        return item;
      }),
    );
  }

  function render() {
    renderColleagues();
    renderLeaderboard();
  }

  /** @param {() => Promise<unknown>} command */
  async function run(command) {
    message.textContent = '';
    try {
      await command();
    } catch (error) {
      if (error instanceof Refused) {
        message.textContent = error.message;
      } else {
        console.error(error);
        message.textContent = 'Something went wrong. Please try again.';
      }
    }
    render();
  }

  colleagueList.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('button');
    const colleagueId = button?.dataset.colleagueId;
    if (!button || !colleagueId) return;
    button.disabled = true;
    run(() =>
      button.dataset.action === 'stop'
        ? tracker.stopVisit(colleagueId)
        : tracker.startVisit(colleagueId),
    );
  });

  addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const alias = aliasInput.value;
    aliasInput.value = '';
    run(() => tracker.addColleague(alias));
  });

  render();
  setInterval(() => {
    renderTimers();
    renderLeaderboard();
  }, 1000);
}
