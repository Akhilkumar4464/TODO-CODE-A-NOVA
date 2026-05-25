// Deprecated: kept for backward compatibility with existing auth route.
// New implementation lives in backend/config/mailer.js with SMTP fallback.
import { sendEmail } from '../config/mailer.js';

const sendEmailLegacy = async (to, subject, text) => {
  return sendEmail({ to, subject, text });
};

export default sendEmailLegacy;

