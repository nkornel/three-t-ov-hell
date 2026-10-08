# 08: Edit and delete visits

**What to build:** The operator can fix timing mistakes in the current month. From a colleague they can open the list of that colleague's visits this month, change the start and end of a finished visit, change the start of a running visit, or delete a visit. Edits that would corrupt the leaderboard are refused with a message saying why. The leaderboard reflects every change immediately.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] The operator can see a colleague's visits in the current month with their start, end and duration
- [ ] The start and end of a finished visit can be changed
- [ ] The start of a running visit can be changed without stopping it
- [ ] A visit can be deleted, after a confirmation
- [ ] An edit is refused if the visit would end before it starts
- [ ] An edit is refused if the visit would end in the future
- [ ] An edit is refused if the visit would overlap another visit by the same colleague
- [ ] An edit is refused if the visit would no longer start in the current month
- [ ] The leaderboard updates as soon as an edit or deletion is made
- [ ] Each rule is covered by tests through the tracker's commands and queries
