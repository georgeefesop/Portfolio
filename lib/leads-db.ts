import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'leads.json');

export type LeadStatus = 'anonymous' | 'contacted' | 'converted';
export type Source = 'estimator' | 'contact_form';

export interface Lead {
    id: string; // UUID
    createdAt: string; // ISO Date
    source: Source;
    status: LeadStatus;

    // AI Insights (Estimator Only)
    leadScore?: number; // 0-10
    leadScoreReasoning?: string;
    gapAnalysis?: string;

    // Estimate Data (Estimator Only)
    initialBrief?: string;
    estimateCostLow?: number;
    estimateCostHigh?: number;
    projectType?: string;

    // Contact Info (Added later or plain contact)
    name?: string;
    email?: string;
    company?: string;
    finalBrief?: string; // The message they actually sent
    budgetRange?: string; // From dropdown
}

async function ensureDb() {
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
    }
}

export async function getLeads(): Promise<Lead[]> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export async function getLead(id: string): Promise<Lead | undefined> {
    const leads = await getLeads();
    return leads.find(l => l.id === id);
}

export async function saveLead(lead: Lead): Promise<void> {
    const leads = await getLeads();
    // Check if lead already exists to avoid duplicates if ID is somehow reused (unlikely with UUID)
    const index = leads.findIndex(l => l.id === lead.id);
    if (index >= 0) {
        leads[index] = lead;
    } else {
        leads.push(lead);
    }
    await fs.writeFile(DB_PATH, JSON.stringify(leads, null, 2));
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    const leads = await getLeads();
    const index = leads.findIndex(l => l.id === id);
    if (index === -1) return null;

    const updatedLead = { ...leads[index], ...updates };
    leads[index] = updatedLead;

    await fs.writeFile(DB_PATH, JSON.stringify(leads, null, 2));
    return updatedLead;
}

export async function deleteLead(id: string): Promise<boolean> {
    const leads = await getLeads();
    const filtered = leads.filter(l => l.id !== id);
    if (filtered.length === leads.length) return false;

    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
    return true;
}
