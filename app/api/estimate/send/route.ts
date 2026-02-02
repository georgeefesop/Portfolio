import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { updateLead, getLead } from '@/lib/leads-db';

function formatEstimateForEmail(result: {
    projectType?: string;
    timeline?: { low: string; high: string };
    cost: { low: number; high: number; currency: string };
    whatsIncluded: string[];
    considerations: string;
}) {
    const lines = [
        result.projectType && `<p><strong>Project type:</strong> ${result.projectType}</p>`,
        result.timeline && `<p><strong>Timeline:</strong> ${result.timeline.low} – ${result.timeline.high}</p>`,
        result.cost && `<p><strong>Estimated cost:</strong> ${result.cost.currency}${result.cost.low.toLocaleString()} – ${result.cost.high.toLocaleString()}</p>`,
        result.whatsIncluded?.length && `<p><strong>What's included:</strong></p><ul>${result.whatsIncluded.map((i: string) => `<li>${i}</li>`).join('')}</ul>`,
        result.considerations && `<p><strong>Considerations:</strong></p><p>${result.considerations}</p>`
    ].filter(Boolean);
    return lines.join('');
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, company, input, result } = body;

        const leadId = result?.leadId;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: true, message: 'Name is required.' }, { status: 400 });
        }
        if (!email || typeof email !== 'string' || !email.trim()) {
            return NextResponse.json({ error: true, message: 'Email is required.' }, { status: 400 });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return NextResponse.json({ error: true, message: 'Please enter a valid email address.' }, { status: 400 });
        }

        // --- CRM: UPGRADE TO HARD LEAD ---
        let leadData: any = {};
        if (leadId) {
            try {
                await updateLead(leadId, {
                    status: 'contacted',
                    name,
                    email,
                    company,
                    finalBrief: input
                });
                leadData = await getLead(leadId) || {};
            } catch (e) {
                console.error("Failed to update lead DB:", e);
            }
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.log('Estimate send (no API key):', { name, email, company, input: input?.slice(0, 100), result: result?.status });
            return NextResponse.json({ success: true });
        }

        const resend = new Resend(resendApiKey);
        const from = 'Portfolio <onboarding@resend.dev>';

        // Lead Score and Gap Analysis for Admin Email
        const scoreHeader = leadData.leadScore ? `
            <div style="background: #f0fdf4; border: 1px solid #16a34a; padding: 12px; border-radius: 6px; margin-bottom: 20px; color: #166534;">
                <h3 style="margin:0">🎯 Lead Score: ${leadData.leadScore}/10</h3>
                <p style="margin:5px 0 0 0; font-size:14px;"><em>Reasoning: ${leadData.leadScoreReasoning}</em></p>
                <p style="margin:10px 0 0 0; font-size:14px; color: #991b1b;"><strong>⚠️ Missing Scope (Gap):</strong> ${leadData.gapAnalysis}</p>
            </div>
        ` : '';

        // 1) Email to you: brief + estimate + contact
        const yourHtml = `
            <h2>New brief & estimate</h2>
            ${scoreHeader}
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <p><strong>Their brief:</strong></p>
            <p>${(input || '').replace(/\n/g, '<br>')}</p>
            ${result && result.status === 'estimate' ? `
            <h3>Estimate summary</h3>
            ${formatEstimateForEmail(result)}
            ` : '<p>(No estimate attached)</p>'}
        `;

        const { error: err1 } = await resend.emails.send({
            from,
            to: ['george.efesop@gmail.com'],
            replyTo: email,
            subject: `Brief & estimate from ${name} ${leadData.leadScore ? `(Score: ${leadData.leadScore}/10)` : ''}`,
            html: yourHtml
        });

        if (err1) {
            console.error('Resend error (to you):', err1);
            return NextResponse.json({
                error: true,
                message: 'Email could not be sent. Check your Resend API key and domain, or try again later.'
            }, { status: 500 });
        }

        // 2) Email to them: polite confirmation + copy of estimate
        const estimateBlock = result && result.status === 'estimate'
            ? formatEstimateForEmail(result)
            : "<p>We'll follow up with next steps shortly.</p>";

        const theirHtml = `
            <p>Hi ${name},</p>
            <p>Thanks for sharing your idea and for your interest in working together. Here's a copy of your estimate for your records.</p>
            ${estimateBlock}
            <p>If you'd like to move forward or adjust the scope, just reply to this email or reach out directly.</p>
            <p>Best,<br>George</p>
        `;

        const { error: err2 } = await resend.emails.send({
            from,
            to: [email.trim()],
            subject: 'Your estimate – George Efesopoulos',
            html: theirHtml
        });

        if (err2) {
            console.error('Resend error (to lead):', err2);
            return NextResponse.json({
                error: true,
                message: 'Confirmation email could not be sent. Your brief was received—we\'ll be in touch.'
            }, { status: 500 });
        }

        // 3) Optional: append row to Google Sheet via Apps Script webhook (no API key)
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
        if (webhookUrl) {
            const row: Record<string, unknown> = {
                timestamp: new Date().toISOString(),
                name: name.trim(),
                email: email.trim().toLowerCase(),
                company: (company || '').trim() || '',
                brief: (input || '').trim(),
                estimateStatus: result?.status ?? '',
                projectType: result?.projectType ?? '',
                timeline: result?.timeline ? `${result.timeline.low} – ${result.timeline.high}` : '',
                costLow: result?.cost?.low ?? '',
                costHigh: result?.cost?.high ?? '',
                currency: result?.cost?.currency ?? '',
                whatsIncluded: (result?.whatsIncluded ?? []).join(' | '),
                considerations: (result?.considerations ?? '').trim(),

                // NEW CRM FIELDS
                leadScore: leadData.leadScore || '',
                leadScoreReasoning: leadData.leadScoreReasoning || '',
                gapAnalysis: leadData.gapAnalysis || '',
                source: 'estimator'
            };
            if (webhookSecret) row._secret = webhookSecret;
            try {
                const res = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(row)
                });
                if (!res.ok) {
                    console.warn('Sheets webhook failed:', res.status, await res.text());
                }
            } catch (e) {
                console.warn('Sheets webhook error:', e);
            }
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Estimate send error:', e);
        return NextResponse.json({ error: true, message: 'Something went wrong.' }, { status: 500 });
    }
}
