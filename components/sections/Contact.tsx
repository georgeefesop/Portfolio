'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FadeIn from '../motion/FadeIn';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ContactFormData {
    name: string;
    email: string;
    company: string;
    projectType: string;
    budget: string;
    description: string;
}

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>();

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try emailing directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="bg-bg-primary py-24 scroll-mt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Start a project</h2>
                        <p className="text-text-secondary text-lg">
                            I take on a limited number of projects each quarter. <br className="hidden md:block" />
                            If you&apos;re building something that requires thoughtful design and technical execution, fill out the form below.
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="bg-bg-secondary border border-green-900/50 rounded-2xl p-12 text-center">
                            <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-text-secondary">Thanks! I&apos;ll respond within 24-48 hours.</p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="mt-8 text-accent-primary hover:text-white transition-colors"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-bg-secondary p-8 md:p-10 rounded-2xl border border-border-subtle">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-primary">Name</label>
                                    <input
                                        {...register('name', { required: 'Name is required' })}
                                        className="w-full px-4 py-3 bg-bg-primary border border-border-medium rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-primary">Email</label>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        className="w-full px-4 py-3 bg-bg-primary border border-border-medium rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
                                </div>
                            </div>

                            {/* Company */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary">Company / Project</label>
                                <input
                                    {...register('company', { required: 'Company is required' })}
                                    className="w-full px-4 py-3 bg-bg-primary border border-border-medium rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                    placeholder="Acme Inc."
                                />
                                {errors.company && <span className="text-xs text-red-400">{errors.company.message}</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Project Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-primary">Project Type</label>
                                    <select
                                        {...register('projectType', { required: 'Please select a type' })}
                                        className="w-full px-4 py-3 bg-bg-primary border border-border-medium rounded-lg text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors appearance-none"
                                    >
                                        <option value="">Select a type...</option>
                                        <option value="MVP">MVP Design + Development</option>
                                        <option value="Landing">Landing Page</option>
                                        <option value="SaaS">SaaS Dashboard</option>
                                        <option value="AI">AI Integration</option>
                                        <option value="System">Design Systems</option>
                                        <option value="Consulting">Hourly Consulting</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.projectType && <span className="text-xs text-red-400">{errors.projectType.message}</span>}
                                </div>

                                {/* Budget */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-primary">Budget</label>
                                    <select
                                        {...register('budget', { required: 'Please select a range' })}
                                        className="w-full px-4 py-3 bg-bg-primary border border-border-medium rounded-lg text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors appearance-none"
                                    >
                                        <option value="">Select a range...</option>
                                        <option value="5-10k">€5k - €10k</option>
                                        <option value="10-20k">€10k - €20k</option>
                                        <option value="20k+">€20k+</option>
                                        <option value="hourly">Hourly basis</option>
                                        <option value="notsure">Not sure yet</option>
                                    </select>
                                    {errors.budget && <span className="text-xs text-red-400">{errors.budget.message}</span>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary">Brief Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-bg-primary border border-border-medium rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors resize-none"
                                    placeholder="Tell me about your project goals and timeline..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Sending...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>

                            <p className="text-center text-text-muted text-sm pt-4">
                                Or contact directly: <a href="mailto:george.efesop@gmail.com" className="text-text-primary hover:text-white underline decoration-accent-primary/50 hover:decoration-accent-primary transition-all">george.efesop@gmail.com</a> | <a href="tel:+35797907137" className="text-text-primary hover:text-white underline decoration-accent-primary/50 hover:decoration-accent-primary transition-all">+357 97 907 137</a>
                            </p>
                        </form>
                    )}
                </FadeIn>
            </div>
        </section>
    );
}
