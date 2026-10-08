# 10: Closed months and winners

**What to build:** The monthly game. When a calendar month ends in local time it closes by itself, whether the app is open at that moment or is next opened days later. A visit still running when its month closes is discarded. A closed month is final: its visits cannot be edited or deleted. A month selector lets the operator look back at earlier months, and each closed month marks its winner: every colleague at the top with a non-zero total. The current month shows who is leading but never a winner.

**Design:** Follow the mockup. The month selector sits in the leaderboard panel's heading: previous and next buttons around a button that opens the list of months, each line showing its state (In progress, the winner's alias, the number of joint winners, or No winner). It changes the leaderboard only. The colleagues panel always shows the current month, so timing carries on while the operator looks back. A closed month looks final: a double frame, a "Final" stamp with a lock, a banner naming the winner or joint winners with their avatars and total, filled Winner or Joint winner tags with a crown, and no live marker or Leading tag. A closed month with no visits shows "No winner". The current month keeps the In progress banner and the dashed Leading tag.

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
- [ ] The month selector and the closed-month leaderboard match the mockup for a single winner, joint winners and no winner
- [ ] Changing the month on the leaderboard leaves the colleagues panel on the current month

## Comments

2026-10-08: Design added from `design/mockup.html`, with the maintainer's decisions on where it differs from the spec (see the spec's Design section).
