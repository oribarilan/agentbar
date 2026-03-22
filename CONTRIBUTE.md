# CONTRIBUTE.md

## Feature Development Workflow

This repository uses a strict branch + PR workflow.

### 1) Do not develop on `main`

- Never start feature work directly on `main`.
- Never commit directly to `main`.
- Never push directly to `main`.

### 2) Start from latest `main`

```bash
git checkout main
git pull --ff-only
```

### 3) Create a feature branch

Use a clear branch name:

- `feat/<short-topic>`
- `fix/<short-topic>`
- `chore/<short-topic>`
- `docs/<short-topic>`

Example:

```bash
git checkout -b feat/floating-bar-settings
```

### 4) Develop and commit on that branch only

- Keep commits focused and reviewable.
- Use conventional commit messages (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).

### 5) Run checks before pushing

At minimum:

```bash
just test
```

Recommended full check:

```bash
just check
```

### 6) Push branch and open PR

```bash
git push -u origin <your-branch>
```

- Open a Pull Request to `main`.
- Ensure required checks pass.
- Address review feedback on the same branch.

### 7) Merge through PR only

- All changes to `main` must go through a PR.
- Do not bypass protections.
- Do not force-push to `main`.

### 8) After merge

```bash
git checkout main
git pull --ff-only
git branch -d <your-branch>
```
