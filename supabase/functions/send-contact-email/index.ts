import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { name, email, message }: ContactFormData = await req.json()

    // Validate input
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prepare email content
    const emailContent = {
      sender: {
        name: "NeXa_Esports Contact Form",
        email: "noreply@nexaesports.com" // Use your verified sender email
      },
      to: [
        {
          email: "nexaesports@gmail.com", // Your Brevo email address
          name: "NeXa_Esports Team"
        }
      ],
      subject: `Contact Form Submission from ${name}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF1F44, #CC1936); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">NeXa_Esports Contact Form</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <div style="background: #f1f3f4; padding: 10px; border-radius: 4px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This email was sent from the NeXa_Esports contact form.
            </p>
          </div>
        </div>
      `,
      replyTo: {
        email: email,
        name: name
      }
    }

    // Send email using Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': Deno.env.get('BREVO_API_KEY') || '', // Set this in your Supabase environment variables
      },
      body: JSON.stringify(emailContent)
    })

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text()
      console.error('Brevo API error:', errorData)
      throw new Error(`Brevo API error: ${brevoResponse.status}`)
    }

    const result = await brevoResponse.json()
    console.log('Email sent successfully:', result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        messageId: result.messageId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})