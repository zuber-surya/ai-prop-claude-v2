# Git Workflow

This document outlines the Git workflow for the Property Vista CRM MVP project, including branch naming conventions, commit message guidelines, pull request process, code review standards, and release flow.

---

## Branch Naming

Use descriptive branch names with appropriate prefixes to indicate the type of work.

- **Feature branches**: `feat/<short-description>`  
  Example: `feat/ai-search-integration`
- **Bug fix branches**: `fix/<short-description>`  
  Example: `fix/login-validation-error`
- **Documentation branches**: `docs/<short-description>`  
  Example: `docs/api-spec-update`
- **Chore / maintenance**: `chore/<short-description>`  
  Example: `chore/update-dependencies`
- **Refactor branches**: `refactor/<short-description>`  
  Example: `refactor/service-layer-cleanup`
- **Release branches**: `release/<version>`  
  Example: `release/v1.2.0`
- **Hotfix branches**: `hotfix/<short-description>`  
  Example: `hotfix/security-patch`

Keep branch names short, lowercase, and use hyphens as separators. Avoid long sentences.

---

## Commit Messages

Follow the Conventional Commits specification (https://www.conventionalcommits.org/) for clear, automated changelog generation.

Structure: `<type>(<scope>?): <description>`

- **type**: Must be one of:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation changes
  - `style`: Formatting, missing semi‑colons, etc.; no production code change
  - `refactor`: Code change that neither fixes a bug nor adds a feature
  - `perf`: Performance improvement
  - `test`: Adding or correcting tests
  - `chore`: Changes to build process or auxiliary tools
- **scope** (optional): Indicates the module or component affected (e.g., `auth`, `property`, `ui`).
- **description**: Short, imperative statement (max 50 characters). Do not capitalize first letter, no period at end.

Examples:
- `feat(auth): add refresh token rotation`
- `fix(property): prevent negative price input`
- `docs(ui): update homepage component hierarchy`
- `chore(deps): upgrade prisma to 5.10.0`

If the commit addresses a scope that spans multiple areas, omit the scope.

Body (optional): Provide additional context, motivation, or references to issues. Use blank line after description.

Footer (optional): Reference issue numbers (e.g., `Fixes #123`) or breaking changes (`BREAKING CHANGE: ...`).

---

## Pull Request (PR) Process

1. **Create a branch** from `main` (or `develop` if using a development branch).
2. **Make commits** following the commit message guidelines.
3. **Push the branch** to the remote repository.
4. **Open a Pull Request** targeting `main` (or `develop`).
5. **PR Title**: Use the same format as commit message, but can be more descriptive.
6. **PR Description**:
   - Brief summary of changes.
   - Related issue/ticket number (if applicable).
   - Screenshots or recordings for UI changes.
   - List of any breaking changes or migrations needed.
   - Checklist of tasks completed (e.g., unit tests, lint passes, documentation updated).
7. **Requirements before merging**:
   - All CI checks must pass (tests, lint, build).
   - At least one approving review from a team member.
   - No merge conflicts with base branch.
   - Branch must be up‑to‑date with `main` (rebase or merge latest `main`).
8. **Squash and merge** is preferred to keep a clean linear history. Use "Squash and merge" option when merging.
9. **Delete the branch** after merging (both locally and remotely).

---

## Code Review

- Reviewers should check for:
  - Correctness: Does the code implement the intended functionality?
  - Adherence to coding standards (see `CODING_STANDARDS.md`).
  - Security considerations: input validation, authentication, authorization.
  - Performance: avoid N+1 queries, large payloads, blocking operations.
  - Test coverage: new code should be accompanied by unit/integration tests.
  - Clarity: code is readable, well‑named, and commented where necessary.
  - Documentation: any changes to public APIs or configurations are documented.
- Use constructive, respectful feedback. Ask questions if unclear.
- Approve only when all concerns are addressed.
- If the author disagrees with feedback, discuss openly; seek consensus.
- Keep reviews timely (within 24 hours if possible).

---

## Release Flow

We follow a semantic versioning (SemVer) approach: MAJOR.MINOR.PATCH.

### Preparation
1. Ensure `main` branch is up‑to‑date and passes all CI checks.
2. Create a release branch from `main`: `git checkout -b release/vX.Y.Z`.
3. Update version numbers in:
   - `package.json` (both root and frontend/backend if separate).
   - Any version constants in code.
   - Update `CHANGELOG.md` with unreleased changes (or rely on conventional commits tooling).
4. Commit the version bumps: `chore(release): prepare vX.Y.Z`.
5. Push the release branch and open a PR targeting `main`.
6. Obtain approvals and ensure CI passes.
7. Merge the release branch into `main` using "Squash and merge" (or merge commit if preferred).
8. Tag the merge commit on `main` with the version: `git tag vX.Y.Z`.
9. Push the tag: `git push origin vX.Y.Z`.

### Post‑Release
- Optionally, create a release on GitHub with the tag, release notes from `CHANGELOG.md`, and attach any assets.
- Deploy the tagged commit to staging/production via CI/CD pipeline.
- Monitor for issues; if a critical bug is found, create a hotfix branch from the tag, fix, and release a patch version.

### Automation
- Consider using tools like `standard-version` or `changesets` to automate versioning and changelog generation.
- CI pipelines can be configured to deploy automatically on new tags (for staging) or manual approval (for production).

---
*End of Git Workflow Document*