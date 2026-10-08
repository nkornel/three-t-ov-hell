# 09: Full leaderboard rows and long-visit highlight

**What to build:** The leaderboard becomes worth reading and a forgotten timer becomes hard to miss. Each row shows rank, total time, number of visits and longest visit, with times in hours, minutes and seconds. Colleagues with exactly equal totals share a rank, and every active colleague appears even before their first visit. A visit that has been running for more than thirty minutes is highlighted on the main screen.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Each leaderboard row shows rank, alias, total time, number of visits and longest visit
- [ ] Times are shown in hours, minutes and seconds
- [ ] A running visit counts toward total, visit count and longest visit as it ticks
- [ ] Colleagues with exactly equal totals share the same rank
- [ ] Active colleagues with no time in the current month are listed at the bottom, ordered by alias
- [ ] A visit running for more than thirty minutes is visibly highlighted, and the highlight clears when it is stopped
- [ ] Ranking, ties, zero-time ordering and the thirty-minute flag are covered by tests through the tracker's queries
