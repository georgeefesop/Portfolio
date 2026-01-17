import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Here you would implement your email provider logic (Resend, SendGrid, etc.)
        console.log('Contact form submission:', data);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to send message' },
            { status: 500 }
        );
    }
}
