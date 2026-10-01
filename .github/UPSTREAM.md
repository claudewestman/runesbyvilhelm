# Syncing from upstream core

This repo is based on [kattbjorn-core](https://github.com/kattbjorn/kattbjorn-core).
Upstream changes can be pulled in via GitHub Actions or locally.

## Setup (once per repo)

### 1. Add the upstream repo variable

In the site repo: **Settings → Secrets and variables → Actions → Variables → New repository variable**

```
Name:  UPSTREAM_REPO_URL
Value: https://github.com/kattbjorn/kattbjorn-core.git
```

### 2. Add the upstream remote locally

```bash
git remote add upstream https://github.com/kattbjorn/kattbjorn-core.git
```

---

## Syncing changes

### Via GitHub Actions (recommended)

Go to **Actions → Sync from upstream core → Run workflow**.

A pull request is opened automatically. Review it and merge.

### Locally

```bash
git fetch upstream
git merge upstream/main
```

Resolve any conflicts, then push.

---

## What to watch out for

Conflicts will only occur if the site repo has changed the same file as core.
To keep merges clean, limit site-specific changes to:

- `src/config/site.ts`
- `public/` (logo, favicon, og-image etc.)
- `.env` and GitHub Actions secrets
