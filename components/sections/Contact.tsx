'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FadeIn from '../motion/FadeIn';
import { Mail, MessageCircle, ChevronDown, ChevronUp, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface ContactFormData {
    name: string;
    email: string;
    description: string;
    // Optional
    company?: string;
    projectType?: string;
    budget?: string;
}

export default function Contact() {
    const [showDetails, setShowDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, trigger, getValues, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

    const getFormattedMessage = (data: ContactFormData) => {
        const parts = [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            data.company ? `Company/Project: ${data.company}` : null,
            data.projectType ? `Project Type: ${data.projectType}` : null,
            data.budget ? `Budget: ${data.budget}` : null,
            `\nBrief:\n${data.description}`,
            `\n(Ref: ${typeof window !== 'undefined' ? window.location.href : 'Portfolio'})`
        ];
        return parts.filter(Boolean).join('\n');
    };

    const handleEmail = async (e: React.MouseEvent) => {
        e.preventDefault();
        const isValid = await trigger(['name', 'email', 'description']);
        if (!isValid) return;

        setIsSubmitting(true);
        const data = getValues();

        try {
            const response = await fetch('https://formsubmit.co/ajax/george.efesop@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    _subject: `New Project Inquiry from ${data.name}`,
                    _template: 'table'
                })
            });

            if (!response.ok) throw new Error('Failed to send');

            setIsSuccess(true);
            reset();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const navbarHeight = 80; // Approximate navbar height
                const position = contactSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try WhatsApp or email directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsApp = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Don't validate, just get whatever data is there
        const data = getValues();
        const text = encodeURIComponent(`Hi George — I'd like to start a project.\n\n${getFormattedMessage(data)}`);

        window.open(`https://wa.me/35797907137?text=${text}`, '_blank');
    };

    return (
        <section id="contact" className="bg-bg-primary py-16 md:py-24 scroll-mt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">Start a project</h2>
                        <p className="text-text-secondary text-lg">
                            Selective availability — I reply within 24–48 hours.
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="bg-bg-secondary border border-green-900/50 rounded-2xl p-12 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-text-secondary mb-8">Thanks for reaching out {getValues().name}. I&apos;ll get back to you shortly.</p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="text-accent-primary hover:text-white transition-colors font-medium underline underline-offset-4"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form className="bg-bg-secondary p-6 md:p-8 rounded-2xl border border-border-subtle shadow-sm">

                            {/* Essential Fields */}
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div className="relative group">
                                        <input
                                            {...register('name', { required: 'Name is required' })}
                                            id="name"
                                            placeholder=" "
                                            className="peer w-full px-4 pt-5 pb-2 bg-bg-secondary border border-border-medium rounded-lg text-text-primary text-base focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder-transparent"
                                        />
                                        <label
                                            htmlFor="name"
                                            className="absolute left-4 top-2 text-xs text-text-muted transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-secondary peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent-primary"
                                        >
                                            Name
                                        </label>
                                        {errors.name && <span className="absolute right-3 top-3.5 text-red-400"><AlertCircle size={16} /></span>}
                                    </div>

                                    {/* Email */}
                                    <div className="relative group">
                                        <input
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: { value: /^\S+@\S+$/i, message: "Valid email required" }
                                            })}
                                            id="email"
                                            placeholder=" "
                                            className="peer w-full px-4 pt-5 pb-2 bg-bg-secondary border border-border-medium rounded-lg text-text-primary text-base focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder-transparent"
                                        />
                                        <label
                                            htmlFor="email"
                                            className="absolute left-4 top-2 text-xs text-text-muted transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-secondary peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent-primary"
                                        >
                                            Email
                                        </label>
                                        {errors.email && <span className="absolute right-3 top-3.5 text-red-400"><AlertCircle size={16} /></span>}
                                    </div>
                                </div>

                                {/* Brief */}
                                <div className="relative group">
                                    <textarea
                                        {...register('description', { required: 'Brief is required' })}
                                        id="description"
                                        rows={3}
                                        placeholder="What are you building, who is it for, and what’s the biggest challenge right now? (Links welcome)"
                                        className="peer w-full px-4 pt-7 pb-3 bg-bg-secondary border border-border-medium rounded-lg text-text-primary text-base focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors resize-none placeholder:text-text-muted/50"
                                    />
                                    <label
                                        htmlFor="description"
                                        className="absolute left-4 top-2 text-xs text-text-muted transition-all peer-placeholder-shown:text-text-secondary peer-focus:text-accent-primary font-medium"
                                    >
                                        Project Brief
                                    </label>
                                    {errors.description && <span className="absolute right-3 top-3 text-red-400"><AlertCircle size={16} /></span>}
                                </div>
                            </div>

                            {/* Collapsible Optional Fields */}
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors py-2"
                                >
                                    {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    {showDetails ? 'Hide details' : 'Add details (Company, Budget, Type)'}
                                </button>

                                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden transition-all duration-300 ease-in-out", showDetails ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0")}>
                                    {/* Company */}
                                    <div className="relative">
                                        <input
                                            {...register('company')}
                                            id="company"
                                            placeholder=" "
                                            className="peer w-full px-4 pt-5 pb-2 bg-bg-secondary border border-border-medium rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-colors placeholder-transparent"
                                        />
                                        <label htmlFor="company" className="absolute left-4 top-2 text-xs text-text-muted transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-secondary peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent-primary">
                                            Company / Project Name
                                        </label>
                                    </div>

                                    {/* Project Type */}
                                    <div className="relative group">
                                        <select
                                            {...register('projectType')}
                                            id="projectType"
                                            className="peer w-full px-4 pt-5 pb-2 bg-bg-secondary border border-border-medium rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-colors appearance-none bg-transparent cursor-pointer"
                                        >
                                            <option value=""></option>
                                            <option value="MVP">MVP Design + Development</option>
                                            <option value="SaaS">SaaS Dashboard</option>
                                            <option value="Landing">Landing Page</option>
                                            <option value="System">Design System</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <label htmlFor="projectType" className="absolute left-4 top-2 text-xs text-text-muted transition-all peer-focus:text-accent-primary pointer-events-none">
                                            Project Type
                                        </label>
                                        <ChevronDown className="absolute right-4 top-4 text-text-muted pointer-events-none" size={16} />
                                    </div>

                                    {/* Budget */}
                                    <div className="relative group">
                                        <select
                                            {...register('budget')}
                                            id="budget"
                                            className="peer w-full px-4 pt-5 pb-2 bg-bg-secondary border border-border-medium rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-colors appearance-none bg-transparent cursor-pointer"
                                        >
                                            <option value=""></option>
                                            <option value="5-10k">€5k - €10k</option>
                                            <option value="10-20k">€10k - €20k</option>
                                            <option value="20k+">€20k+</option>
                                            <option value="hourly">Hourly basis</option>
                                        </select>
                                        <label htmlFor="budget" className="absolute left-4 top-2 text-xs text-text-muted transition-all peer-focus:text-accent-primary pointer-events-none">
                                            Budget Range
                                        </label>
                                        <ChevronDown className="absolute right-4 top-4 text-text-muted pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-row gap-4">
                                <button
                                    onClick={handleEmail}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-white/10 hover:bg-white/[0.15] text-white border border-white/10 hover:border-accent-primary backdrop-blur-md font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
                                    {isSubmitting ? 'Sending...' : 'Email'}
                                </button>
                                <button
                                    onClick={handleWhatsApp}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-white/10 hover:bg-white/[0.15] text-white border border-white/10 hover:border-accent-primary backdrop-blur-md font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <MessageCircle size={20} />
                                    WhatsApp
                                </button>
                            </div>

                            {/* Validation Error Message */}
                            {(Object.keys(errors).length > 0) && (
                                <p className="text-center text-red-400 text-sm mt-4 animate-pulse">
                                    Please fill in the required fields (Name, Email, Brief)
                                </p>
                            )}

                            <div className="mt-6 text-center pt-6 border-t border-border-subtle/50">
                                <p className="text-sm text-text-muted flex flex-wrap justify-center gap-x-1">
                                    <span>Prefer direct contact?</span>
                                    <a href="mailto:george.efesop@gmail.com" className="hover:text-text-primary underline transition-colors">george.efesop@gmail.com</a>
                                    <span className="hidden sm:inline">•</span>
                                    <a href="tel:+35797907137" className="hover:text-text-primary underline transition-colors whitespace-nowrap">+357 97 907 137</a>
                                </p>
                            </div>

                        </form>
                    )}
                </FadeIn>
            </div>
        </section>
    );
}
