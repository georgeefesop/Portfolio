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

            const rawData = await res.json();

            // Transform Sheet Data with robust key mapping
            const leads = rawData.map((row: any) => {
                // Normalize all keys to lowercase and trim spaces for comparison
                const normalized: Record<string, any> = {};
                Object.keys(row).forEach(k => {
                    normalized[k.toLowerCase().trim()] = row[k];
                });

                // Helper to try multiple possible keys
                const getVal = (keys: string[]) => {
                    for (const k of keys) {
                        if (normalized[k] !== undefined && normalized[k] !== null && normalized[k] !== '') {
                            return normalized[k];
                        }
                    }
                    return undefined;
                };

                return {
                    id: getVal(['id', 'uuid', 'leadid']) || 'sheet-' + Math.random().toString(36).substr(2, 9),
                    createdAt: getVal(['timestamp', 'createdat', 'date']) || new Date().toISOString(),
                    name: getVal(['name', 'customer', 'client']),
                    email: getVal(['email', 'email address', 'contact']),
                    company: getVal(['company', 'organization', 'business']),
                    status: (getVal(['email']) ? 'contacted' : 'anonymous'),
                    projectType: getVal(['projecttype', 'type', 'service']),
                    initialBrief: getVal(['brief', 'message', 'description', 'project brief']),
                    finalBrief: getVal(['brief', 'message', 'description', 'project brief']),
                    budgetRange: getVal(['budgetrange', 'budget', 'price range']),
                    source: getVal(['source', 'origin']) || 'google_sheet',
                    leadScore: parseFloat(getVal(['leadscore', 'score']) || '0'),
                    gapAnalysis: getVal(['gapanalysis', 'gap', 'risks']),
                    timeline: getVal(['timeline', 'duration', 'estimate duration']),
                    estimateCostLow: parseFloat(getVal(['costlow', 'mincost', 'lowprice']) || '0') || undefined,
                    estimateCostHigh: parseFloat(getVal(['costhigh', 'maxcost', 'highprice']) || '0') || undefined,
                    leadScoreReasoning: 'From Live Database'
                };
            });

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
