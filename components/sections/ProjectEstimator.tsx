'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from 'posthog-js';
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

interface ProjectEstimatorProps {
    externalIsMinimized?: boolean;
    externalSetMinimized?: (val: boolean) => void;
    headerActions?: React.ReactNode;
}

export default function ProjectEstimator({ externalIsMinimized, externalSetMinimized, headerActions }: ProjectEstimatorProps) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<EstimateResult | null>(null);
    const [previousInput, setPreviousInput] = useState<string | null>(null);
    const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>(['design_prototype']);
    const [isRefining, setIsRefining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [internalIsMinimized, setInternalIsMinimized] = useState(false);
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactCompany, setContactCompany] = useState('');

    const isQuoteMinimized = externalIsMinimized ?? internalIsMinimized;
    const setIsQuoteMinimized = externalSetMinimized ?? setInternalIsMinimized;

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

        posthog.capture?.('estimator_run', { input_length: input.length, deliverables: selectedDeliverables });

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
            posthog.capture?.('estimator_brief_sent', { has_company: Boolean(company), has_estimate: Boolean(result && result.status === 'estimate') });
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
                        className={`project-estimator-backdrop fixed inset-0 z-[60] backdrop-blur-sm bg-black/15 ${isLoading ? 'pointer-events-none' : 'pointer-events-auto cursor-default'}`}
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

            {/* UI Control Group: Background Toggle + Quote Button */}
            {/* Position: Bottom Right on Mobile, Right Center on Desktop */}
            {/* UI Control Group: Background Toggle + Quote Button */}
            {/* Position: Bottom Right on Mobile, Right Center on Desktop */}
            {/* UI Control Group: Background Toggle + Quote Button */}
            {/* Position: Bottom Right on Mobile, Right Center on Desktop */}
            <div className="project-estimator-controls absolute right-4 bottom-8 md:bottom-auto md:right-8 md:top-1/2 md:-translate-y-1/2 z-[70] flex flex-col items-end pointer-events-none">
                <div className="project-estimator-controls-inner pointer-events-auto flex flex-col items-end">
                    {/* External Actions (Background Toggle) */}
                    <AnimatePresence mode="wait">
                        {headerActions && !isFormExpanded && (
                            <motion.div
                                className="project-estimator-header-actions"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                {headerActions}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Floating dot to open/close quote - matches toggle vibe */}
                    <AnimatePresence>
                        {result && !isLoading && !isRefining && (
                            <div className="project-estimator-toggle-wrap relative z-30 -mt-4 md:-mt-2"> {/* Negative margin to offset Toggle's scale dead-space */}
                                <motion.button
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.6 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsQuoteMinimized(!isQuoteMinimized);
                                    }}
                                    className="project-estimator-toggle-button w-[46px] h-[46px] md:w-[51px] md:h-[51px] rounded-full backdrop-blur-sm border border-white/10 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center shadow-lg pointer-events-auto"
                                    aria-label={isQuoteMinimized ? 'Open quote' : 'Close quote'}
                                >
                                    <FileText className="project-estimator-toggle-icon w-5 h-5 md:w-6 md:h-6 text-white pointer-events-none" strokeWidth={1.5} />
                                </motion.button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Blur overlay + modal when quote is open */}
            <AnimatePresence>
                {quoteExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="project-estimator-modal-backdrop fixed inset-0 z-50 backdrop-blur-md bg-black/30 pointer-events-auto"
                            onClick={() => setIsQuoteMinimized(true)}
                            aria-hidden
                        />
                        <div className="project-estimator-modal fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="project-estimator-modal-panel pointer-events-auto max-w-[560px] w-full max-h-[85vh] overflow-hidden relative z-[70]"
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



            <div className={`project-estimator-section w-full transition-all duration-500 pointer-events-none z-[70] relative px-4 ${isRefining && result ? 'max-w-[1000px]' : 'max-w-[500px]'} mx-auto`}>
                <div className={`project-estimator-layout flex flex-col md:flex-row gap-8 w-full ${isRefining && result ? 'items-start' : 'items-center justify-center'}`}>

                    {/* Main Content Area - show input when no result or refining */}
                    <div className={`project-estimator-main w-full transition-all duration-500 ${isRefining && result ? 'md:w-1/2' : ''}`}>
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
                            className="project-estimator-refine-aside hidden md:block w-1/2 sticky top-24"
                        >
                            <div className="project-estimator-refine-aside-inner opacity-60 pointer-events-none scale-95 origin-left transition-all">
                                <ResultCard result={result} input={input} hideActions />
                            </div>
                        </motion.div>
                    )}

                    {/* Mobile Result Overlay during refinement */}
                    {isRefining && result && (
                        <div className="project-estimator-refine-mobile md:hidden w-full mt-8 opacity-40 pointer-events-none scale-95 origin-top transition-all">
                            <ResultCard result={result} input={input} hideActions />
                        </div>
                    )}
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="project-estimator-error mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2 items-center"
                    >
                        <AlertCircle size={14} className="project-estimator-error-icon" />
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
        <div className={`initial-state-root w-full flex flex-col items-center pointer-events-auto ${isRefining ? 'opacity-100' : ''}`}>
            {/* Expanded Center Container */}
            <AnimatePresence>
                {isExpanded && (
                    <div className="initial-state-expanded fixed inset-0 z-[60] flex items-center justify-center p-4">
                        {/* Static Backdrop Layer */}
                        <div
                            className="initial-state-expanded-backdrop absolute inset-0 bg-black/15 backdrop-blur-sm"
                            onClick={() => setAllowExpanded(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="initial-state-expanded-panel relative w-full max-w-[560px] flex flex-col items-center z-[70]"
                        >
                            {/* Form Header */}
                            <div className="initial-state-header text-center mb-6">
                                <h3 className="initial-state-heading text-2xl md:text-3xl font-bold text-white tracking-tight">Tell me your idea?</h3>
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="initial-state-description text-zinc-200 text-sm mt-2 font-medium text-center"
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
                                        className="initial-state-pills-wrap overflow-hidden w-full"
                                    >
                                        <div className="initial-state-pills pt-4 pb-2 flex flex-wrap justify-center gap-2">
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
                                                        className={`initial-state-pill ${isSelected ? 'initial-state-pill-selected' : ''} px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all border min-h-[32px] ${isSelected
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
                                    <button onClick={onCancel} className="initial-state-cancel text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest mt-1">
                                        Cancel [×]
                                    </button>
                                )}
                            </div>

                            <div className={`initial-state-textarea-wrap w-full rounded-xl border border-white/25 overflow-hidden bg-[#1D1D22] shadow-2xl group focus-within:border-accent-primary/60 transition-all duration-500`}>
                                <div className="initial-state-textarea-inner relative">
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
                                        className={`initial-state-textarea w-full bg-transparent px-4 text-white text-sm focus:outline-none transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] resize-none flex items-center leading-relaxed h-[180px] pt-4 pb-12`}
                                        rows={4}
                                    />

                                    <div className="initial-state-no-email absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 font-mono tracking-tight uppercase whitespace-nowrap">
                                        NO EMAIL REQUIRED.
                                    </div>

                                    {isUnderMin && (
                                        <div className={`initial-state-char-count absolute bottom-4 right-4 text-[10px] font-mono transition-colors text-red-500/80`}>
                                            {input.length}/{minChars}+
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="initial-state-submit-wrap mt-6 w-full flex justify-center">
                                <InstrumentButton
                                    onClick={onSubmit}
                                    disabled={!isButtonActive}
                                    className="initial-state-submit w-full sm:w-[280px] h-14 md:h-16 text-sm font-mono uppercase tracking-widest relative group overflow-hidden"
                                >
                                    <span className="initial-state-submit-label relative z-10 flex items-center justify-center gap-2">
                                        {isRefining ? "Update ballpark" : (previousInput ? "Recalculate" : "Instant Breakdown")}
                                        <ChevronRight className="initial-state-submit-icon w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                    <div className="initial-state-collapsed-header text-center mb-8">
                        <h3 className="initial-state-collapsed-heading text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Tell me your idea?</h3>
                        <p className="initial-state-collapsed-description text-sm md:text-base text-zinc-200 max-w-sm mx-auto">Get an instant project breakdown, scope and timeline.</p>
                    </div>
                    <div className={`initial-state-collapsed-wrap w-full max-w-[560px] rounded-xl border border-white/25 overflow-hidden bg-[#1A1A1E] group focus-within:border-accent-primary/60 transition-all duration-500 pointer-events-auto shadow-xl`}>
                        <div className="initial-state-collapsed-inner relative">
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
                                className={`initial-state-collapsed-textarea w-full bg-transparent px-4 py-3.5 text-white placeholder:text-zinc-400 text-sm focus:outline-none resize-none min-h-[52px]`}
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
            className="loading-state-root flex flex-col items-center justify-center p-12 space-y-6 text-center"
        >
            <div className="loading-state-spinner relative">
                <div className="loading-state-pulse w-12 h-12 rounded-full border-2 border-accent-primary/20 animate-ping" />
                <div className="loading-state-icon-wrap absolute inset-0 flex items-center justify-center">
                    <Sparkles className="loading-state-icon text-accent-primary animate-pulse w-5 h-5" />
                </div>
            </div>
            <p className="loading-state-label text-zinc-400 text-sm font-mono tracking-widest uppercase animate-pulse">
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
            <div className="result-card-success relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
                {/* Static Blur Layer - iOS Fix */}
                <div
                    className="result-card-success-blur absolute inset-0 z-0 bg-[#121216]/90 backdrop-blur-md"
                    style={{ WebkitBackdropFilter: 'blur(12px)' }}
                />

                {/* Animated Content Layer */}
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="result-card-success-content relative z-10"
                >
                    <div className="result-card-success-body p-8 md:p-10 flex flex-col items-center text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                            className="result-card-success-icon-wrap w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
                        >
                            <CheckCircle2 className="result-card-success-icon w-8 h-8 text-emerald-400" strokeWidth={2} />
                        </motion.div>
                        <div className="result-card-success-text space-y-2">
                            <h3 className="result-card-success-heading text-xl md:text-2xl font-bold text-white">Thank you.</h3>
                            <p className="result-card-success-message text-sm text-zinc-400 max-w-[300px] mx-auto leading-relaxed">
                                A copy of your estimate has been sent to <span className="result-card-success-email text-zinc-300">{contactEmail}</span>. I&apos;ll be in touch shortly.
                            </p>
                        </div>
                        <div className="result-card-success-actions flex flex-col sm:flex-row gap-3 w-full max-w-[300px] pt-2">
                            <button
                                type="button"
                                onClick={onSuccessDone}
                                className="result-card-success-close flex-1 min-h-[44px] h-12 sm:h-11 text-[11px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
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
            <div className="result-card-out-of-scope relative rounded-xl border border-white/10 overflow-hidden text-center">
                {/* Static Blur Layer - iOS Fix */}
                <div
                    className="result-card-out-of-scope-blur absolute inset-0 z-0 bg-[#121216]/85 backdrop-blur-md"
                    style={{ WebkitBackdropFilter: 'blur(12px)' }}
                />

                <motion.div
                    key="out_of_scope"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="result-card-out-of-scope-content relative z-10 p-6 space-y-6"
                >
                    <div className="result-card-out-of-scope-icon-wrap w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
                        <AlertCircle className="result-card-out-of-scope-icon text-orange-500 w-6 h-6" />
                    </div>
                    <h3 className="result-card-out-of-scope-heading text-lg font-bold text-white">This isn't something I typically work on.</h3>
                    <p className="result-card-out-of-scope-message text-sm text-zinc-400">
                        {result.outOfScopeMessage}
                    </p>
                    {!hideActions && (
                        <InstrumentButton onClick={onStartOver} className="result-card-out-of-scope-cta w-full h-12">
                            Start Over
                        </InstrumentButton>
                    )}
                </motion.div>
            </div>
        );
    }

    const { cost, timeline, projectType, whatsIncluded, considerations, status, breakdown, wideRange, deliverableNote } = result;

    return (
        <div className={`result-card-root relative rounded-xl overflow-hidden shadow-2xl border border-white/10 ${hideActions ? 'cursor-default' : ''}`}>
            {/* Static Blur Layer - iOS Fix */}
            <div
                className="result-card-blur absolute inset-0 z-0 bg-[#121216]/85 backdrop-blur-md"
                style={{ WebkitBackdropFilter: 'blur(12px)' }}
            />

            <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="result-card-content relative z-10"
            >
                {status === 'too_complex' && (
                    <div className="result-card-warning bg-orange-500/10 border-b border-orange-500/20 p-4 flex gap-3 items-start">
                        <AlertCircle className="result-card-warning-icon text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
                        <p className="result-card-warning-message text-[11px] md:text-xs text-orange-200/80 leading-relaxed">
                            ⚠ This sounds like a larger project that would benefit from a direct conversation. I can help with product strategy and UX architecture - let's talk.
                        </p>
                    </div>
                )}

                <div ref={scrollRef} className="result-card-scroll p-5 md:p-6 space-y-6 max-h-[85vh] overflow-y-auto scrollbar-hide">
                    {/* a) YOUR IDEA */}
                    <section className="result-card-idea space-y-1.5">
                        <div className="result-card-idea-header flex justify-between items-center">
                            <h4 className="result-card-eyebrow text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Your Idea</h4>
                            {!hideActions && (
                                <button onClick={onEdit} className="result-card-edit text-[10px] font-mono text-accent-primary hover:underline flex items-center gap-1">
                                    [Edit ↻]
                                </button>
                            )}
                        </div>
                        <p className="result-card-idea-quote text-xs text-zinc-400 italic bg-white/5 p-3 rounded-lg border border-white/5 line-clamp-3">
                            "{input}"
                        </p>
                    </section>

                    {/* b) PROJECT TYPE */}
                    <section className="result-card-project-type space-y-1">
                        <h4 className="result-card-eyebrow text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Project Type</h4>
                        <p className="result-card-project-type-value text-sm text-white font-medium capitalize">{projectType?.replace(/_/g, ' ')}</p>
                    </section>

                    {/* c) ESTIMATED TIMELINE */}
                    <section className="result-card-timeline space-y-1">
                        <h4 className="result-card-eyebrow text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Estimated Timeline</h4>
                        <p className="result-card-timeline-value text-sm text-white font-medium">{timeline.low} – {timeline.high}</p>
                    </section>

                    {/* Deliverable Note */}
                    {deliverableNote && (
                        <div className="result-card-deliverable-note p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                            <p className="result-card-deliverable-note-text text-[10px] text-blue-300 italic leading-relaxed">
                                {deliverableNote}
                            </p>
                        </div>
                    )}

                    {/* Wide Range Nudge */}
                    {wideRange && !hideActions && (
                        <div className="result-card-wide-range text-center space-y-2">
                            <p className="result-card-wide-range-text text-[10px] text-zinc-500">That's a pretty wide range. Want to narrow it down?</p>
                            <button
                                onClick={onRefine}
                                className="result-card-wide-range-cta text-[10px] font-mono uppercase tracking-widest text-accent-primary hover:underline"
                            >
                                [Refine Brief →]
                            </button>
                        </div>
                    )}



                    {/* d) RECOMMENDED EXECUTION PATH (Roadmap) */}
                    {breakdown && breakdown.length > 0 && (
                        <section className="result-card-roadmap space-y-3 pt-2">
                            <h4 className="result-card-eyebrow text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Recommended Execution Path</h4>
                            <div className="result-card-roadmap-list space-y-2">
                                {breakdown.map((step: CalculationStep, i: number) => {
                                    if (i === breakdown.length - 1) return null; // Skip TOTAL row for roadmap view
                                    return (
                                        <div key={i} className="result-card-roadmap-step flex justify-between items-center text-xs border border-white/5 bg-white/5 rounded-lg p-2.5">
                                            <span className="result-card-roadmap-step-label text-zinc-300 font-medium">{step.label.replace(/(\+.*)/, '').trim()}</span> {/* Strip cost multipliers from label if present */}
                                            <span className="result-card-roadmap-step-value font-mono text-accent-primary opacity-80">{step.value.replace(/(\+€.*)/, 'Included')}</span> {/* Hide costs in roadmap, show Time/Included */}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* e) WHAT'S INCLUDED */}
                    <section className="result-card-scope space-y-2">
                        <h4 className="result-card-eyebrow text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Possible Scope</h4>
                        <ul className="result-card-scope-list grid grid-cols-1 gap-1.5">
                            {whatsIncluded.map((item: string, i: number) => (
                                <li key={i} className="result-card-scope-item flex items-center gap-2 text-xs text-zinc-300">
                                    <CheckCircle2 size={12} className="result-card-scope-item-icon text-accent-primary/50" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* f) CONSIDERATIONS */}
                    <section className="result-card-considerations space-y-1.5">
                        <h4 className="result-card-eyebrow text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Considerations</h4>
                        <p className="result-card-considerations-text text-xs text-zinc-400 leading-relaxed whitespace-pre-line">
                            {considerations}
                        </p>
                    </section>

                    {/* g) DISCLAIMER */}
                    <p className="result-card-disclaimer text-[9px] text-center text-zinc-600 font-mono pt-2 border-t border-white/5 tracking-tight uppercase">
                        AI-powered estimate. Actual scope and pricing will be discussed when we talk.
                    </p>

                    {/* h) CONTACT FIELDS + TWO BUTTONS */}
                    {!hideActions && (
                        <div className="result-card-contact flex flex-col gap-3 pt-2">
                            {!canSendBrief && (contactName.trim() || contactEmail.trim()) && (
                                <p className="result-card-contact-validation text-[10px] text-red-400 font-mono -mt-1 mb-0.5">Name and a valid email are required.</p>
                            )}
                            <div className="result-card-contact-fields grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={contactName}
                                    onChange={(e) => setContactName?.(e.target.value)}
                                    className="result-card-contact-input result-card-contact-input-name w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-accent-primary/50"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail?.(e.target.value)}
                                    className="result-card-contact-input result-card-contact-input-email w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-accent-primary/50"
                                />
                                <input
                                    type="text"
                                    placeholder="Company (optional)"
                                    value={contactCompany}
                                    onChange={(e) => setContactCompany?.(e.target.value)}
                                    className="result-card-contact-input result-card-contact-input-company w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-accent-primary/50"
                                />
                            </div>
                            {sendError && (
                                <p className="result-card-contact-error text-[11px] text-red-400 font-mono">{sendError}</p>
                            )}
                            <div className="result-card-contact-actions flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={onRefine}
                                    disabled={sendStatus === 'sending'}
                                    className="result-card-contact-refine sm:w-[40%] h-10 text-[11px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all disabled:opacity-50"
                                >
                                    Refine Estimate
                                </button>
                                <InstrumentButton
                                    onClick={onStartProject}
                                    disabled={sendStatus === 'sending' || !canSendBrief}
                                    className="result-card-contact-submit sm:w-[60%] h-10 text-xs font-mono uppercase tracking-widest"
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
                        className="result-card-scroll-hint absolute bottom-4 left-1/2 z-30 pointer-events-none flex flex-col items-center gap-1"
                    >
                        <span className="result-card-scroll-hint-label text-[10px] font-mono text-accent-primary uppercase tracking-[0.2em] font-bold">More below</span>
                        <motion.div
                            className="result-card-scroll-hint-icon-wrap"
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <ChevronDown className="result-card-scroll-hint-icon w-5 h-5 text-accent-primary" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
