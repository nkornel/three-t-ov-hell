# 10: Closed months and winners

**What to build:** The monthly game. When a calendar month ends in local time it closes by itself, whether the app is open at that moment or is next opened days later. A visit still running when its month closes is discarded. A closed month is final: its visits cannot be edited or deleted. A month selector lets the operator look back at earlier months, and each closed month marks its winner: every colleague at the top with a non-zero total. The current month shows who is leading but never a winner.

**Blocked by:** 08, 09

**Status:** ready-for-agent

- [ ] A month closes when the calendar month ends in local time, both when the app is open across the boundary and when it is next loaded
- [ ] A visit belongs to the month it started in, even if it ends in the next one
- [ ] A visit still running when its month closes is discarded and does not count
- [ ] After closing, nothing writes to that month's visits again
- [ ] Visits in a closed month cannot be edited or deleted, and the screen offers no way to try
- [ ] A month selector lets the operator view the leaderboard of earlier months
- [ ] A closed month marks its winner clearly; colleagues tied at the top are all marked
- [ ] A closed month in which nobody had any time shows no winner
- [ ] The current month never shows a winner
- [ ] Month boundaries, discarding, read-only enforcement and winner selection are covered by tests using a fake clock
