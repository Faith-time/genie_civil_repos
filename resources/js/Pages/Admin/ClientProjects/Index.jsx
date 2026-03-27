import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Components/Layout/GuestLayout';

const STATUS = {
    pending:      { label: 'En attente',         color: '#e8a84a', bg: 'rgba(232,168,74,0.12)' },
    under_review: { label: "En cours d'examen",  color: '#4a90e8', bg: 'rgba(74,144,232,0.12)' },
    quoted:       { label: 'Devis envoyé',        color: '#9b59b6', bg: 'rgba(155,89,182,0.12)' },
    accepted:     { label: 'Accepté',             color: '#27ae60', bg: 'rgba(39,174,96,0.12)'  },
    rejected:     { label: 'Rejeté',              color: '#e05252', bg: 'rgba(224,82,82,0.12)'  },
    in_progress:  { label: 'En cours',            color: '#1abc9c', bg: 'rgba(26,188,156,0.12)' },
    completed:    { label: 'Terminé',             color: '#8a9bb5', bg: 'rgba(138,155,181,0.12)'},
};

const URGENCY = {
    flexible: { label: 'Flexible', color: '#8a9bb5' },
    normal:   { label: 'Normal',   color: '#4a90e8' },
    urgent:   { label: 'Urgent',   color: '#e05252' },
};

function StatusBadge({ status }) {
    const s = STATUS[status] ?? { label: status, color: '#8a9bb5', bg: 'rgba(138,155,181,0.12)' };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: s.bg, border: `1px solid ${s.color}40`, fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: s.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            {s.label}
        </span>
    );
}

function UrgencyBadge({ urgency }) {
    const u = URGENCY[urgency] ?? { label: urgency, color: '#8a9bb5' };
    return (
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.68rem', fontWeight: 600, color: u.color }}>
            {u.label}
        </span>
    );
}

function formatBudget(min, max) {
    const fmt = (v) => v ? Number(v).toLocaleString('fr-FR') + ' FCFA' : null;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `≥ ${fmt(min)}`;
    if (max) return `≤ ${fmt(max)}`;
    return '—';
}

function fileTheme(filename) {
    const ext = (filename ?? '').split('.').pop().toLowerCase();
    if (ext === 'pdf')                return { color: '#e05252', bg: 'rgba(224,82,82,0.08)',  border: 'rgba(224,82,82,0.25)',  label: 'PDF' };
    if (['xls','xlsx'].includes(ext)) return { color: '#27ae60', bg: 'rgba(39,174,96,0.08)',  border: 'rgba(39,174,96,0.25)',  label: 'Excel' };
    if (['doc','docx'].includes(ext)) return { color: '#4a90e8', bg: 'rgba(74,144,232,0.08)', border: 'rgba(74,144,232,0.25)', label: 'Word' };
    return                                   { color: '#9b59b6', bg: 'rgba(155,89,182,0.08)', border: 'rgba(155,89,182,0.25)', label: 'Fichier' };
}

// ─── ProjectRow ───────────────────────────────────────────────────────────────
function ProjectRow({ project, isAdmin }) {
    const images = project.media?.filter(m => m.type === 'image') ?? [];
    const docs   = project.media?.filter(m => m.type === 'document') ?? [];

    const quoteFilename = project.quote_file ? project.quote_file.split('/').pop() : null;
    const ft = quoteFilename ? fileTheme(quoteFilename) : null;

    const detailRoute = isAdmin
        ? route('admin.client-projects.show', project.id)
        : route('client-projects.show', project.id);

    return (
        <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color 0.2s' }}
             onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,148,58,0.4)'}
             onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>

            {/* Titre + statut */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {isAdmin && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                <svg style={{ width: 13, height: 13, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                {project.user?.name ?? '—'}
                            </span>
                        )}
                        {project.service && (
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.68rem', fontWeight: 600, color: 'var(--gold)', background: 'rgba(201,148,58,0.1)', padding: '2px 8px', borderRadius: 999 }}>
                                {project.service.name}
                            </span>
                        )}
                        <UrgencyBadge urgency={project.urgency} />
                    </div>
                </div>
                <StatusBadge status={project.status} />
            </div>

            {/* Description */}
            {project.description && (
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                    {project.description}
                </p>
            )}

            {/* Bloc devis — document uploadé par l'admin */}
            {quoteFilename && ft && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: ft.bg, border: `1px solid ${ft.border}`, flexWrap: 'wrap' }}>
                    {/* Icône type fichier */}
                    <svg style={{ width: 16, height: 16, color: ft.color, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ft.color, display: 'block', marginBottom: 1 }}>
                            Devis {isAdmin ? 'envoyé' : 'disponible'} · {ft.label}
                        </span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {quoteFilename}
                        </span>
                    </div>
                    <a href={`/storage/${project.quote_file}`} target="_blank" rel="noreferrer"
                       style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, background: 'var(--dropdown-bg)', border: `1px solid ${ft.border}`, color: ft.color, fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background 0.2s', flexShrink: 0 }}
                       onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
                       onMouseLeave={e => e.currentTarget.style.background = 'var(--dropdown-bg)'}>
                        <svg style={{ width: 11, height: 11 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Télécharger
                    </a>
                </div>
            )}

            {/* Métadonnées */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                {project.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <svg style={{ width: 12, height: 12, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {project.location}
                    </span>
                )}
                {(project.budget_estimate_min || project.budget_estimate_max) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <svg style={{ width: 12, height: 12, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {formatBudget(project.budget_estimate_min, project.budget_estimate_max)}
                    </span>
                )}
                {project.desired_start_date && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <svg style={{ width: 12, height: 12, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        Début : {new Date(project.desired_start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Soumis le {new Date(project.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
            </div>

            {/* Médias + lien détail */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {images.slice(0, 4).map((img, i) => (
                        <div key={i} style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
                            <img src={`/storage/${img.file_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                    {images.length > 4 && (
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{images.length - 4} photos</span>
                    )}
                    {docs.length > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: images.length ? 8 : 0 }}>
                            <svg style={{ width: 12, height: 12, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                            </svg>
                            {docs.length} doc{docs.length > 1 ? 's' : ''}
                        </span>
                    )}
                    {!images.length && !docs.length && (
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Aucun fichier joint</span>
                    )}
                </div>

                <Link href={detailRoute}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, background: 'rgba(201,148,58,0.1)', border: '1px solid rgba(201,148,58,0.3)', color: 'var(--gold)', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,148,58,0.1)'; e.currentTarget.style.color = 'var(--gold)'; }}>
                    Voir le détail
                    <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                </Link>
            </div>
        </div>
    );
}

// ─── Page Index ───────────────────────────────────────────────────────────────
export default function Index({ projects = { data: [], total: 0, last_page: 1, links: [] }, filters = {} }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => (r?.name ?? r) === 'admin');

    const indexRoute = isAdmin ? route('admin.client-projects.index') : route('client-projects.index');

    const [search,       setSearch]       = useState(filters?.search ?? '');
    const [activeStatus, setActiveStatus] = useState(filters?.status ?? '');

    const applyFilters = (newFilters) => {
        router.get(indexRoute, { ...filters, ...newFilters }, { preserveState: true, replace: true });
    };
    const handleSearch = (e) => { setSearch(e.target.value); applyFilters({ search: e.target.value, status: activeStatus }); };
    const handleStatus = (s)  => { setActiveStatus(s); applyFilters({ search, status: s }); };

    return (
        <GuestLayout>
            <br/><br/><br/><br/>
            <>
                <Head title={isAdmin ? 'Demandes clients — Admin' : 'Mes projets'} />
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                    * { box-sizing: border-box; }
                    body { background: var(--bg-page); color: var(--text-main); }
                `}</style>

                <div style={{ minHeight: '100vh', background: 'var(--bg-page)', fontFamily: "'DM Sans',sans-serif" }}>

                    {/* Header */}
                    <div style={{ background: 'var(--dropdown-bg)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
                        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <Link href={indexRoute}
                                      style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                                      onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    {isAdmin ? 'Dashboard' : 'Mon espace'}
                                </Link>
                                <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                                <span style={{ color: 'var(--gold)' }}>{isAdmin ? 'Demandes clients' : 'Mes projets'}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                                <div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
                                        {isAdmin ? 'Administration' : 'Espace client'}
                                    </p>
                                    <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1, margin: 0 }}>
                                        {isAdmin
                                            ? <>Demandes <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>clients</span></>
                                            : <>Mes <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>projets</span></>
                                        }
                                    </h1>
                                </div>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{projects.total}</span>{' '}
                                        {isAdmin ? `demande${projects.total > 1 ? 's' : ''} au total` : `projet${projects.total > 1 ? 's' : ''} soumis`}
                                    </span>
                                    {!isAdmin && (
                                        <Link href={route('client-projects.create')}
                                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: 'var(--gold)', color: '#fff', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'background 0.2s' }}
                                              onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-light)'}
                                              onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}>
                                            <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                                            Nouveau projet
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

                        {/* Filtres */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                            {isAdmin && (
                                <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
                                    <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                    <input type="text" value={search} onChange={handleSearch}
                                           placeholder="Rechercher par titre ou client..."
                                           style={{ width: '100%', padding: '10px 16px 10px 36px', background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-main)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', outline: 'none' }}
                                           onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                           onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                <button onClick={() => handleStatus('')}
                                        style={{ padding: '8px 16px', borderRadius: 999, border: !activeStatus ? '1px solid var(--gold)' : '1px solid var(--border)', background: !activeStatus ? 'var(--gold)' : 'var(--dropdown-bg)', color: !activeStatus ? '#fff' : 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                                    Tous ({projects.total})
                                </button>
                                {Object.entries(STATUS).map(([key, s]) => (
                                    <button key={key} onClick={() => handleStatus(key)}
                                            style={{ padding: '8px 16px', borderRadius: 999, border: activeStatus === key ? `1px solid ${s.color}` : '1px solid var(--border)', background: activeStatus === key ? s.bg : 'var(--dropdown-bg)', color: activeStatus === key ? s.color : 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Liste */}
                        {projects.data?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {projects.data.map(project => (
                                    <ProjectRow key={project.id} project={project} isAdmin={isAdmin} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--dropdown-bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <svg style={{ width: 28, height: 28, color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                    </svg>
                                </div>
                                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: 8 }}>
                                    {isAdmin ? 'Aucune demande' : 'Aucun projet soumis'}
                                </p>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {activeStatus || search
                                        ? 'Aucun résultat pour ces critères.'
                                        : isAdmin ? 'Les demandes clients apparaîtront ici.' : 'Soumettez votre premier projet pour commencer.'}
                                </p>
                                {(activeStatus || search) && (
                                    <button onClick={() => { setSearch(''); setActiveStatus(''); applyFilters({ search: '', status: '' }); }}
                                            style={{ marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', textDecoration: 'underline' }}>
                                        Réinitialiser les filtres
                                    </button>
                                )}
                                {!isAdmin && !activeStatus && !search && (
                                    <Link href={route('client-projects.create')}
                                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20, padding: '12px 24px', borderRadius: 10, background: 'var(--gold)', color: '#fff', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                        Soumettre un projet
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {projects.last_page > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40, flexWrap: 'wrap' }}>
                                {projects.links?.map((link, i) => (
                                    <button key={i}
                                            disabled={!link.url || link.active}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            style={{ padding: '8px 14px', borderRadius: 8, border: link.active ? '1px solid var(--gold)' : '1px solid var(--border)', background: link.active ? 'var(--gold)' : 'var(--dropdown-bg)', color: link.active ? '#fff' : link.url ? 'var(--text-muted)' : 'var(--border)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', cursor: link.url ? 'pointer' : 'default', transition: 'all 0.2s' }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </>
        </GuestLayout>
    );
}
