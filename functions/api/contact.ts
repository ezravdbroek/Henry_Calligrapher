/// <reference types="@cloudflare/workers-types" />
/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Sends the contact form through Resend:
 *  1. Internal notification → info@henrycalligraphy.com (bcc: info@brandways.nl), reply-to = visitor
 *  2. Confirmation to the visitor — branded HTML mail with the wordmark and what to expect
 *
 * Env vars (Pages → Settings → Variables and Secrets; locally via .dev.vars):
 *   RESEND_API_KEY — Resend API key (Secret, required)
 *   RESEND_FROM    — sender on the verified domain (optional)
 *   RESEND_TO      — recipient of the internal notification (optional)
 *   RESEND_BCC     — bcc on the internal notification, empty string disables (optional)
 */

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_TO?: string;
  RESEND_BCC?: string;
}

const DEFAULT_FROM = 'Henry Calligraphy <website@henrycalligraphy.com>';
const DEFAULT_TO = 'info@henrycalligraphy.com';
const DEFAULT_BCC = 'info@brandways.nl';

const STUDIO = {
  name: 'Henry Calligraphy',
  owner: 'Isha Henry-Hament',
  role: 'Calligrapher',
  city: 'Breda, the Netherlands',
  url: 'https://henrycalligraphy.com',
  host: 'henrycalligraphy.com',
  email: 'info@henrycalligraphy.com',
  instagram: 'https://www.instagram.com/henrycalligraphy/',
  instagramHandle: '@henrycalligraphy',
  logo: 'https://henrycalligraphy.com/images/henry-wordmark.png',
  tagline: 'There’s a distinctive warmth, that only handwritten notes seem to deliver.',
};

/** Mirrors the "What to expect" list on the contact page (src/data/content.ts). */
const EXPECTATIONS = [
  {
    title: 'A quote made for your project',
    text: 'A final quote is based on materials, quantity, complexity and turnaround time. Quotes are valid for 14 days unless otherwise stated.',
  },
  {
    title: 'A deposit confirms the booking',
    text: 'Full payment terms are outlined in your quote or invoice. Work on custom pieces begins once the agreed deposit has been received.',
  },
  {
    title: 'Timelines agreed up front',
    text: 'Turnaround times depend on project scope, material availability and current workload. Delivery costs and methods are agreed before final payment.',
  },
];

// Colours — the site's oklch design tokens converted to hex (src/styles/global.css)
const C_PAPER = '#F9F6F0'; // --background
const C_CARD = '#FCFAF6'; // --card
const C_INK = '#211C17'; // --foreground
const C_MUTED = '#69625B'; // --muted-foreground
const C_SOFT = '#EFEBE3'; // --secondary
const C_LINE = '#DDD9D0'; // --border
const C_ACCENT = '#800020'; // --accent
const C_ON_DARK = '#F9F6F0';
const C_ON_DARK_MUTED = 'rgba(249,246,240,0.62)';

// Same families as the site, with mail-safe fallbacks
const FONT_SANS = "'Karla', Arial, 'Helvetica Neue', Helvetica, sans-serif";
const FONT_SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";

const MAX = { short: 200, message: 5000 } as const;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** Turns the <input type="date"> value (yyyy-mm-dd) into "Saturday 4 July 2026"; anything else passes through. */
function prettyDate(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/* ---------- Shared shell: cream page, card with wordmark, dark footer ---------- */

function eyebrow(text: string, color = C_MUTED) {
  return `<div style="font-family:${FONT_SANS}; font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:${color};">${text}</div>`;
}

function emailShell(opts: { preheader: string; bodyHtml: string; footerNote: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Karla:wght@400;500&display=swap" rel="stylesheet" />
  <title>${STUDIO.name}</title>
</head>
<body style="margin:0; padding:0; background:${C_PAPER};">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:${C_PAPER};">${escape(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C_PAPER};">
    <tr>
      <td align="center" style="padding:36px 12px 44px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background:${C_CARD}; border:1px solid ${C_LINE};">
          <!-- Wordmark -->
          <tr>
            <td align="center" style="padding:40px 40px 28px; border-bottom:1px solid ${C_LINE};">
              <a href="${STUDIO.url}" style="text-decoration:none;">
                <img src="${STUDIO.logo}" alt="${STUDIO.name}" width="210" style="display:block; width:210px; max-width:100%; height:auto; border:0;" />
              </a>
            </td>
          </tr>
          ${opts.bodyHtml}
          <!-- Footer -->
          <tr>
            <td style="background:${C_INK}; padding:30px 40px 32px; text-align:center;">
              <div style="font-family:${FONT_SERIF}; font-size:22px; color:${C_ON_DARK}; letter-spacing:0.3px;">${STUDIO.name}</div>
              <div style="font-family:${FONT_SANS}; font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:${C_ON_DARK_MUTED}; margin:6px 0 16px;">${STUDIO.owner} &nbsp;·&nbsp; ${STUDIO.role} &nbsp;·&nbsp; Breda</div>
              <div style="font-family:${FONT_SANS}; font-size:12px; line-height:1.9; color:${C_ON_DARK_MUTED};">
                <a href="mailto:${STUDIO.email}" style="color:${C_ON_DARK}; text-decoration:none;">${STUDIO.email}</a>
                &nbsp;·&nbsp;
                <a href="${STUDIO.instagram}" style="color:${C_ON_DARK}; text-decoration:none;">${STUDIO.instagramHandle}</a>
                &nbsp;·&nbsp;
                <a href="${STUDIO.url}" style="color:${C_ON_DARK}; text-decoration:underline;">${STUDIO.host}</a>
              </div>
              <div style="font-family:${FONT_SANS}; font-size:11px; line-height:1.7; color:${C_ON_DARK_MUTED}; margin-top:16px; border-top:1px solid rgba(249,246,240,0.14); padding-top:14px;">${opts.footerNote}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ---------- Data ---------- */

type Inquiry = {
  subject: string;
  name: string;
  email: string;
  occasion: string;
  date: string;
  quantity: string;
  message: string;
};

/** The details the visitor filled in, as label/value pairs; empty optional fields are skipped. */
function details(d: Inquiry) {
  return [
    ['Inquiry about', d.subject],
    ['Occasion', d.occasion],
    ['Date', prettyDate(d.date)],
    ['Quantity', d.quantity],
  ].filter(([, value]) => value) as Array<[string, string]>;
}

function detailRows(d: Inquiry, extra: Array<[string, string]> = []) {
  const rows = [...extra, ...details(d)];
  return rows
    .map(
      ([label, valueHtml]) => `
      <tr>
        <td valign="top" width="150" style="padding:11px 16px 11px 0; border-bottom:1px solid ${C_LINE};">${eyebrow(label)}</td>
        <td valign="top" style="padding:11px 0; border-bottom:1px solid ${C_LINE}; font-family:${FONT_SANS}; font-size:15px; line-height:1.6; color:${C_INK};">${valueHtml}</td>
      </tr>`,
    )
    .join('');
}

function messageBlock(message: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">
      <tr>
        <td style="background:${C_SOFT}; border-left:2px solid ${C_ACCENT}; padding:18px 22px; font-family:${FONT_SANS}; font-size:15px; line-height:1.75; color:${C_INK}; white-space:pre-wrap;">${escape(message)}</td>
      </tr>
    </table>`;
}

/* ---------- 1. Internal notification ---------- */

function notificationEmail(d: Inquiry) {
  const received = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  const body = `
    <tr>
      <td style="padding:32px 40px 8px;">
        ${eyebrow('New inquiry via the contact form', C_ACCENT)}
        <div style="font-family:${FONT_SERIF}; font-size:30px; line-height:1.15; color:${C_INK}; margin:10px 0 4px;">${escape(d.name)}</div>
        <div style="font-family:${FONT_SANS}; font-size:13px; color:${C_MUTED}; margin-bottom:22px;">${received}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C_LINE};">
          ${detailRows(d, [
            ['Email', `<a href="mailto:${escape(d.email)}" style="color:${C_ACCENT}; text-decoration:none; font-weight:500;">${escape(d.email)}</a>`],
          ])}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px 6px;">
        ${eyebrow('Message')}
        ${messageBlock(d.message)}
      </td>
    </tr>
    <tr>
      <td style="padding:28px 40px 40px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background:${C_INK}; border-radius:999px;">
              <a href="mailto:${escape(d.email)}?subject=${encodeURIComponent(`Re: Your inquiry — ${d.subject}`)}"
                 style="display:inline-block; padding:14px 30px; font-family:${FONT_SANS}; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:${C_ON_DARK}; text-decoration:none; border-radius:999px;">Reply to ${escape(d.name.split(' ')[0])}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const html = emailShell({
    preheader: `${d.name} — ${d.subject}`,
    bodyHtml: body,
    footerNote: `Sent automatically from the contact form on ${STUDIO.host}. Replying to this email answers ${escape(d.name)} directly.`,
  });

  const text = [
    `NEW INQUIRY VIA ${STUDIO.host.toUpperCase()}`,
    `Received: ${received}`,
    '',
    `Name:   ${d.name}`,
    `Email:  ${d.email}`,
    ...details(d).map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    d.message,
  ].join('\n');

  return { subject: `Commission inquiry — ${d.subject} — ${d.name}`, html, text };
}

/* ---------- 2. Confirmation to the visitor ---------- */

function confirmationEmail(d: Inquiry) {
  const rows = details(d);
  const body = `
    <tr>
      <td style="padding:40px 40px 8px;">
        ${eyebrow('Thank you', C_ACCENT)}
        <div style="font-family:${FONT_SERIF}; font-size:32px; line-height:1.15; color:${C_INK}; margin:10px 0 18px;">Your inquiry has been received</div>
        <div style="font-family:${FONT_SANS}; font-size:15px; line-height:1.75; color:${C_INK};">
          Dear ${escape(d.name)},<br /><br />
          Thank you for getting in touch via ${STUDIO.host}. I have received your inquiry and will come back to you with a tailored proposal, usually within a few working days.
        </div>
      </td>
    </tr>
    <!-- Copy of the inquiry -->
    <tr>
      <td style="padding:26px 40px 4px;">
        ${eyebrow('Your inquiry')}
        ${
          rows.length
            ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px; border-top:1px solid ${C_LINE};">${detailRows(d)}</table>`
            : ''
        }
        ${messageBlock(d.message)}
      </td>
    </tr>
    <!-- What to expect -->
    <tr>
      <td style="padding:32px 40px 8px;">
        ${eyebrow('What to expect')}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">
          ${EXPECTATIONS.map(
            (item, i) => `
          <tr>
            <td valign="top" width="36" style="padding:16px 0 0; font-family:${FONT_SERIF}; font-size:22px; line-height:1.2; color:${C_ACCENT};">${i + 1}</td>
            <td valign="top" style="padding:16px 0 0;">
              <div style="font-family:${FONT_SERIF}; font-size:20px; line-height:1.25; color:${C_INK};">${item.title}</div>
              <div style="font-family:${FONT_SANS}; font-size:14px; line-height:1.7; color:${C_MUTED}; margin-top:4px;">${item.text}</div>
            </td>
          </tr>`,
          ).join('')}
        </table>
      </td>
    </tr>
    <!-- Sign-off -->
    <tr>
      <td style="padding:32px 40px 40px;">
        <div style="border-top:1px solid ${C_LINE}; padding-top:26px; font-family:${FONT_SANS}; font-size:15px; line-height:1.7; color:${C_INK};">Kind regards,</div>
        <div style="font-family:${FONT_SERIF}; font-style:italic; font-size:26px; color:${C_INK}; margin-top:6px;">${STUDIO.owner}</div>
        <div style="font-family:${FONT_SANS}; font-size:13px; color:${C_MUTED}; margin-top:4px;">${STUDIO.name} &nbsp;·&nbsp; ${STUDIO.role} &nbsp;·&nbsp; ${STUDIO.city}</div>
        <div style="font-family:${FONT_SERIF}; font-style:italic; font-size:16px; line-height:1.5; color:${C_MUTED}; margin-top:22px;">${STUDIO.tagline}</div>
      </td>
    </tr>`;

  const html = emailShell({
    preheader: 'Thank you for your inquiry — I will come back to you with a tailored proposal.',
    bodyHtml: body,
    footerNote: `This is an automatic confirmation. You can simply reply to this email; your reply reaches Isha directly at ${STUDIO.email}.`,
  });

  const text = [
    `Dear ${d.name},`,
    '',
    `Thank you for getting in touch via ${STUDIO.host}. I have received your inquiry and will come back to you with a tailored proposal, usually within a few working days.`,
    '',
    'YOUR INQUIRY',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    d.message,
    '',
    'WHAT TO EXPECT',
    ...EXPECTATIONS.map((item, i) => `${i + 1}. ${item.title} — ${item.text}`),
    '',
    'Kind regards,',
    STUDIO.owner,
    `${STUDIO.name} · ${STUDIO.role} · ${STUDIO.city}`,
    `${STUDIO.email} · ${STUDIO.instagramHandle} · ${STUDIO.url}`,
    '',
    'This is an automatic confirmation. You can simply reply to this email.',
  ].join('\n');

  return { subject: `Your inquiry to ${STUDIO.name} has been received`, html, text };
}

/* ---------- Resend ---------- */

type Mail = {
  from: string;
  to: string[];
  bcc?: string[];
  reply_to?: string;
  subject: string;
  html: string;
  text: string;
  tags?: Array<{ name: string; value: string }>;
};

async function sendMail(apiKey: string, mail: Mail) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(mail),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as { id: string };
}

/* ---------- Handler ---------- */

const clean = (value: FormDataEntryValue | null, max: number) =>
  String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, max);

async function readInquiry(request: Request) {
  const type = request.headers.get('content-type') ?? '';
  let data: FormData;
  if (type.includes('application/json')) {
    data = new FormData();
    for (const [k, v] of Object.entries((await request.json()) as Record<string, unknown>)) {
      data.set(k, String(v ?? ''));
    }
  } else {
    data = await request.formData();
  }
  return {
    inquiry: {
      subject: clean(data.get('subject'), MAX.short) || 'Something else',
      name: clean(data.get('name'), MAX.short),
      email: clean(data.get('email'), MAX.short),
      occasion: clean(data.get('occasion'), MAX.short),
      date: clean(data.get('date'), MAX.short),
      quantity: clean(data.get('quantity'), MAX.short),
      message: String(data.get('message') ?? '').trim().slice(0, MAX.message),
    } satisfies Inquiry,
    // Honeypot — hidden from people, filled in by bots
    honeypot: clean(data.get('website'), MAX.short),
  };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Only accept posts from the site itself (browsers always send Origin on form posts).
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: 'Forbidden.' }, 403);
  }

  let inquiry: Inquiry;
  let honeypot: string;
  try {
    ({ inquiry, honeypot } = await readInquiry(request));
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  if (honeypot) return json({ ok: true }, 200);

  if (!inquiry.name || !inquiry.message || !isEmail(inquiry.email)) {
    return json({ ok: false, error: 'Please fill in your name, a valid email and a message.' }, 400);
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return json({ ok: false, error: 'Mail is not configured.' }, 500);
  }
  const from = env.RESEND_FROM || DEFAULT_FROM;
  const to = env.RESEND_TO || DEFAULT_TO;
  const bcc = env.RESEND_BCC === undefined ? DEFAULT_BCC : env.RESEND_BCC;

  // 1. Internal notification — this one has to succeed
  const notification = notificationEmail(inquiry);
  try {
    await sendMail(apiKey, {
      from,
      to: [to],
      ...(bcc ? { bcc: [bcc] } : {}),
      reply_to: `${inquiry.name} <${inquiry.email}>`,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      tags: [{ name: 'type', value: 'contact-notification' }],
    });
  } catch (err) {
    console.error('Notification failed', err);
    return json({ ok: false, error: 'Sending failed. Please email us directly.' }, 502);
  }

  // 2. Confirmation to the visitor — best effort, the inquiry itself is already in
  const confirmation = confirmationEmail(inquiry);
  try {
    await sendMail(apiKey, {
      from,
      to: [inquiry.email],
      reply_to: `${STUDIO.owner} <${STUDIO.email}>`,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
      tags: [{ name: 'type', value: 'contact-confirmation' }],
    });
  } catch (err) {
    console.error('Confirmation failed', err);
  }

  return json({ ok: true }, 200);
};

/** Any method other than POST (Pages routes POST to onRequestPost first). */
export const onRequest: PagesFunction<Env> = async () => json({ ok: false, error: 'Method not allowed.' }, 405);
