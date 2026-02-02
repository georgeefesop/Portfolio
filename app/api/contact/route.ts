import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { updateLead, saveLead, Lead, getLead } from '@/lib/leads-db';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, description, company, projectType, budget, leadId } = body;

        let currentLead: Lead | undefined;

        // --- CRM: MERGE OR CREATE LEAD ---
        if (leadId) {
            // Merge with existing 'soft' lead
            await updateLead(leadId, {
                status: 'contacted',
                name,
                email,
                company,
                budgetRange: budget,
                projectType: projectType || undefined, // Keep existing if not provided, or overwrite
                finalBrief: description
            });
            currentLead = await getLead(leadId);
        } else {
            // New direct lead
            const newId = randomUUID();
            const newLead: Lead = {
                id: newId,
                createdAt: new Date().toISOString(),
                source: 'contact_form',
                status: 'contacted',
                name,
                email,
                company,
                budgetRange: budget,
                projectType,
                finalBrief: description,
                // No AI score yet for direct contact, could add later
            };
            await saveLead(newLead);
            currentLead = newLead;
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.log('Contact form (no API key):', body);
            return NextResponse.json({ success: true, message: 'Message received (dev)' });
        }

        const resend = new Resend(resendApiKey);

        // Admin Email HTML
        const scoreHeader = currentLead?.leadScore ? `
            <div style="background: #f0fdf4; border: 1px solid #16a34a; padding: 12px; border-radius: 6px; margin-bottom: 20px; color: #166534;">
                <h3 style="margin:0">🎯 Lead Score: ${currentLead.leadScore}/10 (Pre-qualified)</h3>
                <p style="margin:5px 0 0 0; font-size:14px;"><em>AI Reasoning: ${currentLead.leadScoreReasoning}</em></p>
            </div>
        ` : '';

        const yourHtml = `
            <h2>New Contact Inquiry</h2>
            ${scoreHeader}
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || '-'}</p>
            <p><strong>Type:</strong> ${projectType || '-'}</p>
            <p><strong>Budget:</strong> ${budget || '-'}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${(description || '').replace(/\n/g, '<br>')}</p>
            <br>
            <p style="font-size: 12px; color: #666;">Source: ${currentLead?.source}</p>
        `;

        const { error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: ['george.efesop@gmail.com'],
            replyTo: email,
            subject: `New Inquiry: ${name} ${company ? `from ${company}` : ''}`,
            html: yourHtml,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 });
        }

        // Google Sheets Sync
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
        if (webhookUrl) {
            const row: Record<string, unknown> = {
                timestamp: new Date().toISOString(),
                name,
                email,
                company,
                brief: description,
                projectType,
                budgetRange: budget,
                source: currentLead?.source,
                leadScore: currentLead?.leadScore || '',
                gapAnalysis: currentLead?.gapAnalysis || '',
            };
            if (webhookSecret) row._secret = webhookSecret;

            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(row)
            }).catch(e => console.error('Sheets webhook error:', e));
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
