import FadeIn from '../motion/FadeIn';
import { Shield, Star, Zap, Mail, MessageCircle, Phone, ArrowRight } from 'lucide-react';

const UPWORK_PROFILE_URL = 'https://www.upwork.com/freelancers/~0192f6c9c9c1e1bf83';
const UPWORK_GREEN = '#14A800';

function UpworkWordmark({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 102 28"
            role="img"
            aria-label="Upwork"
            className={className}
            style={style}
        >
            <path fill="currentColor" d="M28.18,19.06A6.54,6.54,0,0,1,23,16c.67-5.34,2.62-7,5.2-7s4.54,2,4.54,5-2,5-4.54,5m0-13.34a7.77,7.77,0,0,0-7.9,6.08,26,26,0,0,1-1.93-5.62H12v7.9c0,2.87-1.3,5-3.85,5s-4-2.12-4-5l0-7.9H.49v7.9A8.61,8.61,0,0,0,2.6,20a7.27,7.27,0,0,0,5.54,2.35c4.41,0,7.5-3.39,7.5-8.24V8.77a25.87,25.87,0,0,0,3.66,8.05L17.34,28h3.72l1.29-7.92a11,11,0,0,0,1.36,1,8.32,8.32,0,0,0,4.14,1.28h.34A8.1,8.1,0,0,0,36.37,14a8.12,8.12,0,0,0-8.19-8.31" />
            <path fill="currentColor" d="M80.8,7.86V6.18H77.2V21.81h3.65V15.69c0-3.77.34-6.48,5.4-6.13V6c-2.36-.18-4.2.31-5.45,1.87" />
            <polygon fill="currentColor" points="55.51 6.17 52.87 17.11 50.05 6.17 45.41 6.17 42.59 17.11 39.95 6.17 36.26 6.17 40.31 21.82 44.69 21.82 47.73 10.71 50.74 21.82 55.12 21.82 59.4 6.17 55.51 6.17" />
            <path fill="currentColor" d="M67.42,19.07c-2.59,0-4.53-2.05-4.53-5s2-5,4.53-5S72,11,72,14s-2,5-4.54,5m0-13.35A8.1,8.1,0,0,0,59.25,14,8.18,8.18,0,1,0,75.6,14a8.11,8.11,0,0,0-8.18-8.31" />
            <path fill="currentColor" d="M91.47,14.13h.84l5.09,7.69h4.11l-5.85-8.53a7.66,7.66,0,0,0,4.74-7.11H96.77c0,3.37-2.66,4.65-5.3,4.65V0H87.82V21.82h3.64Z" />
        </svg>
    );
}

export default function Contact() {
    return (
        <section id="contact" className="contact-section bg-bg-primary py-16 md:py-24 scroll-mt-20">
            <div className="contact-container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="contact-header text-center mb-10">
                        <p className="contact-eyebrow font-serif italic text-text-muted text-lg md:text-xl mb-3">
                            The fastest way to work together
                        </p>
                        <h2 className="contact-heading font-serif text-h1 leading-[0.95] tracking-tight mb-4">
                            <span className="contact-heading-dim text-text-dim">Hire me on</span>{' '}
                            <span className="contact-heading-emphasis italic font-normal text-text-primary">Upwork</span>
                        </h2>
                        <p className="contact-subheading text-text-secondary text-lg max-w-2xl mx-auto">
                            Escrow protection, verified reviews, no invoices to chase. I work mostly through Upwork - it&apos;s the cleanest path for both of us.
                        </p>
                    </div>

                    <div className="contact-card bg-bg-secondary p-6 md:p-8 rounded-2xl border border-border-subtle shadow-sm">

                        {/* Identity strip */}
                        <div className="contact-identity flex flex-wrap items-center gap-3 pb-6 border-b border-border-subtle/50">
                            <UpworkWordmark className="contact-identity-logo h-7 w-auto" style={{ color: UPWORK_GREEN }} />
                            <span
                                className="contact-identity-badge px-2 py-0.5 text-[10px] font-bold tracking-wider text-white rounded-full"
                                style={{ backgroundColor: UPWORK_GREEN }}
                            >
                                PRO
                            </span>
                        </div>

                        <div className="contact-name pt-5 pb-6">
                            <p className="contact-name-value text-text-primary font-bold">George E.</p>
                            <p className="contact-name-role text-text-secondary text-sm">Product Designer + Bespoke Web Builder</p>
                        </div>

                        {/* Stats row */}
                        <div className="contact-stats grid grid-cols-3 divide-x divide-border-subtle border-y border-border-subtle/50">
                            {[
                                { value: '100%', label: 'Job Success' },
                                { value: '5.0 ★', label: 'Avg rating' },
                                { value: '0–4 hr', label: 'Response time' },
                            ].map((s) => (
                                <div key={s.label} className="contact-stat text-center py-5 px-2">
                                    <p className="contact-stat-value text-2xl md:text-3xl font-bold text-text-primary">{s.value}</p>
                                    <p className="contact-stat-label text-[11px] uppercase tracking-wider text-text-muted mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Testimonial */}
                        <blockquote className="contact-quote mt-6 pl-4 border-l-2 border-accent-primary text-text-secondary italic">
                            <p className="contact-quote-body">&ldquo;George impressed me a lot. With a two-day turnaround and a challenging brief, he brought the goods and put together a design that nailed the tone.&rdquo;</p>
                            <footer className="contact-quote-attribution mt-2 text-xs not-italic text-text-muted">- Upwork client, UI/UX project</footer>
                        </blockquote>

                        {/* Why-Upwork value props */}
                        <div className="contact-value-props mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                            {[
                                { icon: Shield, title: 'Escrow-protected' },
                                { icon: Star, title: 'Verified reviews' },
                                { icon: Zap, title: 'Zero admin' },
                            ].map((v) => (
                                <div key={v.title} className="contact-value-prop flex items-center gap-3">
                                    <v.icon className="contact-value-prop-icon text-accent-primary shrink-0" size={18} />
                                    <p className="contact-value-prop-title text-text-primary font-semibold text-sm">{v.title}</p>
                                </div>
                            ))}
                        </div>

                        {/* Primary CTA */}
                        <a
                            href={UPWORK_PROFILE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-ph-event="cta_upwork_clicked"
                            className="contact-cta-button mt-8 w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-lg transition-colors group bg-[#14A800] hover:bg-[#108300]"
                        >
                            Hire me on Upwork
                            <ArrowRight size={18} className="contact-cta-icon group-hover:translate-x-0.5 transition-transform" />
                        </a>

                        {/* Direct-contact strip */}
                        <div className="contact-direct mt-6 pt-6 border-t border-border-subtle/50 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-text-muted">
                            <a
                                href="mailto:george.efesop@gmail.com"
                                data-ph-event="cta_email_clicked"
                                className="contact-direct-link flex items-center gap-2 hover:text-text-primary transition-colors"
                            >
                                <Mail size={14} />
                                george.efesop@gmail.com
                            </a>
                            <a
                                href="https://wa.me/35797907137"
                                target="_blank"
                                rel="noopener noreferrer"
                                data-ph-event="cta_whatsapp_clicked"
                                className="contact-direct-link flex items-center gap-2 hover:text-text-primary transition-colors"
                            >
                                <MessageCircle size={14} />
                                WhatsApp
                            </a>
                            <a
                                href="tel:+35797907137"
                                data-ph-event="cta_phone_clicked"
                                className="contact-direct-link flex items-center gap-2 hover:text-text-primary transition-colors whitespace-nowrap"
                            >
                                <Phone size={14} />
                                +357 97 907 137
                            </a>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
