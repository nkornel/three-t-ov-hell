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

## Comments

2026-10-08: The publish workflow is committed at `.github/workflows/publish.yml`: a push to `main` runs `docker compose run --rm test` and, only if that passes, publishes the `site/` folder to GitHub Pages. It has been linted with actionlint but has never run, because the repository does not exist yet.

The maintainer created the public repository `nkornel/three-t-ov-hell` themselves, because the GitHub token on their machine is a fine-grained personal access token that cannot create repositories, and approved publishing at https://nkornel.github.io/three-t-ov-hell/ with `.scratch/` kept in the repository. The project was renamed from `toiletovhell` to `three-t-ov-hell` to match; the local store's keys changed with it, so anything kept by an earlier local preview is no longer read.

The same token is refused when pushing to the repository and when enabling Pages, so nothing has been pushed and no acceptance criterion is ticked yet. The remote `origin` is set locally. What remains:

1. In the repository's settings, set the Pages source to "GitHub Actions". "Deploy from a branch" would serve the whole repository, `.scratch/` included.
2. Push `main` with credentials that may write contents and workflow files to the repository.
3. Check that the run publishes, that the published address behaves like the local preview, and that a failing test publishes nothing.
