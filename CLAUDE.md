@AGENTS.md

# Branching: Git Flow

Follow Git Flow (main, develop, feature, release, hotfix) for all work in this repository.

| Branch | From | Merges into | Purpose |
| --- | --- | --- | --- |
| `main` | — | — | Released code only. Always deployable. Never commit to it directly. |
| `develop` | `main` | `main` (through `release/*`) | Integration branch for the next release. Default branch. |
| `feature/<short-name>` | `develop` | `develop` | One feature or fix for the next release. |
| `release/<version>` | `develop` | `main` and `develop` | QA and release fixes only; no new features. |
| `hotfix/<version>` | `main` | `main` and `develop` | Urgent fix to a released version. |

- Start every change on a new `feature/*` branch off an up-to-date `develop`.
- Merge feature branches into `develop` through a pull request, then delete the branch.
- Merge with `--no-ff` so each feature, release and hotfix stays visible in history.
- A fix made on `release/*` or `hotfix/*` must also reach `develop`.
- Tag every merge into `main` as `v<version>` (for example `v0.2.0`), and bump `package.json` on the release branch.
- Pushing to `main` deploys the website (`.github/workflows/pages.yml`), so `site/` changes ship with a release or hotfix.
