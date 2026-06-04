import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!emailRe.test(email)) {
      return Response.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }
    if (message.length > 5000) {
      return Response.json({ error: 'Message is too long.' }, { status: 400 });
    }

    const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;

    // If a Web3Forms access key is configured, deliver the message for real.
    // Get a free key (no signup needed beyond an email) at https://web3forms.com.
    if (web3formsKey) {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: `Portfolio message from ${name}`,
          from_name: name,
          replyto: email,
          name,
          email,
          message,
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        console.error('Web3Forms delivery failed:', detail);
        return Response.json({ error: 'Delivery failed, please email me directly.' }, { status: 502 });
      }
      return Response.json({ ok: true, delivered: true });
    }

    // No provider configured: accept the message and log it so nothing is lost
    // in dev. The UI still confirms success; set WEB3FORMS_ACCESS_KEY to deliver.
    console.log('📨 Contact form (no email provider configured):', { name, email, message });
    return Response.json({ ok: true, delivered: false });
  } catch (error) {
    console.error('Contact API error:', error);
    return Response.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
