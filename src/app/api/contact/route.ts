import { createClient } from 'lib/supabase/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return new Response('Email service not configured', { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { profileSlug, name, email, company, message } = await request.json();

    const supabase = createClient();
    
    // Get profile owner's email with proper type handling
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        id,
        users (
          email
        )
      `)
      .eq('public_url', profileSlug)
      .single();

    if (error || !profile?.users?.[0]?.email) {
      console.error('Profile fetch error:', error);
      return new Response('Profile not found', { status: 404 });
    }

    // Send email with updated settings
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'contact@prosper.cv',
      to: profile.users[0].email,
      cc: ['inquiry@prosper.cv'],
      replyTo: email,
      subject: `New contact from ${name} at ${company}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company}

Message:
${message}
      `
    });

    if (emailError) {
      console.error('Email send error:', emailError);
      return new Response('Failed to send email', { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return new Response('Internal error', { status: 500 });
  }
} 