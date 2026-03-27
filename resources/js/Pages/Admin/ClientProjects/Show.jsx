import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Components/Layout/GuestLayout';

const STATUS = {
    pending:      { label: 'En attente',        color: '#e8a84a', bg: 'rgba(232,168,74,0.12)' },
    under_review: { label: "En cours d'examen", color: '#4a90e8', bg: 'rgba(74,144,232,0.12)' },
    quoted:       { label: 'Devis envoyé',       color: '#9b59b6', bg: 'rgba(155,89,182,0.12)' },
    accepted:     { label: 'Accepté',            color: '#27ae60', bg: 'rgba(39,174,96,0.12)'  },
    rejected:     { label: 'Rejeté',             color: '#e05252', bg: 'rgba(224,82,82,0.12)'  },
    in_progress:  { label: 'En cours',           color: '#1abc9c', bg: 'rgba(26,188,156,0.12)' },
    completed:    { label: 'Terminé',            color: '#8a9bb5', bg: 'rgba(138,155,181,0.12)'},
};

const URGENCY = {
    flexible: { label: 'Flexible', color: '#8a9bb5' },
    normal:   { label: 'Normal',   color: '#4a90e8' },
    urgent:   { label: 'Urgent',   color: '#e05252' },
};

const S = {
    card:       { background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid var(--border)' },
    cardBody:   { padding: '24px' },
    label:      { fontFamily: "'DM Sans',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6, display: 'block' },
    value:      { fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' },
    muted:      { fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75 },
    input:      { width: '100%', padding: '10px 14px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-main)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
};

function fileTheme(filename) {
    const ext = (filename ?? '').split('.').pop().toLowerCase();
    if (ext === 'pdf')                return { color: '#e05252', bg: 'rgba(224,82,82,0.08)',  border: 'rgba(224,82,82,0.25)',  label: 'PDF' };
    if (['xls','xlsx'].includes(ext)) return { color: '#27ae60', bg: 'rgba(39,174,96,0.08)',  border: 'rgba(39,174,96,0.25)',  label: 'Excel' };
    if (['doc','docx'].includes(ext)) return { color: '#4a90e8', bg: 'rgba(74,144,232,0.08)', border: 'rgba(74,144,232,0.25)', label: 'Word' };
    return                                   { color: '#9b59b6', bg: 'rgba(155,89,182,0.08)', border: 'rgba(155,89,182,0.25)', label: 'Fichier' };
}

function FileTypeIcon({ filename, size = 22 }) {
    const ext = (filename ?? '').split('.').pop().toLowerCase();
    const { color } = fileTheme(filename);
    if (['xls','xlsx'].includes(ext)) return (
        <svg style={{ width: size, height: size, color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 6h18M3 14h18M3 18h18M9 6v12M15 6v12"/>
        </svg>
    );
    if (['doc','docx'].includes(ext)) return (
        <svg style={{ width: size, height: size, color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
    );
    return (
        <svg style={{ width: size, height: size, color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
    );
}

function InfoBlock({ label, value }) {
    if (!value) return null;
    return (
        <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
            <span style={S.label}>{label}</span>
            <span style={S.value}>{value}</span>
        </div>
    );
}

// ─── Bouton Messagerie ────────────────────────────────────────────────────────
function MessagerieBouton({ project, conversation, isAdmin }) {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        router.post(
            route('conversations.store-for-project', project.id),
            {},
            { onFinish: () => setLoading(false) }
        );
    };

    const convHref = conversation
        ? (isAdmin
            ? route('admin.conversations.show', conversation.id)
            : route('conversations.show', conversation.id))
        : null;

    const isOpen = conversation?.status === 'open';

    return (

        <div style={{ ...S.card, border: '1px solid rgba(74,144,232,0.35)' }}>
            <div style={{ ...S.cardHeader, background: 'rgba(74,144,232,0.05)' }}>
                <span style={{ width: 3, height: 20, background: '#4a90e8', borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, flex: 1 }}>
                    Messagerie
                </h2>
                {conversation && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: isOpen ? 'rgba(34,197,94,0.12)' : 'rgba(138,155,181,0.12)', border: `1px solid ${isOpen ? 'rgba(34,197,94,0.3)' : 'rgba(138,155,181,0.3)'}`, fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700, color: isOpen ? '#22c55e' : '#8a9bb5' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: isOpen ? '#22c55e' : '#8a9bb5' }} />
                        {isOpen ? 'Active' : 'Fermée'}
                    </span>
                )}
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                    {conversation
                        ? isAdmin
                            ? 'Accédez à la conversation avec ce client concernant ce projet.'
                            : 'Échangez directement avec notre équipe sur ce projet.'
                        : isAdmin
                            ? 'Ouvrez une conversation avec le client pour ce projet.'
                            : 'Démarrez une conversation avec notre équipe à propos de ce projet.'}
                </p>

                {convHref ? (
                    <Link href={convHref}
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 20px', borderRadius: 12, background: '#4a90e8', color: '#fff', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'background 0.2s, transform 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#357abd'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#4a90e8'; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <svg style={{ width: 15, height: 15 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        Ouvrir la conversation
                    </Link>
                ) : (
                    <button onClick={handleClick} disabled={loading}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 20px', borderRadius: 12, background: loading ? 'rgba(74,144,232,0.5)' : '#4a90e8', color: '#fff', border: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s, transform 0.15s' }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#357abd'; e.currentTarget.style.transform = 'scale(1.02)'; }}}
                            onMouseLeave={e => { e.currentTarget.style.background = '#4a90e8'; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <svg style={{ width: 15, height: 15 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        {loading ? 'Ouverture...' : 'Démarrer la messagerie'}
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── AdminPanel ───────────────────────────────────────────────────────────────
function AdminPanel({ project }) {
    const { data, setData, processing, errors } = useForm({
        status:      project.status      ?? 'pending',
        admin_notes: project.admin_notes ?? '',
        quote_file:  null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('_method',     'PATCH');
        fd.append('status',      data.status);
        fd.append('admin_notes', data.admin_notes ?? '');
        if (data.quote_file) fd.append('quote_file', data.quote_file);
        router.post(route('admin.client-projects.update-status', project.id), fd);
    };

    const currentFilename = project.quote_file ? project.quote_file.split('/').pop() : null;
    const ft = currentFilename ? fileTheme(currentFilename) : null;

    return (
        <form onSubmit={handleSubmit} style={S.card}>
            <div style={S.cardHeader}>
                <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    Gérer la demande
                </h2>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>

                <div>
                    <label style={S.label}>Statut</label>
                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                            style={{ ...S.input, cursor: 'pointer' }}>
                        {Object.entries(STATUS).map(([key, s]) => (
                            <option key={key} value={key}>{s.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={S.label}>Notes / Message au client</label>
                    <textarea value={data.admin_notes} onChange={e => setData('admin_notes', e.target.value)}
                              rows={4} placeholder="Résumé du devis, remarques, prochaines étapes..."
                              style={{ ...S.input, resize: 'none', lineHeight: 1.6 }} />
                </div>

                <div>
                    <label style={S.label}>
                        Document devis
                        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 6 }}>
                            — PDF, Word ou Excel
                        </span>
                    </label>
                    {currentFilename && ft && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: ft.bg, border: `1px solid ${ft.border}`, marginBottom: 10 }}>
                            <FileTypeIcon filename={currentFilename} size={20} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentFilename}</p>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.68rem', color: ft.color, margin: '2px 0 0', fontWeight: 600 }}>Devis actuel · {ft.label}</p>
                            </div>
                            <a href={`/storage/${project.quote_file}`} target="_blank" rel="noreferrer"
                               style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 11px', borderRadius: 8, border: `1px solid ${ft.border}`, background: 'var(--dropdown-bg)', color: ft.color, fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
                                Voir
                            </a>
                        </div>
                    )}
                    <label htmlFor="quote_file_input"
                           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 16px', borderRadius: 12, border: '2px dashed var(--border)', background: 'var(--bg-page)', cursor: 'pointer', transition: 'border-color 0.2s' }}
                           onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                           onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                            {currentFilename ? 'Remplacer le document' : 'Uploader le devis'}
                        </p>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>PDF · Word · Excel — max 20 Mo</p>
                        {data.quote_file && (
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold)' }}>✓ {data.quote_file.name}</span>
                        )}
                    </label>
                    <input id="quote_file_input" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx"
                           onChange={e => setData('quote_file', e.target.files[0] ?? null)}
                           style={{ display: 'none' }} />
                </div>

                {Object.keys(errors).length > 0 && (
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)' }}>
                        {Object.values(errors).map((err, i) => (
                            <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#e05252', margin: '2px 0' }}>{err}</p>
                        ))}
                    </div>
                )}

                <button type="submit" disabled={processing}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: 'none', background: 'var(--gold)', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.6 : 1, boxShadow: '0 4px 16px rgba(201,148,58,0.3)' }}>
                    {processing ? 'Enregistrement...' : 'Mettre à jour'}
                </button>
            </div>
        </form>
    );
}

// ─── QuotePanel ───────────────────────────────────────────────────────────────
function QuotePanel({ project }) {
    const hasQuote = project.quote_file || project.admin_notes;
    if (!hasQuote) return null;
    const filename = project.quote_file ? project.quote_file.split('/').pop() : null;
    const ft = filename ? fileTheme(filename) : null;

    return (
        <div style={{ ...S.card, border: '1px solid rgba(155,89,182,0.35)' }}>
            <div style={{ ...S.cardHeader, background: 'rgba(155,89,182,0.06)' }}>
                <span style={{ width: 3, height: 20, background: '#9b59b6', borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Votre devis</h2>
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(155,89,182,0.12)', border: '1px solid rgba(155,89,182,0.3)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.68rem', fontWeight: 700, color: '#9b59b6' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#9b59b6' }} />Disponible
                </span>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {project.admin_notes && (
                    <div>
                        <span style={S.label}>Message de l'équipe</span>
                        <p style={{ ...S.muted, whiteSpace: 'pre-line', margin: 0, padding: '14px 16px', borderRadius: 12, background: 'var(--bg-page)', border: '1px solid var(--border)', lineHeight: 1.7 }}>
                            {project.admin_notes}
                        </p>
                    </div>
                )}
                {filename && ft && (
                    <div>
                        <span style={S.label}>Document devis complet</span>
                        <a href={`/storage/${project.quote_file}`} target="_blank" rel="noreferrer"
                           style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderRadius: 14, background: ft.bg, border: `1px solid ${ft.border}`, textDecoration: 'none', transition: 'filter 0.2s, transform 0.15s' }}
                           onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                           onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--dropdown-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${ft.border}` }}>
                                <FileTypeIcon filename={filename} size={24} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filename}</p>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: ft.color, margin: '4px 0 0', fontWeight: 600 }}>{ft.label} — Cliquez pour ouvrir ou télécharger</p>
                            </div>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--dropdown-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${ft.border}` }}>
                                <svg style={{ width: 16, height: 16, color: ft.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            </div>
                        </a>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', margin: '10px 0 0', fontStyle: 'italic', lineHeight: 1.55 }}>
                            Ce document contient le détail complet des prestations et des coûts. Contactez-nous pour toute question.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function WaitingQuotePanel() {
    return (
        <div style={{ ...S.card, border: '1px solid rgba(138,155,181,0.2)' }}>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
                <div style={{ width: 58, height: 58, borderRadius: 16, background: 'var(--bg-page)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ width: 26, height: 26, color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 8px' }}>Devis en préparation</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 }}>
                        Notre équipe analyse votre demande et prépare un document de devis détaillé.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Page Show ────────────────────────────────────────────────────────────────
export default function Show({ project, conversation }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => (r?.name ?? r) === 'admin');

    if (!project) return null;

    const status  = STATUS[project.status]   ?? STATUS.pending;
    const urgency = URGENCY[project.urgency] ?? URGENCY.normal;
    const images  = (project.media ?? []).filter(m => m.type === 'image');
    const docs    = (project.media ?? []).filter(m => m.type === 'document');

    const fmt    = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
    const fmtAmt = (n) => n ? Number(n).toLocaleString('fr-FR') + ' FCFA' : null;
    const indexRoute = isAdmin ? route('admin.client-projects.index') : route('client-projects.index');

    return (

        <GuestLayout>

            <Head title={`${isAdmin ? 'Projet' : 'Mon projet'} — ${project.title}`} />

            {/* ── Hero ── */}
            <div style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
                <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, borderRadius: '50%', border: '1px solid var(--border)', pointerEvents: 'none', opacity: 0.4 }} />
                <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '44px 24px 36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Link href={indexRoute} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            {isAdmin ? 'Demandes clients' : 'Mes projets'}
                        </Link>
                        <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        <span style={{ color: 'var(--gold)' }}>{project.title}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <span style={{ width: 20, height: 1, background: 'var(--gold)' }} />
                                <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif" }}>
                                    {isAdmin ? 'Administration' : 'Espace client'}
                                </span>
                            </div>
                            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.05, margin: '0 0 12px', maxWidth: 700 }}>
                                {project.title}
                            </h1>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                                {isAdmin && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem' }}>
                                        <svg style={{ width: 13, height: 13, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                        {project.user?.name ?? '—'}
                                    </span>
                                )}
                                {project.service && (
                                    <span style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(201,148,58,0.1)', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 700 }}>
                                        {project.service.name}
                                    </span>
                                )}
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: urgency.color, fontWeight: 600 }}>Urgence : {urgency.label}</span>
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)' }}>Soumis le {fmt(project.created_at)}</span>
                            </div>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 999, background: status.bg, color: status.color, fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700, border: `1px solid ${status.color}40`, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.color }} />
                            {status.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Contenu ── */}
            <div style={{ background: 'var(--bg-page)', padding: '40px 0 72px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

                    {/* Colonne gauche */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={S.card}>
                            <div style={S.cardHeader}>
                                <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Description</h2>
                            </div>
                            <div style={S.cardBody}>
                                <p style={{ ...S.muted, whiteSpace: 'pre-line', margin: 0 }}>{project.description}</p>
                            </div>
                        </div>

                        <div style={S.card}>
                            <div style={S.cardHeader}>
                                <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Détails</h2>
                            </div>
                            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
                                <InfoBlock label="Localisation"   value={project.location} />
                                <InfoBlock label="Date souhaitée" value={fmt(project.desired_start_date)} />
                                <InfoBlock label="Budget min"     value={fmtAmt(project.budget_estimate_min)} />
                                <InfoBlock label="Budget max"     value={fmtAmt(project.budget_estimate_max)} />
                                <InfoBlock label="Urgence"        value={urgency.label} />
                                <InfoBlock label="Statut"         value={status.label} />
                            </div>
                        </div>

                        {images.length > 0 && (
                            <div style={S.card}>
                                <div style={{ ...S.cardHeader, justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Photos jointes</h2>
                                    </div>
                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-page)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 999 }}>
                                        {images.length} photo{images.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div style={{ padding: 24 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 10 }}>
                                        {images.map((img, idx) => (
                                            <a key={img.id ?? idx} href={img.url ?? `/storage/${img.file_path}`} target="_blank" rel="noreferrer"
                                               style={{ display: 'block', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', transition: 'border-color 0.2s, transform 0.2s' }}
                                               onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                               onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                                                <img src={img.url ?? `/storage/${img.file_path}`} alt={img.file_name ?? `Photo ${idx + 1}`}
                                                     style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {docs.length > 0 && (
                            <div style={S.card}>
                                <div style={S.cardHeader}>
                                    <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Documents joints</h2>
                                </div>
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {docs.map((doc, idx) => (
                                        <a key={doc.id ?? idx} href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer"
                                           style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-page)', textDecoration: 'none', transition: 'border-color 0.2s' }}
                                           onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                                           onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,148,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <svg style={{ width: 18, height: 18, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.file_name}</p>
                                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.68rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{(doc.file_size / 1024).toFixed(0)} KB</p>
                                            </div>
                                            <svg style={{ width: 15, height: 15, color: 'var(--gold)', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Colonne droite */}
                    <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* ── Messagerie (admin + client) ── */}
                        <MessagerieBouton project={project} conversation={conversation} isAdmin={isAdmin} />

                        {/* Admin : formulaire de gestion */}
                        {isAdmin && <AdminPanel project={project} />}

                        {/* Client : devis reçu ou attente */}
                        {!isAdmin && (
                            project.quote_file || project.admin_notes
                                ? <QuotePanel project={project} />
                                : <WaitingQuotePanel />
                        )}

                        {/* Infos client — admin seulement */}
                        {isAdmin && project.user && (
                            <div style={S.card}>
                                <div style={S.cardHeader}>
                                    <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Client</h2>
                                </div>
                                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{project.user.name}</p>
                                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{project.user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Retour — client seulement */}
                        {!isAdmin && (
                            <Link href={indexRoute}
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--dropdown-bg)', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'border-color 0.2s, color 0.2s' }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                                Retour à mes projets
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
