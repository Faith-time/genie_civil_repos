import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Components/Layout/GuestLayout';

const S = {
    card: { background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid var(--border)' },
    muted: { fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75 },
};

export default function RealisationShow({ realisation }) {
    const [activeImg, setActiveImg] = useState(null);

    if (!realisation) return (
        <GuestLayout>
            <div style={{ textAlign: 'center', padding: '96px 24px' }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', color: 'var(--text-main)' }}>
                    Réalisation introuvable
                </p>
                <Link href={route('realisations.index')}
                      style={{ color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif" }}>
                    ← Retour aux réalisations
                </Link>
            </div>
        </GuestLayout>
    );

    const images   = realisation.images ?? [];
    const hasVideo = !!realisation.video_url;
    const fmt = (d) => d
        ? new Date(d).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        : null;

    return (
        <GuestLayout>
            <Head title={realisation.title ?? 'Réalisation'} />

            {/* ── Hero ── */}
            <div style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
                <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, borderRadius: '50%', border: '1px solid var(--border)', pointerEvents: 'none', opacity: 0.4 }} />

                <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '44px 24px 36px' }}>

                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Link href={route('realisations.index')}
                              style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            Réalisations
                        </Link>
                        <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                        <span style={{ color: 'var(--gold)' }}>{realisation.title}</span>
                    </div>

                    {/* Surtitle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ width: 20, height: 1, background: 'var(--gold)' }} />
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif" }}>
                            Portfolio
                        </span>
                    </div>

                    <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.05, margin: '0 0 14px' }}>
                        {realisation.title}
                    </h1>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                        {realisation.service && (
                            <span style={{ padding: '3px 12px', borderRadius: 999, background: 'rgba(201,148,58,0.1)', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 700 }}>
                                {realisation.service.name}
                            </span>
                        )}
                        {realisation.client_name && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                <svg style={{ width: 12, height: 12, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                {realisation.client_name}
                            </span>
                        )}
                        {realisation.location && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                <svg style={{ width: 11, height: 11 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                </svg>
                                {realisation.location}
                            </span>
                        )}
                        {realisation.date_realisation && (
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {fmt(realisation.date_realisation)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Contenu ── */}
            <div style={{ background: 'var(--bg-page)', padding: '40px 0 72px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>

                    {/* Vidéo */}
                    {hasVideo && (
                        <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
                            <video
                                src={realisation.video_url}
                                controls
                                playsInline
                                style={{ width: '100%', maxHeight: 580, display: 'block', objectFit: 'contain' }}
                            />
                        </div>
                    )}

                    {/* Galerie photos */}
                    {images.length > 0 && (
                        <div style={S.card}>
                            <div style={{ ...S.cardHeader, justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                        Galerie
                                    </h2>
                                </div>
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-page)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 999 }}>
                                    {images.length} photo{images.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
                                {images.map((img, idx) => (
                                    <button key={img.id ?? idx}
                                            onClick={() => setActiveImg(img)}
                                            style={{ border: '1px solid var(--border)', padding: 0, background: 'none', cursor: 'zoom-in', borderRadius: 12, overflow: 'hidden', aspectRatio: '1', display: 'block', transition: 'border-color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                        <img
                                            src={img.image_url ?? `/storage/${img.image_path}`}
                                            alt={img.title ?? realisation.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s' }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {realisation.description && (
                        <div style={S.card}>
                            <div style={S.cardHeader}>
                                <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Description</h2>
                            </div>
                            <div style={{ padding: 24 }}>
                                <p style={{ ...S.muted, whiteSpace: 'pre-line', margin: 0 }}>{realisation.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Retour */}
                    <div>
                        <Link href={route('realisations.index')}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--dropdown-bg)', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'border-color 0.2s, color 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                            <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                            Retour aux réalisations
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Lightbox ── */}
            {activeImg && (
                <div onClick={() => setActiveImg(null)}
                     style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}>
                    <img src={activeImg.image_url ?? `/storage/${activeImg.image_path}`}
                         alt={activeImg.title ?? ''}
                         onClick={e => e.stopPropagation()}
                         style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 32px 80px rgba(0,0,0,0.8)', cursor: 'default' }} />
                    <button onClick={() => setActiveImg(null)}
                            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ✕
                    </button>
                </div>
            )}
        </GuestLayout>
    );
}
