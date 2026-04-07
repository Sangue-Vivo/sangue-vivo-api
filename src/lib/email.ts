import { Resend } from 'resend';
import { env } from '../config/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!resend) {
    console.log('[EMAIL DEV]', options.subject, '→', options.to);
    console.log('[EMAIL DEV]', options.html.substring(0, 200) + '...');
    return;
  }

  await resend.emails.send({
    from: 'Sangue Vivo <noreply@sanguevivo.com.br>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
