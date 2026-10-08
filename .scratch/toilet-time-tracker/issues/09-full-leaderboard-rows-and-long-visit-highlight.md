# 09: Full leaderboard rows and long-visit highlight

**What to build:** The leaderboard becomes worth reading and a forgotten timer becomes hard to miss. Each row shows rank, total time, number of visits and longest visit, with times in hours, minutes and seconds. Colleagues with exactly equal totals share a rank, and every active colleague appears even before their first visit. A visit that has been running for more than thirty minutes is highlighted on the main screen.

**Design:** Follow the mockup's leaderboard table: rank, colleague, total, visits and longest, with numbers in the digits font. On a narrow panel the visits and longest columns fold into a line under the alias. Shared ranks use competition ranking (1, 2, 3=, 3=, 5) with an equals sign after a shared rank, and every colleague sharing first place carries the Leading tag. Rows with no time sit under a "No time yet" divider with a dash in place of a rank. On the colleagues panel, an idle row says how many visits the colleague has this month. A row out for more than thirty minutes takes the mockup's over-thirty state: a red frame, a striped side bar, an alert badge, a flashing "Over 30 min" tag that holds still under reduced motion, a red timer and the prompt to press stop.

**Blocked by:** 01, 12

**Status:** ready-for-agent

- [ ] Each leaderboard row shows rank, alias, total time, number of visits and longest visit
- [ ] Times are shown in hours, minutes and seconds
- [ ] A running visit counts toward total, visit count and longest visit as it ticks
- [ ] Colleagues with exactly equal totals share the same rank
- [ ] Active colleagues with no time in the current month are listed at the bottom, ordered by alias
- [ ] A visit running for more than thirty minutes is visibly highlighted, and the highlight clears when it is stopped
- [ ] Ranking, ties, zero-time ordering and the thirty-minute flag are covered by tests through the tracker's queries
- [ ] The leaderboard table, the tie marker, the "No time yet" group and the over-thirty row match the mockup, including the narrow layout
- [ ] The over-thirty state can be recognised without colour and without motion

## Comments

2026-10-08: Design added from `design/mockup.html`, with the maintainer's decisions on where it differs from the spec (see the spec's Design section). Now also blocked by 12.
