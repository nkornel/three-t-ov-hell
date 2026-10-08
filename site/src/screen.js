import { MAX_ALIAS_LENGTH, Refused, aliasLength } from './tracker.js';

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
 * One entry of a colleague's "more" menu.
 * @param {string} action
 * @param {string} iconName
 * @param {string} label
 * @param {string} [className]
 */
function menuItem(action, iconName, label, className = '') {
  const button = element('button', className, icon(iconName), label);
  button.setAttribute('type', 'button');
  button.setAttribute('role', 'menuitem');
  button.dataset.action = action;
  const item = element('li', '', button);
  item.setAttribute('role', 'none');
  return item;
}

/**
 * Looks after one alias field: its hint, its character counter and the
 * refusal shown beside it. The page has one in the add-colleague form and one
 * in the change-alias dialog.
 *
 * @param {HTMLElement} field
 */
function aliasField(field) {
  /** @type {HTMLInputElement} */
  const input = find(field, 'input');
  const error = find(field, '.field-error');
  const errorText = find(error, 'span');
  const counter = find(field, '.counter');
  find(field, '.hint').textContent =
    `Shown on the leaderboard. Up to ${MAX_ALIAS_LENGTH} characters.`;

  function showCount() {
    const length = aliasLength(input.value);
    counter.textContent = `${length}/${MAX_ALIAS_LENGTH}`;
    counter.classList.toggle('over', length > MAX_ALIAS_LENGTH);
  }

  /** @param {string} reason why the alias was refused, or '' to clear it */
  function explain(reason) {
    errorText.textContent = reason;
    error.hidden = reason === '';
    field.classList.toggle('has-error', reason !== '');
    if (reason === '') input.removeAttribute('aria-invalid');
    else input.setAttribute('aria-invalid', 'true');
  }

  input.addEventListener('input', () => {
    showCount();
    // A refusal for being too long stays until the alias fits again.
    if (aliasLength(input.value) <= MAX_ALIAS_LENGTH) explain('');
  });
  showCount();

  return {
    input,
    explain,
    /** @param {string} alias */
    fill(alias) {
      input.value = alias;
      explain('');
      showCount();
    },
  };
}

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
  const newColleagueAlias = aliasField(find(addForm, '.field'));
  /** @type {HTMLDialogElement} */
  const aliasDialog = find(root, '#alias-dialog');
  const changedAlias = aliasField(find(aliasDialog, '.field'));
  /** @type {HTMLDialogElement} */
  const archiveDialog = find(root, '#archive-dialog');
  const archiveTitle = find(archiveDialog, '#archive-dialog-title');
  const archiveText = find(archiveDialog, '#archive-dialog-text');
  const archiveRefusal = find(archiveDialog, '#archive-refusal');
  const monthFormat = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });

  /** The colleague a dialog is open for. */
  let dialogColleagueId = '';

  /** @param {Colleagues[number]} colleague */
  function colleagueRow(colleague) {
    const running = colleague.runningVisit;
    const row = element('li', 'crow');
    row.dataset.state = running ? 'out' : 'idle';
    row.dataset.colleagueId = colleague.id;

    // The line under the alias is there even when it is empty, so that the
    // row, and the button in it, stay put when a visit starts or stops.
    const meta = element('span', 'crow-meta');
    const timer = element('span', 'timer', timerText(running));
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
    button.setAttribute('aria-label', `${action.describe} ${colleague.alias}`);

    const more = element('button', 'btn btn-icon more', icon('dots'));
    more.setAttribute('type', 'button');
    more.dataset.action = 'menu';
    more.setAttribute('aria-haspopup', 'menu');
    more.setAttribute('aria-expanded', 'false');
    more.setAttribute('aria-label', `More for ${colleague.alias}`);

    const separator = element('li', 'sep');
    separator.setAttribute('role', 'none');
    const menu = element(
      'ul',
      'menu',
      menuItem('alias', 'tag', 'Change alias'),
      separator,
      menuItem('archive', 'archive', 'Archive', 'danger'),
    );
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', `More for ${colleague.alias}`);
    menu.hidden = true;

    row.append(
      element('div', 'crow-main', element('span', 'alias', colleague.alias), meta),
      element('div', 'crow-timer', timer),
      button,
      more,
      menu,
    );
    return row;
  }

  /**
   * A colleague's row, if they have one.
   * @param {string} colleagueId
   * @returns {HTMLElement | undefined}
   */
  function rowOf(colleagueId) {
    return [.../** @type {NodeListOf<HTMLElement>} */ (colleagueList.querySelectorAll('.crow'))].find(
      (row) => row.dataset.colleagueId === colleagueId,
    );
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
    for (const colleague of colleagues) {
      const timer = rowOf(colleague.id)?.querySelector('.timer');
      if (timer) timer.textContent = timerText(colleague.runningVisit);
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
        const markers = [];
        if (row.leading) markers.push(marker('tag-leading', 'flag', 'Leading'));
        if (row.out) markers.push(marker('tag-run', 'hourglass', 'Out'));
        if (row.archived) markers.push(marker('tag-quiet', 'archive', 'Archived'));
        const who = element('td', 'lb-who', element('span', 'alias', row.alias));
        if (markers.length > 0) who.append(element('div', 'tags', ...markers));
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

  /**
   * Runs a tracker command and redraws. A refusal goes to `explain`, which by
   * default is the message under the header; anything else that goes wrong
   * is always reported there.
   *
   * @param {() => Promise<unknown>} command
   * @param {(reason: string) => void} [explain]
   * @returns {Promise<'done' | 'refused' | 'failed'>}
   */
  async function run(command, explain = showMessage) {
    showMessage('');
    /** @type {'done' | 'refused' | 'failed'} */
    let outcome = 'done';
    try {
      await command();
    } catch (error) {
      if (error instanceof Refused) {
        outcome = 'refused';
        explain(error.message);
      } else {
        outcome = 'failed';
        console.error(error);
        showMessage('Something went wrong. Please try again.');
      }
    }
    render();
    return outcome;
  }

  /**
   * Handles a form's submit with its button switched off meanwhile, so that
   * a second press of Enter cannot send the same command twice.
   *
   * @param {HTMLFormElement} form
   * @param {() => Promise<void>} handle
   */
  function onSubmit(form, handle) {
    /** @type {HTMLButtonElement} */
    const button = find(form, 'button[type="submit"]');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      button.disabled = true;
      try {
        await handle();
      } finally {
        button.disabled = false;
      }
    });
  }

  // The "more" menu on each row. At most one is open at a time.

  /** The row whose menu is open, if any. */
  function rowWithOpenMenu() {
    /** @type {HTMLElement | null} */
    const menu = colleagueList.querySelector('.menu:not([hidden])');
    return menu?.closest('.crow') ?? null;
  }

  function closeMenu() {
    const row = rowWithOpenMenu();
    if (!row) return;
    find(row, '.menu').hidden = true;
    find(row, '.more').setAttribute('aria-expanded', 'false');
  }

  /** @param {HTMLElement} row */
  function toggleMenu(row) {
    const wasOpen = row === rowWithOpenMenu();
    closeMenu();
    if (wasOpen) return;
    const menu = find(row, '.menu');
    menu.hidden = false;
    find(row, '.more').setAttribute('aria-expanded', 'true');
    find(menu, 'button').focus();
  }

  /** @param {EventTarget | null} target */
  function isPartOfAMenu(target) {
    return target instanceof Element && target.closest('.menu, .more') !== null;
  }

  // A click elsewhere, or the focus moving on to something else, closes the
  // menu. Focus that goes nowhere is left to the click: some browsers do not
  // focus a button when it is clicked, and closing here would hide the entry
  // before the click reached it.
  document.addEventListener('click', (event) => {
    if (!isPartOfAMenu(event.target)) closeMenu();
  });
  colleagueList.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !isPartOfAMenu(event.relatedTarget)) closeMenu();
  });

  colleagueList.addEventListener('keydown', (event) => {
    const row = rowWithOpenMenu();
    if (!row) return;
    if (event.key === 'Escape') {
      // Focus goes back first, so that closing is not mistaken for leaving.
      find(row, '.more').focus();
      closeMenu();
      event.preventDefault();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const items = [...row.querySelectorAll('.menu button')];
      const at = items.indexOf(/** @type {HTMLButtonElement} */ (document.activeElement));
      const down = event.key === 'ArrowDown';
      // From outside the entries, down goes to the first and up to the last.
      const next = at === -1 ? (down ? 0 : items.length - 1) : at + (down ? 1 : -1);
      /** @type {HTMLElement} */ (items[(next + items.length) % items.length]).focus();
      event.preventDefault();
    }
  });

  // The dialogs opened from the menu.

  /** @param {string} colleagueId */
  function aliasOf(colleagueId) {
    return tracker.colleagues().find((colleague) => colleague.id === colleagueId)?.alias ?? '';
  }

  /** @param {string} colleagueId */
  function openAliasDialog(colleagueId) {
    dialogColleagueId = colleagueId;
    changedAlias.fill(aliasOf(colleagueId));
    aliasDialog.showModal();
    changedAlias.input.focus();
    changedAlias.input.select();
  }

  /** @param {string} reason why archiving was refused, or '' to clear it */
  function explainArchive(reason) {
    find(archiveRefusal, 'span').textContent = reason;
    archiveRefusal.hidden = reason === '';
  }

  /** @param {string} colleagueId */
  function openArchiveDialog(colleagueId) {
    dialogColleagueId = colleagueId;
    const alias = aliasOf(colleagueId);
    archiveTitle.textContent = `Archive ${alias}?`;
    archiveText.textContent = `${alias} leaves the colleagues panel, and their visits stay on the leaderboard. An archived colleague cannot be brought back.`;
    explainArchive('');
    archiveDialog.showModal();
  }

  // A dialog stays open only on a refusal, which it explains itself. If
  // something else went wrong, it closes so that the message under the
  // header can be seen.
  onSubmit(find(aliasDialog, 'form'), async () => {
    const outcome = await run(
      () => tracker.renameColleague(dialogColleagueId, changedAlias.input.value),
      changedAlias.explain,
    );
    if (outcome === 'refused') changedAlias.input.focus();
    else aliasDialog.close();
  });

  onSubmit(find(archiveDialog, 'form'), async () => {
    const outcome = await run(() => tracker.archiveColleague(dialogColleagueId), explainArchive);
    if (outcome !== 'refused') archiveDialog.close();
  });

  for (const dialog of [aliasDialog, archiveDialog]) {
    dialog.addEventListener('click', (event) => {
      const target = /** @type {HTMLElement} */ (event.target);
      if (target.closest('[data-action="close"]')) dialog.close();
    });
    // Back to the row the dialog was opened from, or to the add-colleague
    // form if that row is gone because its colleague was archived.
    dialog.addEventListener('close', () => {
      const more = /** @type {HTMLElement | null | undefined} */ (
        rowOf(dialogColleagueId)?.querySelector('.more')
      );
      (more ?? newColleagueAlias.input).focus();
    });
  }

  // Commands from the rows and from the add-colleague form.

  colleagueList.addEventListener('click', async (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('button');
    const row = /** @type {HTMLElement | null | undefined} */ (button?.closest('.crow'));
    const colleagueId = row?.dataset.colleagueId;
    if (!button || !row || !colleagueId) return;
    const action = button.dataset.action;

    if (action === 'menu') {
      toggleMenu(row);
    } else if (action === 'alias') {
      closeMenu();
      openAliasDialog(colleagueId);
    } else if (action === 'archive') {
      closeMenu();
      openArchiveDialog(colleagueId);
    } else if (action === 'start' || action === 'stop') {
      const hadFocus = document.activeElement === button;
      button.disabled = true;
      await run(() =>
        action === 'stop' ? tracker.stopVisit(colleagueId) : tracker.startVisit(colleagueId),
      );
      // Redrawing replaced the button, so hand the focus to its successor.
      if (hadFocus) {
        /** @type {HTMLElement | null | undefined} */ (
          rowOf(colleagueId)?.querySelector('.btn-timer')
        )?.focus();
      }
    }
  });

  onSubmit(addForm, async () => {
    const outcome = await run(
      () => tracker.addColleague(newColleagueAlias.input.value),
      newColleagueAlias.explain,
    );
    // An alias that was not added stays in the field to be corrected.
    if (outcome === 'done') newColleagueAlias.fill('');
    newColleagueAlias.input.focus();
  });

  render();
  setInterval(() => {
    renderTimers(tracker.colleagues());
    renderLeaderboard();
  }, 1000);
}
