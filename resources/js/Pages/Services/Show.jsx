import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Components/Layout/GuestLayout';

export default function Show({ service }) {

    if (!service) {
        return (
            <GuestLayout>
                <Head title="Service introuvable" />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', color: 'var(--text-main)', marginBottom: 16 }}>
                            Service introuvable
                        </p>
                        <Link href={route('services.index')} style={{ color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem' }}>
                            ← Retour aux services
                        </Link>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title={service.title} />

            <style>{`
                .show-prose-list li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
                .show-prose-list li .bullet { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; margin-top: 8px; flex-shrink: 0; }
            `}</style>

            {/* ── Hero ── */}
            <div style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(90deg, var(--gold) 1px, transparent 1px), linear-gradient(var(--gold) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

                <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '48px 24px 72px' }}>
                    {/* Breadcrumb */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                        {[{ label: 'Accueil', href: route('home') }, { label: 'Services', href: route('services.index') }].map((crumb, i) => (
                            <React.Fragment key={i}>
                                <Link href={crumb.href}
                                      style={{ color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', letterSpacing: '0.05em', transition: 'color 0.2s' }}
                                      onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    {crumb.label}
                                </Link>
                                <svg style={{ width: 14, height: 14, color: 'var(--border)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </React.Fragment>
                        ))}
                        <span style={{ color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                            {service.title}
                        </span>
                    </nav>

                    <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 400, color: 'var(--text-main)', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                        {service.title}
                    </h1>

                    {service.short_description && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 700, lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" }}>
                            {service.short_description}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ background: 'var(--bg-page)', padding: '64px 0' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }} className="show-grid">
                        <style>{`
                            @media (min-width: 1024px) {
                                .show-grid { grid-template-columns: 2fr 1fr !important; }
                                .show-sidebar { position: sticky; top: 32px; }
                            }
                        `}</style>

                        {/* ── Main ── */}
                        <div>
                            <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '48px' }}>
                                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 3, height: 28, background: 'var(--gold)', borderRadius: 2, flexShrink: 0 }} />
                                    Description détaillée
                                </h2>

                                {service.description ? (
                                    <div>
                                        {service.description.split('\n\n').map((paragraph, index) => {
                                            if (paragraph.includes(':') && paragraph.includes('-')) {
                                                const [titre, ...items] = paragraph.split('\n');
                                                return (
                                                    <div key={index} style={{ marginBottom: 32 }}>
                                                        <p style={{ color: 'var(--text-main)', fontFamily: "'DM Sans',sans-serif", fontWeight: 500, marginBottom: 16, lineHeight: 1.6 }}>
                                                            {titre}
                                                        </p>
                                                        <ul className="show-prose-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                            {items.filter(item => item.trim()).map((item, i) => (
                                                                <li key={i}>
                                                                    <span className="bullet" />
                                                                    <span style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.95rem', lineHeight: 1.7 }}>
                                                                        {item.replace(/^-\s*/, '')}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <p key={index} style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", lineHeight: 1.8, marginBottom: 20, fontSize: '0.95rem' }}>
                                                    {paragraph}
                                                </p>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic' }}>
                                        Aucune description disponible.
                                    </p>
                                )}
                            </div>

                            {/* Réalisations associées */}
                            {service.projects?.length > 0 && (
                                <div style={{ marginTop: 48 }}>
                                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 3, height: 28, background: 'var(--gold)', borderRadius: 2 }} />
                                        Réalisations associées
                                    </h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
                                        {service.projects.map((project) => {
                                            // Priorité 1 : image principale via image_url (appended par Laravel via asset())
                                            const mainImg  = project.images?.find(img => img.is_main) ?? project.images?.[0];
                                            const thumbUrl = mainImg?.image_url ?? null;

                                            // Priorité 2 : vidéo si pas d'image
                                            const hasVideo = !!project.video_url;

                                            return (
                                                <Link key={project.id}
                                                      href={route('realisations.show', project.id)}
                                                      style={{ textDecoration: 'none' }}
                                                      className="project-card-link">
                                                    <style>{`.project-card-link:hover .project-card { transform: translateY(-8px); border-color: var(--gold) !important; }`}</style>
                                                    <div className="project-card" style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', transition: 'all 0.3s ease' }}>
                                                        <div style={{ height: 200, background: 'var(--bg-page)', overflow: 'hidden', position: 'relative' }}>
                                                            {thumbUrl ? (
                                                                /* Image principale de la réalisation */
                                                                <img src={thumbUrl} alt={project.title}
                                                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                     onError={e => { e.currentTarget.style.display = 'none'; }} />
                                                            ) : hasVideo ? (
                                                                /* Pas d'image → preview vidéo inline (muted, autoplay, loop) */
                                                                <video
                                                                    src={project.video_url}
                                                                    muted autoPlay loop playsInline
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                /* Aucun média */
                                                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                                                    <svg style={{ width: 48, height: 48 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                            {/* Badge vidéo si la réalisation a une vidéo ET une image */}
                                                            {thumbUrl && hasVideo && (
                                                                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                    <svg style={{ width: 12, height: 12, color: 'var(--gold)' }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', color: '#fff', fontWeight: 600 }}>Vidéo</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ padding: 20 }}>
                                                            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: 8 }}>
                                                                {project.title}
                                                            </h3>
                                                            {project.location && (
                                                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                                                                    📍 {project.location}
                                                                </p>
                                                            )}
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif" }}>
                                                                <span>Voir la réalisation</span>
                                                                <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Sidebar ── */}
                        <div className="show-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Devis CTA */}
                            <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold)' }} />
                                <div style={{ width: 56, height: 56, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: 'var(--gold)', background: 'rgba(201,148,58,0.08)' }}>
                                    <svg style={{ width: 28, height: 28 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>
                                    Devis gratuit
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 24 }}>
                                    Obtenez une estimation détaillée et personnalisée pour votre projet sans engagement.
                                </p>
                                <Link href={route('contact')}
                                      style={{ display: 'block', width: '100%', background: 'var(--gold)', color: '#fff', textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', padding: '14px 24px', transition: 'background 0.3s', boxSizing: 'border-box' }}
                                      onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-light)'}
                                      onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}>
                                    Demander un devis
                                </Link>
                            </div>

                            {/* Pourquoi nous */}
                            <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
                                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 20 }}>
                                    Pourquoi nous choisir ?
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {['Expertise reconnue en génie civil', 'Solutions sur mesure', 'Respect des délais et budgets', 'Suivi personnalisé'].map((text, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(201,148,58,0.12)', border: '1px solid var(--border)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>✓</span>
                                            <span style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', lineHeight: 1.5 }}>{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact */}
                            <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
                                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>
                                    Une question ?
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
                                    Notre équipe est à votre écoute pour répondre à toutes vos interrogations.
                                </p>
                                <Link href={route('contact')}
                                      style={{ display: 'block', width: '100%', border: '1px solid var(--border)', color: 'var(--text-main)', textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', padding: '13px 24px', transition: 'border-color 0.3s, color 0.3s', boxSizing: 'border-box', background: 'transparent' }}
                                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-main)'; }}>
                                    Nous contacter
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
