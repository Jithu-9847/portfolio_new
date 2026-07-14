'use server'

import { Resend } from 'resend';
import { EmailTemplate } from '@/components/portfolio/email-template';
import { z } from 'zod';
import { headers } from 'next/headers';

// Simple in-memory store for rate limiting (lasts as long as the server instance is active)
const submissionTracker = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  const submissions = submissionTracker.get(ip) || [];
  const activeSubmissions = submissions.filter(time => now - time < oneHour);
  
  if (activeSubmissions.length >= 3) {
    return true;
  }
  
  activeSubmissions.push(now);
  submissionTracker.set(ip, activeSubmissions);
  return false;
}

const disposableDomains = new Set([
  "mailinator.com", "yopmail.com", "tempmail.com", "guerrillamail.com", 
  "10minutemail.com", "dispostable.com", "getairmail.com", "sharklasers.com",
  "maildrop.cc", "temp-mail.org", "fakeinbox.com", "throwawaymail.com",
  "burnermail.io", "trashmail.com", "mailnesia.com", "mailcatch.com"
]);

const contactFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string()
      .email({ message: "Invalid email address." })
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid email address format." })
      .refine(
        (val) => {
          const domain = val.split('@')[1]?.toLowerCase();
          return !disposableDomains.has(domain);
        },
        { message: "Disposable or temporary emails are not allowed." }
      ),
    subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
    message: z.string().min(1, { message: "Message cannot be empty." }),
});

// Helper to identify random mixed-case gibberish strings (common in bot-generated names/subjects)
function isGibberish(text: string): boolean {
  const words = text.split(/\s+/).filter(Boolean);
  for (const word of words) {
    if (word.length >= 10) {
      const middleUpper = (word.slice(1).match(/[A-Z]/g) || []).length;
      const middleLower = (word.slice(1).match(/[a-z]/g) || []).length;
      if (middleUpper >= 2 && middleLower >= 2) {
        return true;
      }
    }
  }
  return false;
}

export async function sendEmail(formData: FormData) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY is missing from environment variables.');
    return { error: 'Email service is not configured. Please add RESEND_API_KEY to your .env.local file.' };
  }

  const resend = new Resend(apiKey);
  
  // IP rate limiting
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    console.warn(`Spam detection: Rate limit exceeded for IP: ${ip}`);
    return { error: 'Too many submissions. Please try again later.' };
  }

  // Honeypot spam check
  const honeypot = formData.get('hp_field') as string;
  if (honeypot && honeypot.length > 0) {
    console.warn('Spam submission detected and blocked via honeypot.');
    return { error: 'Request rejected.' };
  }

  // Submission speed check (Time lock)
  const formTimestamp = parseInt(formData.get('form_timestamp') as string || '0', 10);
  const now = Date.now();
  // Reject if form submitted faster than 2.5 seconds
  if (!formTimestamp || now - formTimestamp < 2500) {
    console.warn('Spam submission detected via speed check.');
    return { error: 'Request rejected. Message sent too quickly.' };
  }

  const sanitize = (text: string) => {
    return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
  };

  const name = sanitize(formData.get('name') as string || '');
  const email = (formData.get('email') as string || '').trim();
  const subject = sanitize(formData.get('subject') as string || '');
  const message = sanitize(formData.get('message') as string || '');

  // Gibberish spam check on Name and Subject
  if (isGibberish(name) || isGibberish(subject)) {
    console.warn('Spam submission detected: Name or Subject contains mixed-case gibberish.');
    return { error: 'Request rejected. Spam detected.' };
  }

  // Single-word message spam check (messages must have spaces)
  if (message.length > 10 && !message.includes(" ")) {
    console.warn('Spam submission detected: Message contains no spaces.');
    return { error: 'Request rejected. Message format is invalid.' };
  }

  // Name length validation (prevent long single-word fake names)
  if (name.length > 20 && !name.includes(" ")) {
    console.warn('Spam submission detected: Name is a single long word.');
    return { error: 'Request rejected. Invalid name.' };
  }

  // Link validation (max 1 link)
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const linkCount = (message.match(urlPattern) || []).length + 
                    (subject.match(urlPattern) || []).length + 
                    (name.match(urlPattern) || []).length;
  if (linkCount > 1) {
    console.warn('Spam submission detected: Too many links.');
    return { error: 'Submissions containing multiple links are blocked to prevent spam.' };
  }

  console.log('Values received, sanitized, and verified in Server Action:', { name, email, subject, message });

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

