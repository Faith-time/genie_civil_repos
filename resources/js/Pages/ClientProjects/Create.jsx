import {Head, useForm, router, Link} from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Components/Layout/GuestLayout';

const URGENCY_OPTIONS = [
    { value: 'flexible', label: 'Flexible', desc: 'Pas de contrainte de délai' },
    { value: 'normal',   label: 'Normal',   desc: 'Dans les délais habituels' },
    { value: 'urgent',   label: 'Urgent',   desc: 'Démarrage rapide requis' },
];

const S = {
    label: { display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 },
    input: { width: '100%', padding: '12px 16px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-main)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' },
    card: { background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '20px 28px', borderBottom: '1px solid var(--border)' },
    error: { marginTop: 6, fontSize: '0.75rem', color: '#e05252', fontFamily: "'DM Sans',sans-serif" },
};

export default function Create({ services }) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: '', title: '', description: '', location: '',
        budget_estimate_min: '', budget_estimate_max: '',
        desired_start_date: '', urgency: 'normal', media: [],
    });

    const [mediaFiles,  setMediaFiles]  = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [dragOver,    setDragOver]    = useState(false);

    const addFiles = (files) => {
        const arr = Array.from(files);
        if (arr.length + mediaFiles.length > 10) { alert('Maximum 10 fichiers'); return; }
        const merged = [...mediaFiles, ...arr];
        setMediaFiles(merged);
        setData('media', merged);
        setPreviewUrls([...previewUrls, ...arr.map(f =>
            f.type.startsWith('image/')
                ? { type: 'image', url: URL.createObjectURL(f), name: f.name }
                : { type: 'doc', name: f.name }
        )]);
    };

    const removeFile = (i) => {
        const nf = mediaFiles.filter((_, idx) => idx !== i);
        setMediaFiles(nf);
        setPreviewUrls(previewUrls.filter((_, idx) => idx !== i));
        setData('media', nf);
    };

    const handleSubmit = (e) => { e.preventDefault(); post(route('client-projects.store'), { forceFormData: true }); };

    return (
        <GuestLayout>
            <Head title="Soumettre un projet" />

            <style>{`.cp-input:focus { border-color: var(--gold) !important; box-shadow: 0 0 0 3px rgba(201,148,58,0.15); } @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <div style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
                <div style={{ position: 'relative', maxWidth: 896, margin: '0 auto', padding: '15px 24px 48px' }}>
                    <Link
                        href={route('realisations.index')}
                        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#D4A574] mb-4 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour aux réalisations
                    </Link>
                    <br/>
                    <br/>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>Nouveau projet</p>
                    <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.05, marginBottom: 10 }}>
                        Votre <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Projet</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', maxWidth: 480 }}>
                        Décrivez votre projet en détail pour recevoir un devis personnalisé rapidement.
                    </p>

                    {/* Steps */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 36, flexWrap: 'wrap' }}>
                        {['Informations', 'Budget & Planning', 'Documents'].map((step, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'var(--dropdown-bg)', border: '1px solid var(--border)' }}>
                                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{step}</span>
                                </div>
                                {i < 2 && <div style={{ width: 24, height: 1, background: 'var(--border)' }} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Form ─────────────────────────────────────────────── */}
            <div style={{ background: 'var(--bg-page)', padding: '56px 0 80px' }}>
                <div style={{ maxWidth: 896, margin: '0 auto', padding: '0 24px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* ── BLOC 1 ── */}
                        <div style={S.card}>
                            <div style={S.cardHeader}>
                                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>1</span>
                                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Informations du projet</h2>
                            </div>
                            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                                {/* Service */}
                                <div>
                                    <label style={S.label}>Type de service *</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
                                        {services.map(service => (
                                            <button key={service.id} type="button" onClick={() => setData('service_id', service.id)} style={{
                                                padding: '12px 16px', borderRadius: 12, textAlign: 'left',
                                                border: data.service_id == service.id ? '1px solid var(--gold)' : '1px solid var(--border)',
                                                background: data.service_id == service.id ? 'rgba(201,148,58,0.1)' : 'var(--bg-page)',
                                                color: data.service_id == service.id ? 'var(--gold)' : 'var(--text-muted)',
                                                fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600,
                                                cursor: 'pointer', transition: 'all 0.2s',
                                            }}>
                                                {service.name}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.service_id && <p style={S.error}>{errors.service_id}</p>}
                                </div>

                                {/* Titre */}
                                <div>
                                    <label style={S.label}>Titre du projet *</label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Ex: Construction villa R+1 à Dakar" className="cp-input" style={S.input} />
                                    {errors.title && <p style={S.error}>{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={S.label}>Description détaillée *</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={6} placeholder="Décrivez votre projet : objectifs, surface, nombre d'étages, matériaux souhaités..." className="cp-input" style={{ ...S.input, resize: 'none', lineHeight: 1.7 }} />
                                    <p style={{ marginTop: 4, fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', fontFamily: "'DM Sans',sans-serif" }}>{data.description.length} caractères</p>
                                    {errors.description && <p style={S.error}>{errors.description}</p>}
                                </div>

                                {/* Localisation */}
                                <div>
                                    <label style={S.label}>Localisation</label>
                                    <div style={{ position: 'relative' }}>
                                        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        <input type="text" value={data.location} onChange={e => setData('location', e.target.value)} placeholder="Ex: Dakar, Sénégal" className="cp-input" style={{ ...S.input, paddingLeft: 42 }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── BLOC 2 ── */}
                        <div style={S.card}>
                            <div style={S.cardHeader}>
                                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>2</span>
                                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Budget et planning</h2>
                            </div>
                            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                                {/* Budget */}
                                <div>
                                    <label style={S.label}>Fourchette budgétaire (FCFA)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        {[['budget_estimate_min','Minimum','5 000 000'], ['budget_estimate_max','Maximum','15 000 000']].map(([key, lbl, ph]) => (
                                            <div key={key}>
                                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>{lbl}</p>
                                                <div style={{ position: 'relative' }}>
                                                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, pointerEvents: 'none', fontFamily: "'DM Sans',sans-serif" }}>FCFA</span>
                                                    <input type="number" value={data[key]} onChange={e => setData(key, e.target.value)} placeholder={ph} className="cp-input" style={{ ...S.input, paddingLeft: 52 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Date */}
                                <div>
                                    <label style={S.label}>Date de début souhaitée</label>
                                    <div style={{ position: 'relative' }}>
                                        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <input type="date" value={data.desired_start_date} onChange={e => setData('desired_start_date', e.target.value)} className="cp-input" style={{ ...S.input, paddingLeft: 42 }} />
                                    </div>
                                </div>

                                {/* Urgence */}
                                <div>
                                    <label style={S.label}>Niveau d'urgence *</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                                        {URGENCY_OPTIONS.map(opt => {
                                            const active = data.urgency === opt.value;
                                            return (
                                                <button key={opt.value} type="button" onClick={() => setData('urgency', opt.value)} style={{
                                                    position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                                    padding: '20px 12px', borderRadius: 16, textAlign: 'center',
                                                    border: active ? '2px solid var(--gold)' : '2px solid var(--border)',
                                                    background: active ? 'rgba(201,148,58,0.08)' : 'var(--bg-page)',
                                                    cursor: 'pointer', transition: 'all 0.2s',
                                                }}>
                                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 700, color: active ? 'var(--gold)' : 'var(--text-main)' }}>{opt.label}</span>
                                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{opt.desc}</span>
                                                    {active && (
                                                        <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <svg style={{ width: 11, height: 11, color: '#fff' }} fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                                            </svg>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── BLOC 3 ── */}
                        <div style={S.card}>
                            <div style={{ ...S.cardHeader, justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>3</span>
                                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Documents et photos</h2>
                                </div>
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-page)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 999 }}>
                                    {mediaFiles.length}/10
                                </span>
                            </div>
                            <div style={{ padding: 28 }}>
                                <label
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        width: '100%', padding: '48px 24px',
                                        border: `2px dashed ${dragOver ? 'var(--gold)' : 'var(--border)'}`,
                                        borderRadius: 16, cursor: 'pointer',
                                        background: dragOver ? 'rgba(201,148,58,0.06)' : 'var(--bg-page)',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box',
                                    }}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                                >
                                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(201,148,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                        <svg style={{ width: 26, height: 26, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                        </svg>
                                    </div>
                                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Glissez vos fichiers ici</p>
                                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>ou</p>
                                    <span style={{ padding: '10px 20px', borderRadius: 10, background: 'var(--gold)', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 700 }}>Parcourir les fichiers</span>
                                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 16 }}>Images, PDF · max 10 fichiers · 10 MB chacun</p>
                                    <input type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />
                                </label>

                                {previewUrls.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 12, marginTop: 20 }}>
                                        {previewUrls.map((preview, i) => (
                                            <div key={i} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}
                                                 className="preview-item">
                                                <style>{`.preview-item:hover .remove-btn { opacity: 1 !important; }`}</style>
                                                {preview.type === 'image' ? (
                                                    <img src={preview.url} alt={preview.name} style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: 100, background: 'var(--bg-page)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                                        <svg style={{ width: 28, height: 28, color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                                        </svg>
                                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", padding: '0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{preview.name}</span>
                                                    </div>
                                                )}
                                                <button type="button" onClick={() => removeFile(i)} className="remove-btn" style={{
                                                    position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%',
                                                    background: 'rgb(239,68,68)', color: '#fff', border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    opacity: 0, transition: 'opacity 0.2s',
                                                }}>
                                                    <svg style={{ width: 10, height: 10 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Actions ── */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 40 }}>
                            <button type="button" onClick={() => router.visit(route('home'))} style={{
                                padding: '12px 24px', borderRadius: 12,
                                border: '1px solid var(--border)', background: 'transparent',
                                color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem',
                                cursor: 'pointer', transition: 'border-color 0.2s',
                            }}>
                                Annuler
                            </button>
                            <button type="submit" disabled={processing || !data.title || !data.description} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '14px 32px', borderRadius: 12, border: 'none',
                                background: 'var(--gold)', color: '#fff',
                                fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 700,
                                cursor: processing || !data.title || !data.description ? 'not-allowed' : 'pointer',
                                opacity: processing || !data.title || !data.description ? 0.5 : 1,
                                transition: 'background 0.2s',
                            }}
                                    onMouseEnter={e => { if (!processing) e.currentTarget.style.background = 'var(--gold-light)'; }}
                                    onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
                            >
                                {processing ? (
                                    <><svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Envoi en cours...</>
                                ) : (
                                    <><svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>Soumettre le projet</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
