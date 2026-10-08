# 11: Twelve-month retention

**What to build:** The game keeps one year of history and tidies up after itself. The month selector offers the current month and the previous eleven. Anything older is deleted automatically, and an archived colleague who no longer has any visits is removed for good. This housekeeping runs alongside month closing and needs nothing from the operator.

**Blocked by:** 05, 10

**Status:** ready-for-agent

- [ ] The month selector offers the current month and the previous eleven, and nothing older
- [ ] Visits from months older than that are deleted from storage, including in Google Drive
- [ ] An archived colleague with no remaining visits is removed permanently
- [ ] An archived colleague who still has visits within the window is kept
- [ ] An active colleague is never removed by housekeeping
- [ ] Housekeeping runs when the app loads and when the month rolls over while it is open
- [ ] The window, deletion and colleague removal are covered by tests using a fake clock
