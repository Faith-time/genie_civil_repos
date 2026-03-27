import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
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
    card: { background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid var(--border)' },
    cardBody: { padding: '24px' },
    label: { fontFamily: "'DM Sans',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6, display: 'block' },
    value: { fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' },
    muted: { fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75 },
    input: { width: '100%', padding: '10px 14px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-main)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
};

function InfoBlock({ label, value }) {
    if (!value) return null;
    return (
        <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
            <span style={S.label}>{label}</span>
            <span style={S.value}>{value}</span>
        </div>
    );
}

// ─── Panneau devis (côté client) ─────────────────────────────────────────────
function QuotePanel({ project }) {
    const hasQuote = project.quote_amount || project.quote_file || project.admin_notes;
    if (!hasQuote) return null;

    return (
        <div style={{ ...S.card, border: '1px solid rgba(155,89,182,0.35)' }}>
            <div style={{ ...S.cardHeader, background: 'rgba(155,89,182,0.06)' }}>
                <span style={{ width: 3, height: 20, background: '#9b59b6', borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    Devis reçu
                </h2>
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(155,89,182,0.12)', border: '1px solid rgba(155,89,182,0.3)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.68rem', fontWeight: 700, color: '#9b59b6' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#9b59b6' }} />
                    Devis envoyé
                </span>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Montant */}
                {project.quote_amount && (
                    <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(155,89,182,0.07)', border: '1px solid rgba(155,89,182,0.2)' }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b59b6', display: 'block', marginBottom: 6 }}>
                            Montant estimé
                        </span>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {Number(project.quote_amount).toLocaleString('fr-FR')} FCFA
                        </span>
                    </div>
                )}

                {/* Message admin */}
                {project.admin_notes && (
                    <div>
                        <span style={S.label}>Message de l'équipe</span>
                        <p style={{ ...S.muted, whiteSpace: 'pre-line', margin: 0, padding: '12px 16px', borderRadius: 12, background: 'var(--bg-page)', border: '1px solid var(--border)' }}>
                            {project.admin_notes}
                        </p>
                    </div>
                )}

                {/* PDF devis */}
                {project.quote_file && (
                    <a href={`/storage/${project.quote_file}`} target="_blank" rel="noreferrer"
                       style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.25)', textDecoration: 'none', transition: 'background 0.2s' }}
                       onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,89,182,0.16)'}
                       onMouseLeave={e => e.currentTarget.style.background = 'rgba(155,89,182,0.08)'}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(155,89,182,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg style={{ width: 20, height: 20, color: '#9b59b6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                Télécharger le devis PDF
                            </p>
                            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                                Cliquez pour ouvrir ou enregistrer
                            </p>
                        </div>
                        <svg style={{ width: 16, height: 16, color: '#9b59b6', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                    </a>
                )}
            </div>
        </div>
    );
}

// ─── Panneau gestion admin ────────────────────────────────────────────────────
function AdminPanel({ project }) {
    const { data, setData, post, processing, errors } = useForm({
        status:       project.status ?? 'pending',
        admin_notes:  project.admin_notes ?? '',
        quote_amount: project.quote_amount ?? '',
        quote_file:   null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('status', data.status);
        formData.append('admin_notes', data.admin_notes ?? '');
        formData.append('quote_amount', data.quote_amount ?? '');
        if (data.quote_file) {
            formData.append('quote_file', data.quote_file);
        }
        router.post(route('admin.client-projects.update-status', project.id), formData);
    };

    return (
        <form onSubmit={handleSubmit} style={S.card}>
            <div style={S.cardHeader}>
                <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Gérer la demande</h2>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Statut */}
                <div>
                    <label style={S.label}>Statut</label>
                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                            style={{ ...S.input, cursor: 'pointer' }}>
                        {Object.entries(STATUS).map(([key, s]) => (
                            <option key={key} value={key}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Note admin */}
                <div>
                    <label style={S.label}>Message au client</label>
                    <textarea value={data.admin_notes} onChange={e => setData('admin_notes', e.target.value)}
                              rows={4} placeholder="Informations, remarques, prochaines étapes..."
                              style={{ ...S.input, resize: 'none', lineHeight: 1.6 }} />
                </div>

                {/* Montant devis */}
                <div>
                    <label style={S.label}>Montant du devis (FCFA)</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: "'DM Sans',sans-serif", pointerEvents: 'none' }}>FCFA</span>
                        <input type="number" value={data.quote_amount} onChange={e => setData('quote_amount', e.target.value)}
                               placeholder="0" style={{ ...S.input, paddingLeft: 50 }} />
                    </div>
                </div>

                {/* Fichier devis PDF */}
                <div>
                    <label style={S.label}>Devis PDF</label>
                    <input type="file" accept=".pdf"
                           onChange={e => setData('quote_file', e.target.files[0])}
                           style={{ ...S.input, padding: '8px 12px', cursor: 'pointer' }} />
                    {project.quote_file && (
                        <a href={`/storage/${project.quote_file}`} target="_blank" rel="noreferrer"
                           style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', textDecoration: 'none' }}>
                            <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            Devis actuel
                        </a>
                    )}
                </div>

                {/* Erreurs */}
                {Object.keys(errors).length > 0 && (
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)' }}>
                        {Object.values(errors).map((err, i) => (
                            <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#e05252', margin: '2px 0' }}>{err}</p>
                        ))}
                    </div>
                )}

                <button type="submit" disabled={processing} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 24px', borderRadius: 12, border: 'none',
                    background: 'var(--gold)', color: '#fff',
                    fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    opacity: processing ? 0.6 : 1,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 16px rgba(201,148,58,0.3)',
                }}
                        onMouseEnter={e => { if (!processing) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,148,58,0.4)'; } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,148,58,0.3)'; }}>
                    {processing ? 'Enregistrement...' : 'Mettre à jour'}
                </button>
            </div>
        </form>
    );
}

// ─── Show ─────────────────────────────────────────────────────────────────────
export default function Show({ project }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => (r?.name ?? r) === 'admin');

    if (!project) return null;

    const status  = STATUS[project.status]   ?? STATUS.pending;
    const urgency = URGENCY[project.urgency] ?? URGENCY.normal;
    const images  = (project.media ?? []).filter(m => m.type === 'image');
    const docs    = (project.media ?? []).filter(m => m.type === 'document');

    const fmt    = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
    const fmtAmt = (n) => n ? Number(n).toLocaleString('fr-FR') + ' FCFA' : null;

    const indexRoute = isAdmin
        ? route('admin.client-projects.index')
        : route('client-projects.index');

    return (
        <GuestLayout>
            <Head title={`${isAdmin ? 'Projet' : 'Mon projet'} — ${project.title}`} />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <div style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
                <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, borderRadius: '50%', border: '1px solid var(--border)', pointerEvents: 'none', opacity: 0.4 }} />

                <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '44px 24px 36px' }}>

                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Link href={indexRoute}
                              style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            {isAdmin ? 'Demandes clients' : 'Mes projets'}
                        </Link>
                        <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        <span style={{ color: 'var(--gold)' }}>{project.title}</span>
                    </div>

                    {/* Titre + statut */}
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
                                {/* Nom client — visible admin seulement */}
                                {isAdmin && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem' }}>
                                        <svg style={{ width: 13, height: 13, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        {project.user?.name ?? '—'}
                                    </span>
                                )}
                                {project.service && (
                                    <span style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(201,148,58,0.1)', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 700 }}>
                                        {project.service.name}
                                    </span>
                                )}
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: urgency.color, fontWeight: 600 }}>
                                    Urgence : {urgency.label}
                                </span>
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    Soumis le {fmt(project.created_at)}
                                </span>
                            </div>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 999, background: status.bg, color: status.color, fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700, border: `1px solid ${status.color}40`, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.color }} />
                            {status.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Contenu ───────────────────────────────────────────── */}
            <div style={{ background: 'var(--bg-page)', padding: '40px 0 72px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

                    {/* ── Colonne gauche ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Description */}
                        <div style={S.card}>
                            <div style={S.cardHeader}>
                                <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Description</h2>
                            </div>
                            <div style={S.cardBody}>
                                <p style={{ ...S.muted, whiteSpace: 'pre-line', margin: 0 }}>{project.description}</p>
                            </div>
                        </div>

                        {/* Détails */}
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

                        {/* Photos */}
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

                        {/* Documents joints */}
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
                                                <svg style={{ width: 18, height: 18, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                                </svg>
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {doc.file_name}
                                                </p>
                                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.68rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                                                    {(doc.file_size / 1024).toFixed(0)} KB
                                                </p>
                                            </div>
                                            <svg style={{ width: 15, height: 15, color: 'var(--gold)', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Colonne droite ── */}
                    <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Panneau admin : formulaire de gestion */}
                        {isAdmin && <AdminPanel project={project} />}

                        {/* Panneau client : affichage du devis reçu */}
                        {!isAdmin && <QuotePanel project={project} />}

                        {/* Informations client — admin seulement */}
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

                        {/* Bouton retour — client */}
                        {!isAdmin && (
                            <Link href={indexRoute}
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--dropdown-bg)', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'border-color 0.2s, color 0.2s' }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                                </svg>
                                Retour à mes projets
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
