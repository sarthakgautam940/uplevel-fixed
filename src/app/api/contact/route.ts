import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, niche, revenue, message, source } = body;

    // Webhook to Make.com
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, niche, revenue, message, source, timestamp: new Date().toISOString() }),
      }).catch(console.error);
    }

    // Send via Resend
    const resendKey = process.env.RESEND_API_KEY;
    const notifEmail = process.env.NOTIFICATION_EMAIL;
    if (resendKey && notifEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "UpLevel Website <noreply@uplevelservices.co>",
          to: [notifEmail],
          subject: `New Lead: ${name} — ${niche || "Unknown Niche"}`,
          html: `<h2>New Lead</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || "N/A"}</p><p><strong>Niche:</strong> ${niche}</p><p><strong>Revenue:</strong> ${revenue}</p><p><strong>Message:</strong> ${message}</p><p><strong>Time:</strong> ${new Date().toLocaleString()}</p>`,
        }),
      }).catch(console.error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
