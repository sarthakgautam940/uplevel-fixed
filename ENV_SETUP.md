# Environment Variables Setup

This guide covers setting up environment variables for **local development** and **Vercel deployment**.

---

## Vercel: Copy-Paste Block

Add these in **Settings → Environment Variables**. Replace placeholders with real values:

```
RESEND_API_KEY=placeholder
NOTIFICATION_EMAIL=hello@uplevelservices.co
MAKE_WEBHOOK_URL=https://placeholder.make.com
NEXT_PUBLIC_VAPI_KEY=placeholder
NEXT_PUBLIC_VAPI_ASSISTANT_ID=placeholder
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

*(Paste each line as a separate variable in Vercel. The site will run with placeholders; contact form won't send until `RESEND_API_KEY` and optionally `MAKE_WEBHOOK_URL` are real.)*

---

## Quick Start (Local)

```bash
cp .env.example .env.local
```

Then edit `.env.local` and fill in real values where needed. Placeholders work for local dev but contact form won't send emails or webhooks until real keys are set.

---

## Vercel Setup

1. Open your project in Vercel: **Dashboard → [your project] → Settings → Environment Variables**
2. Add each variable below. For each one:
   - **Key**: variable name (e.g. `RESEND_API_KEY`)
   - **Value**: your real key or placeholder
   - **Environments**: check Production, Preview, and Development
3. Redeploy after adding variables (Vercel doesn't pick up new env vars on existing deployments).

---

## Variables Reference

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | For email | Sends contact form submissions via Resend |
| `NOTIFICATION_EMAIL` | For email | Recipient for contact form emails |
| `MAKE_WEBHOOK_URL` | For webhooks | Make.com webhook to receive form data |
| `NEXT_PUBLIC_VAPI_KEY` | Optional | Vapi AI voice widget (future use) |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Optional | Vapi assistant ID |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics measurement ID |

---

## Where to Get Each Key

### Resend (Contact Form Emails)

1. Go to [resend.com](https://resend.com) → Sign up or log in
2. **API Keys** → Create API Key
3. Copy the key (starts with `re_`)
4. **Domains** → Add `uplevelservices.co` and verify DNS if you want to send from that domain (or use Resend's default domain for testing)

### Make.com (Webhook)

1. Go to [make.com](https://make.com) → Create scenario
2. Add **Webhooks** module → **Custom webhook**
3. Copy the webhook URL
4. Add modules after the webhook to process the data (e.g. add to CRM, send Slack notification, etc.)

### Google Analytics (Optional)

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property → Add data stream (Web)
3. Copy Measurement ID (format: `G-XXXXXXXXXX`)

### Vapi (Optional — Future AI Voice)

1. Go to [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. **API Keys** → Create key
3. **Assistants** → Create or select assistant → Copy assistant ID

---

## Notes

- **`NEXT_PUBLIC_*`** variables are exposed to the browser. Never put secrets in them.
- **Server-only** variables (`RESEND_API_KEY`, `MAKE_WEBHOOK_URL`, `NOTIFICATION_EMAIL`) stay on the server and are safe.
- With placeholder values, the site runs; the contact form will return success but won't send emails or hit the webhook until real keys are set.
