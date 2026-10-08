# 06: Pick an avatar

**What to build:** Every colleague has an avatar. When adding a colleague the operator picks one from a picker next to the alias field, and can later change it to any free one. Avatars appear beside each colleague's start button and on their leaderboard row. This ticket draws the first five of the twenty avatars and builds everything around them; the remaining fifteen follow in ticket 07.

Avatars are original animated SVG cartoons, flat in style, on the themes of pirates, sailors, zombie pirates and voodoo figures, in the spirit of classic pirate adventure games. They must not copy any existing character.

**Blocked by:** 05

**Status:** ready-for-agent

- [ ] Five avatars exist, each with a stable identifier and a display name, each with a looping animation
- [ ] Animations stop for people whose system asks for reduced motion
- [ ] Adding a colleague requires picking an avatar
- [ ] An avatar held by an active colleague is shown as unavailable in the picker and cannot be chosen
- [ ] The operator can change a colleague's avatar to any free one
- [ ] Archiving a colleague frees their avatar; the archived colleague still shows it on past leaderboards
- [ ] When every avatar is held, adding a colleague is refused with a message saying why
- [ ] Avatars are shown beside each colleague on the main screen and on each leaderboard row
- [ ] An automated check confirms every avatar is a well-formed SVG with a unique identifier
- [ ] The avatar rules are covered by tests through the tracker's commands and queries
