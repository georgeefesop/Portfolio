'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Rocket, Target, Zap, Shield, AlertCircle, CheckCircle, Clock, Activity, Lock, AlertTriangle, ArrowRight, Lightbulb, Coffee, Receipt, List, ChefHat, CreditCard, LayoutGrid, ChevronLeft, ChevronRight, Check, Plus, Minus } from 'lucide-react';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// --- Types ---

type StepId = 0 | 1 | 2;

interface LayoutProps {
    x: number; // Offset from center X
    y: number; // Offset from center Y
    scale?: number;
    opacity?: number;
    zIndex?: number;
    width?: number; // Optional override
}

// --- Data & Content ---

const stepsInfo = [
    { label: "Idea Board", id: "idea" },
    { label: "Wireframe", id: "wireframe" },
    { label: "Product", id: "product" }
];

const stickyContent = {
    A: {
        friction: { id: "TKT-102", title: "Kitchen Sync Failed", text: "Connection lost • 2m ago", variant: "orange", tag: "Bug", user: "KD" },
        solution: { title: "Real-time Sync", text: "Instant KDS connection", variant: "primary" }
    },
    C: {
        friction: { id: "TKT-129", title: "Inventory Drift", text: "-14 units discrepancy", variant: "default", tag: "Backend", user: "SYS" },
        solution: { title: "Live Inventory", text: "Synced with every sale", variant: "default" }
    },
    D: {
        friction: { id: "TKT-156", title: "Bill Split Error", text: "Can't split custom amount", variant: "orange", tag: "UX", user: "AM" },
        solution: { title: "One-Tap Split", text: "Seat, item, or custom", variant: "default" }
    },
    F: {
        friction: {
            id: "TKT-201",
            title: "Redesign Coffee Shop POS",
            text: "Interface is confusing & slow",
            impact: "Peak-hour queue + errors",
            goal: "< 2 taps per common order",
            constraints: "Touchscreen • gloves • offline mode",
            variant: "red",
            tag: "CRITICAL",
            user: "PM"
        },
        solution: { title: "Intuitive Interface", text: "Zero-training workflow", variant: "default" }
    }
};

const expandedCardsContent = {
    menu: {
        q: "How does ordering work?",
        a: ["Tap to add • Long-press for modifiers", "Favorites row for speed"]
    },
    modifiers: {
        q: "How do modifiers stay fast?",
        a: ["Quick chips: Size, Milk, Extras", "Rule-based defaults per item"]
    },
    payment: {
        q: "How does payment handle complexity?",
        a: ["Split by seat or item", "Card / cash / mixed"]
    }
};

const decisionContent = [
    "One-hand cashier flow",
    "Kitchen updates under 1s",
    "End-of-day totals in 1 tap"
];

// Content for Scene 4 panels
// Menu items with realistic prices
const menuItems = [
    { name: 'Latte', price: 5.50, category: 'Coffee' },
    { name: 'Cappuccino', price: 5.00, category: 'Coffee' },
    { name: 'Americano', price: 4.00, category: 'Coffee' },
    { name: 'Mocha', price: 6.00, category: 'Coffee' },
    { name: 'Espresso', price: 3.50, category: 'Coffee' },
    { name: 'Flat White', price: 5.25, category: 'Coffee' },
    { name: 'Earl Grey', price: 4.50, category: 'Tea' },
    { name: 'Matcha Latte', price: 6.00, category: 'Tea' },
    { name: 'Chai Latte', price: 5.50, category: 'Tea' },
    { name: 'Peppermint', price: 4.00, category: 'Tea' },
    { name: 'English Bfast', price: 4.00, category: 'Tea' },
    { name: 'Bagel', price: 3.50, category: 'Pastry' },
    { name: 'Croissant', price: 4.00, category: 'Pastry' },
    { name: 'Pain au Choc', price: 4.50, category: 'Pastry' },
    { name: 'Danish', price: 4.25, category: 'Pastry' },
    { name: 'Muffin', price: 3.75, category: 'Pastry' }
];

const panelContent = {
    checkout: {
        title: "Checkout",
        sub: "Add items + modifiers fast",
        categories: ["Coffee", "Tea", "Pastry"],
        items: ["Latte", "Cap", "Americano", "Mocha", "Espresso", "Flat W", "Bagel", "Croissant"],
        order: [
            { n: "Latte (L)", p: "€5.50" },
            { n: "Cappuccino", p: "€4.50" }
        ]
    },
    payment: {
        title: "Payment",
        sub: "Split + tip + complete",
        total: "€12.45",
        tips: ["15%", "18%", "20%"]
    },
    kitchen: {
        title: "Kitchen",
        sub: "Tickets + status",
        tickets: [
            { id: "#184", s: "Prep", t: "2m" },
            { id: "#183", s: "Ready", t: "5m" }
        ]
    }
};

// --- Component ---

export default function ProductCanvas({ step, setStep }: { step: StepId, setStep: React.Dispatch<React.SetStateAction<StepId>> }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isSmallMobile, setIsSmallMobile] = useState(false);
    const [isNarrowMobile, setIsNarrowMobile] = useState(false);
    const [isNarrowDesktop, setIsNarrowDesktop] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [introAnim, setIntroAnim] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [orderItems, setOrderItems] = useState<any[]>([
        { name: "Latte", modifiers: "Oat • Lg", price: 5.50, qty: 1 },
        { name: "Croissant", modifiers: "Warmed", price: 4.00, qty: 1 },
        { name: "Avocado Toast", modifiers: "Poached Egg", price: 12.00, qty: 1 }
    ]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showKitchenTicket, setShowKitchenTicket] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [toastItems, setToastItems] = useState<any[]>([]);
    const [menuAnimEnabled, setMenuAnimEnabled] = useState(false);
    const [posDimensions, setPosDimensions] = useState({ width: 900, height: 560 });
    const [posOffset, setPosOffset] = useState({ x: 0, y: 0 });
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const cartContainerRef = useRef<HTMLDivElement>(null);

    // Refs for measuring card heights
    const cardRefA = useRef<HTMLDivElement>(null);
    const cardRefC = useRef<HTMLDivElement>(null);
    const cardRefD = useRef<HTMLDivElement>(null);
    const cardRefF = useRef<HTMLDivElement>(null);
    const [cardHeights, setCardHeights] = useState({ A: 180, C: 180, D: 180, F: 280 });

    // Initial Gate (Mobile and viewport width checks)
    useEffect(() => {
        setMounted(true);
        const checkViewport = () => {
            const width = window.innerWidth;
            const mobile = width < 1024;
            const smallMobile = width < 770;
            const narrowMobile = width < 390;
            const narrowDesktop = width >= 1024 && width < 1300;
            setIsMobile(mobile);
            setIsSmallMobile(smallMobile);
            setIsNarrowMobile(narrowMobile);
            setIsNarrowDesktop(narrowDesktop);
            // State updates only - dimensions handled by useEffect
        };
        checkViewport();
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    // Reset POS dimensions/offset when switching steps
    // Reset/Update POS dimensions when switching steps or resizing
    useEffect(() => {
        if (step !== 2) {
            setPosDimensions(isMobile ? { width: 340, height: 620 } : { width: 900, height: 560 });
            setPosOffset({ x: 0, y: 0 });
        } else {
            // Step 2 Logic
            if (isNarrowMobile) {
                // Narrow Phone (< 390px) - Thinner to fit
                setPosDimensions({ width: 320, height: 420 });
            } else if (isSmallMobile) {
                // Phone (< 770px) - Compact
                setPosDimensions({ width: 340, height: 420 });
            } else if (isMobile) {
                // Tablet (770px - 1024px) - Intermediate Stable
                setPosDimensions({ width: 420, height: 480 });
            } else {
                // Desktop (>= 1024px)
                setPosDimensions({ width: 900, height: 560 });
            }
        }
    }, [step, isMobile, isSmallMobile]);

    const handleResize = (direction: string, delta: { x: number, y: number }) => {
        setPosDimensions(prevDim => {
            let dW = 0;
            let dH = 0;

            if (direction.includes('e')) { dW = delta.x * 2; }
            if (direction.includes('w')) { dW = -delta.x * 2; }
            if (direction.includes('s')) { dH = delta.y * 2; }
            if (direction.includes('n')) { dH = -delta.y * 2; }

            const nextWidth = Math.max(400, prevDim.width + dW);
            const nextHeight = Math.max(400, prevDim.height + dH);

            return { width: nextWidth, height: nextHeight };
        });
    };

    // Scene 1 Animation Logic (Triggered on Step 0 entry)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 0) {
            setIntroAnim(false);
            timer = setTimeout(() => setIntroAnim(true), 2200); // Reduced from 2500ms
        } else {
            setIntroAnim(false);
        }
        return () => clearTimeout(timer);
    }, [step]);

    // Measure card heights on mount and when step changes
    useEffect(() => {
        const measureHeights = () => {
            const heights = {
                A: cardRefA.current?.offsetHeight || 180,
                C: cardRefC.current?.offsetHeight || 180,
                D: cardRefD.current?.offsetHeight || 180,
                F: cardRefF.current?.offsetHeight || 280
            };
            setCardHeights(heights);
        };

        // Measure after a short delay to ensure cards are rendered
        const timer = setTimeout(measureHeights, 100);
        return () => clearTimeout(timer);
    }, [step]);

    // Menu Animation Logic: Cleanup only
    useEffect(() => {
        if (menuAnimEnabled) {
            const timer = setTimeout(() => setMenuAnimEnabled(false), 2000); // 2s window for entrance
            return () => clearTimeout(timer);
        }
    }, [menuAnimEnabled]);

    // Autoplay disabled per user request
    // useEffect(() => {
    //     const TICK_RATE = 100;
    //     const DURATION = 12000;
    //     const INCREMENT = 100 / (DURATION / TICK_RATE);
    //     const timer = setInterval(() => {
    //         if (!isPaused && step < 2) {
    //             setProgress(prev => {
    //                 if (prev >= 100) {
    //                     setStep(s => (s + 1) as StepId);
    //                     return 0;
    //                 }
    //                 return prev + INCREMENT;
    //             });
    //         }
    //     }, TICK_RATE);
    //     return () => clearInterval(timer);
    // }, [isPaused, step]);

    // Reset progress on manual nav
    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (step < 2) {
            const nextStep = (step + 1) as StepId;
            setStep(nextStep);
            setProgress(0);
            // Trigger animation if entering POS
            if (nextStep === 2) setMenuAnimEnabled(true);
        } else {
            // Loop back to start
            setStep(0);
            setProgress(0);
        }
    };

    const handleBack = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (step > 0) {
            setStep(prev => (prev - 1) as StepId);
            setProgress(0);
        }
    };

    // Interactive handlers
    const addToCart = (item: any) => {
        setOrderItems(prev => {
            const exists = prev.find(i => i.name === item.name);
            if (exists) {
                return prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
            }
            // If new item, scroll to bottom (on tablet/mobile)
            if (isMobile) {
                setTimeout(() => {
                    if (cartContainerRef.current) {
                        cartContainerRef.current.scrollTo({
                            top: cartContainerRef.current.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
            return [...prev, { name: item.name, modifiers: "", price: item.price, qty: 1 }];
        });
    };

    const clearCart = () => {
        setOrderItems([]);
    };

    const removeFromCart = (index: number) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    };

    const updateQuantity = (index: number, delta: number) => {
        setOrderItems(prev => prev.map((item, i) => {
            if (i === index) {
                return { ...item, qty: item.qty + delta };
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const calculateTotals = () => {
        const total = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const taxRate = 0.10; // 10% VAT inclusive
        const net = total / (1 + taxRate);
        const tax = total - net;
        return {
            net: net.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        };
    };

    const handleInactiveClick = (feature: string) => {
        setActiveTooltip(feature);
        setTimeout(() => setActiveTooltip(null), 2500);
    };

    const sendToKitchen = () => {
        if (orderItems.length === 0) return;

        setShowConfirmation(true);
        // Snapshot items for toast before clearing
        setToastItems([...orderItems]);

        // Sequence: Brief "Sent" confirmation -> Show Toast -> Clear Cart
        setTimeout(() => {
            setShowConfirmation(false);
            setShowKitchenTicket(true);
            clearCart();
            setTimeout(() => setShowKitchenTicket(false), 4000);
        }, 1000);
    };

    const handleCanvasClick = () => {
        // Click anywhere to advance (except on interactive elements)
        if (step < 2) {
            handleNext();
        } else {
            // Loop back to start
            setStep(0);
            setProgress(0);
        }
    }

    // --- Layout System ---

    const getLayout = (id: string, currentStep: StepId): LayoutProps => {
        // Safe defaults
        let layout: LayoutProps = { x: 0, y: 0, opacity: 0, scale: 0.8, zIndex: 0 };
        const isDesktop = !isMobile;

        // --- SCENE 1: IDEA BOARD (TRELLO / TICKETS) ---
        if (currentStep === 0) {
            // POSITIONING CONSTANTS
            // Cards are positioned from their CENTER due to AnimatedElement transform
            // Header divider line is at y: -220
            // Use measured card heights for accurate positioning
            // Gap between header and first card: 40px (increased for better spacing)
            // Gap between cards: 30px

            const HEADER_Y = -220;
            const GAP_HEADER = 40;  // Gap between header and first card
            const GAP_CARDS = 30;   // Gap between cards

            // Use actual measured heights
            const heightA = cardHeights.A;
            const heightC = cardHeights.C;
            const heightD = cardHeights.D;
            const heightF = cardHeights.F;

            // Position 1 (Top of list) for F
            const POS_1_Y_F = HEADER_Y + GAP_HEADER + (heightF / 2);
            // Position 2 (Second in list) for D
            const POS_2_Y_D = POS_1_Y_F + (heightF / 2) + GAP_CARDS + (heightD / 2);
            // Position 1 (Top of list) for D (when F moves out)
            const POS_1_Y_D = HEADER_Y + GAP_HEADER + (heightD / 2);


            // Trello Headers (Shifted Up slightly) - Dim non-active headers
            if (id === 'col-header-1') layout = { x: -300, y: -220, opacity: introAnim ? 0.3 : 1, scale: 1, zIndex: 5 };
            else if (id === 'col-header-2') layout = { x: 0, y: -220, opacity: 1, scale: 1, zIndex: 5 };
            else if (id === 'col-header-3') layout = { x: 300, y: -220, opacity: introAnim ? 0.3 : 1, scale: 1, zIndex: 5 };
            // Trello Board Layout - 3 Columns
            // Col 1: Backlog (x: -300)
            // Col 2: In Progress (x: 0)
            // Col 3: Blocked (x: 300)

            // A: Kitchen Sync (Hidden on Slide 1)
            else if (id === 'sticky-A') {
                layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
            }
            // D: Split Bill (Backlog - Bottom, moves to Top when F leaves)
            else if (id === 'sticky-D') {
                layout = {
                    x: -300,
                    y: introAnim ? POS_1_Y_D : POS_2_Y_D,
                    opacity: introAnim ? 0.3 : 1,
                    scale: 1,
                    zIndex: 7,
                    width: 260
                };
            }
            // F: Staff Overwhelmed (Backlog Top -> In Progress) - HERO CARD
            else if (id === 'sticky-F') {
                const startX = -300;
                const targetX = 0;
                const startY = POS_1_Y_F;
                const targetY = HEADER_Y + GAP_HEADER + (heightF / 2);

                layout = {
                    x: introAnim ? targetX : startX,
                    y: introAnim ? targetY : startY,
                    opacity: 1,
                    scale: introAnim ? 1.05 : 1,
                    zIndex: 10,
                    width: 260
                };
            }
            // C: Inventory (Review - Column 3)
            else if (id === 'sticky-C') {
                layout = {
                    x: 300,
                    y: POS_1_Y_D,
                    opacity: introAnim ? 0.3 : 1,
                    scale: 1,
                    zIndex: 8,
                    width: 260
                };
            }

            // Hide others
            else if (id === 'sticky-B') {
                layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
            }

            // Remove Sketch
            else if (id === 'sticky-sketch') layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };


            // Mobile S1 (Vertical Stack) - OPTIMIZED
            if (isMobile) {
                // Viewport cropping approach: centered and focused
                if (id === 'sticky-F') {
                    // Main Hero Card (POS redesign)
                    layout = { x: 0, y: 0, opacity: 1, scale: 0.95, zIndex: 10, width: 280 };
                }
                else {
                    // Hide ALL other cards on Slide 1 mobile to prevent load flicker
                    layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
                }
            }
        }

        // --- SCENE 2: WIREFRAME ---
        else if (currentStep === 1) {
            // Show Wireframe at same position as final product
            // Desktop: 30% smaller (0.7 scale)
            // Mobile: keep scale 1 (or adjust for persistent ticket if needed)
            if (id === 'sticky-sketch') {
                layout = {
                    x: 0,
                    y: isMobile ? 56 : 10,
                    opacity: 1,
                    scale: isMobile ? 0.86 : 0.8,
                    zIndex: 20
                };
            }

            // Hero Ticket (Persist from Step 0 - Hidden below 1300px width)
            else if (id === 'sticky-F') {
                if (isMobile || isNarrowDesktop) {
                    // Hide on mobile and narrow desktop (< 1300px)
                    layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
                } else {
                    // Wide Desktop (>= 1300px): Park on LEFT side
                    layout = { x: -520, y: 0, opacity: 0.9, scale: 0.85, zIndex: 25, width: 260 };
                }
            }

            // Hide other elements
            else layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
        }

        // --- SCENE 3: PRODUCT (Final View) ---
        else if (currentStep === 2) {
            // Sketch Fades Out
            if (id === 'sticky-sketch') layout = { x: 0, y: 0, opacity: 0, scale: 0.6, zIndex: 0 };

            // Dashboard Frame (Main POS) - Shifted down to avoid header overlap
            // Use manual offsets if in Step 2
            if (id === 'dashboard-frame') layout = { x: posOffset.x, y: 10 + posOffset.y, opacity: 1, scale: 1, zIndex: 5 };

            // Hide old floating panels (content now integrated into dashboard)
            else if (id === 'panel-order-center') layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
            else if (id === 'panel-checkout') layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
            else if (id === 'panel-payment') layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
            else if (id === 'panel-kitchen') layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };

            // Mobile S3
            if (isMobile) {
                if (id === 'dashboard-frame') layout = { x: 0, y: 20, opacity: 1, scale: 1, zIndex: 5 };
                else if (id === 'panel-order-center') layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
                else if (id === 'panel-checkout') layout = { x: 0, y: 0, opacity: 0, scale: 0, zIndex: 0 };
            }
        }

        return layout;
    };


    return (
        <div
            ref={containerRef}
            onClick={handleCanvasClick}
            className={cn("relative w-full flex items-center justify-center overflow-hidden bg-[#05050A] transition-opacity duration-500 h-full",
                mounted ? "opacity-100" : "opacity-0"
            )}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.10] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />


            {/* --- Navigation Controls --- */}
            <div className={cn(
                "absolute left-0 w-full flex flex-col items-center gap-3 z-50 pointer-events-none transition-all duration-500",
                isSmallMobile ? "bottom-8 pb-safe" : "top-36"
            )}>
                {/* Tap to Continue */}
                <div className={cn(
                    "flex items-center gap-2 text-white text-xs uppercase tracking-widest pointer-events-auto cursor-pointer hover:text-zinc-200 transition-colors",
                    isMobile && "mb-2 scale-90 translate-y-[20px]"
                )} onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                    <ArrowRight size={12} />
                    <span>Tap to continue</span>
                </div>

                {/* Progress & Nav */}
                <div className="flex items-center gap-4 pointer-events-auto">
                    <button
                        onClick={handleBack}
                        disabled={step === 0}
                        className={cn("w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 hover:text-white transition-all", step === 0 ? "opacity-0" : "opacity-100", isMobile && "scale-90")}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <div className={cn("relative h-1.5 bg-zinc-800 rounded-full overflow-hidden group transition-all", isMobile ? "w-[200px]" : "w-[300px]")}>
                        {/* Clickable Overlay Zones */}
                        <div className="absolute inset-0 flex z-20">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className="flex-1 cursor-pointer hover:bg-white/10 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); setStep(i as StepId); setProgress(0); }}
                                    title={stepsInfo[i].label}
                                />
                            ))}
                        </div>

                        {/* Indicators */}
                        {[1, 2].map(i => (
                            <div key={i} className="absolute top-0 bottom-0 w-[1px] bg-black/40 z-10" style={{ left: `${i * 33.33}%` }} />
                        ))}

                        {/* Progress bar - static, accent color */}
                        <div
                            className="absolute top-0 bottom-0 left-0 bg-accent-primary transition-all duration-300"
                            style={{ width: `${(step + 1) * 33.33}%` }}
                        />
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={step === 2}
                        className={cn("w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 hover:text-white transition-all", step === 2 ? "opacity-0" : "opacity-100")}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* SCENE CONTENT - removed old tap to continue */}
            <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center perspective-1000">

                {/* SCENE 1: STICKIES */}
                {/* Helper for content selection */}
                {(() => {
                    const mode = step === 0 ? 'friction' : 'solution';
                    const cA = stickyContent.A[mode];
                    const cC = stickyContent.C[mode];
                    const cD = stickyContent.D[mode];
                    const cF = stickyContent.F[mode];

                    return (
                        <>
                            {/* Column Headers */}
                            <AnimatedElement layout={getLayout('col-header-1', step)}>
                                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest w-[260px] text-center pb-2 border-b-2 border-zinc-800">Backlog</div>
                            </AnimatedElement>
                            <AnimatedElement layout={getLayout('col-header-2', step)}>
                                <div className="text-xs font-bold text-accent-primary uppercase tracking-widest w-[260px] text-center pb-2 border-b-[3px] border-accent-primary/40">In Progress</div>
                            </AnimatedElement>
                            <AnimatedElement layout={getLayout('col-header-3', step)}>
                                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest w-[260px] text-center pb-2 border-b-2 border-zinc-800">Review</div>
                            </AnimatedElement>

                            <AnimatedElement layout={getLayout('sticky-A', step)}>
                                <div ref={cardRefA}>
                                    {step === 0 ? <TicketUI data={cA} dimmed={introAnim} compact={false} /> : <StickyUI title={cA.title} text={cA.text} variant={cA.variant as any} />}
                                </div>
                            </AnimatedElement>
                            <AnimatedElement layout={getLayout('sticky-C', step)}>
                                <div ref={cardRefC}>
                                    {step === 0 ? <TicketUI data={cC} dimmed={introAnim} compact={false} /> : <StickyUI title={cC.title} text={cC.text} variant={cC.variant as any} />}
                                </div>
                            </AnimatedElement>
                            <AnimatedElement layout={getLayout('sticky-D', step)}>
                                <div ref={cardRefD}>
                                    {step === 0 ? <TicketUI data={cD} dimmed={introAnim} compact={false} /> : <StickyUI title={cD.title} text={cD.text} variant={cD.variant as any} />}
                                </div>
                            </AnimatedElement>
                            <AnimatedElement layout={getLayout('sticky-F', step)}>
                                <div ref={cardRefF}>
                                    {step === 0 || step === 1 ? (
                                        <TicketUI data={step === 0 ? cF : stickyContent.F.friction} dimmed={false} showAssigned={step === 0 && introAnim} compact={false} />
                                    ) : (
                                        <StickyUI title={cF.title} text={cF.text} variant={cF.variant as any} />
                                    )}
                                </div>
                            </AnimatedElement>
                        </>
                    );
                })()}

                {/* SCENE 2: DETAILED WIREFRAME (Blueprint for Final POS) */}
                <AnimatedElement layout={getLayout('sticky-sketch', step)}>
                    <div className="relative group">
                        {/* Annotations (Visible only in Step 1) */}
                        <AnimatePresence>
                            {step === 1 && (
                                <>
                                    {/* Annotation 1: Quick Categories (Top Left) */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: 2.2, type: "spring" }}
                                        className="absolute top-[35px] left-4 md:-left-28 z-50 pointer-events-none"
                                        style={{ fontFamily: 'var(--font-caveat)' }}
                                    >
                                        <div className="text-xl md:text-2xl text-accent-primary font-bold whitespace-nowrap drop-shadow-lg relative">
                                            Quick Categories
                                        </div>
                                    </motion.div>

                                    {/* Annotation 2: Menu Tile Grid (Left Middle) */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: 2.4, type: "spring" }}
                                        className="absolute top-[125px] left-4 md:-left-28 z-50 pointer-events-none"
                                        style={{ fontFamily: 'var(--font-caveat)' }}
                                    >
                                        <div className="text-xl md:text-2xl text-accent-primary font-bold whitespace-nowrap drop-shadow-lg relative">
                                            Menu Tile Grid
                                        </div>
                                    </motion.div>

                                    {/* Annotation 3: Live Order Panel (Right Top) */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: 2.6, type: "spring" }}
                                        className="absolute top-32 md:top-32 right-4 md:-right-28 z-50 pointer-events-none"
                                        style={{ fontFamily: 'var(--font-caveat)' }}
                                    >
                                        <div className="text-xl md:text-2xl text-accent-primary font-bold whitespace-nowrap drop-shadow-lg relative text-right">
                                            Live Order Panel
                                        </div>
                                    </motion.div>

                                    {/* Annotation 4: One-Tap Actions (Right Bottom) */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: 2.8, type: "spring" }}
                                        className="absolute bottom-[230px] md:bottom-[134px] right-4 md:-right-[170px] z-50 pointer-events-none"
                                        style={{ fontFamily: 'var(--font-caveat)' }}
                                    >
                                        <div className="text-xl md:text-2xl text-accent-primary font-bold whitespace-nowrap drop-shadow-lg relative text-right">
                                            One-Tap Actions
                                        </div>
                                    </motion.div>

                                    {/* Annotation 5: Connection Status (Top Right) */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: 3.0, type: "spring" }}
                                        className="absolute top-[-30px] md:-top-16 right-4 md:right-0 z-50 pointer-events-none"
                                        style={{ fontFamily: 'var(--font-caveat)' }}
                                    >
                                        <div className="text-xl md:text-2xl text-accent-primary font-bold whitespace-nowrap drop-shadow-lg relative text-right md:text-center">
                                            Connection Status
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial="hidden"
                            animate={step === 1 ? "show" : "hidden"}
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                                }
                            }}
                            className={cn(
                                "bg-zinc-900/20 backdrop-blur-sm border-2 border-dashed border-zinc-400/60 rounded-xl p-0 flex flex-col overflow-hidden transition-all duration-500",
                                isMobile ? "w-[340px] h-[480px]" : "w-[900px] h-[560px]"
                            )}
                        >
                            {/* Top Bar Wireframe */}
                            <motion.div variants={{ hidden: { opacity: 0, y: -10, scale: 0.95 }, show: { opacity: 1, y: 0, scale: [0.95, 1.02, 1] } }} className={cn("h-12 border-b-2 border-dashed border-zinc-500/50 flex items-center justify-between", isMobile ? "px-3" : "px-4")}>
                                <div className={cn("border border-zinc-400/60 rounded bg-zinc-700/20", isMobile ? "w-12 h-3" : "w-24 h-4")} />
                                <div className={cn("flex", isMobile ? "gap-1.5" : "gap-3")}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={cn("border border-zinc-500/50 rounded", i === 1 && "bg-zinc-600/30", isMobile ? "w-10 h-5" : "w-16 h-6")} />
                                    ))}
                                </div>
                                <div className={cn("border border-zinc-400/60 rounded bg-zinc-700/20", isMobile ? "w-8 h-3" : "w-16 h-4")} />
                            </motion.div>

                            {/* Main Layout - Responsive */}
                            <div className={cn("flex-1 flex", isMobile ? "flex-col" : "flex-row")}>
                                {/* LEFT: Menu Section */}
                                <div className={cn("flex flex-col border-dashed border-zinc-500/50", isMobile ? "flex-[60] border-b-2" : "flex-[65] border-r-2")}>
                                    {/* Search + Tabs */}
                                    <motion.div variants={{ hidden: { opacity: 0, x: -10, scale: 0.95 }, show: { opacity: 1, x: 0, scale: [0.95, 1.02, 1] } }} className="p-4 border-b-2 border-dashed border-zinc-500/50 space-y-3">
                                        {/* Search Bar */}
                                        <div className="h-9 border border-zinc-400/60 rounded-lg flex items-center px-3 gap-2 bg-zinc-800/20">
                                            <Search size={12} className="text-zinc-400" />
                                            <div className="flex-1 h-2 bg-zinc-600/30 rounded" />
                                        </div>
                                        {/* Category Tabs */}
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={cn("px-4 py-1.5 border border-zinc-500/50 rounded-full", i === 1 && "bg-accent-primary/20 border-accent-primary/60")} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Menu Grid */}
                                    <div className="flex-1 p-4 overflow-hidden">
                                        <div className={cn("grid gap-3 h-full content-start", isNarrowMobile ? "grid-cols-2" : (isMobile ? "grid-cols-3" : "grid-cols-4"))}>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].slice(0, isMobile ? 6 : 8).map(i => (
                                                <motion.div
                                                    key={i}
                                                    variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: [0.8, 1.05, 1] } }}
                                                    className="aspect-square border-2 border-dashed border-zinc-500/50 rounded-lg flex flex-col overflow-hidden"
                                                >
                                                    {/* Image Area */}
                                                    <div className="flex-[7] bg-zinc-700/20 flex items-center justify-center border-b border-dashed border-zinc-500/30">
                                                        <Coffee size={20} className="text-zinc-500" />
                                                    </div>
                                                    {/* Info Area */}
                                                    <div className="flex-[3] p-2 space-y-1 bg-zinc-800/10">
                                                        <div className="h-2 w-3/4 bg-zinc-600/30 rounded" />
                                                        <div className="h-1.5 w-1/2 bg-accent-primary/30 rounded" />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Cart Section */}
                                <div className={cn("flex flex-col", isMobile ? "flex-[40]" : "flex-[35]")}>
                                    {/* Ticket Header */}
                                    {!isMobile && (
                                        <motion.div variants={{ hidden: { opacity: 0, x: 10, scale: 0.95 }, show: { opacity: 1, x: 0, scale: [0.95, 1.02, 1] } }} className="p-3 border-b-2 border-dashed border-zinc-500/50 bg-zinc-700/20 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className="h-3 w-20 bg-zinc-600/40 rounded" />
                                                <div className="h-5 w-16 border border-zinc-500/60 rounded" />
                                            </div>
                                            <div className="h-2 w-full bg-zinc-600/30 rounded" />
                                        </motion.div>
                                    )}

                                    {/* Order Items */}
                                    <div className="flex-1 p-3 space-y-2 overflow-hidden">
                                        {[1, 2, 3].slice(0, isMobile ? 2 : 3).map(i => (
                                            <motion.div
                                                key={i}
                                                variants={{ hidden: { opacity: 0, x: 20, scale: 0.9 }, show: { opacity: 1, x: 0, scale: [0.9, 1.05, 1] } }}
                                                className="flex items-start gap-2 p-2 border border-dashed border-zinc-500/40 rounded"
                                            >
                                                <div className="w-6 h-6 border border-zinc-500/60 rounded flex-shrink-0 bg-zinc-700/20" />
                                                <div className="flex-1 space-y-1">
                                                    <div className="h-2.5 w-3/4 bg-zinc-600/30 rounded" />
                                                    <div className="h-2 w-1/2 bg-zinc-600/20 rounded" />
                                                </div>
                                                <div className="h-2.5 w-12 bg-zinc-600/30 rounded flex-shrink-0" />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Quick Actions (Mobile Compact) */}
                                    {isMobile && (
                                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="px-3 border-t-2 border-dashed border-zinc-500/50 bg-zinc-700/15 py-1">
                                            <div className="flex justify-between">
                                                <div className="h-4 w-16 bg-zinc-700/30 rounded" />
                                                <div className="h-4 w-12 bg-zinc-700/30 rounded" />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Desktop Quick Actions */}
                                    {!isMobile && (
                                        <motion.div variants={{ hidden: { opacity: 0, y: 10, scale: 0.95 }, show: { opacity: 1, y: 0, scale: [0.95, 1.05, 1] } }} className="px-3 py-2 border-t-2 border-dashed border-zinc-500/50 bg-zinc-700/15">
                                            <div className="grid grid-cols-4 gap-1.5">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="h-6 border border-zinc-500/50 rounded" />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Total + Actions */}
                                    <motion.div variants={{ hidden: { opacity: 0, y: 10, scale: 0.95 }, show: { opacity: 1, y: 0, scale: [0.95, 1.05, 1] } }} className="p-3 border-t-2 border-dashed border-zinc-500/50 space-y-3 bg-zinc-800/20">
                                        <div className="flex justify-between items-center">
                                            <div className="h-3 w-12 bg-zinc-700/20 rounded" />
                                            <div className="h-6 w-20 bg-zinc-700/30 rounded" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 h-9 border border-zinc-500/60 rounded" />
                                            <div className="flex-[3] h-9 bg-accent-primary/30 border border-accent-primary/60 rounded" />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Bottom Status Bar */}
                            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }} className="h-6 border-t-2 border-dashed border-zinc-500/50 flex items-center justify-between px-4 bg-zinc-700/20">
                                <div className="h-2 w-32 bg-zinc-600/30 rounded" />
                                <div className="h-2 w-16 bg-zinc-600/30 rounded" />
                            </motion.div>


                        </motion.div>
                    </div>
                </AnimatedElement>



                {/* SCENE 3: STRUCTURE */}
                {/* SCENE 3: UNIFIED POS DASHBOARD */}
                <AnimatedElement
                    layout={getLayout('dashboard-frame', step)}
                >
                    {(() => {
                        const isEffectiveMobile = isMobile || posDimensions.width < 600;
                        return (
                            <motion.div
                                initial="hidden"
                                animate={step === 2 ? "show" : "hidden"}
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                                    }
                                }}
                                className={cn(
                                    "bg-gradient-to-br from-zinc-950 to-black border-2 border-white/15 rounded-xl shadow-2xl overflow-visible flex flex-col relative",
                                    !isResizing && "transition-all duration-500",
                                    step !== 2 && "pointer-events-none"
                                )}
                                style={{
                                    width: step === 2 ? posDimensions.width : (isMobile ? 340 : 900),
                                    height: step === 2 ? posDimensions.height : (isMobile ? 400 : 560),
                                    maxHeight: isMobile ? 'calc(100dvh - 320px)' : 'none',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Resize Handles */}
                                {step === 2 && !isMobile && (
                                    <>
                                        <ResizeHandle direction="n" onResize={(d) => handleResize('n', d)} onResizeStart={() => setIsResizing(true)} onResizeEnd={() => setIsResizing(false)} />
                                        <ResizeHandle direction="s" onResize={(d) => handleResize('s', d)} onResizeStart={() => setIsResizing(true)} onResizeEnd={() => setIsResizing(false)} />
                                        <ResizeHandle direction="e" onResize={(d) => handleResize('e', d)} onResizeStart={() => setIsResizing(true)} onResizeEnd={() => setIsResizing(false)} />
                                        <ResizeHandle direction="w" onResize={(d) => handleResize('w', d)} onResizeStart={() => setIsResizing(true)} onResizeEnd={() => setIsResizing(false)} />
                                        <ResizeHandle direction="ne" onResize={(d) => handleResize('ne', d)} onResizeStart={() => setIsResizing(true)} onResizeEnd={() => setIsResizing(false)} />
                                        <ResizeHandle direction="nw" onResize={(d) => handleResize('nw', d)} onResizeStart={() => setIsResizing(true)} onResizeEnd={() => setIsResizing(false)} />
                                        <ResizeHandle direction="se" onResize={(d) => handleResize('se', d)} onResizeStart={() => setIsResizing(true)} onResizeEnd={() => setIsResizing(false)} />
                                        <ResizeHandle direction="sw" onResize={(d) => handleResize('sw', d)} onResizeStart={() => setIsResizing(true)} onResizeEnd={() => setIsResizing(false)} />
                                    </>
                                )}
                                {/* Top Bar */}
                                <motion.div variants={{ hidden: { opacity: 0, y: -10 }, show: { opacity: 1, y: 0 } }} className={cn("bg-zinc-900 border-b border-zinc-700 flex items-center justify-between px-4 rounded-t-[10px]", isEffectiveMobile ? "h-8" : "h-12")}>
                                    <div className="flex items-center gap-2">
                                        {!isEffectiveMobile && <span className="font-bold text-zinc-100 tracking-tight text-sm">Aster Café</span>}
                                        <span className={cn("font-mono font-bold text-accent-primary bg-accent-primary/10 px-1.5 py-0.5 rounded border border-accent-primary/20", isEffectiveMobile ? "text-[9px]" : "text-[10px]")}>MVP PROTOTYPE</span>
                                    </div>
                                    <div className={cn("flex gap-4 font-medium", isEffectiveMobile ? "text-[10px]" : "text-xs")}>
                                        <span className={cn("text-white transition-colors", isEffectiveMobile ? "py-1.5" : "px-3 py-1.5 bg-zinc-800 rounded-md shadow-sm border border-zinc-600")}>Checkout</span>
                                        <button onClick={() => handleInactiveClick('Orders')} className="text-zinc-500 py-1.5 hover:text-zinc-300 cursor-pointer transition-colors relative">
                                            Orders
                                            {activeTooltip === 'Orders' && <Tooltip text="Not in scope for MVP" />}
                                        </button>
                                        <button onClick={() => handleInactiveClick('Reports')} className="text-zinc-500 py-1.5 hover:text-zinc-300 cursor-pointer transition-colors relative">
                                            Reports
                                            {activeTooltip === 'Reports' && <Tooltip text="Not in scope for MVP" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                        <span className={cn("text-zinc-400 uppercase tracking-wider font-medium", isEffectiveMobile ? "text-[8px]" : "text-[10px]")}>Online</span>
                                    </div>
                                </motion.div>

                                {/* Main Content: 2-Column Layout (Desktop) / Stacked (Mobile) */}
                                <div className={cn("flex-1 flex min-h-0", isEffectiveMobile ? "flex-col" : "flex-row")}>
                                    {/* LEFT: Menu Grid */}
                                    <div className={cn("flex flex-col min-h-0", isEffectiveMobile ? "flex-[60] border-b border-zinc-700 bg-zinc-800/40" : "flex-[65] border-r border-zinc-700 bg-zinc-900/50")}>
                                        {/* Search + Categories */}
                                        {/* Search + Categories */}
                                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} className={cn("space-y-3 flex flex-col justify-center", isEffectiveMobile ? "p-1" : "p-4 border-b border-zinc-800")}>
                                            {/* Search Bar */}
                                            {!isEffectiveMobile && (
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder="Search menu..."
                                                        className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
                                                    />
                                                </div>
                                            )}
                                            {/* Category Tabs */}
                                            <div className={cn("flex gap-2 overflow-x-auto pb-1 scrollbar-hide", isEffectiveMobile && "pt-1")}>
                                                {['All', 'Coffee', 'Tea', 'Pastry'].map((cat, i) => (
                                                    <button
                                                        key={cat}
                                                        className={cn(
                                                            "rounded-full font-medium whitespace-nowrap cursor-pointer border",
                                                            isEffectiveMobile ? "px-3 py-1 text-[10px]" : "px-4 py-1.5 text-xs",
                                                            selectedCategory === cat
                                                                ? "bg-accent-primary text-black shadow-sm border-accent-primary"
                                                                : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600 border-zinc-500"
                                                        )}
                                                        onClick={() => setSelectedCategory(cat)}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Menu Grid */}
                                        <motion.div
                                            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.3 } } }}
                                            className={cn("flex-1 overflow-y-auto scrollbar-custom", isEffectiveMobile ? "p-2" : "p-4")}
                                        >
                                            <div className={cn("grid", isNarrowMobile ? "grid-cols-2 gap-2" : (isEffectiveMobile ? "grid-cols-3 gap-2" : "grid-cols-3 xl:grid-cols-4 gap-4"))}>
                                                {menuItems
                                                    .filter(item => (selectedCategory === 'All' || item.category === selectedCategory) && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    .map((item, i) => (
                                                        <motion.div
                                                            key={item.name}
                                                            variants={menuAnimEnabled
                                                                ? { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
                                                                : { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
                                                            }
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => addToCart(item)}
                                                            className="bg-zinc-800 border border-zinc-700/50 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-500/50 hover:bg-zinc-700 transition-colors group"
                                                        >
                                                            <div className={cn("bg-zinc-900 relative overflow-hidden", isEffectiveMobile ? "aspect-video" : "aspect-[4/3]")}>
                                                                {/* Category Image */}
                                                                <motion.img
                                                                    initial={{ scale: 1.05 }}
                                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                                    src={
                                                                        (item.name.includes('Americano')) ? '/menu/americano.png' :
                                                                            (item.name.includes('Espresso')) ? '/menu/espresso.png' :
                                                                                (item.name.includes('Cappuccino')) ? '/menu/cappuccino.png' :
                                                                                    (item.name.includes('Flat White')) ? '/menu/flat_white.png' :
                                                                                        (item.name.includes('Pain')) ? '/menu/pain_au_chocolat.png' :
                                                                                            (item.name.includes('Mocha') || item.name.includes('Choc')) ? '/menu/mocha.png' :
                                                                                                (item.name.includes('Bagel')) ? '/menu/bagel.png' :
                                                                                                    (item.name.includes('Muffin')) ? '/menu/muffin.png' :
                                                                                                        (item.name.includes('Danish')) ? '/menu/danish.png' :
                                                                                                            (item.name.includes('Chai')) ? '/menu/chai_latte.png' :
                                                                                                                (item.name.includes('Pepper')) ? '/menu/peppermint_tea.png' :
                                                                                                                    (item.name.includes('Bfast')) ? '/menu/english_breakfast.png' :
                                                                                                                        (item.name.includes('Tea') || item.name.includes('Grey')) ? '/menu/black_tea.png' :
                                                                                                                            item.category === 'Coffee' ? '/menu/coffee.png' :
                                                                                                                                item.category === 'Tea' ? '/menu/tea.png' :
                                                                                                                                    '/menu/pastry.png'
                                                                    }
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover opacity-100 group-hover:scale-105 will-change-transform transition-transform duration-500"
                                                                />

                                                                {/* Price Tag Overlay */}
                                                                <div className="absolute top-1 right-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/10 shadow-lg">
                                                                    €{item.price.toFixed(2)}
                                                                </div>

                                                                {/* Hover Overlay Gradient */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                                            </div>
                                                            <div className={cn("relative", isEffectiveMobile ? "p-2" : "p-3")}>
                                                                <h3 className={cn("font-medium tracking-wide text-zinc-100 leading-tight", isEffectiveMobile ? "text-xs" : "text-sm")}>{item.name}</h3>
                                                                <p className={cn("text-zinc-400 mt-0.5", isEffectiveMobile ? "text-[10px]" : "text-[11px]")}>{item.category}</p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* RIGHT: Cart & Actions */}
                                    <div className={cn("flex flex-col bg-zinc-900 border-l border-zinc-800 min-h-0", isEffectiveMobile ? "flex-[40]" : "flex-[35]")}>
                                        {/* Cart Header */}
                                        {!isEffectiveMobile && (
                                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Receipt size={16} className="text-accent-primary" />
                                                    <span className="font-semibold text-zinc-200 text-sm">Order</span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); clearCart(); }}
                                                    className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800 px-2 py-1 rounded cursor-pointer"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        )}

                                        {/* Order Items List */}
                                        <div ref={cartContainerRef} className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-custom relative">
                                            {isEffectiveMobile && orderItems.length === 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                                                    <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-tight leading-relaxed">
                                                        Tap menu items<br />to add to order
                                                    </span>
                                                </div>
                                            )}
                                            <AnimatePresence>
                                                {orderItems.map((item, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                                        exit={{ opacity: 0, height: 0, scale: 0.9 }}
                                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                                        className={cn("flex items-start rounded-lg hover:bg-zinc-800/50 group", isEffectiveMobile ? "gap-2 p-1" : "gap-3 p-2")}
                                                    >
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(i, -1); }} className="w-6 h-6 flex items-center justify-center bg-zinc-700 text-zinc-300 hover:text-white rounded border border-zinc-600 cursor-pointer">-</button>
                                                            <div className="w-6 h-6 flex items-center justify-center bg-black/40 rounded text-xs font-medium text-zinc-200 border border-white/5">
                                                                {item.qty}
                                                            </div>
                                                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(i, 1); }} className="w-6 h-6 flex items-center justify-center bg-zinc-700 text-zinc-300 hover:text-white rounded border border-zinc-600 cursor-pointer">+</button>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between">
                                                                <span className={cn("text-zinc-200 truncate font-medium pr-2", isEffectiveMobile ? "text-xs" : "text-sm")}>{item.name}</span>
                                                                <span className={cn("text-zinc-300", isEffectiveMobile ? "text-xs" : "text-sm")}>€{(item.price * item.qty).toFixed(2)}</span>
                                                            </div>
                                                            {item.modifiers && <div className={cn("text-zinc-500", isEffectiveMobile ? "text-[9px]" : "text-[10px] truncate")}>{item.modifiers}</div>}
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeFromCart(i); }}
                                                            className={cn("p-1 hover:text-red-400 text-zinc-600 transition-opacity", isEffectiveMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100")}
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>

                                        {/* Quick Actions */}
                                        {!isEffectiveMobile && (
                                            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="px-3 py-2 border-t border-zinc-800 bg-zinc-800/20">
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {['Discount', 'Loyalty', 'Split', 'Print'].map(action => (
                                                        <button
                                                            key={action}
                                                            onClick={() => handleInactiveClick(action)}
                                                            className="px-2 py-1.5 bg-zinc-800 border border-zinc-700 text-[9px] text-zinc-400 rounded hover:bg-zinc-700 transition-colors cursor-pointer relative"
                                                        >
                                                            {action}
                                                            {activeTooltip === action && <Tooltip text="Not in scope for MVP" position="top" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Total + Actions */}
                                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className={cn("border-t border-zinc-800 bg-zinc-900", isEffectiveMobile ? "p-1.5" : "p-3")}>
                                            {!isEffectiveMobile && (
                                                <div className="flex flex-col gap-1 mb-3">
                                                    <div className="flex justify-between items-center text-xs text-zinc-500">
                                                        <span>Subtotal</span>
                                                        <span>€{calculateTotals().net}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs text-zinc-500">
                                                        <span>VAT (10%)</span>
                                                        <span>€{calculateTotals().tax}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1 pt-2 border-t border-zinc-800">
                                                        <span className="font-medium text-zinc-400 text-sm">Total</span>
                                                        <span className="font-bold font-mono text-white text-xl">€{calculateTotals().total}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex gap-2 items-center">
                                                {isEffectiveMobile ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); clearCart(); }}
                                                        className="px-3 py-2 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded transition-colors border border-zinc-700 cursor-pointer"
                                                    >
                                                        Clear
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleInactiveClick('Hold'); }}
                                                        className="flex-1 py-2.5 text-xs bg-zinc-600 hover:bg-zinc-500 text-zinc-200 font-medium rounded transition-colors border border-zinc-500 cursor-pointer relative"
                                                    >
                                                        Hold
                                                        {activeTooltip === 'Hold' && <Tooltip text="Not in scope for MVP" position="top" />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); sendToKitchen(); }}
                                                    className={cn("bg-accent-primary hover:bg-accent-primary/90 text-black font-bold rounded transition-all shadow-lg relative overflow-hidden cursor-pointer", isEffectiveMobile ? "flex-1 py-2 text-xs" : "flex-[3] py-2.5 text-sm")}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {showConfirmation ? (
                                                            <motion.div
                                                                key="sent"
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="flex items-center justify-center gap-2"
                                                            >
                                                                <CheckCircle size={18} />
                                                                <span>Sent!</span>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.span
                                                                key="idle"
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                            >
                                                                Send to Kitchen
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </button>
                                                {isEffectiveMobile && (
                                                    <div className="flex flex-col items-end min-w-[50px] leading-tight">
                                                        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">Total</span>

                                                        <span className="text-sm font-bold font-mono text-white">€{calculateTotals().total}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Kitchen Ticket Toast Overlay */}
                                <AnimatePresence>
                                    {showKitchenTicket && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-72 bg-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg border border-zinc-800 overflow-hidden"
                                        >
                                            <div className="bg-zinc-800 px-3 py-2.5 border-b border-zinc-700/50 flex justify-between items-center text-zinc-400">
                                                <div className="flex items-center gap-2">
                                                    <Receipt size={12} className="text-accent-primary" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Kitchen Ticket</span>
                                                </div>
                                                <span className="text-[10px] font-mono font-bold text-zinc-500">#184-A</span>
                                            </div>
                                            <div className="p-4 bg-zinc-900/50 space-y-3">
                                                <div className="space-y-2">
                                                    {toastItems.map((item, i) => (
                                                        <div key={i} className="flex justify-between items-center text-[11px]">
                                                            <div className="flex gap-3">
                                                                <span className="font-bold text-accent-primary">{item.qty}x</span>
                                                                <span className="text-zinc-300 font-medium">{item.name}</span>
                                                            </div>
                                                            <span className="text-zinc-500 font-mono">€{(item.price * item.qty).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-3 border-t border-dashed border-zinc-800 flex justify-center text-center">
                                                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">Order Route: Main Kitchen</span>
                                                </div>
                                            </div>
                                            {/* Small timer bar at bottom */}
                                            <motion.div
                                                initial={{ scaleX: 1 }}
                                                animate={{ scaleX: 0 }}
                                                transition={{ duration: 4, ease: "linear" }}
                                                className="h-1 bg-accent-primary w-full origin-left"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Bottom Status Bar */}
                                <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={cn("bg-zinc-950 border-t border-zinc-800 flex items-center justify-between px-4 rounded-b-[10px]", isEffectiveMobile ? "h-[14px]" : "h-6")}>
                                    <div className="flex items-center gap-3 text-[9px] text-zinc-600">
                                        <span className="flex items-center gap-1">
                                            <span className="w-1 h-1 bg-green-500 rounded-full" />
                                            Online
                                        </span>
                                        <span>•</span>
                                        <span>Terminal 01</span>
                                        <span>•</span>
                                        <span>v2.4.1</span>
                                    </div>
                                    <div className="text-[9px] text-zinc-600">
                                        10:42 AM
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })()}
                </AnimatedElement>

                <AnimatedElement layout={getLayout('panel-checkout', step)}>
                    <PanelCheckoutUI data={panelContent.checkout} isProduct={step === 1} />
                </AnimatedElement>

                <AnimatedElement layout={getLayout('panel-order-center', step)}>
                    <div className="w-[260px] h-[500px] bg-zinc-900 border border-zinc-700/50 rounded-lg flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-3 bg-zinc-800/30 border-b border-zinc-800/50 flex justify-between items-center">
                            <span className="text-xs font-mono text-zinc-400">Order #184</span>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Dine-in</span>
                                <span className="text-[10px] text-zinc-500">Tbl 3</span>
                            </div>
                        </div>
                        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                            {[
                                { n: "Latte", m: "Oat • Lg", p: "5.50", q: 1 },
                                { n: "Croissant", m: "Warmed", p: "4.00", q: 1 },
                                { n: "Avocado Tst", m: "Poached Egg", p: "12.00", q: 1 }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between text-xs group">
                                    <div className="flex gap-2">
                                        <div className="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center text-[10px] text-zinc-500 border border-zinc-700/50">{item.q}</div>
                                        <div>
                                            <div className="text-zinc-200 font-medium">{item.n}</div>
                                            <div className="text-[10px] text-zinc-500">{item.m}</div>
                                        </div>
                                    </div>
                                    <div className="text-zinc-300">€{item.p}</div>
                                </div>
                            ))}
                            {/* Empty state lines */}
                            <div className="border-t border-dashed border-zinc-800 pt-2">
                                <div className="text-[10px] text-zinc-600 italic">Tap to add item...</div>
                            </div>
                        </div>

                        {/* Modifier Chips */}
                        <div className="px-3 py-2 border-t border-zinc-800/50 bg-zinc-800/20 flex gap-2 flex-wrap">
                            {["Sm", "Md", "Lg"].map(s => <span key={s} className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-[9px] text-zinc-400 rounded-full">{s}</span>)}
                            <div className="w-px h-4 bg-zinc-700" />
                            {["Oat", "Soy", "Alm"].map(s => <span key={s} className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-[9px] text-zinc-400 rounded-full">{s}</span>)}
                        </div>

                        <div className="p-3 border-t border-zinc-800 bg-zinc-900 space-y-2">
                            <div className="flex justify-between text-sm font-bold text-white mb-2">
                                <span>Total</span>
                                <span>€21.50</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[10px] font-bold rounded transition-colors cursor-default border border-zinc-600">Hold</button>
                                <button className="flex-[3] py-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold text-xs rounded transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer">Send to Kitchen</button>
                            </div>
                        </div>
                    </div>
                </AnimatedElement>

                <AnimatedElement layout={getLayout('panel-payment', step)}>
                    <PanelPaymentUI data={panelContent.payment} isProduct={step === 1} />
                </AnimatedElement>
                <AnimatedElement layout={getLayout('panel-kitchen', step)}>
                    <PanelKitchenUI data={panelContent.kitchen} isProduct={step === 1} />
                </AnimatedElement>

            </div>
        </div>
    );
}

// --- Interaction Helpers ---

function ResizeHandle({ direction, onResize, onResizeStart, onResizeEnd }: {
    direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw',
    onResize: (delta: { x: number, y: number }) => void,
    onResizeStart: () => void,
    onResizeEnd: () => void
}) {
    const getClassName = () => {
        const base = "absolute z-[100] transition-colors hover:bg-accent-primary/20 ";
        switch (direction) {
            case 'n': return base + "top-0 left-0 right-0 h-1.5 cursor-ns-resize";
            case 's': return base + "bottom-0 left-0 right-0 h-1.5 cursor-ns-resize";
            case 'e': return base + "top-0 bottom-0 right-0 w-1.5 cursor-ew-resize";
            case 'w': return base + "top-0 bottom-0 left-0 w-1.5 cursor-ew-resize";
            case 'ne': return base + "top-0 right-0 w-3 h-3 cursor-nesw-resize";
            case 'nw': return base + "top-0 left-0 w-3 h-3 cursor-nwse-resize";
            case 'se': return base + "bottom-0 right-0 w-3 h-3 cursor-nwse-resize";
            case 'sw': return base + "bottom-0 left-0 w-3 h-3 cursor-nesw-resize";
        }
    };

    return (
        <motion.div
            className={getClassName()}
            drag
            dragMomentum={false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onPointerDown={(e) => e.stopPropagation()}
            onDragStart={onResizeStart}
            onDragEnd={onResizeEnd}
            onDrag={(e, info) => onResize(info.delta)}
        />
    );
}


// --- UI Components ---

function AnimatedElement({
    layout,
    children,
    className,
    drag,
    onDrag,
    onDragStart,
    onDragEnd,
    dragMomentum,
    dragConstraints
}: {
    layout: LayoutProps,
    children: React.ReactNode,
    className?: string,
    drag?: boolean | "x" | "y",
    onDrag?: (e: any, info: any) => void,
    onDragStart?: (e: any, info: any) => void,
    onDragEnd?: (e: any, info: any) => void,
    dragMomentum?: boolean,
    dragConstraints?: any
}) {
    return (
        <motion.div
            className={cn("absolute top-1/2 left-1/2 will-change-transform", className)}
            initial={false}
            animate={{
                x: layout.x,
                y: layout.y,
                opacity: layout.opacity,
                scale: layout.scale,
                zIndex: layout.zIndex
            }}
            drag={drag}
            onDrag={onDrag}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            dragMomentum={dragMomentum}
            dragConstraints={dragConstraints}
            transition={{
                type: "spring",
                stiffness: 90,
                damping: 20,
                mass: 1
            }}
            style={{
                translateX: "-50%",
                translateY: "-50%"
            }}
        >
            {children}
        </motion.div>
    );
}

// Updated StickyUI: "Friction" vs "Solution" modes
function StickyUI({ title, text, variant = "default", size = "md" }: { title: string, text: string, variant?: "default" | "primary" | "red" | "orange", size?: "md" | "lg" }) {
    const isAlert = variant === "red" || variant === "orange";

    return (
        <div className={cn("backdrop-blur-md rounded-xl border shadow-lg flex flex-col gap-2 transition-all duration-500",
            size === "lg" ? "w-[240px] h-[180px] p-6" : "w-[240px] h-[180px] p-5", // Uniform size
            variant === "red" && "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
            variant === "orange" && "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50",
            variant === "primary" && "bg-accent-primary/5 border-accent-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]",
            variant === "default" && "bg-bg-secondary/90 border-border-subtle hover:border-border-medium"
        )}>
            {/* Header Icon/Dot */}
            <div className="flex items-center justify-between">
                <div className={cn("w-2 h-2 rounded-full",
                    variant === "red" ? "bg-red-500 animate-pulse" :
                        variant === "orange" ? "bg-orange-500" :
                            variant === "primary" ? "bg-accent-primary" : "bg-zinc-700"
                )} />
                {isAlert && <AlertCircle size={14} className={cn("opacity-80", variant === "red" ? "text-red-400" : "text-orange-400")} />}
                {variant === "primary" && <CheckCircle size={14} className="text-accent-primary opacity-80" />}
            </div>

            <div className="flex flex-col gap-1 mt-2">
                <span className={cn("font-bold leading-tight",
                    size === "lg" ? "text-lg" : "text-base",
                    variant === "red" ? "text-red-200" :
                        variant === "orange" ? "text-orange-200" : "text-text-primary"
                )}>{title}</span>

                <span className={cn("leading-snug",
                    size === "lg" ? "text-sm" : "text-xs",
                    isAlert ? "text-white/70" : "text-text-secondary"
                )}>{text}</span>
            </div>

            {/* "Fixing..." indicator for Scene 2 transition if needed, purely visual for now */}
        </div>
    );
}

// New TicketUI matching "How I Work" style
function TicketUI({ data, dimmed, showAssigned, compact }: { data: any, dimmed?: boolean, showAssigned?: boolean, compact?: boolean }) {
    if (!data) return null;
    return (
        <div className={cn("bg-zinc-800/80 backdrop-blur-md rounded-xl border-2 border-zinc-700 shadow-lg flex flex-col transition-all duration-300 group select-none relative hover:border-zinc-600",
            compact ? "w-[240px] p-4 gap-2" : "w-[260px] p-5 gap-3",
            dimmed && "opacity-40" // Increased from opacity-15
        )}>
            {/* Ticket Label - Visual Cue */}
            <div className="absolute -top-2.5 left-4 bg-zinc-800 text-zinc-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-700 shadow-sm">
                Ticket
            </div>

            {!compact && (
                <div className="flex justify-between items-start">
                    {/* ID Pill */}
                    <div className={cn("px-2 py-0.5 rounded bg-bg-tertiary border border-white/5 text-[10px] font-mono font-bold text-text-secondary transition-opacity", dimmed && "opacity-30")}>
                        {data.id}
                    </div>
                    {/* Avatar / User */}
                    <div className={cn("w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-500 transition-opacity", dimmed && "opacity-30")}>
                        {data.user}
                    </div>
                </div>
            )}

            <div>
                <h3 className={cn("font-bold transition-opacity mb-1",
                    compact ? "text-sm leading-tight" : "text-base leading-tight",
                    data.variant === "red" ? "text-red-400" :
                        data.variant === "orange" ? "text-orange-400" : "text-text-primary",
                    dimmed && "opacity-30"
                )}>{data.title}</h3>
                <p className={cn("transition-opacity text-text-secondary leading-snug",
                    compact ? "text-[11px]" : "text-sm",
                    dimmed && "opacity-30"
                )}>{data.text}</p>
            </div>

            {/* Product-grade fields - Hidden in compact mode */}
            {!compact && (data.impact || data.goal || data.constraints) && (
                <div className={cn("space-y-2 pt-2 border-t border-border-subtle transition-opacity", dimmed && "opacity-30")}>
                    {data.impact && (
                        <div className="flex gap-2">
                            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase w-16 flex-shrink-0">Impact:</span>
                            <span className="text-xs text-zinc-400">{data.impact}</span>
                        </div>
                    )}
                    {data.goal && (
                        <div className="flex gap-2">
                            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase w-16 flex-shrink-0">Goal:</span>
                            <span className="text-xs text-accent-primary font-medium">{data.goal}</span>
                        </div>
                    )}
                    {data.constraints && (
                        <div className="flex gap-2">
                            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase w-16 flex-shrink-0">Context:</span>
                            <span className="text-xs text-zinc-500">{data.constraints}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Footer Tags */}
            {!compact && (
                <div className="flex gap-2 mt-1">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-bold transition-opacity",
                        data.variant === "red" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            data.variant === "orange" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                                "bg-zinc-800 text-zinc-400 border border-zinc-700",
                        dimmed && "opacity-30"
                    )}>
                        {data.tag}
                    </span>
                </div>
            )}

            {/* Assigned Cue (Internal) */}
            {!compact && showAssigned && (
                <div className="absolute bottom-5 right-5">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 backdrop-blur-sm shadow-sm opacity-90">
                        <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <span className="text-[9px] text-zinc-400 font-medium tracking-wide">
                            Assigned: <span className="text-zinc-200">George</span>
                        </span>
                    </div>
                </div>
            )}

            {compact && (
                <div className="flex gap-2 transition-all duration-500 mt-1">
                    <div className="px-1.5 py-0.5 rounded bg-zinc-800/50 border border-zinc-700/50 text-[9px] text-zinc-500 font-medium font-mono uppercase tracking-tighter">
                        Goal: <span className="text-accent-primary opacity-80">&lt; 2 taps</span>
                    </div>
                    <div className="px-1.5 py-0.5 rounded bg-zinc-800/50 border border-zinc-700/50 text-[9px] text-zinc-600 font-medium font-mono uppercase tracking-tighter">
                        Offline
                    </div>
                </div>
            )}
        </div>
    );
}

// Keep ExpandedCardUI matching sticky style roughly (it already does mostly)
function ExpandedCardUI({ title, q, a }: { title: string, q: string, a: string[] }) {
    return (
        <div className="w-[260px] bg-bg-secondary/95 backdrop-blur-md rounded-xl border border-border-subtle shadow-2xl p-4 flex flex-col gap-3 relative overflow-hidden">

            <div className="text-[11px] font-bold text-accent-primary uppercase tracking-wide bg-accent-primary/5 w-fit px-2.5 py-1 rounded-full border border-accent-primary/10">{title}</div>
            <div className="space-y-2">
                <div className="text-sm font-medium text-white leading-snug">{q}</div>
                <div className="space-y-1">
                    {a.map((ans, i) => (
                        <div key={i} className="text-xs text-zinc-400 bg-zinc-800/40 px-2 py-1.5 rounded flex items-start gap-2 border border-white/5">
                            <span className="text-accent-primary mt-0.5">•</span> {ans}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DecisionsCardUI({ items }: { items: string[] }) {
    return (
        <div className="w-[280px] bg-accent-primary/5 backdrop-blur-md rounded-xl border border-accent-primary/20 shadow-2xl p-4 text-center">
            <h3 className="text-sm font-bold text-accent-primary mb-3 uppercase tracking-widest">Decisions Locked</h3>
            <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-white bg-zinc-900/80 px-3 py-1.5 rounded-md border border-white/5 shadow-sm text-left">
                        <Check size={10} className="text-accent-primary" />
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

function FlowStripUI() {
    return (
        <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur px-5 py-3 rounded-full border border-zinc-800 shadow-xl">
            {["Order", "Modify", "Pay", "Kitchen", "Close"].map((step, i, arr) => (
                <React.Fragment key={step}>
                    <span className="text-xs font-bold text-zinc-300">{step}</span>
                    {i < arr.length - 1 && <ArrowRight size={12} className="text-zinc-600" />}
                </React.Fragment>
            ))}
        </div>
    );
}

function GroupCardUI({ title, items }: { title: string, items: string[] }) {
    return (
        <div className="w-[180px] bg-zinc-900/50 backdrop-blur-sm border-2 border-dashed border-zinc-800 rounded-xl p-3 flex flex-col gap-2 relative">
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-center mb-1">{title}</div>
            {items.map(item => (
                <div key={item} className="bg-zinc-800/80 text-zinc-300 text-[10px] px-2 py-1.5 rounded shadow-sm border border-white/5 text-center">
                    {item}
                </div>
            ))}
        </div>
    );
}

// Panels
function PanelCheckoutUI({ data, isProduct }: { data: any, isProduct: boolean }) {
    return (
        <div className={cn("bg-zinc-900 border border-zinc-700/60 rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-500",
            isProduct ? "w-[240px] h-[450px]" : "w-[260px] h-[350px]"
        )}>
            {!isProduct && (
                <div className="p-3 border-b border-zinc-800">
                    <div className="text-xs font-bold text-white mb-0.5">{data.title}</div>
                    <div className="text-[10px] text-zinc-500">{data.sub}</div>
                </div>
            )}

            <div className="p-3 flex gap-2 overflow-x-auto pb-0 mb-2 no-scrollbar">
                {data.categories.map((c: string) => <span key={c} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full whitespace-nowrap border border-zinc-700">{c}</span>)}
            </div>

            <div className="flex-1 grid grid-cols-2 gap-2 p-3 pt-0 content-start">
                {data.items.slice(0, isProduct ? 12 : 6).map((item: string) => (
                    <div key={item} className="aspect-[4/3] bg-zinc-800/30 border border-zinc-800 rounded flex items-center justify-center text-[10px] text-zinc-300 font-medium hover:bg-zinc-700 transition-colors cursor-pointer text-center px-1">
                        {item}
                    </div>
                ))}
            </div>

            {/* Hint only in Scene 4 */}
            {!isProduct && (
                <div className="p-2 border-t border-zinc-800 bg-zinc-800/20">
                    <div className="flex flex-col gap-1 opacity-50">
                        <div className="h-1.5 w-full bg-zinc-700 rounded-full" />
                        <div className="h-1.5 w-2/3 bg-zinc-700 rounded-full" />
                    </div>
                </div>
            )}
        </div>
    );
}

function PanelPaymentUI({ data, isProduct }: { data: any, isProduct: boolean }) {
    return (
        <div className={cn("bg-zinc-900 border border-zinc-700/60 rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-500",
            isProduct ? "w-[260px] h-[190px]" : "w-[260px] h-[250px]"
        )}>
            {!isProduct && (
                <div className="p-3 border-b border-zinc-800">
                    <div className="text-xs font-bold text-white mb-0.5">{data.title}</div>
                    <div className="text-[10px] text-zinc-500">{data.sub}</div>
                </div>
            )}
            <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-zinc-500 text-[10px]">Total + Tax</span>
                        <span className="text-white text-xl font-bold font-mono">{data.total}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {data.tips.map((t: string) => (
                        <div key={t} className="flex-1 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-400 text-center text-[10px] rounded cursor-pointer hover:bg-zinc-700 transition-colors">{t}</div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                    <button className="py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded flex items-center justify-center gap-1 transition-colors">
                        <CreditCard size={12} /> Card
                    </button>
                    <button className="py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded border border-zinc-700 transition-colors">Cash</button>
                </div>
            </div>
        </div>
    );
}

function PanelKitchenUI({ data, isProduct }: { data: any, isProduct: boolean }) {
    return (
        <div className={cn("bg-zinc-900 border border-zinc-700/60 rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-500",
            isProduct ? "w-[260px] h-[130px]" : "w-[260px] h-[200px]"
        )}>
            {!isProduct && (
                <div className="p-3 border-b border-zinc-800">
                    <div className="text-xs font-bold text-white mb-0.5">{data.title}</div>
                    <div className="text-[10px] text-zinc-500">{data.sub}</div>
                </div>
            )}
            <div className="p-3 space-y-2">
                {data.tickets.map((t: any) => (
                    <div key={t.id} className="bg-zinc-800/30 border border-zinc-800 p-2 rounded flex justify-between items-center text-xs">
                        <div className="flex flex-col">
                            <span className="text-white font-mono font-bold">{t.id}</span>
                            <span className="text-[9px] text-zinc-600">Table 3</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider", t.s === "Ready" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20")}>{t.s}</span>
                            <span className="text-zinc-500 text-[10px] min-w-[20px] text-right">{t.t}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Tooltip Component
function Tooltip({ text, position = "bottom" }: { text: string, position?: "top" | "bottom" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: position === "top" ? 5 : -5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
                "absolute z-50 bg-zinc-900 text-zinc-200 text-[10px] px-2 py-1 rounded border border-zinc-700 shadow-xl whitespace-nowrap pointer-events-none",
                position === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
                "left-1/2 -translate-x-1/2"
            )}
        >
            {text}
            <div className={cn(
                "absolute w-2 h-2 bg-zinc-900 border-zinc-700 rotate-45 left-1/2 -translate-x-1/2",
                position === "top" ? "bottom-[-5px] border-b border-r" : "top-[-5px] border-l border-t"
            )} />
        </motion.div>
    );
}
