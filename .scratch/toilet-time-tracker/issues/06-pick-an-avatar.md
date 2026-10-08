# 06: Pick an avatar

**What to build:** Every colleague has an avatar. When adding a colleague the operator picks one from a picker next to the alias field, and can later change it to any free one. Avatars appear beside each colleague's start button and on their leaderboard row. This ticket draws the first five of the twenty avatars and builds everything around them; the remaining fifteen follow in ticket 07.

Avatars are original SVG pixel art drawn on a 32-pixel grid, on the themes of pirates, sailors, zombie pirates and voodoo figures, in the spirit of classic pirate adventure games and in keeping with the logo in `design/logo.png`. They must not copy any existing character. An avatar is still by default; its animation plays only while its colleague is out, so movement shows who is away.

**Design:** Follow the mockup's picker: a five-by-four grid beside the alias field. A taken avatar is greyed, hatched, carries a lock and says who holds it. The selected one has a brass frame and a check. None is selected to begin with, and submitting without one is refused with a message on the picker. With every avatar taken, the form explains why nobody can be added and how to free an avatar. Change avatar joins the row menu and opens the same picker in a dialog. Avatars appear at the mockup's sizes on colleague rows, on leaderboard rows and in the picker, and are drawn so that they scale by whole pixels. The mockup's coloured tiles and descriptions are placeholders for the real avatars.

**Blocked by:** 05

**Status:** ready-for-agent

- [ ] Five avatars exist as pixel art on a 32-pixel grid, each with a stable identifier, a display name and its own looping animation
- [ ] An avatar is still by default and its animation plays only while its colleague is out
- [ ] Animations stop for people whose system asks for reduced motion
- [ ] Adding a colleague requires picking an avatar
- [ ] An avatar held by an active colleague is shown as unavailable in the picker and cannot be chosen
- [ ] The operator can change a colleague's avatar to any free one
- [ ] Archiving a colleague frees their avatar; the archived colleague still shows it on past leaderboards
- [ ] When every avatar is held, adding a colleague is refused with a message saying why
- [ ] Avatars are shown beside each colleague on the main screen and on each leaderboard row
- [ ] An automated check confirms every avatar is a well-formed SVG with a unique identifier
- [ ] The avatar rules are covered by tests through the tracker's commands and queries
- [ ] The picker matches the mockup in its taken, selected, nothing-chosen and all-taken states, and can be used from the keyboard alone

## Comments

2026-10-08: Design added from `design/mockup.html`, with the maintainer's decisions on where it differs from the spec (see the spec's Design section). The avatars change from flat cartoons that always loop to pixel art that moves only while the colleague is out.
