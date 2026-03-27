import { Head, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';
import GuestLayout from '@/Components/Layout/GuestLayout';

/* ─────────────────────────────────────────────────────────────────────────────
   VideoCard — réalisations avec video_url
   (Abdou Faye, Assane Diop, Centre Commercial Niodior, Cheikh Tidiane Sy…)
───────────────────────────────────────────────────────────────────────────── */
function VideoCard({ realisation, href }) {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [hovered, setHovered] = useState(false);

    const toggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!videoRef.current) return;
        playing ? videoRef.current.pause() : videoRef.current.play();
    };

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 16, overflow: 'hidden',
                border: `1px solid ${hovered ? 'var(--gold)' : 'var(--border)'}`,
                background: '#0a0a0a',
                transition: 'transform 0.4s cubic-bezier(.22,1,.36,1), border-color 0.3s, box-shadow 0.4s',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.45)' : '0 2px 12px rgba(0,0,0,0.2)',
                display: 'flex', flexDirection: 'column',
            }}
        >
            <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <video
                        ref={videoRef}
                        src={realisation.video_url}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer',
                            transform: hovered && !playing ? 'scale(1.03)' : 'scale(1)',
                            transition: 'transform 0.7s cubic-bezier(.22,1,.36,1)',
                        }}
                        preload="metadata" playsInline
                        onPlay={() => setPlaying(true)}
                        onPause={() => setPlaying(false)}
                        onEnded={() => setPlaying(false)}
                        onClick={toggle}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.1) 55%,transparent 80%)', pointerEvents: 'none' }} />
                    <button onClick={toggle} aria-label={playing ? 'Pause' : 'Lire'}
                            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', opacity: playing && !hovered ? 0 : 1, transition: 'opacity 0.3s' }}>
                        <span style={{ width: 54, height: 54, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: playing ? 'rgba(255,255,255,0.15)' : 'var(--gold)', border: playing ? '1px solid rgba(255,255,255,0.25)' : 'none', backdropFilter: playing ? 'blur(6px)' : 'none', boxShadow: playing ? 'none' : '0 0 0 10px rgba(201,148,58,0.15)', transition: 'all 0.3s' }}>
                            {playing
                                ? <svg style={{ width: 20, height: 20, color: '#fff' }} fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                : <svg style={{ width: 22, height: 22, color: '#fff', marginLeft: 3 }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            }
                        </span>
                    </button>
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {realisation.service && (
                            <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--gold)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.07em', textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                                {realisation.service.name}
                            </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', color: 'rgba(255,255,255,0.9)', fontSize: '0.6rem', fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                            <svg style={{ width: 9, height: 9 }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            Vidéo
                        </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px', pointerEvents: 'none' }}>
                        <h3 style={{ color: '#fff', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 5px', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.6)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {realisation.title}
                        </h3>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {realisation.location && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(255,255,255,0.6)', fontSize: '0.68rem', fontFamily: "'DM Sans',sans-serif" }}>
                                    <svg style={{ width: 10, height: 10 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    {realisation.location}
                                </span>
                            )}
                            {realisation.date_realisation && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(255,255,255,0.6)', fontSize: '0.68rem', fontFamily: "'DM Sans',sans-serif" }}>
                                    <svg style={{ width: 10, height: 10 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    {new Date(realisation.date_realisation).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Link href={href}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--border)', color: 'var(--gold)', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'background 0.2s, padding-left 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,148,58,0.06)'; e.currentTarget.style.paddingLeft = '18px'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '14px'; }}>
                <span>Voir le projet</span>
                <svg style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </Link>
        </article>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PhotoCard — réalisations SANS vidéo, une carte par image
   (Madame_Zeinab → img1…img15 / autres → img16…img20)
───────────────────────────────────────────────────────────────────────────── */
function PhotoCard({ image, realisation, href }) {
    const [hovered, setHovered] = useState(false);

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 16, overflow: 'hidden',
                border: `1px solid ${hovered ? 'var(--gold)' : 'var(--border)'}`,
                background: 'var(--dropdown-bg)',
                transition: 'transform 0.4s cubic-bezier(.22,1,.36,1), border-color 0.3s, box-shadow 0.4s',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.15)',
                display: 'flex', flexDirection: 'column',
            }}
        >
            <div style={{ position: 'relative', paddingTop: '75%', background: '#111', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <img
                        src={image.image_url}
                        alt={image.title ?? realisation.title}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                            transform: hovered ? 'scale(1.06)' : 'scale(1)',
                            transition: 'transform 0.7s cubic-bezier(.22,1,.36,1)',
                        }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.05) 50%,transparent 80%)', pointerEvents: 'none' }} />
                    {realisation.service && (
                        <span style={{ position: 'absolute', top: 10, left: 10, padding: '4px 10px', borderRadius: 999, background: 'var(--gold)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.07em', textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                            {realisation.service.name}
                        </span>
                    )}
                    {image.is_main && (
                        <span style={{ position: 'absolute', top: 10, right: 10, padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', color: 'rgba(255,255,255,0.85)', fontSize: '0.58rem', fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                            Principale
                        </span>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px', pointerEvents: 'none' }}>
                        <h3 style={{ color: '#fff', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.6)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {image.title ?? realisation.title}
                        </h3>
                        {realisation.location && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(255,255,255,0.6)', fontSize: '0.68rem', fontFamily: "'DM Sans',sans-serif" }}>
                                <svg style={{ width: 10, height: 10 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                {realisation.location}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <Link href={href}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--border)', color: 'var(--gold)', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'background 0.2s, padding-left 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,148,58,0.06)'; e.currentTarget.style.paddingLeft = '18px'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '14px'; }}>
                <span>Voir le projet</span>
                <svg style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </Link>
        </article>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ClientSection
───────────────────────────────────────────────────────────────────────────── */
function ClientSection({ clientName, realisations }) {
    const cards = [];

    realisations.forEach(r => {
        const isVirtual = typeof r.id === 'string' && r.id.startsWith('img_');

        if (r.video_url) {
            // Vidéo → toujours un vrai ID en base
            cards.push(
                <VideoCard key={`video-${r.id}`} realisation={r}
                           href={route('realisations.show', r.id)} />
            );
        } else {
            (r.images ?? []).forEach((img, idx) => {
                // ✅ Photo virtuelle (dossier) → route showFolder
                // ✅ Photo en base → route show
                const href = isVirtual
                    ? route('realisations.show-folder', r.client_name)
                    : route('realisations.show', r.id);

                cards.push(
                    <PhotoCard key={`photo-${r.id}-${img.id ?? idx}`}
                               image={img} realisation={r} href={href} />
                );
            });
        }
    });

    if (cards.length === 0) return null;

    const videoCount = realisations.filter(r => r.video_url).length;
    const photoCount = realisations.filter(r => !r.video_url).reduce((s, r) => s + (r.images?.length ?? 0), 0);

    return (
        <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--dropdown-bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 17, height: 17, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                </div>
                <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, lineHeight: 1 }}>
                        {clientName}
                    </h2>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                        {videoCount > 0 && `${videoCount} vidéo${videoCount > 1 ? 's' : ''}`}
                        {videoCount > 0 && photoCount > 0 && ' · '}
                        {photoCount > 0 && `${photoCount} photo${photoCount > 1 ? 's' : ''}`}
                    </p>
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)', marginLeft: 4 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                {cards}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page Index
───────────────────────────────────────────────────────────────────────────── */
export default function Index({ realisations }) {
    const [activeService, setActiveService] = useState(null);

    const services = [...new Map(
        realisations.filter(r => r.service).map(r => [r.service.id, r.service])
    ).values()];

    const filtered = activeService
        ? realisations.filter(r => r.service?.id === activeService)
        : realisations;

    const grouped = filtered.reduce((acc, r) => {
        const key = r.client_name?.trim() || 'Autres projets';
        if (!acc[key]) acc[key] = [];
        acc[key].push(r);
        return acc;
    }, {});

    const groups = Object.entries(grouped);

    return (
        <GuestLayout>
            <Head title="Mes Réalisations" />

            <div style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
                <div style={{ position: 'absolute', top: -150, right: -150, width: 600, height: 600, borderRadius: '50%', border: '1px solid var(--border)', pointerEvents: 'none', opacity: 0.4 }} />
                <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', border: '1px solid rgba(201,148,58,0.12)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '56px 24px 40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
                        <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", margin: 0 }}>Portfolio</p>
                    </div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.8rem,7vw,5rem)', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.0, margin: '0 0 10px' }}>
                        Mes <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Réalisations</em>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', margin: 0 }}>
                        {realisations.length} projet{realisations.length !== 1 ? 's' : ''} · {groups.length} client{groups.length !== 1 ? 's' : ''}
                    </p>

                    {services.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
                            {[{ id: null, name: `Tous (${realisations.length})` }, ...services.map(s => ({ id: s.id, name: s.name }))].map(item => {
                                const active = activeService === item.id;
                                return (
                                    <button key={item.id ?? 'all'} onClick={() => setActiveService(item.id)}
                                            style={{ padding: '7px 18px', borderRadius: 999, border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`, background: active ? 'var(--gold)' : 'transparent', color: active ? '#fff' : 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; } }}
                                            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
                                    >{item.name}</button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ background: 'var(--bg-page)', minHeight: '60vh', padding: '52px 0 64px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                    {groups.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
                            {groups.map(([clientName, items]) => (
                                <ClientSection key={clientName} clientName={clientName} realisations={items} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '96px 0' }}>
                            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: 8 }}>Aucune réalisation</p>
                            <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', marginBottom: 20 }}>
                                {activeService ? 'Aucun projet pour ce service.' : 'Les réalisations apparaîtront ici.'}
                            </p>
                            {activeService && (
                                <button onClick={() => setActiveService(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', textDecoration: 'underline' }}>
                                    Voir tous les projets
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ padding: '0 24px 72px', maxWidth: 1280, margin: '0 auto' }}>
                <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 28, padding: 'clamp(40px,6vw,72px) clamp(24px,5vw,64px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(to right,transparent,var(--gold),transparent)', opacity: 0.5 }} />
                    <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(to right,transparent,var(--gold),transparent)', opacity: 0.5 }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
                        <span style={{ width: 20, height: 1, background: 'var(--gold)' }} />
                        <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", margin: 0 }}>Vous avez un projet ?</p>
                        <span style={{ width: 20, height: 1, background: 'var(--gold)' }} />
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 12px', lineHeight: 1.1 }}>
                        Travaillons <em style={{ color: 'var(--gold)' }}>ensemble</em>
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', maxWidth: 440, margin: '0 auto 32px' }}>
                        Soumettez votre projet et je vous contacterai dans les plus brefs délais.
                    </p>
                    <Link href={route('client-projects.create')}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--gold)', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', padding: '15px 36px', borderRadius: 14, boxShadow: '0 8px 24px rgba(201,148,58,0.3)', transition: 'transform 0.25s, box-shadow 0.25s' }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(201,148,58,0.4)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,148,58,0.3)'; }}>
                        <svg style={{ width: 15, height: 15 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                        Soumettre mon projet
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
