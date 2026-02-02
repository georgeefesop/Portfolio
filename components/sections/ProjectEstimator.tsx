'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Edit3, Send, CheckCircle2, AlertCircle, RotateCcw, ChevronDown, ChevronUp, FileText, ChevronRight } from 'lucide-react';
import InstrumentButton from '../ui/InstrumentButton';

interface CalculationStep {
    label: string;
    value: string;
}

interface EstimateResult {
    status: 'estimate' | 'needs_clarification' | 'too_complex' | 'out_of_scope';
    projectType?: string;
    timeline?: { low: string; high: string };
    cost: { low: number; high: number; currency: string; note: string | null };
    whatsIncluded: string[];
    considerations: string;
    breakdown: CalculationStep[];
    wideRange: boolean;
    deliverableNote: string | null;
    clarifyingQuestions: null;
    outOfScopeMessage: string | null;
    requiresBackend: boolean;
    // CRM
    leadId?: string;
    leadScore?: number;
    gapAnalysis?: string;
}

export default function ProjectEstimator() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<EstimateResult | null>(null);
    const [previousInput, setPreviousInput] = useState<string | null>(null);
    const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>(['design_prototype']);
    const [isRefining, setIsRefining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isQuoteMinimized, setIsQuoteMinimized] = useState(false);
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactCompany, setContactCompany] = useState('');

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const collapseFormRef = useRef<(() => void) | null>(null);

    // Auto-expand textarea (skip when empty so single-line classes control size)
    useEffect(() => {
        if (!textareaRef.current) return;
        if (input.trim().length === 0) {
            textareaRef.current.style.height = '';
            textareaRef.current.style.minHeight = '';
        } else {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    const handleGetEstimate = async () => {
        if (input.length < 15) return;

        setIsLoading(true);
        setError(null);

        const startTime = Date.now();

        try {
            const response = await fetch('/api/estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput: input,
                    previousInput: previousInput,
                    deliverableType: selectedDeliverables.length ? selectedDeliverables : ['design_prototype']
                }),
            });

            const data = await response.json();

            // Ensure minimum 2.5s delay
            const elapsedTime = Date.now() - startTime;
            const remainingDelay = Math.max(0, 2500 - elapsedTime);

            await new Promise(resolve => setTimeout(resolve, remainingDelay));

            if (data.error) {
                setError(data.message || "An unexpected error occurred.");
            } else {
                setResult(data);
                setPreviousInput(input);
                setIsQuoteMinimized(false);
                // Persist for Contact Form pre-fill
                localStorage.setItem('ge_portfolio_estimate', JSON.stringify({ input, result: data }));
            }
        } catch (err) {
            setError("Something went wrong. Try again or contact me directly.");
        } finally {
            setIsLoading(false);
            setIsRefining(false);
        }
    };

    const handleRefine = () => {
        setIsRefining(true);
    };

    const handleEdit = () => {
        setResult(null);
        setIsRefining(false);
    };

    const handleStartOver = () => {
        setResult(null);
        setInput('');
        setPreviousInput(null);
        setSelectedDeliverables(['design_prototype']);
        setIsQuoteMinimized(false);
    };

    const handleSuccessDone = () => {
        setIsQuoteMinimized(true);
    };

    const handleSuccessSendAnother = () => {
        setResult(null);
        setInput('');
        setPreviousInput(null);
        setSelectedDeliverables(['design_prototype']);
        setContactName('');
        setContactEmail('');
        setContactCompany('');
        setSendStatus('idle');
        setSendError(null);
        setIsQuoteMinimized(true);
    };

    const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [sendError, setSendError] = useState<string | null>(null);

    const handleStartProject = async () => {
        const name = contactName.trim();
        const email = contactEmail.trim().toLowerCase();
        const company = contactCompany.trim() || undefined;

        if (!name) {
            setSendError('Please enter your name.');
            return;
        }
        if (!email) {
            setSendError('Please enter your email.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSendError('Please enter a valid email address.');
            return;
        }

        setSendError(null);
        setSendStatus('sending');

        try {
            const res = await fetch('/api/estimate/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    company,
                    input,
                    result: result && result.status === 'estimate' ? result : null
                })
            });
            const data = await res.json();

            if (data.error) {
                setSendError(data.message || 'Something went wrong. Please try again.');
                setSendStatus('error');
                return;
            }
            setSendStatus('success');
        } catch {
            setSendError('Something went wrong. Please try again.');
            setSendStatus('error');
        }
    };

    const isButtonActive = input.length >= 15;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const canSendBrief =
        contactName.trim().length > 0 &&
        contactEmail.trim().length > 0 &&
        emailRegex.test(contactEmail.trim());

    // Clear send error when user edits contact fields so they can retry
    useEffect(() => {
        if (sendError) setSendError(null);
    }, [contactName, contactEmail]);

    const quoteExpanded = result && !isQuoteMinimized && !isLoading && !isRefining;
    const quoteMinimized = result && isQuoteMinimized && !isLoading && !isRefining;

    const showInputForm = (!result || isRefining || quoteMinimized) && !isLoading;

    return (
        <>
            {/* Subtle blur behind expanded form / during calculation; click to collapse and unfocus */}
            <AnimatePresence>
                {((showInputForm && isFormExpanded) || isLoading) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed inset-0 z-[60] backdrop-blur-sm bg-black/15 ${isLoading ? 'pointer-events-none' : 'pointer-events-auto cursor-default'}`}
                        onClick={() => {
                            if (!isLoading && showInputForm && isFormExpanded) {
                                collapseFormRef.current?.();
                                textareaRef.current?.blur();
                            }
                        }}
                        aria-hidden
                    />
                )}
            </AnimatePresence>

            {/* Blur overlay + modal when quote is open */}
            <AnimatePresence>
                {quoteExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 backdrop-blur-md bg-black/30 pointer-events-auto"
                            onClick={() => setIsQuoteMinimized(true)}
                            aria-hidden
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pointer-events-auto max-w-[560px] w-full max-h-[85vh] overflow-hidden relative z-[70]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ResultCard
                                    result={result!}
                                    input={input}
                                    onRefine={handleRefine}
                                    onEdit={handleEdit}
                                    onClose={() => setIsQuoteMinimized(true)}
                                    onStartOver={handleStartOver}
                                    onStartProject={handleStartProject}
                                    onSuccessDone={handleSuccessDone}
                                    onSuccessSendAnother={handleSuccessSendAnother}
                                    sendStatus={sendStatus}
                                    sendError={sendError}
                                    canSendBrief={canSendBrief}
                                    contactName={contactName}
                                    setContactName={setContactName}
                                    contactEmail={contactEmail}
                                    setContactEmail={setContactEmail}
                                    contactCompany={contactCompany}
                                    setContactCompany={setContactCompany}
                                />
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Floating dot to open/close quote - under toggle, matches toggle vibe */}
            <AnimatePresence>
                {result && !isLoading && !isRefining && (
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsQuoteMinimized((prev) => !prev);
                        }}
                        className="absolute right-8 z-[70] top-[calc(33.33%+48px)] -translate-y-1/2 w-14 h-14 rounded-full backdrop-blur-sm border border-white/10 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center shadow-lg pointer-events-auto"
                        aria-label={isQuoteMinimized ? 'Open quote' : 'Close quote'}
                    >
                        <FileText className="w-6 h-6 text-white pointer-events-none" strokeWidth={1.5} />
                    </motion.button>
                )}
            </AnimatePresence>

            <div className={`w-full transition-all duration-500 pointer-events-none z-[70] relative px-4 ${isRefining && result ? 'max-w-[1000px]' : 'max-w-[500px]'} mx-auto`}>
                <div className={`flex flex-col md:flex-row gap-8 w-full ${isRefining && result ? 'items-start' : 'items-center justify-center'}`}>

                    {/* Main Content Area - show input when no result or refining */}
                    <div className={`w-full transition-all duration-500 ${isRefining && result ? 'md:w-1/2' : ''}`}>
                        <AnimatePresence mode="wait">
                            {(showInputForm) && (
                                <InitialState
                                    input={input}
                                    setInput={setInput}
                                    selectedDeliverables={selectedDeliverables}
                                    setSelectedDeliverables={setSelectedDeliverables}
                                    textareaRef={textareaRef}
                                    isButtonActive={isButtonActive}
                                    onSubmit={handleGetEstimate}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            if (isButtonActive) handleGetEstimate();
                                        }
                                    }}
                                    previousInput={previousInput}
                                    isRefining={isRefining}
                                    onCancel={() => setIsRefining(false)}
                                    onBlur={() => {
                                        if (input.length === 0) {
                                            // We'll handle this inside InitialState for cleaner state management
                                        }
                                    }}
                                    onFormExpandedChange={setIsFormExpanded}
                                    onRegisterCollapse={(fn: (() => void) | null) => { collapseFormRef.current = fn; }}
                                />
                            )}

                            {isLoading && (
                                <LoadingState />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Side-by-side Result during refinement (Desktop) */}
                    {isRefining && result && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hidden md:block w-1/2 sticky top-24"
                        >
                            <div className="opacity-60 pointer-events-none scale-95 origin-left transition-all">
                                <ResultCard result={result} input={input} hideActions />
                            </div>
                        </motion.div>
                    )}

                    {/* Mobile Result Overlay during refinement */}
                    {isRefining && result && (
                        <div className="md:hidden w-full mt-8 opacity-40 pointer-events-none scale-95 origin-top transition-all">
                            <ResultCard result={result} input={input} hideActions />
                        </div>
                    )}
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2 items-center"
                    >
                        <AlertCircle size={14} />
                        {error}
                    </motion.div>
                )}
            </div>
        </>
    );
}

function InitialState({
    input,
    setInput,
    selectedDeliverables,
    setSelectedDeliverables,
    textareaRef,
    isButtonActive,
    onSubmit,
    onKeyDown,
    previousInput,
    isRefining,
    onCancel,
    onFormExpandedChange,
    onRegisterCollapse
}: any) {
    const minChars = 15;
    const isUnderMin = input.length < minChars;
    const hasInput = input.length > 0;
    const [allowExpanded, setAllowExpanded] = useState(isRefining);
    const [showButton, setShowButton] = useState(false);

    const pills = [
        { id: 'design_only', label: 'Design Only' },
        { id: 'design_prototype', label: 'Design + Prototype' },
        { id: 'full_build', label: 'Full Build' },
        { id: 'ai_integration', label: 'AI Integration' },
        { id: 'not_sure', label: 'Not Sure' }
    ];

    // Empty => always single line (derived). With content => expand after 1200ms.
    useEffect(() => {
        if (!hasInput) {
            setAllowExpanded(false);
            return;
        }
        const timer = setTimeout(() => {
            if (document.activeElement === textareaRef.current) {
                setAllowExpanded(true);
            }
        }, 1200);
        return () => clearTimeout(timer);
    }, [input, hasInput, textareaRef]);

    const isExpanded = hasInput && allowExpanded;

    useEffect(() => {
        onFormExpandedChange?.(isExpanded);
    }, [isExpanded, onFormExpandedChange]);

    useEffect(() => {
        onRegisterCollapse?.(() => setAllowExpanded(false));
        return () => { onRegisterCollapse?.(null); };
    }, [onRegisterCollapse]);

    useEffect(() => {
        if (isUnderMin || !isExpanded) {
            const timer = setTimeout(() => setShowButton(false), 600);
            return () => clearTimeout(timer);
        }
        const timer = setTimeout(() => setShowButton(true), 1300);
        return () => clearTimeout(timer);
    }, [input, isUnderMin, isExpanded]);

    const handleFocus = () => {
        if (hasInput) setAllowExpanded(true);
    };

    const handleBlur = () => {
        if (input.trim() === '') {
            setAllowExpanded(false);
        }
    };

    useEffect(() => {
        if (isRefining) setAllowExpanded(true);
    }, [isRefining]);

    // Fix cursor jumping: Focus the expanded textarea and move cursor to end
    const expandedRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if ((isExpanded || isRefining) && expandedRef.current) {
            const el = expandedRef.current;
            // Use a small delay to ensure the browser has completed any auto-focus/selection reset
            const timer = setTimeout(() => {
                const length = el.value.length;
                el.focus();
                el.setSelectionRange(length, length);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isExpanded, isRefining]);

    return (
        <div className={`w-full flex flex-col items-center pointer-events-auto ${isRefining ? 'opacity-100' : ''}`}>
            {/* Expanded Center Container */}
            <AnimatePresence>
                {isExpanded && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        {/* Static Backdrop Layer */}
                        <div
                            className="absolute inset-0 bg-black/15 backdrop-blur-sm"
                            onClick={() => setAllowExpanded(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="relative w-full max-w-[560px] flex flex-col items-center z-[70]"
                        >
                            {/* Form Header */}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Tell me your idea?</h3>
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-zinc-200 text-sm mt-2 font-medium text-center"
                                    >
                                        Get an instant project breakdown, scope and timeline.
                                    </motion.p>
                                </AnimatePresence>

                                <AnimatePresence initial={false}>
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            height: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
                                            opacity: { duration: 0.3, delay: 0.1 }
                                        }}
                                        className="overflow-hidden w-full"
                                    >
                                        <div className="pt-4 pb-2 flex flex-wrap justify-center gap-2">
                                            {pills.map((pill: any) => {
                                                const isSelected = selectedDeliverables.includes(pill.id);
                                                return (
                                                    <button
                                                        key={pill.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedDeliverables((prev: string[]) =>
                                                                isSelected ? prev.filter((id: string) => id !== pill.id) : [...prev, pill.id]
                                                            );
                                                        }}
                                                        className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all border min-h-[32px] ${isSelected
                                                            ? 'border-accent-primary bg-accent-primary text-white shadow-md shadow-accent-primary/20'
                                                            : 'border-white/10 bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600 hover:text-white hover:border-white/20'
                                                            }`}
                                                    >
                                                        {pill.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {isRefining && (
                                    <button onClick={onCancel} className="text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest mt-1">
                                        Cancel [×]
                                    </button>
                                )}
                            </div>

                            <div className={`w-full rounded-xl border border-white/25 overflow-hidden bg-[#1D1D22] shadow-2xl group focus-within:border-accent-primary/60 transition-all duration-500`}>
                                <div className="relative">
                                    <textarea
                                        ref={expandedRef}
                                        value={input}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setInput(v);
                                            if (v.trim() === '') setAllowExpanded(false);
                                        }}
                                        onKeyDown={onKeyDown}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        placeholder='e.g. A dashboard for…'
                                        className={`w-full bg-transparent px-4 text-white text-sm focus:outline-none transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] resize-none flex items-center leading-relaxed h-[180px] pt-4 pb-12`}
                                        rows={4}
                                    />

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 font-mono tracking-tight uppercase whitespace-nowrap">
                                        NO EMAIL REQUIRED.
                                    </div>

                                    {isUnderMin && (
                                        <div className={`absolute bottom-4 right-4 text-[10px] font-mono transition-colors text-red-500/80`}>
                                            {input.length}/{minChars}+
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 w-full flex justify-center">
                                <InstrumentButton
                                    onClick={onSubmit}
                                    disabled={!isButtonActive}
                                    className="w-full sm:w-[280px] h-14 md:h-16 text-sm font-mono uppercase tracking-widest relative group overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isRefining ? "Update ballpark" : (previousInput ? "Recalculate" : "Instant Breakdown")}
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </InstrumentButton>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Standard Inline Input (Collapsed) */}
            {!isExpanded && (
                <>
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Tell me your idea?</h3>
                        <p className="text-sm md:text-base text-zinc-200 max-w-sm mx-auto">Get an instant project breakdown, scope and timeline.</p>
                    </div>
                    <div className={`w-full max-w-[560px] rounded-xl border border-white/25 overflow-hidden bg-[#1A1A1E] group focus-within:border-accent-primary/60 transition-all duration-500 pointer-events-auto shadow-xl`}>
                        <div className="relative">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setInput(v);
                                }}
                                onKeyDown={onKeyDown}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder='e.g. A dashboard for…'
                                className={`w-full bg-transparent px-4 py-3.5 text-white placeholder:text-zinc-400 text-sm focus:outline-none resize-none min-h-[52px]`}
                                rows={1}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function LoadingState() {
    return (
        <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 space-y-6 text-center"
        >
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-accent-primary/20 animate-ping" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-accent-primary animate-pulse w-5 h-5" />
                </div>
            </div>
            <p className="text-zinc-400 text-sm font-mono tracking-widest uppercase animate-pulse">
                Analysing your idea
            </p>
        </motion.div>
    );
}

function ResultCard({ result, input, onRefine, onEdit, onStartOver, onStartProject, onSuccessDone, onSuccessSendAnother, hideActions = false, sendStatus = 'idle', sendError = null, canSendBrief = false, contactName = '', setContactName, contactEmail = '', setContactEmail, contactCompany = '', setContactCompany }: any) {
    const [isExpanded, setIsExpanded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollHint, setShowScrollHint] = useState(false);

    // Initial check for scrollability and scroll events
    useEffect(() => {
        if (!result) return;

        const checkScroll = () => {
            if (scrollRef.current) {
                const isScrollable = scrollRef.current.scrollHeight > scrollRef.current.clientHeight + 10;
                const isNearTop = scrollRef.current.scrollTop < 30;
                setShowScrollHint(isScrollable && isNearTop);
            }
        };

        checkScroll();
        const timer = setTimeout(checkScroll, 600); // Wait for animations/layout

        const el = scrollRef.current;
        if (el) el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        return () => {
            if (el) el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timer);
        };
    }, [result]);

    // "Liquid Preview Bounce" - Significant peek to reveal the CTA button
    useEffect(() => {
        if (!result || !scrollRef.current) return;

        const timer = setTimeout(() => {
            if (scrollRef.current) {
                // Dramatic 280px deep dive to show the user the button at the bottom
                scrollRef.current.scrollTo({ top: 280, behavior: 'smooth' });

                // Return to top after a brief pause so they can read the start
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }, 800);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [result]);

    if (!result) return null;

    // Success state: only after brief was sent (not after Calculate Estimate)
    if (!hideActions && sendStatus === 'success' && contactEmail) {
        return (
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
                {/* Static Blur Layer - iOS Fix */}
                <div
                    className="absolute inset-0 z-0 bg-[#121216]/90 backdrop-blur-md"
                    style={{ WebkitBackdropFilter: 'blur(12px)' }}
                />

                {/* Animated Content Layer */}
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="relative z-10"
                >
                    <div className="p-8 md:p-10 flex flex-col items-center text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                            className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
                        >
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" strokeWidth={2} />
                        </motion.div>
                        <div className="space-y-2">
                            <h3 className="text-xl md:text-2xl font-bold text-white">Thank you.</h3>
                            <p className="text-sm text-zinc-400 max-w-[300px] mx-auto leading-relaxed">
                                A copy of your estimate has been sent to <span className="text-zinc-300">{contactEmail}</span>. I&apos;ll be in touch shortly.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[300px] pt-2">
                            <button
                                type="button"
                                onClick={onSuccessDone}
                                className="flex-1 min-h-[44px] h-12 sm:h-11 text-[11px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (result.status === 'out_of_scope') {
        return (
            <div className="relative rounded-xl border border-white/10 overflow-hidden text-center">
                {/* Static Blur Layer - iOS Fix */}
                <div
                    className="absolute inset-0 z-0 bg-[#121216]/85 backdrop-blur-md"
                    style={{ WebkitBackdropFilter: 'blur(12px)' }}
                />

                <motion.div
                    key="out_of_scope"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 p-6 space-y-6"
                >
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
                        <AlertCircle className="text-orange-500 w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">This isn't something I typically work on.</h3>
                    <p className="text-sm text-zinc-400">
                        {result.outOfScopeMessage}
                    </p>
                    {!hideActions && (
                        <InstrumentButton onClick={onStartOver} className="w-full h-12">
                            Start Over
                        </InstrumentButton>
                    )}
                </motion.div>
            </div>
        );
    }

    const { cost, timeline, projectType, whatsIncluded, considerations, status, breakdown, wideRange, deliverableNote } = result;

    return (
        <div className={`relative rounded-xl overflow-hidden shadow-2xl border border-white/10 ${hideActions ? 'cursor-default' : ''}`}>
            {/* Static Blur Layer - iOS Fix */}
            <div
                className="absolute inset-0 z-0 bg-[#121216]/85 backdrop-blur-md"
                style={{ WebkitBackdropFilter: 'blur(12px)' }}
            />

            <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
            >
                {status === 'too_complex' && (
                    <div className="bg-orange-500/10 border-b border-orange-500/20 p-4 flex gap-3 items-start">
                        <AlertCircle className="text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-[11px] md:text-xs text-orange-200/80 leading-relaxed">
                            ⚠ This sounds like a larger project that would benefit from a direct conversation. I can help with product strategy and UX architecture — let's talk.
                        </p>
                    </div>
                )}

                <div ref={scrollRef} className="p-5 md:p-6 space-y-6 max-h-[85vh] overflow-y-auto scrollbar-hide">
                    {/* a) YOUR IDEA */}
                    <section className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Your Idea</h4>
                            {!hideActions && (
                                <button onClick={onEdit} className="text-[10px] font-mono text-accent-primary hover:underline flex items-center gap-1">
                                    [Edit ↻]
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-zinc-400 italic bg-white/5 p-3 rounded-lg border border-white/5 line-clamp-3">
                            "{input}"
                        </p>
                    </section>

                    {/* b) PROJECT TYPE */}
                    <section className="space-y-1">
                        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Project Type</h4>
                        <p className="text-sm text-white font-medium">{projectType}</p>
                    </section>

                    {/* c) ESTIMATED TIMELINE */}
                    <section className="space-y-1">
                        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Estimated Timeline</h4>
                        <p className="text-sm text-white font-medium">{timeline.low} – {timeline.high}</p>
                    </section>

                    {/* Deliverable Note */}
                    {deliverableNote && (
                        <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                            <p className="text-[10px] text-blue-300 italic leading-relaxed">
                                {deliverableNote}
                            </p>
                        </div>
                    )}

                    {/* Wide Range Nudge */}
                    {wideRange && !hideActions && (
                        <div className="text-center space-y-2">
                            <p className="text-[10px] text-zinc-500">That's a pretty wide range. Want to narrow it down?</p>
                            <button
                                onClick={onRefine}
                                className="text-[10px] font-mono uppercase tracking-widest text-accent-primary hover:underline"
                            >
                                [Refine Brief →]
                            </button>
                        </div>
                    )}



                    {/* d) RECOMMENDED EXECUTION PATH (Roadmap) */}
                    {breakdown && breakdown.length > 0 && (
                        <section className="space-y-3 pt-2">
                            <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Recommended Execution Path</h4>
                            <div className="space-y-2">
                                {breakdown.map((step: CalculationStep, i: number) => {
                                    if (i === breakdown.length - 1) return null; // Skip TOTAL row for roadmap view
                                    return (
                                        <div key={i} className="flex justify-between items-center text-xs border border-white/5 bg-white/5 rounded-lg p-2.5">
                                            <span className="text-zinc-300 font-medium">{step.label.replace(/(\+.*)/, '').trim()}</span> {/* Strip cost multipliers from label if present */}
                                            <span className="font-mono text-accent-primary opacity-80">{step.value.replace(/(\+€.*)/, 'Included')}</span> {/* Hide costs in roadmap, show Time/Included */}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* e) WHAT'S INCLUDED */}
                    <section className="space-y-2">
                        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">What's Included</h4>
                        <ul className="grid grid-cols-1 gap-1.5">
                            {whatsIncluded.map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                                    <CheckCircle2 size={12} className="text-accent-primary/50" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* f) CONSIDERATIONS */}
                    <section className="space-y-1.5">
                        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Considerations</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            {considerations}
                        </p>
                    </section>

                    {/* g) DISCLAIMER */}
                    <p className="text-[9px] text-center text-zinc-600 font-mono pt-2 border-t border-white/5 tracking-tight uppercase">
                        AI-powered estimate. Actual scope and pricing will be discussed when we talk.
                    </p>

                    {/* h) CONTACT FIELDS + TWO BUTTONS */}
                    {!hideActions && (
                        <div className="flex flex-col gap-3 pt-2">
                            {!canSendBrief && (contactName.trim() || contactEmail.trim()) && (
                                <p className="text-[10px] text-red-400 font-mono -mt-1 mb-0.5">Name and a valid email are required.</p>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={contactName}
                                    onChange={(e) => setContactName?.(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-accent-primary/50"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail?.(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-accent-primary/50"
                                />
                                <input
                                    type="text"
                                    placeholder="Company (optional)"
                                    value={contactCompany}
                                    onChange={(e) => setContactCompany?.(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-accent-primary/50"
                                />
                            </div>
                            {sendError && (
                                <p className="text-[11px] text-red-400 font-mono">{sendError}</p>
                            )}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={onRefine}
                                    disabled={sendStatus === 'sending'}
                                    className="sm:w-[40%] h-10 text-[11px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all disabled:opacity-50"
                                >
                                    Refine Estimate
                                </button>
                                <InstrumentButton
                                    onClick={onStartProject}
                                    disabled={sendStatus === 'sending' || !canSendBrief}
                                    className="sm:w-[60%] h-10 text-xs font-mono uppercase tracking-widest"
                                >
                                    {sendStatus === 'sending' ? 'Sending…' : sendStatus === 'success' ? 'Sent' : 'Send brief & get in touch'}
                                </InstrumentButton>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Floating Scroll Cue */}
            <AnimatePresence>
                {showScrollHint && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 10, x: '-50%' }}
                        className="absolute bottom-4 left-1/2 z-30 pointer-events-none flex flex-col items-center gap-1"
                    >
                        <span className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.2em] font-bold">More below</span>
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <ChevronDown className="w-5 h-5 text-accent-primary" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
