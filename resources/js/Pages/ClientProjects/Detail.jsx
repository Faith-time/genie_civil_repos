import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Components/Layout/GuestLayout';

const STATUS_MAP = {
    pending:      { label: 'En attente',      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: '⏳' },
    under_review: { label: 'En cours d\'analyse', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: '🔍' },
    quoted:       { label: 'Devis envoyé',    color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: '📄' },
    accepted:     { label: 'Accepté',         color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✅' },
    rejected:     { label: 'Refusé',          color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  icon: '❌' },
    in_progress:  { label: 'En cours',        color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '🔨' },
    completed:    { label: 'Terminé',         color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '🎉' },
};

const URGENCY_LABELS = {
    urgent:   { label: 'Urgent',   color: '#ef4444' },
    normal:   { label: 'Normal',   color: 'var(--gold)' },
    flexible: { label: 'Flexible', color: '#10b981' },
};

const S = {
    card: { background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '20px 28px', borderBottom: '1px solid var(--border)' },
    cardBody: { padding: '28px' },
    label: { fontFamily: "'DM Sans',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6, display: 'block' },
    value: { fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' },
    muted: { fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75 },
};

function InfoBlock({ label, value }) {
    if (!value) return null;
    return (
        <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 18px' }}>
            <span style={S.label}>{label}</span>
            <span style={S.value}>{value}</span>
        </div>
    );
}

export default function Detail({ project }) {
    if (!project) return null;

    const status   = STATUS_MAP[project.status]   ?? STATUS_MAP.pending;
    const urgency  = URGENCY_LABELS[project.urgency] ?? URGENCY_LABELS.normal;
    const images   = (project.media ?? []).filter(m => m.type === 'image');
    const docs     = (project.media ?? []).filter(m => m.type === 'document');

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    const formatAmount = (n) => n
        ? Number(n).toLocaleString('fr-FR') + ' FCFA'
        : null;

    return (
        <GuestLayout>
            <Head title={project.title} />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <div style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
                <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, borderRadius: '50%', border: '1px solid var(--border)', pointerEvents: 'none', opacity: 0.4 }} />
                <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(201,148,58,0.12)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', maxWidth: 896, margin: '0 auto', padding: '44px 24px 40px' }}>

                    {/* Retour */}
                    <Link href={route('realisations.index')}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', marginBottom: 24, transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                        <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                        Retour aux réalisations
                    </Link>

                    {/* Label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ width: 20, height: 1, background: 'var(--gold)' }} />
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif" }}>
                            Mon projet
                        </span>
                    </div>

                    {/* Titre + status */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.05, margin: 0, maxWidth: 600 }}>
                            {project.title}
                        </h1>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, background: status.bg, color: status.color, fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700, border: `1px solid ${status.color}30`, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {status.icon} {status.label}
                        </span>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16, alignItems: 'center' }}>
                        {project.service && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem' }}>
                                <svg style={{ width: 13, height: 13, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                {project.service.name}
                            </span>
                        )}
                        {project.location && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem' }}>
                                <svg style={{ width: 13, height: 13, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                {project.location}
                            </span>
                        )}
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', borderRadius: 999, background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: urgency.color, fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 700 }}>
                            Urgence : {urgency.label}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem' }}>
                            Soumis le {formatDate(project.created_at)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Contenu ───────────────────────────────────────────── */}
            <div style={{ background: 'var(--bg-page)', padding: '48px 0 72px' }}>
                <div style={{ maxWidth: 896, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Note admin si présente */}
                    {project.admin_notes && (
                        <div style={{ background: 'rgba(201,148,58,0.08)', border: '1px solid rgba(201,148,58,0.3)', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <svg style={{ width: 20, height: 20, color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <div>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Message de l'équipe</p>
                                <p style={S.muted}>{project.admin_notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Devis si disponible */}
                    {project.quote_amount && (
                        <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                            <div>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#10b981', marginBottom: 4 }}>Devis proposé</p>
                                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                    {formatAmount(project.quote_amount)}
                                </p>
                            </div>
                            {project.quote_file && (
                                <a href={`/storage/${project.quote_file}`} target="_blank" rel="noreferrer"
                                   style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: '#10b981', color: '#fff', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                    Télécharger le devis
                                </a>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <span style={{ width: 3, height: 22, background: 'var(--gold)', borderRadius: 2, flexShrink: 0 }} />
                            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Description du projet</h2>
                        </div>
                        <div style={S.cardBody}>
                            <p style={{ ...S.muted, whiteSpace: 'pre-line' }}>{project.description}</p>
                        </div>
                    </div>

                    {/* Infos */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <span style={{ width: 3, height: 22, background: 'var(--gold)', borderRadius: 2, flexShrink: 0 }} />
                            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Détails</h2>
                        </div>
                        <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                            <InfoBlock label="Service"           value={project.service?.name} />
                            <InfoBlock label="Localisation"      value={project.location} />
                            <InfoBlock label="Date souhaitée"    value={formatDate(project.desired_start_date)} />
                            <InfoBlock label="Budget min"        value={formatAmount(project.budget_estimate_min)} />
                            <InfoBlock label="Budget max"        value={formatAmount(project.budget_estimate_max)} />
                            <InfoBlock label="Urgence"           value={urgency.label} />
                        </div>
                    </div>

                    {/* Galerie images */}
                    {images.length > 0 && (
                        <div style={S.card}>
                            <div style={{ ...S.cardHeader, justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ width: 3, height: 22, background: 'var(--gold)', borderRadius: 2, flexShrink: 0 }} />
                                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Photos jointes</h2>
                                </div>
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-page)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 999 }}>
                                    {images.length} photo{images.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div style={{ padding: 28 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
                                    {images.map((img, idx) => (
                                        <a key={img.id ?? idx} href={`/storage/${img.file_path}`} target="_blank" rel="noreferrer"
                                           style={{ display: 'block', aspectRatio: '1', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', transition: 'border-color 0.2s, transform 0.2s' }}
                                           onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                           onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                                            <img src={`/storage/${img.file_path}`} alt={img.file_name ?? `Photo ${idx + 1}`}
                                                 style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {docs.length > 0 && (
                        <div style={S.card}>
                            <div style={S.cardHeader}>
                                <span style={{ width: 3, height: 22, background: 'var(--gold)', borderRadius: 2, flexShrink: 0 }} />
                                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Documents joints</h2>
                            </div>
                            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {docs.map((doc, idx) => (
                                    <a key={doc.id ?? idx} href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer"
                                       style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--bg-page)', textDecoration: 'none', transition: 'border-color 0.2s' }}
                                       onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                                       onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(201,148,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg style={{ width: 20, height: 20, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                                        </div>
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {doc.file_name}
                                            </p>
                                            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                                                {doc.mime_type} · {(doc.file_size / 1024).toFixed(0)} KB
                                            </p>
                                        </div>
                                        <svg style={{ width: 16, height: 16, color: 'var(--gold)', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 24, padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(to right,transparent,var(--gold),transparent)', opacity: 0.45 }} />
                        <div style={{ position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(to right,transparent,var(--gold),transparent)', opacity: 0.45 }} />

                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Besoin d'aide ?</p>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 8px' }}>
                            Vous avez des <em style={{ color: 'var(--gold)' }}>questions</em> ?
                        </h3>
                        <p style={{ ...S.muted, maxWidth: 400, margin: '0 auto 24px' }}>
                            Notre équipe est disponible pour répondre à toutes vos interrogations concernant votre projet.
                        </p>
                        <Link href={route('contact')}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold)', color: '#fff', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 28px', borderRadius: 12, boxShadow: '0 8px 24px rgba(201,148,58,0.28)', transition: 'transform 0.25s' }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                            <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            Nous contacter
                        </Link>
                    </div>

                </div>
            </div>
        </GuestLayout>
    );
}
