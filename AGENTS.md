# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 15 marketing website (not a monorepo). The only service is the Next.js dev server.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` |
| Build | `npm run build` |

### Notes

- **No test framework** is configured — `npm run lint` is the only automated code quality check.
- **ESLint config** (`.eslintrc.json`) uses `next/core-web-vitals` with `react/no-unescaped-entities` disabled to match the codebase's existing conventions.
- **Environment variables** are optional for local dev. Copy `.env.example` to `.env.local`; the site runs fully with placeholder values. See `ENV_SETUP.md` for details on each variable.
- **External services** (Resend email, Make.com webhook) gracefully degrade when keys are missing — the contact form returns success but doesn't send.
- The **AI chat widget** (ARIA) uses hardcoded keyword-matching responses, not a real AI backend.
