import { sendContactConfirmation } from '../config/mailer.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Send confirmation email via SMTP (or print to console in fallback mode)
    await sendContactConfirmation(name, email, message);

    return res.status(200).json({
      message: 'Your message has been received! Confirmation email sent.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error sending contact confirmation',
      error: error.message,
    });
  }
};
