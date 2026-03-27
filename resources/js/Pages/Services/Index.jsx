import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import GuestLayout from '@/Components/Layout/GuestLayout';

export default function Index({ services = []}) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => (r?.name ?? r) === 'admin');
    const serviceIcons = {
        'Etude de sol': (
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                <path d="M8 48L16 40L24 44L32 36L40 42L48 34L56 40" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="12" y="52" width="40" height="8" strokeWidth="2" fill="currentColor" opacity="0.2"/>
                <circle cx="32" cy="28" r="3" fill="currentColor"/>
                <path d="M32 31V42M28 38H36" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
        'Suivi et coordination de chantier': (
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                <rect x="12" y="20" width="40" height="32" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M20 20V16L32 8L44 16V20" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 30H32M22 38H32M22 46H32" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="42" cy="38" r="6" strokeWidth="2" fill="currentColor" opacity="0.2"/>
                <path d="M39 38L41 40L45 36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        'Etude béton et métallique': (
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                <rect x="16" y="24" width="32" height="28" strokeWidth="2.5"/>
                <path d="M16 32H48M16 40H48M24 24V52M32 24V52M40 24V52" strokeWidth="2"/>
                <path d="M28 12L32 8L36 12M32 8V24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="32" cy="16" r="2" fill="currentColor"/>
            </svg>
        ),
        'Expertise technique et contrôle qualité': (
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                <circle cx="32" cy="32" r="18" strokeWidth="2.5"/>
                <path d="M26 32L30 36L38 28" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M32 14V18M32 46V50M50 32H46M18 32H14" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="32" cy="32" r="24" strokeWidth="1.5" opacity="0.3"/>
            </svg>
        ),
        'Réalisation de plans': (
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                <rect x="12" y="16" width="40" height="36" strokeWidth="2.5" rx="2"/>
                <path d="M12 24H52M20 16V52M28 28V48M36 28V48M44 28V48" strokeWidth="2" opacity="0.5"/>
                <path d="M24 32H32M24 40H32" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="46" cy="20" r="2" fill="currentColor"/>
            </svg>
        )
    };

    const getServiceIcon = (title) => {
        const iconKey = Object.keys(serviceIcons).find(key =>
            title.toLowerCase().includes(key.toLowerCase())
        );
        return iconKey ? serviceIcons[iconKey] : serviceIcons['Etude de sol'];
    };

    const ServiceCard = ({ service, index }) => (
        <Link href={route('services.show', service.slug)} className="group block h-full">
            <div style={{
                position: 'relative',
                height: '100%',
                background: 'var(--dropdown-bg)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.5s ease',
            }}
                 className="service-card"
            >
                <style>{`
                    .service-card:hover {
                        border-color: var(--gold) !important;
                        transform: translateY(-8px);
                        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
                    }
                    .service-card:hover .card-accent-bar {
                        transform: scaleX(1) !important;
                    }
                    .service-card:hover .card-icon {
                        transform: scale(1.1);
                    }
                    .service-card:hover .card-title {
                        color: var(--gold) !important;
                    }
                    .service-card:hover .card-arrow {
                        gap: 16px !important;
                    }
                    .service-card:hover .card-arrow svg {
                        transform: translateX(4px);
                    }
                `}</style>

                <div style={{ padding: '32px' }}>
                    {/* Icon */}
                    <div className="card-icon" style={{
                        width: 80, height: 80,
                        marginBottom: 24,
                        color: 'var(--gold)',
                        transition: 'transform 0.5s ease',
                    }}>
                        {getServiceIcon(service.title)}
                    </div>

                    {/* Title */}
                    <h3 className="card-title" style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        marginBottom: 12,
                        transition: 'color 0.3s',
                    }}>
                        {service.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                        color: 'var(--text-muted)',
                        lineHeight: 1.7,
                        marginBottom: 20,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.9rem',
                    }}>
                        {service.short_description || (service.description?.substring(0, 120) + '...')}
                    </p>

                    {/* Projects count */}
                    {service.projects_count > 0 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            fontSize: '0.8rem', color: 'var(--text-muted)',
                            marginBottom: 20,
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>{service.projects_count} projet{service.projects_count > 1 ? 's' : ''}</span>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="card-arrow" style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        color: 'var(--gold)',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        transition: 'gap 0.3s',
                    }}>
                        <span>Voir les détails</span>
                        <svg style={{ width: 16, height: 16, transition: 'transform 0.3s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>

                    {/* Admin badge */}
                    {isAdmin && !service.is_active && (
                        <div style={{ position: 'absolute', top: 16, right: 16 }}>
                            <span style={{
                                background: 'rgba(224,82,82,0.15)',
                                color: '#e05252',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                padding: '4px 12px',
                                borderRadius: 999,
                                border: '1px solid rgba(224,82,82,0.3)',
                                fontFamily: "'DM Sans', sans-serif",
                                letterSpacing: '0.08em',
                            }}>
                                Inactif
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom gold bar */}
                <div className="card-accent-bar" style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 2,
                    background: 'var(--gold)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.5s ease',
                }} />
            </div>
        </Link>
    );

    return (
        <GuestLayout>
            <Head title="Nos Services" />

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <div style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--bg-page)',
                borderBottom: '1px solid var(--border)',
                paddingTop: 80,
            }}>
                {/* Blueprint grid */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    backgroundImage: `
                        linear-gradient(90deg, var(--gold) 1px, transparent 1px),
                        linear-gradient(var(--gold) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }} />

                <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '64px 24px 80px', textAlign: 'center' }}>
                    {/* Badge */}
                    <div style={{ marginBottom: 24 }}>
                        <span style={{
                            color: 'var(--gold)',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            border: '1px solid var(--border)',
                            padding: '6px 20px',
                            borderRadius: 999,
                            background: 'rgba(201,148,58,0.06)',
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            Excellence en Génie Civil
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                        fontWeight: 400,
                        color: 'var(--text-main)',
                        marginBottom: 20,
                        lineHeight: 1.05,
                        letterSpacing: '-0.02em',
                    }}>
                        Mes <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Services</span>
                    </h1>

                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.1rem',
                        maxWidth: 600,
                        margin: '0 auto',
                        lineHeight: 1.8,
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        Des solutions d'ingénierie complètes et sur mesure pour vos projets de construction,
                        alliant expertise technique et innovation.
                    </p>
                </div>
            </div>

            {/* ── Services Grid ──────────────────────────────────────── */}
            <div style={{ background: 'var(--bg-page)', padding: '80px 0' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

                    {services.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
                                Aucun service disponible pour le moment.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Row 1 : 3 cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
                                {services.slice(0, 3).map((service, index) => (
                                    <ServiceCard key={service.id || index} service={service} index={index} />
                                ))}
                            </div>

                            {/* Row 2 : remaining cards, centered */}
                            {services.length > 3 && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${Math.min(services.slice(3).length, 2)}, minmax(300px, 1fr))`,
                                    gap: 32,
                                    marginTop: 32,
                                    maxWidth: 800,
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}>
                                    {services.slice(3).map((service, index) => (
                                        <ServiceCard key={service.id || (index + 3)} service={service} index={index + 3} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* ── CTA Banner ─────────────────────────────────── */}
                    <div style={{
                        marginTop: 80,
                        background: 'var(--dropdown-bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 24,
                        padding: '64px 48px',
                        position: 'relative',
                        overflow: 'hidden',
                        textAlign: 'center',
                    }}>
                        {/* dot grid */}
                        <div style={{
                            position: 'absolute', inset: 0, opacity: 0.04,
                            backgroundImage: `radial-gradient(circle at 2px 2px, var(--gold) 1px, transparent 0)`,
                            backgroundSize: '32px 32px',
                        }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--gold)', opacity: 0.4 }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'var(--gold)', opacity: 0.4 }} />

                        <div style={{ position: 'relative' }}>
                            {isAdmin ? (
                                /* ── Version Admin ── */
                                <>
                                    <h2 style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                                        fontWeight: 600,
                                        color: 'var(--text-main)',
                                        marginBottom: 12,
                                    }}>
                                        Gérer les services
                                    </h2>
                                    <p style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '1rem',
                                        marginBottom: 32,
                                        maxWidth: 560,
                                        margin: '0 auto 32px',
                                        lineHeight: 1.7,
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                        Ajoutez ou modifiez les services proposés sur le site.
                                    </p>
                                    <Link href={route('admin.services.create')} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: 'var(--gold)',
                                        color: '#fff',
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        padding: '14px 32px',
                                        transition: 'background 0.3s, transform 0.3s',
                                    }}
                                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                    >
                                        <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Ajouter un service</span>
                                    </Link>
                                </>
                            ) : (
                                /* ── Version Client / Visiteur ── */
                                <>
                                    <h2 style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                                        fontWeight: 600,
                                        color: 'var(--text-main)',
                                        marginBottom: 12,
                                    }}>
                                        Besoin d'un devis gratuit ?
                                    </h2>
                                    <p style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '1rem',
                                        marginBottom: 32,
                                        maxWidth: 560,
                                        margin: '0 auto 32px',
                                        lineHeight: 1.7,
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                        Contactez-nous pour discuter de votre projet et recevoir une estimation détaillée sans engagement.
                                    </p>
                                    <Link href={route('contact')} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: 'var(--gold)',
                                        color: '#fff',
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        padding: '14px 32px',
                                        transition: 'background 0.3s, transform 0.3s',
                                    }}
                                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                    >
                                        <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Demander un devis</span>
                                        <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
