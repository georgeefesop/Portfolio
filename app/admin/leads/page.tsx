'use client';

import { useState, useEffect, Fragment } from 'react';
import { Lead } from '@/lib/leads-db';
import { ChevronRight, Trash2, Mail, ExternalLink, Save, Loader2, X, PlusCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeadsDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'local' | 'live'>('local');

    // Initial Fetch & Mode Change
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;
        fetchLeads();
    }, [viewMode]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const endpoint = viewMode === 'live' ? '/api/admin/leads?source=live' : '/api/admin/leads';
            const res = await fetch(endpoint);
            const data = await res.json();
            if (Array.isArray(data)) {
                // Deduplicate by ID
                const uniqueLeads = Array.from(new Map(data.map((item: Lead) => [item.id, item])).values());
                setLeads(uniqueLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, updates: Partial<Lead>) => {
        try {
            const res = await fetch('/api/admin/leads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, updates })
            });
            const data = await res.json();
            if (data.success) {
                setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
                return true;
            }
        } catch (e) {
            console.error('Update failed', e);
        }
        return false;
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this lead? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
            if ((await res.json()).success) {
                setLeads(prev => prev.filter(l => l.id !== id));
                if (selectedLeadId === id) setSelectedLeadId(null);
            }
        } catch (e) {
            console.error('Delete failed', e);
        }
    };

    const generateEmailDraft = (lead: Lead) => {
        const subject = `Re: Project Inquiry - ${lead.projectType || 'Your Idea'}`;
        const firstName = lead.name?.split(' ')[0] || 'there';

        let body = `Hi ${firstName},\n\nThanks for reaching out about your project. I've reviewed your brief.\n\n`;
        if (lead.gapAnalysis) {
            body += `I noticed one key area we should discuss: ${lead.gapAnalysis}\n\n`;
        }
        body += `Are you free for a quick chat later this week to discuss next steps?`;
        if (lead.estimateCostLow) {
            body += `\n\n(Context: The initial estimate was roughly €${lead.estimateCostLow}–€${lead.estimateCostHigh}, but we can refine this during our call.)`;
        }
        body += `\n\nBest,\nGeorge`;

        window.open(`mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    const toggleRow = (id: string) => {
        setSelectedLeadId(selectedLeadId === id ? null : id);
    };

    if (process.env.NODE_ENV !== 'development') {
        return <div className="p-20 text-center text-zinc-500 font-mono">Development Mode Only</div>;
    }

    if (loading) {
        return <div className="h-screen flex items-center justify-center bg-[#0E0E11] text-accent-primary"><Loader2 className="animate-spin" /></div>;
    }

    // Metrics
    const totalGenerated = leads.length;
    const totalSubmitted = leads.filter(l => l.status !== 'anonymous').length;
    const highValue = leads.filter(l => (l.leadScore || 0) >= 7).length;

    return (
        <div className="min-h-screen bg-[#0E0E11] text-zinc-200 p-8 pt-24 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Lead Command Center</h1>
                        <p className="text-sm text-zinc-500 mt-1">Local Workspace • {leads.length} Leads</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        {/* Source Toggle */}
                        <div className="flex bg-[#141419] p-1 rounded-lg border border-white/10">
                            <button
                                onClick={() => setViewMode('local')}
                                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${viewMode === 'local' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                LOCAL
                            </button>
                            <button
                                onClick={() => setViewMode('live')}
                                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${viewMode === 'live' ? 'bg-emerald-900/40 text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                LIVE
                            </button>
                        </div>
                        <div className={`text-xs font-mono px-3 py-1.5 rounded-full border ${viewMode === 'live' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'}`}>
                            {viewMode === 'live' ? 'READ ONLY' : 'EDIT MODE'}
                        </div>
                    </div>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard title="Generated" value={totalGenerated} />
                    <KpiCard title="Submitted" value={totalSubmitted} />
                    <KpiCard title="High Value (Score >= 7)" value={highValue} />
                </div>

                {/* Table */}
                <div className="rounded-xl border border-white/10 bg-[#141419] overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-zinc-400 font-mono uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Score</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Lead Details</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leads.map(lead => (
                                <Fragment key={lead.id}>
                                    <tr
                                        onClick={() => toggleRow(lead.id)}
                                        className={`hover:bg-white/[0.04] transition-colors cursor-pointer group ${selectedLeadId === lead.id ? 'bg-white/[0.04]' : ''}`}
                                    >
                                        <td className="px-6 py-4 align-top w-24">
                                            <div className={`
                                                w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border
                                                ${(lead.leadScore || 0) >= 8 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                                                    (lead.leadScore || 0) >= 5 ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' :
                                                        'bg-zinc-800 border-zinc-700 text-zinc-500'}
                                            `}>
                                                {lead.leadScore || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top w-40">
                                            <StatusBadge status={lead.status} />
                                            <div className="text-[10px] text-zinc-500 mt-2 font-mono">
                                                {new Date(lead.createdAt).toLocaleString(undefined, {
                                                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="font-medium text-white text-base">
                                                {lead.name || <span className="text-zinc-500 italic">Anonymous Visitor</span>}
                                            </div>
                                            <div className="text-zinc-400 text-xs mt-1">
                                                {lead.projectType ? formatLabel(lead.projectType) : lead.source}
                                            </div>
                                            {lead.initialBrief && (
                                                <p className="text-zinc-500 text-xs mt-2 line-clamp-1 max-w-md group-hover:text-zinc-300">
                                                    {lead.initialBrief}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            {selectedLeadId === lead.id ? <ChevronUp className="w-5 h-5 text-zinc-500 ml-auto" /> : <ChevronDown className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 ml-auto" />}
                                        </td>
                                    </tr>

                                    {/* EXPANDABLE ROW CONTENT */}
                                    <AnimatePresence>
                                        {selectedLeadId === lead.id && (
                                            <tr key={`${lead.id}-expanded`}>
                                                <td colSpan={4} className="p-0 border-b border-white/5 bg-[#0E0E12] inset-shadow-lg">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-6 md:p-8 border-l-2 border-accent-primary ml-6 md:ml-10 my-4 space-y-8 bg-zinc-900/20 rounded-r-xl">

                                                            {/* Action Bar */}
                                                            <div className="flex gap-3 justify-end">
                                                                {/* Only allow actions in Local Mode */}
                                                                {viewMode === 'local' ? (
                                                                    <>
                                                                        {lead.email && (
                                                                            <button
                                                                                onClick={() => generateEmailDraft(lead)}
                                                                                className="bg-white hover:bg-zinc-200 text-black text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-white/5"
                                                                            >
                                                                                <Mail size={16} /> Draft Outreach
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => handleDelete(lead.id)}
                                                                            className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg flex items-center gap-2 transition-colors"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="text-xs text-zinc-500 font-mono italic p-2 border border-white/5 rounded">
                                                                        Read Only Mode (Google Sheets)
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Detailed Stats */}
                                                            <div className={`grid grid-cols-2 gap-8 ${viewMode === 'live' ? 'pointer-events-none opacity-80' : ''}`}>
                                                                <div className="space-y-4">
                                                                    <EditableField
                                                                        label="Status"
                                                                        value={lead.status}
                                                                        onSave={(val: any) => handleUpdate(lead.id, { status: val })}
                                                                        type="select"
                                                                        options={['anonymous', 'contacted', 'qualified', 'closed', 'lost']}
                                                                    />
                                                                    <EditableField
                                                                        label="Project Type"
                                                                        value={lead.projectType ? formatLabel(lead.projectType) : ''}
                                                                        onSave={(val: any) => handleUpdate(lead.id, { projectType: val })}
                                                                    />
                                                                    <EditableField
                                                                        label="Budget Range"
                                                                        value={lead.budgetRange || ''}
                                                                        onSave={(val: any) => handleUpdate(lead.id, { budgetRange: val })}
                                                                    />
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <EditableField
                                                                        label="Name"
                                                                        value={lead.name || ''}
                                                                        onSave={(val: any) => handleUpdate(lead.id, { name: val })}
                                                                    />
                                                                    <EditableField
                                                                        label="Email"
                                                                        value={lead.email || ''}
                                                                        onSave={(val: any) => handleUpdate(lead.id, { email: val })}
                                                                    />
                                                                    <EditableField
                                                                        label="Company"
                                                                        value={lead.company || ''}
                                                                        onSave={(val: any) => handleUpdate(lead.id, { company: val })}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Analysis Block */}
                                                            <div className="bg-[#141419] p-5 rounded-lg border border-white/5 space-y-6">
                                                                <div className="grid md:grid-cols-2 gap-6">
                                                                    <div>
                                                                        <h3 className="text-xs font-mono uppercase text-zinc-500 mb-2">Lead Reasoning</h3>
                                                                        <p className="text-sm text-emerald-400/90 italic">"{lead.leadScoreReasoning || 'N/A'}"</p>
                                                                    </div>
                                                                    {lead.gapAnalysis && (
                                                                        <div>
                                                                            <h3 className="text-xs font-mono uppercase text-zinc-500 mb-2">Gap Analysis</h3>
                                                                            <p className="text-sm text-orange-400/90 leading-relaxed bg-orange-900/10 p-2 rounded border border-orange-500/10">
                                                                                {lead.gapAnalysis}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* NEW: Project Estimate Details */}
                                                                {(lead.timeline || lead.estimateCostLow || (lead as any).whatsIncluded || (lead as any).considerations) && (
                                                                    <div className="border-t border-white/5 pt-4">
                                                                        <h3 className="text-xs font-mono uppercase text-zinc-500 mb-4">Initial Estimate Details</h3>
                                                                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                                                                            {lead.timeline && (
                                                                                <div>
                                                                                    <span className="text-zinc-500 block text-xs mb-1">Timeline</span>
                                                                                    <span className="text-white">{lead.timeline}</span>
                                                                                </div>
                                                                            )}
                                                                            {lead.estimateCostLow && (
                                                                                <div>
                                                                                    <span className="text-zinc-500 block text-xs mb-1">Estimated Cost</span>
                                                                                    <span className="text-white">€{lead.estimateCostLow?.toLocaleString()} – €{lead.estimateCostHigh?.toLocaleString()}</span>
                                                                                </div>
                                                                            )}
                                                                            {(lead as any).whatsIncluded && (
                                                                                <div className="col-span-2">
                                                                                    <span className="text-zinc-500 block text-xs mb-1">Possible Scope</span>
                                                                                    <p className="text-zinc-300 leading-relaxed text-xs">{(lead as any).whatsIncluded}</p>
                                                                                </div>
                                                                            )}
                                                                            {(lead as any).considerations && (
                                                                                <div className="col-span-2">
                                                                                    <span className="text-zinc-500 block text-xs mb-1">Considerations</span>
                                                                                    <p className="text-zinc-300 leading-relaxed text-xs whitespace-pre-line">{(lead as any).considerations}</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <hr className="border-white/5" />

                                                                <div>
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <h3 className="text-xs font-mono uppercase text-zinc-500">Full Brief / Message</h3>
                                                                    </div>
                                                                    <textarea
                                                                        className="w-full h-24 bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:border-accent-primary transition-colors resize-y"
                                                                        defaultValue={lead.finalBrief || lead.initialBrief}
                                                                        onBlur={(e) => handleUpdate(lead.id, { finalBrief: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value }: { title: string, value: string | number }) {
    return (
        <div className="bg-[#141419] border border-white/10 rounded-xl p-6">
            <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white font-mono">{value}</div>
        </div>
    );
}

// Helper to format project types
const formatLabel = (str: string) => {
    if (!str) return '';
    return str.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        'anonymous': 'text-zinc-500 border-zinc-700 bg-zinc-800',
        'contacted': 'text-purple-400 border-purple-500/30 bg-purple-500/10',
        'qualified': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        'closed': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
        'lost': 'text-red-400 border-red-500/30 bg-red-500/10',
    };
    return (
        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide border ${colors[status] || colors.anonymous}`}>
            {formatLabel(status)}
        </span>
    );
}

function EditableField({ label, value, onSave, type = 'text', options = [] }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentVal, setCurrentVal] = useState(value);

    const handleSave = () => {
        onSave(currentVal);
        setIsEditing(false);
    };

    return (
        <div className="group">
            <label className="text-xs text-zinc-500 font-mono uppercase mb-1 block">{label}</label>
            {isEditing ? (
                <div className="flex gap-2">
                    {type === 'select' ? (
                        <select
                            className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-full focus:outline-none"
                            value={currentVal}
                            onChange={(e) => setCurrentVal(e.target.value)}
                        >
                            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    ) : (
                        <input
                            className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-full focus:outline-none"
                            value={currentVal}
                            onChange={(e) => setCurrentVal(e.target.value)}
                            autoFocus
                        />
                    )}
                    <button onClick={handleSave} className="text-emerald-500 hover:text-emerald-400"><Save size={16} /></button>
                </div>
            ) : (
                <div
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-zinc-200 border-b border-transparent hover:border-white/20 cursor-pointer min-h-[24px] flex items-center"
                >
                    {value || <span className="text-zinc-700 italic">Empty</span>}
                    <Edit3 size={12} className="ml-2 opacity-0 group-hover:opacity-50" />
                </div>
            )}
        </div>
    );
}

// Helper Icon was missing
function Edit3({ size, className }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    )
}
