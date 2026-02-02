import { NextResponse } from 'next/server';
import { updateLead, deleteLead, getLeads } from '@/lib/leads-db';

export async function PUT(request: Request) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { id, updates } = body;

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const updated = await updateLead(id, updates);
        return NextResponse.json({ success: true, lead: updated });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const success = await deleteLead(id);
        return NextResponse.json({ success });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    // Live Data from Google Sheets
    if (source === 'live') {
        const sheetUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        if (!sheetUrl) {
            return NextResponse.json({ error: 'Google Sheets URL not configured' }, { status: 500 });
        }

        try {
            // Must follow redirects for Apps Script Web App
            const res = await fetch(sheetUrl, { redirect: 'follow' });
            if (!res.ok) throw new Error('Failed to fetch from sheets');

            const data = await res.json();

            // Transform Sheet Data (which is usually strings) to Lead Interface
            // Note: Keys match the headers we set in GOOGLE_SHEETS_SETUP.md
            const leads = data.map((row: any) => ({
                id: row.id || 'sheet-' + Math.random().toString(36).substr(2, 9), // Fallback ID
                createdAt: row.timestamp || new Date().toISOString(),
                name: row.name,
                email: row.email,
                company: row.company,
                status: row.email ? 'contacted' : 'anonymous', // Simple status inference
                projectType: row.projectType,
                initialBrief: row.brief, // Sheets stores it as 'brief'
                finalBrief: row.brief,
                budgetRange: row.budgetRange,
                source: row.source || 'google_sheet', // distinct source
                leadScore: row.leadScore ? parseFloat(row.leadScore) : 0,
                gapAnalysis: row.gapAnalysis,
                timeline: row.timeline,
                estimateCostLow: row.costLow ? parseFloat(row.costLow) : undefined,
                estimateCostHigh: row.costHigh ? parseFloat(row.costHigh) : undefined,
                leadScoreReasoning: 'From Live Database'
            }));

            return NextResponse.json(leads);

        } catch (e) {
            console.error('Sheet Fetch Error:', e);
            return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 502 });
        }
    }

    // Default: Local Data
    const leads = await getLeads();
    return NextResponse.json(leads);
}
