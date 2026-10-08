# 05: Rename and archive colleagues

**What to build:** The operator can manage who is playing. They can change a colleague's alias, and archive a colleague who has left the game: an archived colleague loses their start button but keeps their visits and still appears on the leaderboard of any month in which they have a visit. Alias rules are enforced whenever an alias is entered.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] The operator can change a colleague's alias, and the new alias appears everywhere at once
- [ ] An alias is trimmed, cannot be empty, and cannot be longer than thirty characters
- [ ] An alias already used by an active colleague is refused, ignoring letter case; an archived colleague's alias can be reused
- [ ] The operator can archive a colleague, after which the colleague has no start button
- [ ] Archiving is refused while the colleague has a running visit, with a message saying why
- [ ] An archived colleague still appears on the leaderboard for months in which they have visits
- [ ] There is no way to restore an archived colleague
- [ ] Each rule is covered by tests through the tracker's commands and queries
