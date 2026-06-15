---
name: commit
description: "Creates a git commit with a well-crafted message — inferring the right style from the repo's history rather than defaulting to conventional commits. Use this skill any time the user wants to record their current changes in git: explicit requests like \"commit this\", \"write a commit message\", or \"checkpoint my work\", but also implicit ones like \"we're done, wrap it up\", \"go ahead and commit\", or finishing a coding task where nothing has been committed yet. Also use it when the user asks what commit message to write."
---

# Commit

Create one or more commits that accurately reflect what changed and why — in a style consistent with the repo's existing history.

## Step 1: Understand the changes

Run these in parallel:

```bash
git status
git diff
git diff --staged
```

If nothing is staged, don't blindly stage everything. First look at what's changed and decide what actually belongs in a commit:

- **Exclude** files that look like temporary edits, local experiments, environment config (`.env`, `*.local`, IDE settings), debug logging added during development, or anything unrelated to the work described in the session
- **Include** the files that form the logical change — the ones that would make sense to a future reader of the diff
- Use session context to guide this: if the user described what they were working on, the commit should reflect that work, not everything `git status` happens to show

When in doubt about a specific file, err on the side of leaving it out and mentioning it to the user ("I left out `.env.local` — let me know if you want that included").

Once you've decided what belongs, stage those files explicitly rather than using `git add -A`.

## Step 1b: Decide whether to split into multiple commits

A single logical change belongs in a single commit. But if the staged changes clearly contain multiple unrelated things, splitting them produces a cleaner history.

**Split when:**
- The changes address distinct concerns that could be reverted independently (e.g. a bug fix in `auth.js` + an unrelated dependency bump in `package.json`)
- The diff spans files from different parts of the codebase with no connection between them
- The session context suggests separate tasks were completed (e.g. "I fixed the login bug and also added the export feature")

**Don't split when:**
- The changes work together as one unit (e.g. a new feature file + its test + a README update)
- The changes are small and the split would be pedantic
- You'd have to stage partial file content to separate them cleanly — that's usually not worth it

**When it's ambiguous**, ask: "I could split this into two commits — [A] and [B]. Would you prefer that, or one commit covering everything?"

When splitting, commit each group separately: unstage the second group, commit the first, then stage and commit the second.

## Step 2: Check the current branch

```bash
git branch --show-current
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null || echo "no remote default"
```

Before committing, decide whether the current branch is the right place for this work. There are three situations that call for a new branch:

**1. You're on a protected/shared branch**

These branches shouldn't receive direct commits — work flows in via PRs:
- The repo's default branch (`main`, `master`, or whatever `origin/HEAD` points to)
- Common integration branches: `develop`, `dev`, `staging`, `next`
- Release branches matching patterns like `release/*`, `release-*`

**2. The current branch has already been merged**

Check whether the branch has been merged into the default branch:

```bash
git branch --merged origin/main 2>/dev/null || git branch --merged origin/master 2>/dev/null
```

If the current branch appears in that list, it's already been merged — committing more work here would be confusing. Create a fresh branch instead.

**3. The branch topic doesn't match the work**

Compare the current branch name to what the user is actually working on. If you're on `fix/login-redirect` but the user just finished building the CSV export feature, that branch is the wrong home for this commit. Create a new branch that reflects the actual work.

Use session context to make this call — what has the conversation been about? Does the branch name still describe it?

---

In all three cases, name the new branch by first checking existing conventions:

```bash
git branch -a
```

Common patterns: `feat/add-login`, `fix/null-pointer`, `username/short-description`, `TICKET-123-description`. Match what you see. If there's no clear pattern, use a short kebab-case description of the change.

Create and switch before staging or committing anything:

```bash
git checkout -b <branch-name>
```

Tell the user why you're switching and what branch you created: "The current branch `fix/login-redirect` doesn't match this work, so I'll create `feat/csv-export`."

**If HEAD is detached** (not on any branch), warn the user and ask whether to create a branch or commit in place.

## Step 3: Learn the repo's commit style

Look at recent commits to understand the conventions this repo uses:

```bash
git log --oneline -20
```

Things to observe:
- **Subject line format**: Is there a type prefix like `feat:` or `fix(`scope`)`? Or is it plain prose? Or ticket numbers like `[PROJ-123]`?
- **Capitalization**: Sentence case, title case, or lowercase?
- **Tense**: Imperative ("add feature"), past tense ("added feature"), or present ("adds feature")?
- **Length**: How long are subject lines typically?
- **Body**: Do commits have bodies? Are they common or rare? What do they contain?
- **Footers**: Any patterns like `Refs:`, `Closes #123`, `BREAKING CHANGE:`?

If the repo has a `CONTRIBUTING.md`, `docs/contributing.md`, or `.gitmessage` file, read it — it may document the conventions explicitly.

Match what you find. Don't impose a different convention. If the repo uses plain prose with no prefix, don't add `feat:`. If it uses conventional commits, follow the type vocabulary you see in the history.

If the repo has no commits yet, default to plain imperative prose (no type prefix).

## Step 4: Compose the message

Write a commit message that:

1. **Subject line** — one line, ≤72 chars, matches the repo's style. Summarizes *what* changed, not *how*.
2. **Blank line** — separates subject from body (if there's a body).
3. **Body** (optional but often useful) — explains *why* the change was made, any tradeoffs, and context that won't be obvious from the diff. Wrap at ~72 chars. Skip it for tiny, self-explanatory changes.

The message should be honest about what changed. Read the diff carefully — don't just describe the filenames, describe the actual behavior change.

## Step 5: Commit

```bash
git commit -m "<subject>" -m "<body paragraph 1>" -m "<body paragraph 2>"
```

Or use a heredoc if the message is long:

```bash
git commit -F - <<'EOF'
<subject>

<body>
EOF
```

## Step 6: Confirm

Show the result. For a single commit:

```bash
git show --stat HEAD
```

For multiple commits:

```bash
git log --oneline -<N>
```

Tell the user what was committed, the hash(es), and — if you split — briefly explain why.
