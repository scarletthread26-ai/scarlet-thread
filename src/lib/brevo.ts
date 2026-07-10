import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY || '',
});

export interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  sender?: { email: string; name?: string };
}

export const sendEmail = async ({ to, subject, htmlContent, sender }: SendEmailParams) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent,
      sender: sender || { 
        name: process.env.MAIL_FROM_NAME || 'Scarlet Thread', 
        email: process.env.MAIL_FROM_EMAIL || 'hello@thescarletthread.com' 
      },
      to,
    });
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    return { success: false, error };
  }
};
