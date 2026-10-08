# 02: Publish to GitHub Pages

**What to build:** The app is reachable at a public web address and republishes itself. Pushing to the default branch runs the tests and, if they pass, publishes the site to GitHub Pages; the operator opens the address and can use the walking skeleton there exactly as in the local preview.

Creating the public repository and enabling Pages are outward-facing actions: confirm with the maintainer before doing either. The repository must contain code and avatars only, never game data.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] The project is a git repository with a public GitHub remote under the maintainer's account, created with their confirmation
- [ ] A push to the default branch runs the tests in GitHub Actions
- [ ] A passing run publishes the site to GitHub Pages; a failing run publishes nothing
- [ ] The published address serves the app and it behaves as it does in the local preview
- [ ] The local issue tracker folder and any local data are not published or committed by accident
