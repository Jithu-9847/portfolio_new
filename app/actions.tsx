'use server'

import { Resend } from 'resend';
import { EmailTemplate } from '@/components/portfolio/email-template';
import { z } from 'zod';



const contactFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
    message: z.string().min(1, { message: "Message cannot be empty." }),
});

export async function sendEmail(formData: FormData) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY is missing from environment variables.');
    return { error: 'Email service is not configured. Please add RESEND_API_KEY to your .env.local file.' };
  }

  const resend = new Resend(apiKey);
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  console.log('Values received in Server Action:', { name, email, subject, message });

  // Validate the data
  const validatedFields = contactFormSchema.safeParse({
    name,
    email,
    subject,
    message,
  });


    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['codewizard368@gmail.com'],
      subject: `New Message: ${subject}`,
      react: <EmailTemplate name={name} email={email} subject={subject} message={message} />,
      replyTo: email,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return { error: `Resend Error: ${error.message}` };
    }

    return { success: true };
  } catch (err) {
    console.error('Caught Exception in sendEmail:', err);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

