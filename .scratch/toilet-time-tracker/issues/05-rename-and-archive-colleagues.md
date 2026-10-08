# 05: Rename and archive colleagues

**What to build:** The operator can manage who is playing. They can change a colleague's alias, and archive a colleague who has left the game: an archived colleague loses their start button but keeps their visits and still appears on the leaderboard of any month in which they have a visit. Alias rules are enforced whenever an alias is entered.

**Design:** Each colleague's row gets the mockup's "more" menu, holding Change alias and Archive; Visits and Change avatar join it in tickets 08 and 06. Both open the mockup's small dialog. The alias field, here and in the add-colleague form, has the character counter that turns red past thirty, and a refusal is explained beside the field without discarding what was typed. Archiving asks for confirmation and, when it is refused because the colleague is out, says why in the dialog. An archived colleague's leaderboard row carries the Archived tag. The interface says "Change alias", not "Rename".

**Blocked by:** 01, 12

**Status:** done

- [x] The operator can change a colleague's alias, and the new alias appears everywhere at once
- [x] An alias is trimmed, cannot be empty, and cannot be longer than thirty characters
- [x] An alias already used by an active colleague is refused, ignoring letter case; an archived colleague's alias can be reused
- [x] The operator can archive a colleague, after which the colleague has no start button
- [x] Archiving is refused while the colleague has a running visit, with a message saying why
- [x] An archived colleague still appears on the leaderboard for months in which they have visits
- [x] There is no way to restore an archived colleague
- [x] Each rule is covered by tests through the tracker's commands and queries
- [x] The row menu, the two dialogs, the alias counter and the Archived tag match the mockup
- [x] The menu and the dialogs can be used from the keyboard alone, and closing a dialog returns focus to the row

## Comments

2026-10-08: Design added from `design/mockup.html`, with the maintainer's decisions on where it differs from the spec (see the spec's Design section). Now also blocked by 12.

2026-10-08, later: Built. The screen was exercised in a headless browser in Docker, not by a person: the alias rules in the add form and in the dialog, the menu by keyboard, both dialogs, archiving, and a reload.

Decisions made while building, for the maintainer to overrule if they disagree:

- The archive dialog opens with the focus on Cancel, where the mockup puts it on the Archive button, because archiving cannot be undone.
- An archived colleague cannot be archived again or given a new alias. The spec says nothing about either, and no screen offers them.
- A colleague saved before archiving existed has no archived timestamp and counts as active.
- The character counter does not count spaces around the alias, since the tracker trims them.

"An archived colleague still appears on the leaderboard for months in which they have visits" is met and tested for the current month, which is the only month the leaderboard shows until ticket 10.
