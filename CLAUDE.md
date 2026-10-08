## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage roles are used unchanged (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Tooling

Never install anything on the host for this project. Run every tool (Node, tests, the local preview server) inside Docker; Docker and Docker Compose are already available.

- `docker compose run --rm test` runs the tests
- `docker compose run --rm typecheck` typechecks the site's JavaScript
- `docker compose up preview` serves the site at http://localhost:8321

The site is plain HTML, CSS and JavaScript with no build step: the files under `site/` are served as they are.
