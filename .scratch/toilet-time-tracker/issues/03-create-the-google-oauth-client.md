# 03: Create the Google OAuth client

**What to build:** The one-time Google setup that only the maintainer can perform, so that the app is allowed to sign the operator in and save to their Drive. The maintainer creates a Google Cloud project, enables the Drive API, configures the consent screen with themselves as a user, and creates an OAuth client ID for a web application that allows the published address and the local preview address as origins. The result is a client ID, which is public configuration and is handed to whoever works ticket 04.

An agent can generate a guided walkthrough script for these steps on request; the steps themselves happen in Google's console and need the maintainer's Google account.

**Blocked by:** None (can start immediately)

**Status:** ready-for-human

- [ ] A Google Cloud project exists for the app with the Drive API enabled
- [ ] The consent screen is configured and the operator's Google account is permitted to use the app
- [ ] An OAuth client ID of type web application exists, with the published site's origin and the local preview's origin both allowed
- [ ] The client ID has been recorded where ticket 04 can use it; no client secret is stored anywhere in the project
