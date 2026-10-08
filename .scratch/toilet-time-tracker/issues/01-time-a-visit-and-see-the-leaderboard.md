# 01: Time a visit and see the leaderboard

**What to build:** The walking skeleton, running in the local preview with no Google account. The operator adds a colleague by alias, presses start when they leave and stop when they return, watches a live timer while the visit runs, and sees the current month's leaderboard ranked by total time with the most time first. Everything survives a page reload. This ticket also establishes how the project is run: tests and the preview both run in Docker, and the tracker is driven through its commands and queries with an injected clock and store.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] One Docker command runs the tests and another serves the local preview; nothing is installed on the host
- [x] The operator can add a colleague by typing an alias
- [x] Each colleague has a start button that becomes a stop button while their visit is running
- [x] A running visit shows a timer that advances every second
- [x] Several colleagues can have running visits at once; a colleague can never have two
- [x] The current month's leaderboard lists colleagues by total visit time, most first, and counts running visits as they tick
- [x] Reloading the page keeps colleagues, finished visits and running visits, and a running visit keeps counting from its original start
- [x] Visits are stored per month, by the month they started in according to local time
- [x] The tracker's rules are covered by tests that use a fake clock and the local store, with no browser involved
- [x] The store port has contract tests that pass against the local adapter
