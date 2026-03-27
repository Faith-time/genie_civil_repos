import GuestLayout from '@/Components/Layout/GuestLayout';
import { useState, useEffect, useRef } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';


const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

/* ══ TESTIMONIALS PAGE ══════════════════════════════════ */
.tpage {
    min-height: 100vh;
    background: var(--bg-page);
    color: var(--text-main);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
}

/* ── HERO ── */
.tpage-hero {
    position: relative;
    padding: 160px 6vw 100px;
    overflow: hidden;
}
.tpage-hero-bg {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
        linear-gradient(to right, var(--border) 1px, transparent 1px),
        linear-gradient(to bottom, var(--border) 1px, transparent 1px);
    background-size: 80px 80px;
    opacity: 0.35;
}
.tpage-hero-accent {
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.tpage-hero-glow {
    position: absolute; top: -100px; right: -100px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,148,58,0.06) 0%, transparent 65%);
    pointer-events: none;
}
.tpage-hero-inner {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: center;
}
.tpage-eyebrow {
    display: inline-flex; align-items: center; gap: 12px;
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 20px;
    opacity: 0; animation: tFadeUp 0.7s ease forwards 0.1s;
}
.tpage-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
.tpage-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: clamp(3rem, 5.5vw, 5rem);
    line-height: 1.05; margin: 0 0 20px;
    opacity: 0; animation: tFadeUp 0.7s ease forwards 0.2s;
}
.tpage-hero-title em { font-style: italic; color: var(--gold); }
.tpage-hero-desc {
    font-size: 15px; line-height: 1.8; color: var(--text-muted);
    max-width: 420px; margin: 0;
    opacity: 0; animation: tFadeUp 0.7s ease forwards 0.35s;
}
.tpage-hero-stats {
    opacity: 0; animation: tFadeLeft 0.8s ease forwards 0.3s;
    display: flex; flex-direction: column; gap: 1px;
    background: var(--border);
}
.tpage-hero-stat {
    background: var(--bg-page); padding: 28px 36px;
    display: flex; align-items: center; gap: 24px;
    transition: background 0.3s;
}
.tpage-hero-stat:hover { background: rgba(201,148,58,0.04); }
.tpage-hero-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.8rem; color: var(--gold); line-height: 1; min-width: 80px;
}
.tpage-hero-stat-label {
    font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text-muted); line-height: 1.5;
}

/* ── FILTER BAR ── */
.tpage-filters {
    padding: 0 6vw 48px;
    position: relative; z-index: 1;
}
.tpage-filters-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}
.tpage-filter-label {
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--text-muted); margin-right: 8px;
}
.tpage-filter-btn {
    background: none; border: 1px solid var(--border);
    color: var(--text-muted); padding: 8px 20px;
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; transition: all 0.25s;
}
.tpage-filter-btn:hover { border-color: var(--gold); color: var(--gold); }
.tpage-filter-btn.active {
    background: var(--gold); border-color: var(--gold);
    color: #fff;
}
.tpage-filter-star { color: var(--gold); font-size: 10px; }

/* ── MASONRY GRID ── */
.tpage-grid-wrap { padding: 0 6vw 120px; }
.tpage-grid {
    max-width: 1280px; margin: 0 auto;
    columns: 3; column-gap: 24px;
}
.tcard {
    break-inside: avoid;
    margin-bottom: 24px;
    border: 1px solid var(--border);
    padding: 36px 32px;
    position: relative; overflow: hidden;
    background: var(--bg-page);
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    cursor: default;
}
.tcard:hover {
    border-color: rgba(201,148,58,0.45);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}
.tcard::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s ease;
}
.tcard:hover::before { transform: scaleX(1); }
.tcard.featured { border-color: rgba(201,148,58,0.3); }
.tcard.featured::after {
    content: 'À la une';
    position: absolute; top: 16px; right: 16px;
    background: var(--gold); color: #fff;
    font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 4px 10px;
}

.tcard-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: 4rem; color: var(--gold); opacity: 0.15;
    line-height: 0.7; margin-bottom: 12px;
    display: block;
}
.tcard-stars { display: flex; gap: 3px; margin-bottom: 16px; }
.tcard-star { font-size: 12px; color: var(--border); }
.tcard-star.filled { color: var(--gold); }
.tcard-content {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-size: 1.1rem; font-weight: 300;
    line-height: 1.75; color: var(--text-main);
    margin-bottom: 28px;
}
.tcard-author { display: flex; align-items: center; gap: 14px; }
.tcard-avatar {
    width: 46px; height: 46px; border-radius: 50%;
    object-fit: cover; border: 2px solid var(--border);
    flex-shrink: 0;
}
.tcard-avatar-placeholder {
    width: 46px; height: 46px; border-radius: 50%;
    background: rgba(201,148,58,0.1); border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 1.2rem;
    color: var(--gold); flex-shrink: 0;
}
.tcard-name {
    font-size: 14px; font-weight: 500;
    color: var(--text-main); margin-bottom: 2px;
    display: block;
}
.tcard-role {
    font-size: 11px; color: var(--text-muted);
    letter-spacing: 0.05em; display: block;
}
.tcard-project {
    margin-top: 20px; padding-top: 20px;
    border-top: 1px solid var(--border);
    font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--gold); display: flex; align-items: center; gap: 8px;
}
.tcard-project::before { content: ''; width: 20px; height: 1px; background: var(--gold); }

/* empty state */
.tpage-empty {
    max-width: 1280px; margin: 0 auto;
    text-align: center; padding: 80px 0;
}
.tpage-empty-icon {
    font-size: 3rem; margin-bottom: 20px; display: block;
    opacity: 0.3;
}
.tpage-empty-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; color: var(--text-muted);
}

/* ── PAGINATION ── */
.tpage-pagination {
    max-width: 1280px; margin: 0 auto 0;
    display: flex; align-items: center; justify-content: center; gap: 8px;
}
.page-btn {
    width: 40px; height: 40px;
    background: none; border: 1px solid var(--border);
    color: var(--text-muted); font-family: 'DM Sans', sans-serif;
    font-size: 13px; cursor: pointer;
    transition: all 0.25s; display: flex; align-items: center; justify-content: center;
    text-decoration: none;
}
.page-btn:hover { border-color: var(--gold); color: var(--gold); }
.page-btn.active { background: var(--gold); border-color: var(--gold); color: #fff; }
.page-btn.disabled { opacity: 0.3; pointer-events: none; }

/* ── CTA BAND ── */
.tpage-cta {
    padding: 0 6vw 120px;
}
.tpage-cta-inner {
    max-width: 1280px; margin: 0 auto;
    border: 1px solid var(--border); padding: 72px 80px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 40px; position: relative; overflow: hidden;
}
.tpage-cta-inner::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.tpage-cta-deco {
    position: absolute; right: -20px; top: 50%; transform: translateY(-50%);
    font-family: 'Bebas Neue', sans-serif; font-size: 9rem;
    color: var(--gold); opacity: 0.04; line-height: 1;
    pointer-events: none; user-select: none;
}
.tpage-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: clamp(1.8rem, 3vw, 2.8rem);
    line-height: 1.1; margin: 0;
}
.tpage-cta-title em { font-style: italic; color: var(--gold); }
.tpage-cta-eyebrow {
    font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
}
.tpage-cta-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--gold); }
.tpage-cta-btns { display: flex; gap: 14px; flex-shrink: 0; position: relative; z-index: 1; }

/* ── MODAL ── */
.tmodal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(8,13,26,0.85); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    opacity: 0; transition: opacity 0.3s ease;
    pointer-events: none;
}
.tmodal-overlay.open { opacity: 1; pointer-events: auto; }
.tmodal {
    background: var(--bg-page);
    border: 1px solid var(--border);
    width: 100%; max-width: 620px;
    max-height: 90vh; overflow-y: auto;
    position: relative;
    transform: translateY(32px) scale(0.97);
    transition: transform 0.35s ease;
}
.tmodal-overlay.open .tmodal { transform: translateY(0) scale(1); }
.tmodal-header {
    padding: 40px 48px 0;
    border-bottom: 1px solid var(--border); padding-bottom: 28px;
    position: sticky; top: 0; background: var(--bg-page); z-index: 1;
}
.tmodal-header::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: linear-gradient(90deg, var(--gold), transparent);
}
.tmodal-eyebrow {
    font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 8px; display: block;
}
.tmodal-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 2rem;
    color: var(--text-main); margin: 0;
}
.tmodal-title em { font-style: italic; color: var(--gold); }
.tmodal-close {
    position: absolute; top: 20px; right: 20px;
    background: none; border: 1px solid var(--border);
    width: 36px; height: 36px;
    color: var(--text-muted); cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, color 0.2s;
}
.tmodal-close:hover { border-color: var(--gold); color: var(--gold); }
.tmodal-body { padding: 36px 48px 48px; }

.tform-group { margin-bottom: 24px; }
.tform-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.tform-label {
    display: block; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 8px;
}
.tform-label span { color: var(--gold); }
.tform-input,
.tform-textarea {
    width: 100%; background: none;
    border: 1px solid var(--border); border-radius: 0;
    color: var(--text-main); font-family: 'DM Sans', sans-serif;
    font-size: 14px; padding: 12px 16px;
    transition: border-color 0.25s; outline: none;
    -webkit-appearance: none;
}
.tform-input:focus,
.tform-textarea:focus { border-color: var(--gold); }
.tform-textarea { resize: vertical; min-height: 120px; }
.tform-input::placeholder,
.tform-textarea::placeholder { color: var(--text-muted); opacity: 0.5; }
.tform-error { font-size: 11px; color: #e05252; margin-top: 5px; display: block; }

/* star rating input */
.tform-stars { display: flex; gap: 8px; }
.tform-star-btn {
    background: none; border: none; cursor: pointer;
    font-size: 24px; color: var(--border);
    transition: color 0.15s, transform 0.15s; padding: 4px;
}
.tform-star-btn.active { color: var(--gold); }
.tform-star-btn:hover { transform: scale(1.2); color: var(--gold-light); }

/* avatar upload */
.tform-upload {
    border: 1px dashed var(--border); padding: 24px;
    text-align: center; cursor: pointer; transition: border-color 0.25s;
    position: relative;
}
.tform-upload:hover { border-color: var(--gold); }
.tform-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.tform-upload-icon { font-size: 1.8rem; display: block; margin-bottom: 8px; color: var(--text-muted); }
.tform-upload-label { font-size: 12px; color: var(--text-muted); display: block; }
.tform-upload-label span { color: var(--gold); }
.tform-upload-preview {
    width: 60px; height: 60px; border-radius: 50%;
    object-fit: cover; margin: 0 auto 8px; display: block;
    border: 2px solid var(--gold);
}

.tform-submit {
    width: 100%; padding: 16px;
    background: var(--gold); color: #fff; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 12px;
    letter-spacing: 0.2em; text-transform: uppercase;
    cursor: pointer; transition: background 0.3s, opacity 0.3s;
    margin-top: 8px;
}
.tform-submit:hover { background: var(--gold-light); }
.tform-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.tform-success {
    text-align: center; padding: 48px 24px;
}
.tform-success-icon { font-size: 3rem; margin-bottom: 16px; display: block; }
.tform-success-title {
    font-family: 'Cormorant Garamond', serif; font-size: 1.8rem;
    color: var(--text-main); margin-bottom: 12px;
}
.tform-success-desc { font-size: 14px; color: var(--text-muted); line-height: 1.7; }

/* btn helpers */
.tbtn-gold {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold); color: #fff; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 14px 28px; cursor: pointer;
    transition: background 0.3s; text-decoration: none;
}
.tbtn-gold:hover { background: var(--gold-light); }
.tbtn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: none; border: 1px solid var(--border);
    color: var(--text-main); font-family: 'DM Sans', sans-serif;
    font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 13px 26px; cursor: pointer;
    transition: all 0.3s; text-decoration: none;
}
.tbtn-outline:hover { border-color: var(--gold); color: var(--gold); }

/* ── ANIMATIONS ── */
@keyframes tFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes tFadeLeft {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
}
.treveal {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.65s ease, transform 0.65s ease;
}
.treveal.visible { opacity: 1; transform: translateY(0); }
.treveal-d1 { transition-delay: 0.1s; }
.treveal-d2 { transition-delay: 0.18s; }
.treveal-d3 { transition-delay: 0.26s; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
    .tpage-hero-inner { grid-template-columns: 1fr; gap: 48px; }
    .tpage-grid { columns: 2; }
    .tpage-cta-inner { flex-direction: column; padding: 48px 40px; }
    .tmodal-body, .tmodal-header { padding-left: 28px; padding-right: 28px; }
    .tform-row { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
    .tpage-grid { columns: 1; }
    .tpage-cta-btns { flex-direction: column; }
    .tpage-hero { padding: 120px 6vw 60px; }
}
`;

/* ── Stars display ── */
function Stars({ rating }) {
    return (
        <div className="tcard-stars">
            {[1,2,3,4,5].map(i => (
                <span key={i} className={`tcard-star ${i <= rating ? 'filled' : ''}`}>★</span>
            ))}
        </div>
    );
}

/* ── Star rating input ── */
function StarInput({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="tform-stars">
            {[1,2,3,4,5].map(i => (
                <button
                    key={i} type="button"
                    className={`tform-star-btn ${i <= (hovered || value) ? 'active' : ''}`}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(i)}
                >★</button>
            ))}
        </div>
    );
}

/* ── Testimonial Modal ── */
function TestimonialModal({ open, onClose }) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '', position: '', company: '',
        content: '', rating: 5, avatar: null,
    });
    const [preview, setPreview] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!open) { reset(); setPreview(null); setSubmitted(false); }
    }, [open]);

    const handleAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('avatar', file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('testimonials.store'), {
            forceFormData: true,
            onSuccess: () => setSubmitted(true),
        });
    };

    return (
        <div className={`tmodal-overlay ${open ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="tmodal">
                <div className="tmodal-header">
                    <span className="tmodal-eyebrow">Partagez votre expérience</span>
                    <h2 className="tmodal-title">Laisser un <em>témoignage</em></h2>
                    <button className="tmodal-close" onClick={onClose}>✕</button>
                </div>

                <div className="tmodal-body">
                    {submitted ? (
                        <div className="tform-success">
                            <span className="tform-success-icon">✦</span>
                            <h3 className="tform-success-title">Merci pour votre témoignage !</h3>
                            <p className="tform-success-desc">
                                Votre avis a bien été soumis et sera publié après validation.<br/>
                                Votre confiance nous honore.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {/* Rating */}
                            <div className="tform-group">
                                <label className="tform-label">Note <span>*</span></label>
                                <StarInput value={data.rating} onChange={(v) => setData('rating', v)} />
                                {errors.rating && <span className="tform-error">{errors.rating}</span>}
                            </div>

                            {/* Name + Position */}
                            <div className="tform-row">
                                <div>
                                    <label className="tform-label">Nom complet <span>*</span></label>
                                    <input className="tform-input" type="text" placeholder="Jean Dupont"
                                           value={data.name} onChange={e => setData('name', e.target.value)} />
                                    {errors.name && <span className="tform-error">{errors.name}</span>}
                                </div>
                                <div>
                                    <label className="tform-label">Poste / Fonction</label>
                                    <input className="tform-input" type="text" placeholder="Directeur Technique"
                                           value={data.position} onChange={e => setData('position', e.target.value)} />
                                </div>
                            </div>

                            {/* Company */}
                            <div className="tform-group">
                                <label className="tform-label">Entreprise / Organisation</label>
                                <input className="tform-input" type="text" placeholder="Nom de votre entreprise"
                                       value={data.company} onChange={e => setData('company', e.target.value)} />
                            </div>

                            {/* Content */}
                            <div className="tform-group">
                                <label className="tform-label">Votre témoignage <span>*</span></label>
                                <textarea className="tform-textarea"
                                          placeholder="Décrivez votre expérience avec nos services..."
                                          value={data.content}
                                          onChange={e => setData('content', e.target.value)}
                                          rows={5}
                                />
                                {errors.content && <span className="tform-error">{errors.content}</span>}
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block', textAlign: 'right' }}>
                                    {data.content.length} / 1000
                                </span>
                            </div>

                            {/* Avatar */}
                            <div className="tform-group">
                                <label className="tform-label">Photo de profil (optionnel)</label>
                                <div className="tform-upload">
                                    <input type="file" accept="image/*" onChange={handleAvatar} />
                                    {preview
                                        ? <img src={preview} alt="preview" className="tform-upload-preview" />
                                        : <span className="tform-upload-icon">◎</span>
                                    }
                                    <span className="tform-upload-label">
                                        {preview ? 'Changer la photo' : <>Glisser ou <span>parcourir</span></>}
                                    </span>
                                </div>
                                {errors.avatar && <span className="tform-error">{errors.avatar}</span>}
                            </div>

                            <button type="submit" className="tform-submit" disabled={processing}>
                                {processing ? 'Envoi en cours...' : 'Soumettre le témoignage →'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ══ MAIN PAGE ══════════════════════════════════════════ */
export default function TestimonialsIndex({ testimonials, filters = {}, stats = {} }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => (r?.name ?? r) === 'admin');
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }
        setModalOpen(true);
    };    const [activeFilter, setActiveFilter] = useState(filters.rating || 'all');
    const revealRefs = useRef([]);
    const { flash } = usePage().props;

    useEffect(() => {
        if (!document.getElementById('gc-testimonials-styles')) {
            const el = document.createElement('style');
            el.id = 'gc-testimonials-styles';
            el.textContent = STYLES;
            document.head.appendChild(el);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1 }
        );
        revealRefs.current.forEach(el => el && observer.observe(el));
        return () => observer.disconnect();
    }, [testimonials]);

    const addRef = (i) => (el) => { revealRefs.current[i] = el; };

    const items = testimonials?.data || testimonials || [];
    const totalCount = stats.count ?? items.length;
    const avgRating  = stats.avgRating ? stats.avgRating.toFixed(1) : '—';
    const pagination = testimonials?.links || null;

    const ratingFilters = [
        { label: 'Tous',           value: 'all' },
        { label: '★★★★★ 5 étoiles', value: '5'   },
        { label: '★★★★  4 étoiles', value: '4'   },
        { label: '★★★   3 étoiles', value: '3'   },
    ];

    const handleFilter = (val) => {
        setActiveFilter(val);
        router.get(
            route('testimonials.index'),
            val === 'all' ? {} : { rating: val },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <GuestLayout>
            <style>{`body{background:var(--bg-page)}`}</style>
            <div className="tpage">

                {/* ── HERO ── */}
                <section className="tpage-hero">
                    <div className="tpage-hero-bg" />
                    <div className="tpage-hero-accent" />
                    <div className="tpage-hero-glow" />
                    <div className="tpage-hero-inner">
                        <div>
                            <div className="tpage-eyebrow">Ils témoignent</div>
                            <h1 className="tpage-hero-title">
                                La confiance,<br />
                                <em>bâtie projet</em><br />
                                après projet.
                            </h1>
                            <p className="tpage-hero-desc">
                                Découvrez les retours d'expérience de clients et partenaires qui ont
                                fait confiance à notre expertise en génie civil.
                            </p>
                        </div>

                        <div className="tpage-hero-stats">
                            <div className="tpage-hero-stat">
                                <span className="tpage-hero-stat-num">{stats.count ?? items.length}+</span>
                                <span className="tpage-hero-stat-label">Témoignages<br />publiés</span>
                            </div>
                            <div className="tpage-hero-stat">
                            <span className="tpage-hero-stat-num">
                                {stats.avgRating ? Number(stats.avgRating).toFixed(1) : '—'}
                                <span style={{ fontSize: '1.4rem' }}>★</span>
                            </span>
                                <span className="tpage-hero-stat-label">Note moyenne<br />sur 5</span>
                            </div>
                            <div className="tpage-hero-stat">
                                <span className="tpage-hero-stat-num">98%</span>
                                <span className="tpage-hero-stat-label">Clients<br />satisfaits</span>
                            </div>
                        </div>                    </div>
                </section>

                {/* ── FILTERS ── */}
                {/* ── FILTERS ── */}
                <div className="tpage-filters">
                    <div className="tpage-filters-inner">
                        <span className="tpage-filter-label">Filtrer :</span>
                        {ratingFilters.map(f => (
                            <button key={f.value}
                                    className={`tpage-filter-btn ${activeFilter === f.value ? 'active' : ''}`}
                                    onClick={() => handleFilter(f.value)}>
                                {f.label}
                            </button>
                        ))}
                        {/* Bouton uniquement pour les non-admins */}
                        {!isAdmin && (
                            <button className="tbtn-gold" style={{ marginLeft: 'auto' }}
                                    onClick={handleOpenModal}>
                                + Laisser un avis
                            </button>
                        )}
                    </div>
                </div>
                {/* ── GRID ── */}
                <div className="tpage-grid-wrap">
                    {items.length > 0 ? (
                        <div className="tpage-grid">
                            {items.map((t, i) => (
                                <div key={t.id}
                                     className={`tcard treveal ${t.is_featured ? 'featured' : ''}`}
                                     ref={addRef(i)}
                                     style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                                    <span className="tcard-quote">"</span>
                                    <Stars rating={t.rating} />
                                    <p className="tcard-content">{t.content}</p>
                                    <div className="tcard-author">
                                        {t.avatar_url
                                            ? <img src={`/storage/${t.avatar_url}`} alt={t.name} className="tcard-avatar" />
                                            : <div className="tcard-avatar-placeholder">
                                                {t.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                        }
                                        <div>
                                            <span className="tcard-name">{t.name}</span>
                                            <span className="tcard-role">
                                                {[t.position, t.company].filter(Boolean).join(' — ')}
                                            </span>
                                        </div>
                                    </div>
                                    {t.project && (
                                        <div className="tcard-project">
                                            Projet : {t.project.title}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="tpage-empty">
                            <span className="tpage-empty-icon">◎</span>
                            <p className="tpage-empty-text">Aucun témoignage pour ce filtre.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.length > 3 && (
                        <div className="tpage-pagination" style={{ marginTop: 64 }}>
                            {pagination.map((link, i) => (
                                link.url ? (
                                    <a key={i} href={link.url}
                                       className={`page-btn ${link.active ? 'active' : ''}`}
                                       dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span key={i}
                                          className="page-btn disabled"
                                          dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    )}
                </div>

                {/* ── CTA ── */}
                {/* ── CTA ── */}
                {!isAdmin && (
                    <section className="tpage-cta">
                        <div className="tpage-cta-inner">
                            <span className="tpage-cta-deco">AVIS</span>
                            <div>
                                <div className="tpage-cta-eyebrow">Votre expérience compte</div>
                                <h2 className="tpage-cta-title">
                                    Partagez votre<br /><em>témoignage</em>
                                </h2>
                            </div>
                            <div className="tpage-cta-btns">
                                <button className="tbtn-gold" onClick={handleOpenModal}>
                                    + Laisser un avis
                                </button>
                                <Link href={route('contact')} className="tbtn-outline">
                                    Nous contacter
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* Modal uniquement pour non-admins */}
                {!isAdmin && (
                    <TestimonialModal open={modalOpen} onClose={() => setModalOpen(false)} />
                )}
                {/* ── MODAL ── */}
                <TestimonialModal open={modalOpen} onClose={() => setModalOpen(false)} />
            </div>
        </GuestLayout>
    );
}
