# 08: Edit and delete visits

**What to build:** The operator can fix timing mistakes in the current month. From a colleague they can open the list of that colleague's visits this month, change the start and end of a finished visit, change the start of a running visit, or delete a visit. Edits that would corrupt the leaderboard are refused with a message saying why. The leaderboard reflects every change immediately.

**Design:** Follow the mockup's visit list: a dialog opened from Visits in the colleague's row menu, with a table of date, start, end and duration, editing in place, a refusal that keeps what was typed, marks the field at fault and explains the rule, and a delete confirmation in the row. The row menu arrives with whichever of tickets 05 and 08 is built first. Two things differ from the mockup, as the spec's Design section records. An edit takes a date and a time, not a time alone, so a visit can be moved to another day of the current month. And the running visit's row has a control to change its start, where the mockup says "Stop it to edit". The mockup shows the refusals for ending before the start and for overlapping; ending in the future and leaving the current month use the same component.

One addition to the mockup: a row that has been out for more than thirty minutes, which ticket 09 highlights, offers an "Ended earlier?" shortcut. It stops the visit and opens the visit list with that visit in edit and its end time focused.

**Blocked by:** 01, 09, 12

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
- [ ] The visit list, the in-place edit, the refusal and the delete confirmation match the mockup, with date-and-time fields in place of the mockup's time-only fields
- [ ] A row out for more than thirty minutes offers "Ended earlier?", which stops the visit and opens it for editing with the end time focused

## Comments

2026-10-08: Design added from `design/mockup.html`, with the maintainer's decisions on where it differs from the spec (see the spec's Design section). Now also blocked by 09, for the "Ended earlier?" shortcut, and by 12.
