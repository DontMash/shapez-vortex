---
name: commit
description: "Creates git commits that match the repository's history instead of defaulting to conventional commits. Use this skill whenever the user wants to record changes in git, asks for a commit message, or indicates that the work is ready to wrap up."
---

# Commit

Create one or more commits that accurately describe what changed and why. Match the repository's existing style.

## Step 1: Understand the changes

Run these in parallel:

```bash
git status
git diff
git diff --staged
```

If the request or session context does not make the intended changes clear, do
not guess. Inspect the available targets:

```bash
git status --short
git branch --all
git log --oneline -20
```

Ask the user what to compare and commit. Offer the relevant choices you found,
such as:

- All uncommitted changes
- Only staged changes
- Specific changed files or groups of related files
- Changes since a named branch, tag, or commit
- A specific commit or commit range
- Another ref supplied by the user

Show concrete branch names, commit hashes, and changed file groups in the
choices. Allow the user to select one or more groups. Do not stage or commit
anything until the user chooses.

If nothing is staged, don't blindly stage everything. First look at what's changed and decide what actually belongs in a commit:

- **Exclude** files that look like temporary edits, local experiments, environment config (`.env`, `*.local`, IDE settings), debug logging added during development, or anything unrelated to the work described in the session
- **Include** the files that form the logical change and make sense together in the diff
- Use session context to guide this: if the user described what they were working on, the commit should reflect that work, not everything `git status` happens to show

When unsure about a file, leave it out and tell the user why.

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
- You would have to stage parts of files to separate the changes cleanly

**When it is ambiguous**, ask whether the user wants one commit or separate commits for the distinct changes.

When splitting, commit each group separately: unstage the second group, commit the first, then stage and commit the second.

## Step 2: Check the current branch

```bash
git branch --show-current
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null || echo "no remote default"
```

Before committing, decide whether the current branch is the right place for this work. There are three situations that call for a new branch:

**1. You're on a protected/shared branch**

These branches should receive changes through pull requests, not direct commits:
- The repo's default branch (`main`, `master`, or whatever `origin/HEAD` points to)
- Common integration branches: `develop`, `dev`, `staging`, `next`
- Release branches matching patterns like `release/*`, `release-*`

**2. The current branch has already been merged**

Check whether the branch has been merged into the default branch:

```bash
git branch --merged origin/main 2>/dev/null || git branch --merged origin/master 2>/dev/null
```

If the current branch appears in that list, it has already been merged. Create a new branch instead of adding commits to it.

**3. The branch topic doesn't match the work**

Compare the current branch name to what the user is actually working on. If you're on `fix/login-redirect` but the user just finished building the CSV export feature, that branch is the wrong home for this commit. Create a new branch that reflects the actual work.

Use the session context to decide whether the branch name still describes the work.

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

If the repository has a `CONTRIBUTING.md`, `docs/contributing.md`, or `.gitmessage` file, read it for explicit conventions.

Match what you find. Don't impose a different convention. If the repo uses plain prose with no prefix, don't add `feat:`. If it uses conventional commits, follow the type vocabulary you see in the history.

If the repo has no commits yet, default to plain imperative prose (no type prefix).

## Step 4: Compose the message

Write a commit message that:

1. **Subject line:** One line of no more than 72 characters that matches the repository's style and summarizes what changed.
2. **Blank line:** Separates the subject from the body when a body is present.
3. **Body:** Explain why the change was made, relevant tradeoffs, and context that is not clear from the diff. Wrap it at about 72 characters. Omit it for small, self-explanatory changes.

Read the diff carefully and describe the behavior change, not just the filenames.

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

Tell the user what was committed and provide each commit hash. If you split the work, briefly explain why.
