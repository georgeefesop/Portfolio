'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Edit3, Send, CheckCircle2, AlertCircle, RotateCcw, ChevronDown, ChevronUp, FileText } from 'lucide-react';
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

    // Auto-expand textarea & Focus on refinement (skip when empty so single-line classes control size)
    useEffect(() => {
        if (!textareaRef.current) return;
        if (input.trim().length === 0) {
            textareaRef.current.style.height = '';
            textareaRef.current.style.minHeight = '';
        } else {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
        if (isRefining || !result) {
            textareaRef.current.focus();
        }
    }, [input, isRefining, result]);

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

    const showInputForm = (!result || isRefining || isQuoteMinimized) && !isLoading;

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
                        className={`fixed inset-0 z-20 backdrop-blur-sm bg-black/15 ${isLoading ? 'pointer-events-none' : 'pointer-events-auto cursor-default'}`}
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
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="pointer-events-auto max-w-[560px] w-full max-h-[85vh] overflow-hidden"
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
                        className="fixed right-8 z-[70] top-[calc(23.33%+9rem)] w-14 h-14 rounded-full backdrop-blur-sm border border-white/10 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center shadow-lg pointer-events-auto"
                        aria-label={isQuoteMinimized ? 'Open quote' : 'Close quote'}
                    >
                        <FileText className="w-6 h-6 text-white pointer-events-none" strokeWidth={1.5} />
                    </motion.button>
                )}
            </AnimatePresence>

            <div className={`w-full transition-all duration-500 pointer-events-auto z-30 relative px-4 ${isRefining && result ? 'max-w-[1000px]' : 'max-w-[500px]'} mx-auto`}>
            <div className={`flex flex-col md:flex-row gap-8 w-full ${isRefining && result ? 'items-start' : 'items-center justify-center'}`}>

                {/* Main Content Area - show input when no result, refining, or quote minimized */}
                <div className={`w-full transition-all duration-500 ${isRefining && result ? 'md:w-1/2' : ''}`}>
                    <AnimatePresence mode="wait">
                        {(!result || isRefining || isQuoteMinimized) && !isLoading && (
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
    const [allowExpanded, setAllowExpanded] = useState(false);
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
        const timer = setTimeout(() => setAllowExpanded(true), 1200);
        return () => clearTimeout(timer);
    }, [input, hasInput]);

    const isExpanded = hasInput && allowExpanded;

    useEffect(() => {
        onFormExpandedChange?.(isExpanded);
    }, [isExpanded, onFormExpandedChange]);

    useEffect(() => {
        onRegisterCollapse?.(() => setAllowExpanded(false));
        return () => { onRegisterCollapse?.(null); };
    }, [onRegisterCollapse]);

    useEffect(() => {
        if (isUnderMin) {
            const timer = setTimeout(() => setShowButton(false), 600);
            return () => clearTimeout(timer);
        }
        const timer = setTimeout(() => setShowButton(true), 1300);
        return () => clearTimeout(timer);
    }, [input, isUnderMin]);

    const handleFocus = () => {};
    const handleBlur = () => {};

    return (
        <motion.div
            key="initial"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex flex-col items-center ${isRefining ? 'opacity-100' : ''}`}
        >
            <div className="w-full px-2 mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                    {isRefining ? "Refine your idea?" : (previousInput ? "Update your idea?" : "Tell me your idea?")}
                </h2>
                {isRefining && (
                    <button onClick={onCancel} className="text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest mt-1">
                        Cancel [×]
                    </button>
                )}
            </div>

            <div className={`w-full rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm group focus-within:border-accent-primary/50 transition-all duration-500 ${isRefining ? 'bg-black/80' : 'bg-black/40'}`}>
                <div className="relative">
                    <textarea
                        ref={textareaRef}
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
                        className={`w-full bg-transparent px-4 text-white text-sm focus:outline-none transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] resize-none flex items-center leading-relaxed ${isExpanded ? 'min-h-[140px] pt-4 pb-12' : 'min-h-[52px] py-3 sm:min-h-[48px] sm:py-3.5'}`}
                        rows={isExpanded ? 4 : 1}
                    />

                    {/* Overlaid Disclaimer & Count - Progressive Reveal */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="pointer-events-none"
                            >
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 font-mono tracking-tight uppercase whitespace-nowrap">
                                    Ballpark estimate. No email required.
                                </div>

                                <div className={`absolute bottom-4 right-4 text-[10px] font-mono transition-colors ${isUnderMin ? 'text-red-500/80' : 'text-zinc-400'}`}>
                                    {input.length}/{minChars}+
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Contained Footer for Pills - Progressive Reveal */}
                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                height: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
                                opacity: { duration: 0.4, delay: 0.1 }
                            }}
                            className="bg-white/[0.03] border-t border-white/5 overflow-hidden"
                        >
                            <div className="p-3 space-y-3">
                                <div className="flex flex-wrap justify-center gap-2">
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
                                            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all border min-h-[38px] md:min-h-0 ${isSelected
                                                ? 'border-accent-primary bg-accent-primary/25 text-white'
                                                : 'border-white/15 bg-white/5 text-zinc-500 hover:border-white/25 hover:bg-white/10'
                                                }`}
                                        >
                                            {pill.label}
                                        </button>
                                    );
                                })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="w-full flex flex-col items-center relative">
                <AnimatePresence>
                    {showButton && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-full md:w-auto flex justify-center pt-1"
                        >
                            <InstrumentButton
                                onClick={onSubmit}
                                className="w-full md:w-auto h-12 px-12 whitespace-nowrap"
                            >
                                {isRefining ? "Update ballpark" : (previousInput ? "Recalculate" : "Calculate Estimate")}
                            </InstrumentButton>
                        </motion.div>
                    )}
                </AnimatePresence>
                <a
                    href="#contact"
                    onClick={(e) => {
                        e.preventDefault();
                        const el = document.querySelector('#contact');
                        if (el) {
                            const top = el.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top, behavior: 'smooth' });
                        }
                    }}
                    className="mt-20 md:mt-24 text-zinc-500 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 pointer-events-auto z-0"
                    aria-label="Scroll to contact"
                >
                    <span className="group-hover:translate-y-0.5 transition-transform inline-block">↓</span>
                    <span>Scroll down</span>
                </a>
            </div>
        </motion.div>
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

    if (!result) return null;

    // Success state: only after brief was sent (not after Calculate Estimate)
    if (!hideActions && sendStatus === 'success' && contactEmail) {
        return (
            <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="bg-[#121216]/90 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl"
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
                        <InstrumentButton
                            onClick={onSuccessSendAnother}
                            className="flex-1 min-h-[44px] h-12 sm:h-11 text-xs font-mono uppercase tracking-widest whitespace-nowrap"
                        >
                            New estimate
                        </InstrumentButton>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (result.status === 'out_of_scope') {
        return (
            <motion.div
                key="out_of_scope"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#121216]/85 border border-white/10 rounded-xl p-6 backdrop-blur-md space-y-6 text-center"
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
        );
    }

    const { cost, timeline, projectType, whatsIncluded, considerations, status, breakdown, wideRange, deliverableNote } = result;

    return (
        <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-[#121216]/85 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl relative ${hideActions ? 'cursor-default' : ''}`}
        >
            {status === 'too_complex' && (
                <div className="bg-orange-500/10 border-b border-orange-500/20 p-4 flex gap-3 items-start">
                    <AlertCircle className="text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-[11px] md:text-xs text-orange-200/80 leading-relaxed">
                        ⚠ This sounds like a larger project that would benefit from a direct conversation. I can help with product strategy and UX architecture — let's talk.
                    </p>
                </div>
            )}

            <div className="p-5 md:p-6 space-y-6 max-h-[85vh] overflow-y-auto scrollbar-hide">
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

                <div className="grid grid-cols-2 gap-4">
                    {/* c) ESTIMATED TIMELINE */}
                    <section className="space-y-1">
                        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Estimated Timeline</h4>
                        <p className="text-sm text-white font-medium">{timeline.low} – {timeline.high}</p>
                    </section>

                    {/* d) ESTIMATED COST */}
                    <section className="space-y-1">
                        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Estimated Cost</h4>
                        <p className="text-lg md:text-xl font-black text-accent-primary leading-none">
                            €{cost.low.toLocaleString()} – €{cost.high.toLocaleString()}
                        </p>
                        {result.requiresBackend && (
                            <p className="text-[9px] text-zinc-500 leading-tight mt-1.5 opacity-80 italic">
                                Includes estimated backend development partner costs
                            </p>
                        )}
                    </section>
                </div>

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

                {/* Progressive Reveal: Calculation Breakdown */}
                <section className="border-t border-white/5 pt-4">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest hover:text-zinc-300 transition-colors"
                    >
                        How is this calculated?
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2 pt-4">
                                    {breakdown.map((step: CalculationStep, i: number) => {
                                        const isTotal = i === breakdown.length - 1;
                                        const isMultiplier = step.value.startsWith('+') || step.value.startsWith('-');
                                        const isBackend = step.label.toLowerCase().includes('backend');

                                        return (
                                            <div
                                                key={i}
                                                className={`flex justify-between items-center text-[11px] ${isTotal
                                                    ? 'pt-2 mt-2 border-t border-white/10 font-bold text-white'
                                                    : isMultiplier ? 'text-zinc-400' : 'text-zinc-300'
                                                    }`}
                                            >
                                                <span className={isBackend ? 'text-zinc-500 italic' : ''}>{step.label}</span>
                                                <span className={isTotal ? 'text-accent-primary' : (isMultiplier ? 'text-accent-primary/60' : '')}>
                                                    {step.value}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

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
    );
}
