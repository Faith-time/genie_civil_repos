import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Components/Layout/GuestLayout';
import { useState } from 'react';

const S = {
    label: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.62rem',
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        marginBottom: 8,
        display: 'block',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        background: 'var(--bg-page)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        color: 'var(--text-main)',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    error: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.72rem',
        color: '#e05252',
        marginTop: 5,
        display: 'block',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
    },
};

// ── Icon picker options ───────────────────────────────────────────────────────
const ICON_OPTIONS = [
    { value: 'etude-sol',       label: 'Étude de sol',            emoji: '⛏️' },
    { value: 'chantier',        label: 'Suivi de chantier',       emoji: '🏗️' },
    { value: 'beton',           label: 'Béton & Métallique',      emoji: '🏛️' },
    { value: 'expertise',       label: 'Expertise & Qualité',     emoji: '✅' },
    { value: 'plans',           label: 'Réalisation de plans',    emoji: '📐' },
    { value: 'topographie',     label: 'Topographie',             emoji: '🗺️' },
    { value: 'hydraulique',     label: 'Hydraulique',             emoji: '💧' },
    { value: 'electricite',     label: 'Électricité',             emoji: '⚡' },
    { value: 'autre',           label: 'Autre',                   emoji: '🔧' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title:             '',
        slug:              '',
        short_description: '',
        description:       '',
        icon:              '',
        is_active:         true,
    });

    const [focusedField, setFocusedField] = useState(null);
    const [slugManual,   setSlugManual]   = useState(false);

    const slugify = (str) =>
        str.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');

    const handleTitle = (e) => {
        const val = e.target.value;
        setData(d => ({
            ...d,
            title: val,
            slug: slugManual ? d.slug : slugify(val),
        }));
    };

    const handleSlug = (e) => {
        setSlugManual(true);
        setData('slug', e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.services.store'));
    };

    const inputStyle = (field) => ({
        ...S.input,
        borderColor: focusedField === field
            ? 'var(--gold)'
            : errors[field]
                ? '#e05252'
                : 'var(--border)',
    });

    return (
        <GuestLayout>
            <Head title="Nouveau service — Admin" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                * { box-sizing: border-box; }
                textarea { resize: none; }
                .icon-option { transition: all 0.2s; }
                .icon-option:hover { border-color: var(--gold) !important; background: rgba(201,148,58,0.08) !important; }
                .icon-option.selected { border-color: var(--gold) !important; background: rgba(201,148,58,0.12) !important; }
                .submit-btn:hover:not(:disabled) { background: var(--gold-light) !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,148,58,0.4) !important; }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>

            {/* ── Hero ── */}
            <div style={{
                background: 'var(--bg-page)',
                borderBottom: '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: 80,
            }}>
                {/* Decorative circle */}
                <div style={{
                    position: 'absolute', top: -120, right: -120,
                    width: 400, height: 400, borderRadius: '50%',
                    border: '1px solid var(--border)',
                    pointerEvents: 'none', opacity: 0.4,
                }} />
                {/* Grid background */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.03,
                    backgroundImage: `linear-gradient(90deg, var(--gold) 1px, transparent 1px), linear-gradient(var(--gold) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: '40px 24px 32px' }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Link href={route('services.index')}
                              style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            Services
                        </Link>
                        <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                        <span style={{ color: 'var(--gold)' }}>Nouveau service</span>
                    </div>

                    {/* Title block */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                        <span style={{ width: 20, height: 1, background: 'var(--gold)' }} />
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: "'DM Sans', sans-serif" }}>
                            Administration
                        </span>
                    </div>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        margin: '0 0 6px',
                        lineHeight: 1.1,
                    }}>
                        Créer un nouveau <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>service</span>
                    </h1>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        Remplissez les informations ci-dessous pour ajouter un service au catalogue.
                    </p>
                </div>
            </div>

            {/* ── Form ── */}
            <div style={{ background: 'var(--bg-page)', padding: '40px 0 80px' }}>
                <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* ── Card: Informations principales ── */}
                        <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                    Informations principales
                                </h2>
                            </div>
                            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

                                {/* Title */}
                                <div style={S.fieldGroup}>
                                    <label style={S.label}>
                                        Titre du service <span style={{ color: '#e05252' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={handleTitle}
                                        onFocus={() => setFocusedField('title')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Ex : Étude de sol, Suivi de chantier…"
                                        style={inputStyle('title')}
                                    />
                                    {errors.title && <span style={S.error}>{errors.title}</span>}
                                </div>

                                {/* Slug */}
                                <div style={S.fieldGroup}>
                                    <label style={S.label}>
                                        Slug (URL)
                                        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                                            — généré automatiquement si vide
                                        </span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{
                                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                            fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: 'var(--text-muted)',
                                            pointerEvents: 'none',
                                        }}>
                                            /services/
                                        </span>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={handleSlug}
                                            onFocus={() => setFocusedField('slug')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="etude-de-sol"
                                            style={{ ...inputStyle('slug'), paddingLeft: 88 }}
                                        />
                                    </div>
                                    {errors.slug && <span style={S.error}>{errors.slug}</span>}
                                </div>

                                {/* Short description */}
                                <div style={S.fieldGroup}>
                                    <label style={S.label}>
                                        Courte description
                                        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                                            — max 500 caractères
                                        </span>
                                    </label>
                                    <textarea
                                        value={data.short_description}
                                        onChange={e => setData('short_description', e.target.value)}
                                        onFocus={() => setFocusedField('short_description')}
                                        onBlur={() => setFocusedField(null)}
                                        rows={2}
                                        maxLength={500}
                                        placeholder="Résumé affiché sur la carte du service (liste des services)…"
                                        style={{ ...inputStyle('short_description'), lineHeight: 1.6 }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                        {errors.short_description
                                            ? <span style={S.error}>{errors.short_description}</span>
                                            : <span />
                                        }
                                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                            {data.short_description.length} / 500
                                        </span>
                                    </div>
                                </div>

                                {/* Full description */}
                                <div style={S.fieldGroup}>
                                    <label style={S.label}>
                                        Description complète <span style={{ color: '#e05252' }}>*</span>
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        onFocus={() => setFocusedField('description')}
                                        onBlur={() => setFocusedField(null)}
                                        rows={7}
                                        placeholder="Décrivez en détail ce service, ses avantages, son processus…"
                                        style={{ ...inputStyle('description'), lineHeight: 1.7 }}
                                    />
                                    {errors.description && <span style={S.error}>{errors.description}</span>}
                                </div>
                            </div>
                        </div>

                        {/* ── Card: Icône ── */}
                        <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                    Icône du service
                                </h2>
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 4 }}>
                                    — optionnel
                                </span>
                            </div>
                            <div style={{ padding: 24 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                                    {ICON_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`icon-option ${data.icon === opt.value ? 'selected' : ''}`}
                                            onClick={() => setData('icon', data.icon === opt.value ? '' : opt.value)}
                                            style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                                                padding: '14px 10px',
                                                background: data.icon === opt.value ? 'rgba(201,148,58,0.12)' : 'var(--bg-page)',
                                                border: `1px solid ${data.icon === opt.value ? 'var(--gold)' : 'var(--border)'}`,
                                                borderRadius: 12, cursor: 'pointer',
                                            }}
                                        >
                                            <span style={{ fontSize: '1.5rem' }}>{opt.emoji}</span>
                                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600, color: data.icon === opt.value ? 'var(--gold)' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
                                                {opt.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom icon text */}
                                <div style={{ marginTop: 16 }}>
                                    <label style={{ ...S.label, marginBottom: 6 }}>
                                        Ou saisir un identifiant d'icône personnalisé
                                    </label>
                                    <input
                                        type="text"
                                        value={ICON_OPTIONS.find(o => o.value === data.icon) ? '' : data.icon}
                                        onChange={e => { setData('icon', e.target.value); }}
                                        onFocus={() => setFocusedField('icon')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Ex : heroicon-building-office, fa-hard-hat…"
                                        style={inputStyle('icon')}
                                    />
                                </div>
                                {errors.icon && <span style={S.error}>{errors.icon}</span>}
                            </div>
                        </div>

                        {/* ── Card: Statut ── */}
                        <div style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2 }} />
                                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                    Visibilité
                                </h2>
                            </div>
                            <div style={{ padding: 24 }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '16px 20px',
                                    background: 'var(--bg-page)',
                                    border: `1px solid ${data.is_active ? 'rgba(39,174,96,0.4)' : 'var(--border)'}`,
                                    borderRadius: 12, cursor: 'pointer',
                                    transition: 'border-color 0.2s',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            width: 42, height: 24, borderRadius: 12,
                                            background: data.is_active ? '#27ae60' : 'var(--border)',
                                            position: 'relative', cursor: 'pointer',
                                            transition: 'background 0.25s',
                                            flexShrink: 0,
                                        }}>
                                            <div style={{
                                                position: 'absolute', top: 3, left: data.is_active ? 21 : 3,
                                                width: 18, height: 18, borderRadius: '50%',
                                                background: '#fff',
                                                transition: 'left 0.25s',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                                            }} />
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={e => setData('is_active', e.target.checked)}
                                                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                            />
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                                                Service actif
                                            </p>
                                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                                                {data.is_active
                                                    ? 'Visible sur le site public'
                                                    : 'Masqué sur le site public'}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                        padding: '4px 12px', borderRadius: 999,
                                        background: data.is_active ? 'rgba(39,174,96,0.12)' : 'rgba(138,155,181,0.12)',
                                        border: `1px solid ${data.is_active ? 'rgba(39,174,96,0.3)' : 'rgba(138,155,181,0.3)'}`,
                                        fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 700,
                                        color: data.is_active ? '#27ae60' : '#8a9bb5',
                                    }}>
                                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: data.is_active ? '#27ae60' : '#8a9bb5' }} />
                                        {data.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* ── Erreurs globales ── */}
                        {Object.keys(errors).length > 0 && (
                            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)' }}>
                                {Object.values(errors).map((err, i) => (
                                    <p key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#e05252', margin: '2px 0' }}>
                                        {err}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* ── Actions ── */}
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <Link href={route('services.index')}
                                  style={{
                                      display: 'inline-flex', alignItems: 'center', gap: 8,
                                      padding: '12px 24px', borderRadius: 12,
                                      border: '1px solid var(--border)', background: 'var(--dropdown-bg)',
                                      color: 'var(--text-muted)', textDecoration: 'none',
                                      fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600,
                                      letterSpacing: '0.08em', textTransform: 'uppercase',
                                      transition: 'border-color 0.2s, color 0.2s',
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                                </svg>
                                Annuler
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="submit-btn"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    padding: '12px 32px', borderRadius: 12,
                                    border: 'none', background: 'var(--gold)',
                                    color: '#fff',
                                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 700,
                                    letterSpacing: '0.08em', textTransform: 'uppercase',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 16px rgba(201,148,58,0.3)',
                                    transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                                }}>
                                {processing ? (
                                    <>
                                        <svg style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                        </svg>
                                        Création en cours…
                                    </>
                                ) : (
                                    <>
                                        <svg style={{ width: 15, height: 15 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                                        </svg>
                                        Créer le service
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </GuestLayout>
    );
}
