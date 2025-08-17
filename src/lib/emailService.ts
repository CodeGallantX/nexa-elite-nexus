import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_nexa_esports'; // Replace with your actual service ID
const EMAILJS_TEMPLATE_ID = 'template_contact_form'; // Replace with your actual template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // Replace with your actual public key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_email: 'nexaesports@gmail.com', // Your Brevo email address
      reply_to: formData.email,
      subject: `Contact Form Submission from ${formData.name}`,
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return result.status === 200;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};

// Alternative method using Supabase Edge Function (recommended for production)
export const sendContactEmailViaEdgeFunction = async (formData: ContactFormData): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-contact-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return response.ok;
  } catch (error) {
    console.error('Edge function email error:', error);
    return false;
  }
};