# Toilet Time Tracker

Status: ready-for-agent

## Problem Statement

The operator's office wants to turn toilet breaks into an open game. A colleague who occupies the toilet keeps everyone else at their desks, so the colleague with the most toilet time each month deserves recognition. Today nothing measures this: there is no way to time a visit, no running total per colleague, and no agreed way to name a monthly winner.

The operator wants this with as little effort as possible: no software installed on their PC, no time spent on anything beyond measuring visits and showing a leaderboard, and the data kept as ordinary files in their own Google Drive.

## Solution

A single-page web app, opened in the operator's browser, that the operator uses to time visits and that shows the month's leaderboard.

The operator signs in with Google and sees one screen: every colleague with their avatar, a start/stop button and a live timer, next to the current month's leaderboard. When a colleague leaves for the toilet the operator presses start; when they return the operator presses stop. The leaderboard updates live, ranked by total time with the most time first. A month selector shows the previous eleven months, each with its winner marked.

Colleagues are known only by an alias and a pirate-themed pixel-art avatar chosen from a set of twenty that ships with the app. All data is saved to a folder in the operator's Google Drive that the app creates and is limited to.

On screen the app is called The 3 T's ov Hell and carries its own logo; Toilet Time Tracker is only the working title of this spec. It has one visual design, a pixel-art look in the spirit of 16-bit pirate adventure games, recorded as an interactive mockup in `design/mockup.html`.

## User Stories

### Signing in and data

1. As an operator, I want to open the app from a web address, so that I do not have to install anything.
2. As an operator, I want to sign in with my Google account, so that the app can save data to my Drive.
3. As an operator, I want the app to create its own folder in my Drive on first use, so that I do not have to prepare anything by hand.
4. As an operator, I want the app to be able to see only the files it created, so that the rest of my Drive stays private.
5. As an operator, I want every change saved to Drive immediately, so that closing the browser never loses a visit.
6. As an operator, I want my colleagues and visits to be there when I reopen the app, on any browser or PC, so that the game does not depend on one browser profile.
7. As an operator, I want a clear message when a change could not be saved, so that I know the data on screen is not yet safe.
8. As an operator, I want the app to retry a failed save by itself, so that a brief connection drop does not need my attention.
9. As an operator, I want to be asked to sign in again when my Google session lapses, so that saving resumes without losing what is on screen.
10. As an operator, I want the data stored as one file of colleagues and one file of visits per month, so that I can read or back up the files myself.

### Colleagues

11. As an operator, I want to add a colleague by typing an alias and picking an avatar, so that adding someone takes a few seconds.
12. As an operator, I want aliases to be the only name stored, so that no real names are recorded anywhere.
13. As an operator, I want the app to refuse an empty alias or one already used by an active colleague, so that every row on the leaderboard is identifiable.
14. As an operator, I want to choose from twenty pirate-themed pixel-art avatars, so that the game is fun to look at.
15. As an operator, I want avatars already taken by an active colleague to be shown as unavailable, so that no two active colleagues look the same.
16. As an operator, I want to change a colleague's alias, so that I can fix a typo or follow a change of heart.
17. As an operator, I want to change a colleague's avatar to any free one, so that a colleague can switch character.
18. As an operator, I want to archive a colleague who has left the game, so that they no longer clutter the start buttons.
19. As an operator, I want an archived colleague's visits and leaderboard places kept, so that past results stay true.
20. As an operator, I want archiving to free that colleague's avatar, so that a newcomer can pick it.
21. As an operator, I want to be stopped from archiving a colleague whose visit is still running, so that no timer is left orphaned.
22. As an operator, I want to be told when all twenty avatars are in use, so that I understand why I cannot add another colleague.

### Timing visits

23. As an operator, I want a start button for each active colleague, so that I can begin a visit with one click.
24. As an operator, I want the start button to become a stop button while a visit is running, so that one control does both jobs.
25. As an operator, I want a live timer next to each colleague who is out, so that I can see how long they have been gone.
26. As an operator, I want several colleagues to be out at the same time, each with their own timer, so that the app matches a real office.
27. As an operator, I want a colleague to have at most one running visit, so that a double click cannot create two.
28. As an operator, I want a running visit to keep counting from its original start after I close the browser or restart the PC, so that a reboot does not cut a visit short.
29. As an operator, I want a visit running longer than thirty minutes highlighted, so that I notice a timer I forgot to stop.

### Fixing mistakes

30. As an operator, I want to see the list of a colleague's visits in the current month, so that I can find the one I got wrong.
31. As an operator, I want to change the start and end time of a finished visit in the current month, so that I can correct a late start or a forgotten stop.
32. As an operator, I want to change the start time of a running visit, so that I can correct a late start without stopping it.
33. As an operator, I want to delete a visit in the current month, so that I can remove one started by mistake.
34. As an operator, I want the app to refuse an edit that makes a visit end before it starts, end in the future, overlap another visit by the same colleague, or move out of the current month, so that a typo cannot corrupt the leaderboard.
35. As an operator, I want visits in a closed month to be read-only, so that a result that has been announced can never change.

### Leaderboard

36. As an operator, I want the current month's leaderboard always visible on the main screen, so that the standings are one glance away.
37. As an operator, I want colleagues ranked by total visit time with the most time first, so that the biggest occupier of the toilet is on top.
38. As an operator, I want running visits counted in the totals as they tick, so that the leaderboard moves live.
39. As an operator, I want each row to show the avatar, alias, total time, number of visits and longest visit, so that there is something to talk about beyond the total.
40. As an operator, I want totals shown in hours, minutes and seconds, so that close races are visible.
41. As an operator, I want colleagues with exactly equal totals to share a rank, so that nobody loses a tie on a technicality.
42. As an operator, I want colleagues with no time yet listed at the bottom, so that everyone playing appears on the board.
43. As a colleague, I want to recognise myself on the operator's screen by my alias and avatar, so that I can follow my standing.

### Months and winners

44. As an operator, I want months to be calendar months in my local time, so that the game follows the calendar everyone uses.
45. As an operator, I want a visit to count toward the month it started in, so that a visit across midnight on the last day has one clear home.
46. As an operator, I want a month to close by itself when it ends, so that I do not have to do anything to finish it.
47. As an operator, I want a visit still running when its month closes to be discarded, so that a forgotten timer cannot decide the month.
48. As an operator, I want a month selector covering the current month and the previous eleven, so that I can look back over the past year.
49. As an operator, I want the winner of each closed month clearly marked, so that I can announce them.
50. As an operator, I want colleagues who tie at the top of a closed month to all be marked as winners, so that a shared win is shown as one.
51. As an operator, I want a closed month in which nobody had any time to show no winner, so that an empty month is not awarded.
52. As an operator, I want the current month to show a leader but no winner, so that nobody is crowned early.
53. As an operator, I want data older than twelve months deleted automatically, so that the app keeps only the past year.
54. As an operator, I want an archived colleague with no visits left to be removed for good, so that the colleague list does not grow forever.

### Running the project

55. As the maintainer, I want every tool to run in Docker, so that nothing is installed on my machine.
56. As the maintainer, I want the site republished automatically when I push to the repository, so that I never deploy by hand.
57. As the maintainer, I want a guided walkthrough for the one-time Google setup, so that I can complete the steps only I can perform.
58. As the maintainer, I want to preview the app locally without Google credentials, so that development does not depend on my Drive.

### Look and feel

59. As an operator, I want the app to show its logo, which carries its name, The 3 T's ov Hell, large at the top of the screen, so that the game has an identity the office recognises.
60. As a colleague, I want aliases, timers and totals large enough to read from a couple of metres away, so that I can follow the game from my desk.
61. As an operator, I want the app to follow my system's light or dark setting, so that it suits the screen it runs on.
62. As an operator, I want an avatar to move only while its colleague is out, so that a glance across the room shows who is away.
63. As an operator, I want a shortcut on a visit that has run longer than thirty minutes that stops it and lets me set when it really ended, so that fixing a forgotten timer is one step.
64. As an operator, I want every state marked by more than colour, so that the screen works for people who cannot tell the colours apart.

## Implementation Decisions

### Shape

- A static site of plain HTML, CSS and JavaScript using native ES modules. No framework, no bundler and no build step: the files in the repository are the files served. See ADR 0001 for why this is a web page and not a desktop app.
- All text is in English. There is no language switcher.
- Hosted on GitHub Pages from a public repository. The repository holds code, the design files and the avatar set, never game data.
- A GitHub Actions workflow runs the tests and publishes the site on every push to the default branch. A failing test blocks publication.

### Modules

- **Tracker**: the one deep module, holding every game rule. It is created with a clock and a store, both injected. It exposes commands (add, rename, re-avatar and archive a colleague; start, stop, edit and delete a visit) and queries (active colleagues with their running visits, a colleague's visits in a month, the leaderboard for a month, the list of selectable months, which avatars are free). It has no knowledge of the browser, the network or Google.
- **Store**: a small port the tracker depends on, able to read and write the colleagues document and one visits document per month, and to list and delete month documents. Two adapters implement it: a Google Drive adapter for the published app, and a local adapter used by tests and by the local preview.
- **Google sign-in and Drive adapter**: uses Google's browser sign-in library to obtain an access token with the scope that limits the app to files it created. It finds or creates the app's Drive folder and reads and writes JSON documents in it. The OAuth client ID is public configuration checked into the repository; there is no client secret.
- **Screen**: a thin layer that renders tracker queries and turns clicks into tracker commands. It owns the once-per-second tick that makes timers and the leaderboard move, and the save-status message. Its look and behaviour follow the Design section below.
- **Avatar set**: twenty original SVG files with stable identifiers and a display name each, covering pirates, sailors, zombie pirates and voodoo figures. They are pixel art drawn on a 32-pixel grid, in the spirit of classic pirate adventure games and in keeping with the logo, and copy no existing character. Each has its own looping animation, which plays only while its colleague is out and never for people who ask their system for reduced motion.

### Data

- A colleague has an identifier, an alias, an avatar identifier and an archived timestamp that is empty while they are active.
- A visit has an identifier, a colleague identifier, a start instant and an end instant that is empty while the visit is running.
- Instants are stored in UTC. The month a visit belongs to is decided by its start instant in the operator's local time zone. Durations are differences between instants, so daylight-saving changes do not distort them.
- Drive holds one colleagues document and one visits document per month, named by year and month. Each document carries a format version number.

### Rules

- An alias is trimmed, must not be empty, is at most thirty characters, and must be unique among active colleagues ignoring letter case.
- An avatar may be held by one active colleague at a time. Archiving frees it. With all twenty held, no colleague can be added.
- Archiving is refused while the colleague has a running visit, and cannot be undone in this version.
- Starting a visit is refused for an archived colleague or one who already has a running visit.
- Editing and deleting apply only to visits in the current month. An edited visit must start before it ends, must not end after the present moment, must not overlap another visit by the same colleague, and must still start within the current month.
- A month closes when the calendar month ends in local time. Closing is detected when the app loads and when the month rolls over while the app is open. On closing, any visit of that month still running is discarded. After that the month's document is never written again.
- The app keeps the current month and the previous eleven. Older month documents are deleted, and archived colleagues with no remaining visits are removed, as part of the same housekeeping.
- The leaderboard for a month lists every colleague with a visit in that month; the current month also lists every active colleague. Rows are ordered by total time descending, equal totals share a rank, and zero-time rows come last ordered by alias. A running visit counts up to the present moment toward total, visit count and longest visit.
- The winner of a closed month is every colleague at rank one with a non-zero total. The current month never has a winner.
- A visit running for more than thirty minutes is flagged for highlighting. The threshold is fixed.

### Saving

- Every command is saved straight away. The start of a visit is saved when it starts, not when it stops.
- A command takes effect on screen immediately. If the save fails, the screen shows that changes are unsaved and the app retries until it succeeds. The app does not work offline: without a first successful load from Drive it shows nothing to operate.
- The app assumes one operator in one browser tab. Two tabs open at once are not reconciled.

### Design

- The reference is `design/mockup.html`, an interactive mockup of every screen and state. Its tokens are repeated in `design/tokens.css`. Its sample aliases, avatar tiles and avatar descriptions are placeholders. Where the mockup and this spec disagree, this spec wins; the known differences are listed at the end of this section.
- The app is called The 3 T's ov Hell. The logo, kept as `design/logo.png`, carries the name: the header shows the logo alone, large and centred, with no title or tagline in text, and the browser tab shows the name. "Toilet Time Tracker" does not appear on screen.
- Styling uses the mockup's tokens as CSS custom properties. Components use only the role tokens (`--c-*`), never the raw palette, so the dark theme is a swap of token values. The theme follows the system setting. The header bar is dark in both themes.
- Each colour has one job. Brass marks the primary action, the leader and the winner. Green marks a colleague who is out: the start button, running timers and the Out tag. Red marks stopping and trouble: the stop button, a visit over thirty minutes, refused input, deletion and a lapsed sign-in. Text and background pairings meet WCAG AA, using the adjusted shades in the tokens.
- No state is carried by colour alone. Out, over thirty minutes, leading, winner, a taken avatar and refused input each have an icon, a label or a shape as well.
- Headings, aliases and buttons use Pixelify Sans. Timers and totals use VT323, whose fixed-width digits keep ticking numbers still. Running text uses the system font. The two fonts load from Google Fonts through one stylesheet link and fall back to system fonts.
- Aliases, live timers and leaderboard totals are sized to be read from about two metres away.
- The main screen has two panels side by side, colleagues and leaderboard, which stack on a narrow window. Colleagues are listed by alias and never reorder when someone goes out; only the leaderboard re-sorts. The start and stop button keeps one size and one place.
- Live timers read as a stopwatch (`34:50`, then `1:04:10`). Totals and longest visits always show hours, minutes and seconds (`2h 16m 02s`).
- Shared ranks use competition ranking (1, 2, 3=, 3=, 5), with an equals sign after a shared rank. Rows with no time sit under a "No time yet" divider with a dash in place of a rank.
- The month selector belongs to the leaderboard panel. The colleagues panel always shows the current month, so timing carries on while the operator looks back.
- An avatar is still by default and plays its animation only while its colleague is out.
- A row that has been out for more than thirty minutes offers an "Ended earlier?" shortcut, which stops the visit and opens it for editing with the end time ready to change.
- Motion stops for people who ask their system for reduced motion, and every state keeps its still cues. Every control has a visible keyboard focus state.
- The interface says "Change alias" for renaming a colleague and "Signed out" for a lapsed sign-in.
- The sign-in button is Google's official button, not restyled.
- Differences from the mockup, decided by the maintainer on 2026-10-08:
  - The mockup's hourglass seal and "Toilet Time Tracker" wordmark stand in for the logo, which is shown alone, large and centred.
  - Editing a visit takes a date and a time, where the mockup takes a time alone, so that a visit can be moved to another day of the current month.
  - The start of a running visit can be changed without stopping it, where the mockup says "Stop it to edit".
  - The header has no operator address and no sign-out button.
  - The unsaved status has no count of waiting changes, no countdown and no "Retry now".
  - The "Ended earlier?" shortcut is built; the mockup only suggests it in its notes.

### Local development

- Docker Compose provides a service that runs the tests and a service that serves the site for local preview. Nothing is installed on the host.
- The local preview uses the local store adapter, so it needs no Google account. The Google origin configuration allows both the published address and the local preview address, so the Drive adapter can also be exercised locally.

## Testing Decisions

- A good test exercises the tracker only through its commands and queries, with a fake clock and the local store, and asserts on what a query returns or what the store holds afterwards. Tests do not reach into the tracker's internals, so the internals can be reshaped freely.
- The tracker is the single test seam and carries nearly all the tests: every rule above, with particular attention to month boundaries, closing with a running visit, the twelve-month window, ties, live totals from running visits, and each refused edit.
- The store port has one set of contract tests. They run automatically against the local adapter. The Google Drive adapter is kept thin and is verified by hand against a real Drive using a short written checklist, because it cannot be exercised without a real Google account.
- The avatar set has an automated check: exactly twenty files, each a well-formed SVG, each with a unique identifier.
- The screen is verified by hand in the local preview and on the published site, by comparing it with `design/mockup.html` in both themes and at a narrow width.
- Tests use the test runner built into Node, with no third-party dependencies, and run in Docker.
- There is no prior art: the repository is empty. These tests set the pattern for later work.

## Out of Scope

- Notifications of any kind, including for long-running visits.
- A pop-up or dedicated winner announcement screen, and any way to share results to a chat tool.
- Anything on colleagues' own devices: self-registration, viewing the leaderboard remotely, or starting their own timers.
- More than one operator, shared live state between browsers, or reconciling two open tabs.
- Working offline.
- A separate backup or export feature; Drive is the backup.
- Restoring an archived colleague.
- Editing or deleting anything in a closed month.
- Keeping data beyond twelve months.
- Avatars generated per colleague, uploaded images, or more than twenty avatars.
- Languages other than English.
- A configurable long-visit threshold.
- A sign-out button, and a count, countdown or manual retry in the save status.

## Further Notes

- The game is open: colleagues know they are timed and have agreed to it. The alias-only rule exists so that the stored data names nobody.
- Two steps can only be performed by the maintainer and block the Drive adapter from working: creating a Google Cloud project with an OAuth client ID for a web application, and listing the published address and the local preview address as allowed origins. A guided walkthrough should be produced for this.
- Creating the public GitHub repository and enabling Pages are outward-facing actions and should be confirmed with the maintainer at the time.
- Renaming a colleague or changing their avatar changes how they appear in closed months too, because closed leaderboards are computed from the stored visits and the colleague's current alias. Times, ranks and winners of a closed month never change.
- The twenty-avatar set caps the game at twenty active colleagues. If the office outgrows it, either more avatars are drawn or sharing is allowed.
