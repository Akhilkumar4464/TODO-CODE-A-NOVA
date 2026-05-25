import nodemailer from 'nodemailer';

let transporter = null;

function getFallbackEnabled() {
  return !process.env.EMAIL_USER || !process.env.EMAIL_PASS;
}

export function createTransporter() {
  if (transporter) return transporter;

  if (getFallbackEnabled()) {
    // Console-log fallback: return null transporter and let callers handle fallback.
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
}

export async function sendEmail({ to, subject, text }) {
  // Fallback mode: no SMTP creds present.
  if (getFallbackEnabled()) {
    console.log('[EMAIL FALLBACK]');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    return { accepted: [to], messageId: 'fallback-console-log' };
  }

  const t = createTransporter();
  if (!t) {
    // Safety
    console.log('[EMAIL FALLBACK (unexpected)]');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    return { accepted: [to], messageId: 'fallback-console-log' };
  }

  return t.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}

export async function sendOTPEmail(email, name, otp) {
  const subject = 'Your OTP for Code-A-Nova verification';
  const text = `Hi ${name},\n\nYour 6-digit OTP is: ${otp}. It expires in 10 minutes.`;
  return sendEmail({ to: email, subject, text });
}

export async function sendReminderEmail(email, name, taskTitle, dueDate) {
  const subject = 'Task due soon - Code-A-Nova reminder';
  const due = dueDate ? new Date(dueDate).toLocaleString() : '';
  const text = `Hi ${name},\n\nReminder: "${taskTitle}" is due soon. ${due ? `Due: ${due}` : ''}`;
  return sendEmail({ to: email, subject, text });
}

export async function sendContactConfirmation(name, email, message) {
  const subject = 'We received your message - Code-A-Nova';
  const text = `Hi ${name},\n\nThanks for reaching out! We received your message:\n\n${message}\n`;
  return sendEmail({ to: email, subject, text });
}

