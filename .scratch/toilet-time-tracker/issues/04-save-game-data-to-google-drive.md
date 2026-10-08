# 04: Save game data to Google Drive

**What to build:** On the published site the operator signs in with Google and the game lives in their Drive. The first time, the app creates its own folder; after that it loads the colleagues and visits from it and saves every change there immediately, as one colleagues document and one visits document per month. The app can see only the files it created. When a save fails the operator is told that changes are unsaved and the app retries by itself; when the Google session lapses the operator is asked to sign in again and nothing on screen is lost. The local preview keeps working without Google.

**Design:** Follow `design/mockup.html` for the sign-in screen and for the save status in the header, with the differences the spec's Design section lists. The sign-in screen shows the logo and the name The 3 T's ov Hell, and its button is Google's official sign-in button. The header has no operator address and no sign-out button. The save status has three states: "All changes saved"; changes not yet saved and retrying, without a count, a countdown or "Retry now"; and "Signed out", in red, with a "Sign in again" button.

**Blocked by:** 01, 02, 03, 12

**Status:** ready-for-agent

- [ ] The published site asks the operator to sign in with Google before showing the game
- [ ] The requested access is limited to files the app itself creates
- [ ] On first use the app creates its folder in the operator's Drive; on later visits it finds and reuses it
- [ ] Colleagues and visits created on one browser appear after signing in on another browser
- [ ] Every command is saved straight away, including the start of a visit
- [ ] Each document carries a format version number
- [ ] With the connection cut, a change stays on screen, a visible message says it is unsaved, and it saves by itself once the connection returns
- [ ] When the session expires the operator is prompted to sign in again and can carry on
- [ ] Without a first successful load from Drive, the app shows nothing to operate
- [ ] The local preview still runs on the local store with no Google account
- [ ] A short written checklist for verifying the Drive adapter by hand exists and has been run once against a real Drive
- [ ] The sign-in screen and the three save states match the mockup, apart from the differences listed in the spec
- [ ] The sign-in button is Google's official button, not restyled

## Comments

2026-10-08: Design added from `design/mockup.html`, with the maintainer's decisions on where it differs from the spec (see the spec's Design section). Now also blocked by 12.
