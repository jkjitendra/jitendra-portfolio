
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, mobile, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      // In development or if unconfigured, we simulate success but log a warning
      console.warn('EMAIL_USER or EMAIL_PASS not set. Email will not be sent.');
      console.log('Simulate sending email:', { name, email, message });

      return NextResponse.json(
        { message: 'Form submitted successfully (Simulation mode)' },
        { status: 200 }
      );
    }

    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log("SMTP Connection Verified");
    } catch (verifyError) {
      console.error("SMTP Verification Failed:", verifyError);
      return NextResponse.json(
        { error: 'SMTP Connection Failed. Check server logs.' },
        { status: 500 }
      );
    }

    // Email Layout
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Setup to send to yourself
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Mobile: ${mobile || 'Not provided'}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Portfolio Contact</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mobile:</strong> ${mobile || 'Not provided'}</p>
          <hr />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
