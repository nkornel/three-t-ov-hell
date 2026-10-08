# 02: Publish to GitHub Pages

**What to build:** The app is reachable at a public web address and republishes itself. Pushing to the default branch runs the tests and, if they pass, publishes the site to GitHub Pages; the operator opens the address and can use the walking skeleton there exactly as in the local preview.

Creating the public repository and enabling Pages are outward-facing actions: confirm with the maintainer before doing either. The repository must contain code and avatars only, never game data.

**Blocked by:** 01

**Status:** ready-for-human

- [x] The project is a git repository with a public GitHub remote under the maintainer's account, created with their confirmation
- [x] A push to the default branch runs the tests in GitHub Actions
- [x] A passing run publishes the site to GitHub Pages; a failing run publishes nothing
- [ ] The published address serves the app and it behaves as it does in the local preview
- [x] The local issue tracker folder and any local data are not published or committed by accident

## Comments

2026-10-08: The publish workflow is committed at `.github/workflows/publish.yml`: a push to `main` runs `docker compose run --rm test` and, only if that passes, publishes the `site/` folder to GitHub Pages. It has been linted with actionlint but has never run, because the repository does not exist yet.

The maintainer created the public repository `nkornel/three-t-ov-hell` themselves, because the GitHub token on their machine is a fine-grained personal access token that cannot create repositories, and approved publishing at https://nkornel.github.io/three-t-ov-hell/ with `.scratch/` kept in the repository. The project was renamed from `toiletovhell` to `three-t-ov-hell` to match; the local store's keys changed with it, so anything kept by an earlier local preview is no longer read.

After the maintainer gave the token access and set the Pages source to "GitHub Actions", `main` was pushed and the first run published the site (run 37766851018: 22 tests passed, then the publish job ran). Checked afterwards:

- Every file under `site/` is served at https://nkornel.github.io/three-t-ov-hell/ byte for byte, with the scripts served as JavaScript.
- `.scratch/`, `CLAUDE.md`, `compose.yaml`, `tests/` and `package.json` return 404 at the published address.
- The failing path was not exercised with a real failing push. It rests on the publish job's `needs: test`, which skips the job when the tests fail.

Still open: nobody has used the published app in a browser yet. An attempt to load it in a headless browser gave no result either way. The maintainer should open the address, add a colleague, start and stop a visit, and reload, then tick the last criterion and mark the ticket done.
