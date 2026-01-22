import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // If Resend API key is not set, log the data and return success (for development)
        if (!process.env.RESEND_API_KEY) {
            console.log('Contact form submission (no API key):', data);
            return NextResponse.json({ success: true, message: 'Message received (email not configured)' });
        }

        // Initialize Resend only when API key is available
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Send email using Resend
        const { data: emailData, error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>', // Update this with your verified domain
            to: ['george.efesop@gmail.com'],
            replyTo: data.email,
            subject: `New Contact Form: ${data.projectType} - ${data.company}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Company/Project:</strong> ${data.company}</p>
                <p><strong>Project Type:</strong> ${data.projectType}</p>
                <p><strong>Budget:</strong> ${data.budget}</p>
                <p><strong>Description:</strong></p>
                <p>${data.description || 'No description provided'}</p>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { success: false, message: 'Failed to send message' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send message' },
            { status: 500 }
        );
    }
}
