// src/lib/contact.ts
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/send-contact-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Contact form submission error:", error);
    return false;
  }
};
