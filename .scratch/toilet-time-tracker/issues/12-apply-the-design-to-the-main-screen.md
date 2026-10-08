# 12: Apply the design to the main screen

**What to build:** The app takes on its name and its look. The walking skeleton from ticket 01 is restyled to match `design/mockup.html`: the header with the logo and the name The 3 T's ov Hell, the colleagues panel with its start and stop rows and live timers, the add-colleague form, and the leaderboard. Nothing the tracker does changes, except that colleagues are listed by alias. The spec's Design section says what the design is and where it differs from the mockup. This ticket builds the parts that exist today; each later ticket follows the mockup for the parts it adds.

Not in this ticket, because the features do not exist yet: avatars and the picker (06, 07), the row menu and its dialogs (05), the visit list (08), the visits and longest columns, ties and the over-thirty state (09), the month selector, closed months and winners (10), sign-in and the save status (04). Rows are laid out without an avatar until ticket 06.

**Blocked by:** 01

**Status:** done

- [x] The design tokens are served with the site as their own stylesheet, matching `design/tokens.css`, and the site's styles use only the role tokens
- [x] The page follows the system's light or dark setting, and the header bar is dark in both
- [x] The header shows the logo and the name The 3 T's ov Hell, with "Toilet Time Tracker" as a tagline
- [x] The browser tab shows the name and an icon made from the logo
- [x] The logo served with the site is a reduced copy of `design/logo.png`, sized for the header and the sign-in screen, not the full 1024-pixel original
- [x] Pixelify Sans and VT323 load through one stylesheet link, and the page stays usable on system fonts if they do not load
- [x] The colleagues and leaderboard panels sit side by side and stack on a narrow window, as in the mockup
- [x] A colleague's row shows the alias and a start button that becomes a stop button of the same size in the same place
- [x] While a colleague is out, their row shows the Out tag, the time they left and a live timer in the digits font, and is marked by its tint and side bar as well as by colour
- [x] Colleagues are listed by alias and do not reorder when a visit starts or stops
- [x] The panel heading shows how many colleagues are active and how many are out
- [x] The add-colleague form matches the mockup's alias field, and a refused alias is explained beside the field; the character counter arrives with the alias rules in ticket 05
- [x] The leaderboard is a table in the mockup's style with rank, alias and total, the In progress banner, a Leading tag on the top row and an Out tag on anyone with a running visit
- [x] Live timers read as a stopwatch and totals show hours, minutes and seconds, in fixed-width digits that do not shift as they tick
- [x] The empty states for no colleagues and for an empty leaderboard match the mockup
- [x] Every control has a visible keyboard focus state, and animations stop for people whose system asks for reduced motion
- [x] The screen has been compared by hand with the mockup in the local preview, in both themes and at a narrow width

## Comments

2026-10-08: Built. Beyond the criteria, the tracker's leaderboard now says who is leading and who is out, so the screen does not work that out for itself.

The comparison with the mockup was done on screenshots of the local preview taken in a headless browser in Docker, in both themes and at 1280 and 390 pixels, not by a person at a screen. The same run checked that colleagues stay in alias order, that the start and stop button keeps its place at both widths, that keyboard focus stays on the button after a start, and that the page works with the web fonts blocked.

Three things to know for later tickets:

- A refused alias is shown beside the field, but the tracker refuses no alias until ticket 05. The path was exercised with a stand-in tracker that refuses one.
- An idle row keeps an empty line under the alias, which holds the row's height. Ticket 09 fills it with the colleague's visit count.
- The form still uses the browser's own check for an empty alias. Ticket 05 replaces it with the tracker's refusal.

2026-10-08, later: After seeing the screen in a browser, the maintainer asked for the header to show the logo alone, bigger and centred, with no title or tagline. The third criterion above was met as written and then superseded by this; the spec's Design section now says the same.
