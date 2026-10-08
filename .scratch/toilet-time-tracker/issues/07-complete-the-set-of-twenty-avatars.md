# 07: Complete the set of twenty avatars

**What to build:** The remaining fifteen avatars, so that the operator chooses from twenty and the game can hold twenty active colleagues. They follow the style, size and animation conventions set by the first five and spread evenly across the four themes: pirates, sailors, zombie pirates and voodoo figures. Each is an original character that copies nothing existing.

**Blocked by:** 06

**Status:** ready-for-agent

- [ ] The picker offers exactly twenty avatars
- [ ] The fifteen new avatars match the first five in style and size: pixel art on a 32-pixel grid, each with its own looping animation that plays only while its colleague is out
- [ ] Every avatar is visually distinct from the others at the size used on the leaderboard
- [ ] Animations stop for people whose system asks for reduced motion
- [ ] The automated check confirms exactly twenty well-formed SVG files with unique identifiers

## Comments

2026-10-08: Design added from `design/mockup.html`, with the maintainer's decisions on where it differs from the spec (see the spec's Design section). The avatars are pixel art that moves only while the colleague is out, as in ticket 06.
