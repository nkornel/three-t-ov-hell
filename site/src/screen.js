import { Refused } from './tracker.js';

/**
 * @typedef {import('./tracker.js').Tracker} Tracker
 * @typedef {import('./tracker.js').Clock} Clock
 * @typedef {ReturnType<Tracker['colleagues']>} Colleagues
 */

/** @param {number} value */
const twoDigits = (value) => String(value).padStart(2, '0');

/**
 * A length of time as whole hours, then minutes and seconds in two digits.
 * @param {number} totalSeconds
 */
function hoursMinutesSeconds(totalSeconds) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: twoDigits(Math.floor((totalSeconds % 3600) / 60)),
    seconds: twoDigits(totalSeconds % 60),
  };
}

/**
 * A live timer, read like a stopwatch: 2090 becomes "34:50" and 3850
 * becomes "1:04:10".
 * @param {number} totalSeconds
 */
function formatTimer(totalSeconds) {
  const { hours, minutes, seconds } = hoursMinutesSeconds(totalSeconds);
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

/**
 * A total, always with all three units so that a column of them lines up:
 * 8162 becomes "2h 16m 02s".
 * @param {number} totalSeconds
 */
function formatTotal(totalSeconds) {
  const { hours, minutes, seconds } = hoursMinutesSeconds(totalSeconds);
  return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * The time of day of a stored instant, in the operator's local time: "14:05".
 * @param {string} instant
 */
function formatTimeOfDay(instant) {
  const moment = new Date(instant);
  return `${twoDigits(moment.getHours())}:${twoDigits(moment.getMinutes())}`;
}

/** @param {{ elapsedSeconds: number } | null} runningVisit */
function timerText(runningVisit) {
  return runningVisit ? formatTimer(runningVisit.elapsedSeconds) : '';
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
 * @param {...(Node | string)} children
 */
function element(tag, className, ...children) {
  const node = document.createElement(tag);
  node.className = className;
  node.append(...children);
  return node;
}

/**
 * One of the icons the page defines, by the part of its id after "i-".
 * @param {string} name
 */
function icon(name) {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('class', 'ic');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(namespace, 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

/**
 * A small labelled marker, such as "Out" or "Leading".
 * @param {string} className
 * @param {string} iconName
 * @param {string} label
 */
function marker(className, iconName, label) {
  return element('span', `tag ${className}`, icon(iconName), label);
}

/** What a colleague's button does, depending on whether they are out. */
const VISIT_ACTIONS = {
  start: { icon: 'play', label: 'Start', describe: 'Start a visit for' },
  stop: { icon: 'stop', label: 'Stop', describe: 'Stop the visit for' },
};

/**
 * Draws the tracker on the page and turns clicks into tracker commands.
 *
 * @param {{ tracker: Tracker, clock: Clock, root: ParentNode }} options
 */
export function mountScreen({ tracker, clock, root }) {
  const colleagueList = find(root, '#colleagues');
  const colleagueCount = find(root, '#colleague-count');
  const noColleagues = find(root, '#no-colleagues');
  const leaderboardTable = find(root, '#leaderboard-table');
  const leaderboardBody = find(root, '#leaderboard');
  const noLeaderboard = find(root, '#no-leaderboard');
  const monthLabel = find(root, '#month');
  const message = find(root, '#message');
  const messageText = find(root, '#message-text');
  /** @type {HTMLFormElement} */
  const addForm = find(root, '#add-colleague');
  const aliasField = find(root, '#alias-field');
  /** @type {HTMLInputElement} */
  const aliasInput = find(root, '#alias');
  const aliasError = find(root, '#alias-error');
  const aliasErrorText = find(root, '#alias-error-text');
  const monthFormat = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });

  /** @param {Colleagues[number]} colleague */
  function colleagueRow(colleague) {
    const running = colleague.runningVisit;
    const row = element('li', 'crow');
    row.dataset.state = running ? 'out' : 'idle';

    // The line under the alias is there even when it is empty, so that the
    // row, and the button in it, stay put when a visit starts or stops.
    const meta = element('span', 'crow-meta');
    const timer = element('span', 'timer', timerText(running));
    timer.dataset.colleagueId = colleague.id;
    if (running) {
      meta.append(
        marker('tag-run', 'hourglass', 'Out'),
        `since ${formatTimeOfDay(running.startedAt)}`,
      );
      timer.setAttribute('role', 'timer');
      timer.setAttribute('aria-label', 'Time away');
    }

    const actionName = running ? 'stop' : 'start';
    const action = VISIT_ACTIONS[actionName];
    const button = element('button', `btn btn-timer btn-${actionName}`, icon(action.icon), action.label);
    button.setAttribute('type', 'button');
    button.dataset.action = actionName;
    button.dataset.colleagueId = colleague.id;
    button.setAttribute('aria-label', `${action.describe} ${colleague.alias}`);

    row.append(
      element('div', 'crow-main', element('span', 'alias', colleague.alias), meta),
      element('div', 'crow-timer', timer),
      button,
    );
    return row;
  }

  /** @param {Colleagues} colleagues */
  function renderColleagues(colleagues) {
    const outCount = colleagues.filter((colleague) => colleague.runningVisit).length;
    colleagueCount.textContent = `${colleagues.length} active · ${outCount} out`;
    noColleagues.hidden = colleagues.length > 0;
    colleagueList.replaceChildren(...colleagues.map(colleagueRow));
  }

  /** @param {Colleagues} colleagues */
  function renderTimers(colleagues) {
    const running = new Map(colleagues.map((colleague) => [colleague.id, colleague.runningVisit]));
    for (const timer of colleagueList.querySelectorAll('.timer')) {
      const visit = running.get(/** @type {HTMLElement} */ (timer).dataset.colleagueId ?? '');
      timer.textContent = timerText(visit ?? null);
    }
  }

  function renderLeaderboard() {
    const rows = tracker.leaderboard();
    monthLabel.textContent = monthFormat.format(clock.now());
    // A visit in its first second has no time yet, but the month has begun.
    const begun = rows.some((row) => row.totalSeconds > 0 || row.out);
    leaderboardTable.hidden = !begun;
    noLeaderboard.hidden = begun;
    leaderboardBody.replaceChildren(
      ...rows.map((row, index) => {
        const who = element('td', 'lb-who', element('span', 'alias', row.alias));
        if (row.leading || row.out) {
          const markers = element('div', 'tags');
          if (row.leading) markers.append(marker('tag-leading', 'flag', 'Leading'));
          if (row.out) markers.append(marker('tag-run', 'hourglass', 'Out'));
          who.append(markers);
        }
        const item = element(
          'tr',
          'lb-row',
          element('td', 'lb-rank', String(index + 1)),
          who,
          element('td', 'num lb-total', formatTotal(row.totalSeconds)),
        );
        item.classList.toggle('is-leading', row.leading);
        item.classList.toggle('is-running', row.out);
        return item;
      }),
    );
  }

  function render() {
    renderColleagues(tracker.colleagues());
    renderLeaderboard();
  }

  /** @param {string} text */
  function showMessage(text) {
    messageText.textContent = text;
    message.hidden = text === '';
  }

  /** @param {string} text */
  function showAliasError(text) {
    aliasErrorText.textContent = text;
    aliasError.hidden = text === '';
    aliasField.classList.toggle('has-error', text !== '');
    if (text === '') aliasInput.removeAttribute('aria-invalid');
    else aliasInput.setAttribute('aria-invalid', 'true');
  }

  /**
   * Runs a tracker command and redraws. A refusal goes to `explain`, which by
   * default is the message under the header.
   *
   * @param {() => Promise<unknown>} command
   * @param {(reason: string) => void} [explain]
   * @returns {Promise<boolean>} whether the command went through
   */
  async function run(command, explain = showMessage) {
    showMessage('');
    let done = false;
    try {
      await command();
      done = true;
    } catch (error) {
      if (error instanceof Refused) {
        explain(error.message);
      } else {
        console.error(error);
        showMessage('Something went wrong. Please try again.');
      }
    }
    render();
    return done;
  }

  colleagueList.addEventListener('click', async (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('button');
    const colleagueId = button?.dataset.colleagueId;
    if (!button || !colleagueId) return;
    const hadFocus = document.activeElement === button;
    button.disabled = true;
    await run(() =>
      button.dataset.action === 'stop'
        ? tracker.stopVisit(colleagueId)
        : tracker.startVisit(colleagueId),
    );
    // Redrawing replaced the button, so hand the focus to its successor.
    if (hadFocus) {
      for (const next of colleagueList.querySelectorAll('button')) {
        if (next.dataset.colleagueId === colleagueId) next.focus();
      }
    }
  });

  addForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const alias = aliasInput.value;
    aliasInput.value = '';
    showAliasError('');
    const added = await run(() => tracker.addColleague(alias), showAliasError);
    // An alias that was not added goes back into the field to be corrected.
    if (!added) aliasInput.value = alias;
    aliasInput.focus();
  });

  aliasInput.addEventListener('input', () => showAliasError(''));

  render();
  setInterval(() => {
    renderTimers(tracker.colleagues());
    renderLeaderboard();
  }, 1000);
}
