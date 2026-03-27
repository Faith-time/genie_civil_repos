import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Components/Layout/GuestLayout';

const S = {
    input: { width: '100%', padding: '11px 14px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-main)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' },
    label: { display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8 },
    card: { background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 },
};

export default function Create({ services, videos }) {
    const [previewVideo, setPreviewVideo] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        title: '', description: '', service_id: '', client_name: '',
        location: '', video_path: '', date_realisation: '', is_published: true, order: 0,
    });

    const handleVideoSelect = (video) => { setData('video_path', video.name); setPreviewVideo(video.url); };
    const handleSubmit = (e) => { e.preventDefault(); post(route('admin.realisations.store')); };

    return (
        <GuestLayout>
            <Head title="Ajouter une réalisation" />
            <style>{`.ar-input:focus { border-color: var(--gold) !important; box-shadow: 0 0 0 3px rgba(201,148,58,0.15); }`}</style>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <div style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
                <div style={{ position: 'absolute', top: -96, right: -96, width: 400, height: 400, borderRadius: '50%', border: '1px solid var(--border)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', maxWidth: 960, margin: '0 auto', padding: '48px 24px 40px' }}>
                    <Link href={route('admin.realisations.index')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', marginBottom: 20, transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                        <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                        Retour aux réalisations
                    </Link>

                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Administration</p>
                    <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.05, marginBottom: 8 }}>
                        Nouvelle <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Réalisation</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem' }}>
                        Sélectionnez une vidéo et renseignez les informations du projet réalisé
                    </p>
                </div>
            </div>

            {/* ── Form ─────────────────────────────────────────────── */}
            <div style={{ background: 'var(--bg-page)', padding: '48px 0 64px' }}>
                <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Video selection */}
                        <div style={S.card}>
                            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>Choisir la vidéo *</h2>
                            <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', marginBottom: 20 }}>Sélectionnez parmi les vidéos disponibles</p>

                            {previewVideo && (
                                <div style={{ marginBottom: 20, borderRadius: 14, overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
                                    <video src={previewVideo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} controls key={previewVideo} />
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 10 }}>
                                {videos.map(video => {
                                    const selected = data.video_path === video.name;
                                    return (
                                        <button key={video.name} type="button" onClick={() => handleVideoSelect(video)} style={{
                                            position: 'relative', aspectRatio: '1', borderRadius: 12, overflow: 'hidden',
                                            border: selected ? '2px solid var(--gold)' : '2px solid var(--border)',
                                            cursor: 'pointer', background: '#000', padding: 0,
                                            outline: selected ? '2px solid rgba(201,148,58,0.3)' : 'none',
                                            transition: 'border-color 0.2s',
                                        }}>
                                            <video src={video.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted preload="metadata" />
                                            <div style={{ position: 'absolute', inset: 0, background: selected ? 'rgba(201,148,58,0.65)' : 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                                {selected
                                                    ? <svg style={{ width: 18, height: 18, color: '#fff' }} fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                                                    : <svg style={{ width: 18, height: 18, color: '#fff' }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                }
                                                <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{video.label}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.video_path && <p style={{ marginTop: 12, fontSize: '0.8rem', color: '#e05252', fontFamily: "'DM Sans',sans-serif" }}>{errors.video_path}</p>}
                            {!data.video_path && <p style={{ marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: "'DM Sans',sans-serif" }}>Cliquez sur une vidéo pour la sélectionner</p>}
                        </div>

                        {/* Info */}
                        <div style={S.card}>
                            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 20 }}>Informations de la réalisation</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                {/* Titre */}
                                <div>
                                    <label style={S.label}>Titre *</label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Ex: Construction villa R+1 à Dakar" className="ar-input" style={S.input} />
                                    {errors.title && <p style={{ marginTop: 4, fontSize: '0.75rem', color: '#e05252', fontFamily: "'DM Sans',sans-serif" }}>{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={S.label}>Description</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={4} placeholder="Décrivez ce projet réalisé..." className="ar-input" style={{ ...S.input, resize: 'none', lineHeight: 1.7 }} />
                                </div>

                                {/* 2-col grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={S.label}>Type de service</label>
                                        <select value={data.service_id} onChange={e => setData('service_id', e.target.value)} className="ar-input" style={S.input}>
                                            <option value="">-- Aucun service --</option>
                                            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={S.label}>Nom du client</label>
                                        <input type="text" value={data.client_name} onChange={e => setData('client_name', e.target.value)} placeholder="Ex: M. Diallo" className="ar-input" style={S.input} />
                                    </div>
                                    <div>
                                        <label style={S.label}>Localisation</label>
                                        <input type="text" value={data.location} onChange={e => setData('location', e.target.value)} placeholder="Ex: Dakar, Sénégal" className="ar-input" style={S.input} />
                                    </div>
                                    <div>
                                        <label style={S.label}>Date de réalisation</label>
                                        <input type="date" value={data.date_realisation} onChange={e => setData('date_realisation', e.target.value)} className="ar-input" style={S.input} />
                                    </div>
                                    <div>
                                        <label style={S.label}>Ordre d'affichage</label>
                                        <input type="number" min="0" value={data.order} onChange={e => setData('order', parseInt(e.target.value) || 0)} className="ar-input" style={S.input} />
                                        <p style={{ marginTop: 4, fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif" }}>0 = premier affiché</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginTop: 24 }}>
                                            <input type="checkbox" checked={data.is_published} onChange={e => setData('is_published', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--gold)', cursor: 'pointer' }} />
                                            <div>
                                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)', display: 'block' }}>Publié immédiatement</span>
                                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visible par les clients</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 32 }}>
                            <Link href={route('admin.realisations.index')} style={{
                                padding: '12px 24px', borderRadius: 12,
                                border: '1px solid var(--border)', color: 'var(--text-muted)',
                                textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem',
                                transition: 'border-color 0.2s',
                            }}>
                                Annuler
                            </Link>
                            <button type="submit" disabled={processing || !data.video_path || !data.title} style={{
                                padding: '12px 28px', borderRadius: 12, border: 'none',
                                background: 'var(--gold)', color: '#fff',
                                fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 600,
                                cursor: processing || !data.video_path || !data.title ? 'not-allowed' : 'pointer',
                                opacity: processing || !data.video_path || !data.title ? 0.5 : 1,
                                transition: 'background 0.2s',
                            }}
                                    onMouseEnter={e => { if (!processing) e.currentTarget.style.background = 'var(--gold-light)'; }}
                                    onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
                            >
                                {processing ? 'Enregistrement...' : 'Ajouter la réalisation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
