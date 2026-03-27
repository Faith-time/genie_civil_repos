import { Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Components/Layout/GuestLayout';
import { useEffect, useRef, useState } from 'react';
import {
    ChartLine, ClipboardCheck, Building,
    Clock, DraftingCompass, Wrench,
} from 'lucide-react';

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCounter(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start || target === 0) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
}

function useInView(threshold = 0.2) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, inView];
}

// ─── Service Icon (mappe le slug stocké en BD vers une icône Lucide) ──────────
const ICON_MAP = {
    'chart-line':       ChartLine,
    'clipboard-check':  ClipboardCheck,
    'building':         Building,
    'clock':            Clock,
    'drafting-compass': DraftingCompass,
    'wrench':           Wrench,
};

function ServiceIcon({ name, size = 32 }) {
    const Icon = ICON_MAP[name] || Building; // Building par défaut
    return <Icon size={size} strokeWidth={1.5} />;
}

function StatItem({ value, suffix = '', label, inView }) {
    const count = useCounter(value, 1800, inView);
    return (
        <div className="stat-item">
            <span className="stat-number">{count}{suffix}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
}

// ─── Star Input ───────────────────────────────────────────────────────────────
function StarInput({ value, onChange }) {
    const [hov, setHov] = useState(0);
    return (
        <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <button key={i} type="button"
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 24, padding: 4,
                            color: i <= (hov || value) ? 'var(--gold)' : 'var(--border)',
                            transition: 'color 0.15s, transform 0.15s',
                            transform: i <= (hov || value) ? 'scale(1.15)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setHov(i)}
                        onMouseLeave={() => setHov(0)}
                        onClick={() => onChange(i)}>★</button>
            ))}
        </div>
    );
}

// ─── Testimonial Modal ────────────────────────────────────────────────────────
function TestimonialModal({ open, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', position: '', company: '', content: '', rating: 5, avatar: null,
    });
    const [preview, setPreview] = useState(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!open) { reset(); setPreview(null); setDone(false); }
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setData('avatar', f);
        setPreview(URL.createObjectURL(f));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('testimonials.store'), {
            forceFormData: true,
            onSuccess: () => setDone(true),
        });
    };

    if (!open) return null;

    const inputStyle = {
        width: '100%', background: 'transparent',
        border: '1px solid var(--border)', color: 'var(--text)',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        padding: '11px 14px', outline: 'none', WebkitAppearance: 'none',
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(8,13,26,0.9)', backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20, animation: 'modalFadeIn 0.3s ease',
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: 'var(--bg-mid)', border: '1px solid var(--border)',
                width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto',
                position: 'relative', animation: 'modalSlideIn 0.35s ease',
            }}>
                {/* Header */}
                <div style={{
                    padding: '36px 44px 24px', borderBottom: '1px solid var(--border)',
                    position: 'sticky', top: 0, background: 'var(--bg-mid)', zIndex: 1,
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--gold), var(--gold-light), transparent)' }} />
                    <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 6 }}>
                        Partagez votre expérience
                    </span>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '1.9rem', color: 'var(--text)', margin: 0 }}>
                        Laisser un <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>témoignage</em>
                    </h2>
                    <button onClick={onClose} style={{
                        position: 'absolute', top: 16, right: 16, background: 'none',
                        border: '1px solid var(--border)', width: 34, height: 34,
                        color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                </div>

                {/* Body */}
                <div style={{ padding: '32px 44px 44px' }}>
                    {done ? (
                        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', color: 'var(--gold)', marginBottom: 16, lineHeight: 1 }}>✦</div>
                            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'var(--text)', marginBottom: 12 }}>Merci pour votre confiance !</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                                Votre témoignage a bien été soumis.<br />Il sera publié après validation.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={submit}>
                            {/* Note */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                                    Note <span style={{ color: 'var(--gold)' }}>*</span>
                                </label>
                                <StarInput value={data.rating} onChange={(v) => setData('rating', v)} />
                                {errors.rating && <span style={{ fontSize: 11, color: '#e05252', marginTop: 4, display: 'block' }}>{errors.rating}</span>}
                            </div>

                            {/* Nom + Poste */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 7 }}>
                                        Nom complet <span style={{ color: 'var(--gold)' }}>*</span>
                                    </label>
                                    <input style={inputStyle} type="text" placeholder="Jean Dupont"
                                           value={data.name} onChange={e => setData('name', e.target.value)}
                                           onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                           onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                                    {errors.name && <span style={{ fontSize: 11, color: '#e05252', marginTop: 4, display: 'block' }}>{errors.name}</span>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 7 }}>Poste</label>
                                    <input style={inputStyle} type="text" placeholder="Directeur Technique"
                                           value={data.position} onChange={e => setData('position', e.target.value)}
                                           onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                           onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                                </div>
                            </div>

                            {/* Entreprise */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 7 }}>Entreprise</label>
                                <input style={inputStyle} type="text" placeholder="Votre entreprise"
                                       value={data.company} onChange={e => setData('company', e.target.value)}
                                       onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                       onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                            </div>

                            {/* Témoignage */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 7 }}>
                                    Témoignage <span style={{ color: 'var(--gold)' }}>*</span>
                                </label>
                                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
                                          rows={5} placeholder="Décrivez votre expérience..."
                                          value={data.content} onChange={e => setData('content', e.target.value)}
                                          onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                          onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                                {errors.content && <span style={{ fontSize: 11, color: '#e05252', marginTop: 4, display: 'block' }}>{errors.content}</span>}
                                <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, display: 'block', textAlign: 'right' }}>
                                    {data.content.length} / 1000
                                </span>
                            </div>

                            {/* Photo */}
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 7 }}>Photo (optionnel)</label>
                                <div style={{ border: '1px dashed var(--border)', padding: 20, textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                                    <input type="file" accept="image/*" onChange={handleFile}
                                           style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                    {preview
                                        ? <img src={preview} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 6px', display: 'block', border: '2px solid var(--gold)' }} />
                                        : <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>◎</span>
                                    }
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                        {preview ? 'Changer' : <><span style={{ color: 'var(--gold)' }}>Parcourir</span> ou glisser</>}
                                    </span>
                                </div>
                                {errors.avatar && <span style={{ fontSize: 11, color: '#e05252', marginTop: 4, display: 'block' }}>{errors.avatar}</span>}
                            </div>

                            <button type="submit" disabled={processing} style={{
                                width: '100%', padding: 15,
                                background: processing ? 'var(--text-muted)' : 'var(--gold)',
                                color: '#fff', border: 'none',
                                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                                letterSpacing: '0.2em', textTransform: 'uppercase',
                                cursor: processing ? 'not-allowed' : 'pointer',
                            }}>
                                {processing ? 'Envoi en cours...' : 'Soumettre mon témoignage →'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ realisation, isLarge = false }) {
    // Récupérer l'image principale ou la première image disponible
    const imageUrl = realisation.mainImage?.image_url
        || realisation.images?.[0]?.image_url
        || null;

    const href = route('realisations.show', realisation.id);

    return (
        <Link href={href} className="project-card">
            {realisation.video_url ? (
                <div className="project-placeholder" style={{ position: 'relative' }}>
                    <span>🎬</span>
                    <span style={{
                        position: 'absolute', bottom: 16, right: 16,
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'var(--gold)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>▶</span>
                </div>
            ) : imageUrl ? (
                <img src={imageUrl} alt={realisation.title} className="project-image"
                     style={{ minHeight: isLarge ? 560 : 280 }} />
            ) : (
                <div className="project-placeholder" style={{ minHeight: isLarge ? 560 : 280 }}>
                    🏗️
                </div>
            )}
            <div className="project-overlay">
                {realisation.service && (
                    <div className="project-service-tag">{realisation.service.name}</div>
                )}
                <h3 className="project-title">{realisation.title}</h3>
                {realisation.location && (
                    <div className="project-location">
                        <span>📍</span> {realisation.location}
                    </div>
                )}
                {realisation.date_realisation && (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                        {new Date(realisation.date_realisation).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </div>
                )}
            </div>
        </Link>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Home({

                                 services = [],
                                 featuredRealisations = [],
                                 testimonials = [],
                                 stats = {},
                             }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => (r?.name ?? r) === 'admin');
    const [statsRef, statsInView] = useInView(0.3);
    const [heroLoaded, setHeroLoaded]       = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [modalOpen, setModalOpen]         = useState(false);

    // Synchronisation avec le thème du Navbar
    const [dark, setDark] = useState(() =>
        typeof window !== 'undefined'
            ? document.documentElement.getAttribute('data-theme') !== 'light'
            : true
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDark(document.documentElement.getAttribute('data-theme') !== 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setHeroLoaded(true), 100);
        return () => clearTimeout(t);
    }, []);

    // Auto-rotation du carousel de témoignages
    useEffect(() => {
        if (testimonials.length <= 1) return;
        const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
        return () => clearInterval(t);
    }, [testimonials.length]);

    // Stats avec fallback à 0
    const projectsCount    = stats.projectsCount    ?? 0;
    const satisfactionRate = stats.satisfactionRate  ?? 0;
    const avgRating        = stats.avgRating         ? Number(stats.avgRating).toFixed(1) : '—';
    const testimonialsCount = stats.testimonialsCount ?? 0;

    return (
        <GuestLayout>
            <br /><br /><br /><br /><br />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

                /* ── THEMES ── */
                .home-page.light {
                    --bg:#f4ede0; --bg-mid:#ebe3d4; --bg-light:#e0d5c2;
                    --gold:#9a6e1e; --gold-light:#c9943a;
                    --white:#1c1407; --text:#2e2210; --text-muted:#7a6545;
                    --border:rgba(154,110,30,0.22); --grid-line:rgba(154,110,30,0.09);
                    --card-bg:#f4ede0; --card-hover:#ebe3d4;
                    --overlay-start:rgba(244,237,224,0.96);
                    --shadow:0 4px 32px rgba(100,70,20,0.12);
                }
                .home-page.dark {
                    --bg:#080d1a; --bg-mid:#0f1628; --bg-light:#1a2340;
                    --gold:#c9943a; --gold-light:#e8b96a;
                    --white:#ffffff; --text:#f8f3eb; --text-muted:#8a9bb5;
                    --border:rgba(201,148,58,0.2); --grid-line:rgba(201,148,58,0.07);
                    --card-bg:#080d1a; --card-hover:#0f1628;
                    --overlay-start:rgba(8,13,26,0.95);
                    --shadow:0 4px 40px rgba(0,0,0,0.45);
                }

                /* ── BASE ── */
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .home-page {
                    font-family: 'DM Sans', sans-serif;
                    background: var(--bg); color: var(--text); overflow-x: hidden;
                }
                .home-page, .home-page * {
                    transition: background-color .45s ease, border-color .45s ease,
                                color .45s ease, box-shadow .45s ease;
                }
                /* Exceptions : éléments animés */
                .accent-ring, .accent-center, .scroll-line::after,
                .hero-content, .hero-accent, .hero-photo-col { transition: none !important; }
                .hero-content   { transition: opacity 1s ease, transform 1s ease !important; }
                .hero-photo-col { transition: opacity .9s ease .3s, transform .9s ease .3s !important; }
                .hero-accent    { transition: opacity 1.5s ease .5s !important; }

                .blueprint-bg {
                    position: fixed; inset: 0; pointer-events: none; z-index: 0;
                    background-image:
                        linear-gradient(var(--grid-line) 1px, transparent 1px),
                        linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
                    background-size: 60px 60px;
                }

                /* ── HERO ── */
                .hero {
                    position: relative; min-height: 100vh;
                    display: flex; align-items: center;
                    padding: 0 6vw; z-index: 1; overflow: hidden;
                }
                .hero-inner {
                    position: relative; z-index: 2;
                    width: 100%; max-width: 1280px; margin: 0 auto;
                    display: grid; grid-template-columns: 1fr 320px;
                    gap: 80px; align-items: center;
                }
                .hero-content { opacity: 0; transform: translateY(30px); }
                .hero-content.loaded { opacity: 1; transform: translateY(0); }
                .hero-tag {
                    display: inline-flex; align-items: center; gap: 10px;
                    font-size: 11px; font-weight: 500; letter-spacing: .25em;
                    text-transform: uppercase; color: var(--gold); margin-bottom: 28px;
                }
                .hero-tag::before { content: ''; display: block; width: 40px; height: 1px; background: var(--gold); }
                .hero-name {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(3.5rem, 8vw, 8rem); font-weight: 300;
                    line-height: .92; color: var(--white); letter-spacing: -.02em; margin-bottom: 8px;
                }
                .hero-name em { font-style: italic; color: var(--gold-light); }
                .hero-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(1.2rem, 2.5vw, 2rem);
                    letter-spacing: .15em; color: var(--text-muted); margin-bottom: 32px;
                }
                .hero-desc {
                    font-size: 1rem; font-weight: 300; line-height: 1.8;
                    color: var(--text-muted); max-width: 520px; margin-bottom: 48px;
                }
                .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }

                /* Photo card */
                .hero-photo-col { opacity: 0; transform: translateX(24px); }
                .hero-photo-col.loaded { opacity: 1; transform: translateX(0); }
                .hero-photo-frame { position: relative; width: 100%; }
                .hero-photo-card {
                    position: relative; width: 100%; aspect-ratio: 3/4;
                    border: 1px solid var(--border); overflow: hidden; background: var(--bg-mid);
                }
                .hero-photo-card img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
                .hero-photo-deco  { position: absolute; top: -14px; right: -14px; width: 80px; height: 80px; border: 1px solid var(--border); pointer-events: none; }
                .hero-photo-deco2 { position: absolute; bottom: -14px; left: -14px; width: 60px; height: 60px; border: 1px solid var(--border); pointer-events: none; }
                .hero-photo-badge {
                    position: absolute; bottom: 24px; right: -20px;
                    background: var(--gold); color: #fff; padding: 14px 18px; z-index: 2;
                }
                .hero-photo-badge-num { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; line-height: 1; display: block; }
                .hero-photo-badge-txt { font-size: 8px; letter-spacing: .15em; text-transform: uppercase; opacity: .85; display: block; margin-top: 3px; }
                .hero-photo-sig {
                    position: absolute; top: 20px; left: -14px;
                    background: var(--bg-mid); border: 1px solid var(--border);
                    padding: 10px 14px; z-index: 2;
                }
                .hero-photo-sig-l1 { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: .95rem; color: var(--text); display: block; }
                .hero-photo-sig-l2 { font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); display: block; margin-top: 3px; }

                /* Accent rings */
                .hero-accent {
                    position: absolute; right: 5vw; top: 50%; transform: translateY(-50%);
                    width: min(45vw, 600px); height: min(45vw, 600px);
                    pointer-events: none; opacity: 0;
                }
                .hero-accent.loaded { opacity: .25; }
                .accent-ring { position: absolute; border-radius: 50%; border: 1px solid var(--border); }
                .accent-ring:nth-child(1) { inset: 0;   animation: rotate 40s linear infinite; }
                .accent-ring:nth-child(2) { inset: 12%; animation: rotate 30s linear infinite reverse; }
                .accent-ring:nth-child(3) { inset: 24%; }
                .accent-cross { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
                .accent-cross::before, .accent-cross::after { content: ''; position: absolute; background: var(--border); transition: background .45s ease !important; }
                .accent-cross::before { width: 1px; height: 100%; }
                .accent-cross::after  { width: 100%; height: 1px; }
                .accent-center {
                    position: absolute; inset: 38%;
                    background: radial-gradient(circle, rgba(154,110,30,.12) 0%, transparent 70%);
                    border-radius: 50%; animation: pulse-glow 3s ease-in-out infinite;
                }
                @keyframes rotate    { to { transform: rotate(360deg); } }
                @keyframes pulse-glow { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.1); } }

                .hero-scroll {
                    position: absolute; bottom: 40px; left: 6vw;
                    display: flex; align-items: center; gap: 12px;
                    font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--text-muted);
                }
                .scroll-line { width: 50px; height: 1px; background: linear-gradient(90deg, var(--gold) 0%, transparent 100%); position: relative; overflow: hidden; }
                .scroll-line::after { content: ''; position: absolute; inset: 0; background: var(--bg); animation: scroll-anim 2s ease-in-out infinite; }
                @keyframes scroll-anim { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

                /* ── SECTIONS ── */
                section { position: relative; z-index: 1; }
                .section-inner { max-width: 1280px; margin: 0 auto; padding: 0 6vw; }
                .section-label {
                    display: inline-flex; align-items: center; gap: 12px;
                    font-size: 10px; font-weight: 500; letter-spacing: .3em;
                    text-transform: uppercase; color: var(--gold); margin-bottom: 20px;
                }
                .section-label::before { content: ''; width: 30px; height: 1px; background: var(--gold); }
                .section-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 300;
                    line-height: 1.1; color: var(--white); letter-spacing: -.01em; margin-bottom: 16px;
                }
                .section-title em { font-style: italic; color: var(--gold-light); }
                .section-subtitle { font-size: .95rem; font-weight: 300; color: var(--text-muted); line-height: 1.7; max-width: 480px; }
                .divider { width: 60px; height: 2px; background: linear-gradient(90deg, var(--gold) 0%, transparent 100%); margin: 20px 0 40px; }

                /* ── STATS ── */
                .stats-section {
                    padding: 80px 0;
                    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
                    background: var(--bg-mid);
                }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
                .stat-item {
                    display: flex; flex-direction: column; align-items: center;
                    padding: 40px 20px; border-right: 1px solid var(--border);
                    text-align: center; transition: background .3s !important;
                }
                .stat-item:last-child { border-right: none; }
                .stat-item:hover { background: rgba(154,110,30,.04); }
                .stat-number {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(3rem, 5vw, 5rem); color: var(--gold);
                    line-height: 1; letter-spacing: .05em; margin-bottom: 8px;
                }
                .stat-label { font-size: 11px; font-weight: 400; letter-spacing: .15em; text-transform: uppercase; color: var(--text-muted); }

                /* ── SERVICES ── */
                .services-section { padding: 120px 0; }
                .services-header {
                    display: flex; justify-content: space-between; align-items: flex-end;
                    margin-bottom: 64px; gap: 32px; flex-wrap: wrap;
                }
                .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); }
                .service-card {
                    background: var(--card-bg); padding: 48px 40px;
                    position: relative; overflow: hidden;
                    text-decoration: none; display: block;
                    transition: background .3s !important;
                }
                .service-card::before {
                    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
                    background: var(--gold); transform: scaleX(0); transform-origin: left;
                    transition: transform .4s ease !important;
                }
                .service-card:hover { background: var(--card-hover); }
                .service-card:hover::before { transform: scaleX(1); }
                .service-card:hover .service-arrow { opacity: 1; border-color: var(--gold); transform: translate(-4px,-4px); }
                .service-number { font-family: 'Bebas Neue', sans-serif; font-size: 3.5rem; color: var(--border); line-height: 1; margin-bottom: 24px; }
                .service-icon  { font-size: 2rem; margin-bottom: 20px; display: block; }
                .service-name  { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 400; color: var(--white); margin-bottom: 12px; line-height: 1.2; }
                .service-desc  {
                    font-size: .875rem; font-weight: 300; color: var(--text-muted); line-height: 1.7;
                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
                }
                .service-arrow {
                    position: absolute; bottom: 32px; right: 32px;
                    width: 36px; height: 36px; border: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--gold); font-size: 14px; opacity: 0;
                    transition: all .3s !important;
                }

                /* ── PROJECTS ── */
                .projects-section { padding: 120px 0; background: var(--bg-mid); }
                .projects-header {
                    display: flex; justify-content: space-between; align-items: flex-end;
                    margin-bottom: 64px; flex-wrap: wrap; gap: 32px;
                }
                .projects-grid { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: auto auto; gap: 2px; }
                .project-card { position: relative; overflow: hidden; text-decoration: none; display: block; background: var(--bg-light); }
                .project-card:first-child { grid-row: span 2; }
                .project-image { width: 100%; height: 100%; min-height: 280px; object-fit: cover; display: block; filter: grayscale(15%) brightness(.85); transition: transform .6s ease, filter .6s ease !important; }
                .home-page.light .project-image { filter: grayscale(10%) brightness(.9); }
                .project-card:hover .project-image { filter: grayscale(0%) brightness(1); transform: scale(1.04); }
                .project-placeholder {
                    width: 100%; min-height: 280px;
                    background: linear-gradient(135deg, var(--bg-light) 0%, var(--bg-mid) 100%);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--border); font-size: 4rem; position: relative;
                }
                .project-card:first-child .project-image,
                .project-card:first-child .project-placeholder { min-height: 560px; }
                .project-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, var(--overlay-start) 0%, transparent 60%);
                    padding: 32px; display: flex; flex-direction: column; justify-content: flex-end;
                }
                .project-service-tag { font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; }
                .project-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.2rem,2vw,1.7rem); font-weight: 400; color: var(--white); line-height: 1.2; margin-bottom: 8px; }
                .project-location { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }

                /* Empty states */
                .empty-state {
                    text-align: center; padding: 64px 24px;
                    color: var(--text-muted);
                }
                .empty-state-icon { font-size: 3rem; margin-bottom: 16px; display: block; opacity: .4; }
                .empty-state-text { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; }

                /* ── TESTIMONIALS ── */
                .testimonials-section { padding: 120px 0; overflow: hidden; }
                .testimonials-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
                .testimonial-display { position: relative; min-height: 320px; }
                .testimonial-item {
                    position: absolute; inset: 0; opacity: 0; transform: translateY(20px);
                    transition: all .6s ease !important; pointer-events: none;
                }
                .testimonial-item.active { opacity: 1; transform: translateY(0); pointer-events: auto; }
                .quote-mark { font-family: 'Cormorant Garamond', serif; font-size: 7rem; color: var(--gold); opacity: .13; line-height: .6; margin-bottom: 12px; display: block; }
                .t-stars { display: flex; gap: 3px; margin-bottom: 16px; }
                .tstar     { font-size: 13px; color: var(--border); }
                .tstar.on  { color: var(--gold); }
                .testimonial-content {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(1.1rem, 1.8vw, 1.45rem); font-style: italic;
                    font-weight: 300; color: var(--text); line-height: 1.75; margin-bottom: 28px;
                }
                .testimonial-author { display: flex; align-items: center; gap: 14px; }
                .author-avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); }
                .author-placeholder {
                    width: 50px; height: 50px; border-radius: 50%;
                    background: rgba(154,110,30,.1); border: 2px solid var(--border);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: var(--gold);
                }
                .author-name { font-size: 14px; font-weight: 500; color: var(--white); display: block; margin-bottom: 2px; }
                .author-role { font-size: 11px; color: var(--text-muted); letter-spacing: .05em; }
                .t-nav { display: flex; gap: 8px; margin-top: 40px; }
                .t-dot { width: 24px; height: 2px; background: var(--border); cursor: pointer; border: none; padding: 0; transition: all .3s !important; }
                .t-dot.active { background: var(--gold); width: 48px; }

                .t-cta-block { border: 1px solid var(--border); padding: 44px 40px; position: relative; overflow: hidden; background: var(--card-bg); }
                .t-cta-block::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--gold) 0%, transparent 100%); }
                .t-cta-deco { font-family: 'Bebas Neue', sans-serif; font-size: 5.5rem; color: var(--border); line-height: 1; position: absolute; top: 12px; right: 24px; }
                .t-cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 300; color: var(--white); line-height: 1.2; margin-bottom: 12px; }
                .t-cta-title em { font-style: italic; color: var(--gold-light); }
                .t-cta-text { font-size: .875rem; font-weight: 300; color: var(--text-muted); line-height: 1.7; margin-bottom: 28px; }
                .t-cta-btns { display: flex; gap: 12px; flex-wrap: wrap; }
                .t-mini-stats { display: flex; gap: 24px; margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--border); }
                .t-mini-num { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--gold); line-height: 1; display: block; }
                .t-mini-lbl { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-muted); margin-top: 3px; display: block; }

                /* ── CTA FINAL ── */
                .cta-section {
                    padding: 100px 0; background: var(--bg-mid);
                    border-top: 1px solid var(--border); text-align: center; position: relative; overflow: hidden;
                }
                .cta-section::before {
                    content: 'INGÉNIERIE'; font-family: 'Bebas Neue', sans-serif; font-size: 20vw;
                    color: var(--grid-line); position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%); white-space: nowrap; letter-spacing: .1em; pointer-events: none;
                }
                .cta-content { position: relative; z-index: 1; }
                .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 300; color: var(--white); line-height: 1.1; margin-bottom: 20px; }
                .cta-title em { font-style: italic; color: var(--gold-light); }
                .cta-subtitle { font-size: 1rem; font-weight: 300; color: var(--text-muted); margin-bottom: 48px; max-width: 500px; margin-left: auto; margin-right: auto; }
                .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

                /* ── BUTTONS ── */
                .btn-primary {
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 16px 36px; background: var(--gold); color: var(--bg);
                    font-size: 13px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
                    text-decoration: none; position: relative; overflow: hidden;
                    border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
                }
                .btn-primary::before { content: ''; position: absolute; inset: 0; background: var(--gold-light); transform: translateX(-100%); transition: transform .3s ease !important; }
                .btn-primary:hover::before { transform: translateX(0); }
                .btn-primary span { position: relative; z-index: 1; }
                .btn-outline {
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 16px 36px; border: 1px solid var(--border);
                    color: var(--text); font-size: 13px; font-weight: 400; letter-spacing: .1em;
                    text-transform: uppercase; text-decoration: none; background: none;
                    cursor: pointer; font-family: 'DM Sans', sans-serif;
                    transition: border-color .3s, color .3s !important;
                }
                .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
                .btn-sm-outline {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 11px 20px; border: 1px solid var(--border);
                    color: var(--text); font-family: 'DM Sans', sans-serif;
                    font-size: 11px; font-weight: 400; letter-spacing: .12em; text-transform: uppercase;
                    text-decoration: none; background: none; cursor: pointer;
                    transition: border-color .3s, color .3s !important;
                }
                .btn-sm-outline:hover { border-color: var(--gold); color: var(--gold); }

                /* ── MODAL ── */
                @keyframes modalFadeIn   { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalSlideIn  { from { transform: translateY(28px) scale(.97); } to { transform: translateY(0) scale(1); } }

                /* ── RESPONSIVE ── */
                @media (max-width: 1024px) {
                    .hero-inner { grid-template-columns: 1fr; }
                    .hero-photo-col, .hero-accent { display: none; }
                    .services-grid { grid-template-columns: repeat(2, 1fr); }
                    .projects-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
                    .project-card:first-child { grid-row: span 1; }
                    .project-card:first-child .project-image,
                    .project-card:first-child .project-placeholder { min-height: 280px; }
                    .testimonials-inner { grid-template-columns: 1fr; gap: 48px; }
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .stat-item:nth-child(2) { border-right: none; }
                    .stat-item:nth-child(3), .stat-item:nth-child(4) { border-top: 1px solid var(--border); }
                }
                @media (max-width: 640px) {
                    .services-grid { grid-template-columns: 1fr; }
                    .hero-ctas, .cta-btns, .t-cta-btns { flex-direction: column; }
                    .btn-primary, .btn-outline { text-align: center; justify-content: center; }
                }
            `}</style>

            <div className={`home-page ${dark ? 'dark' : 'light'}`}>
                <div className="blueprint-bg" />

                {/* ══ HERO ══════════════════════════════════════════════ */}
                <section className="hero">
                    <div className="hero-inner">
                        {/* Texte */}
                        <div className={`hero-content ${heroLoaded ? 'loaded' : ''}`}>
                            <div className="hero-tag">Ingénieur Civil Professionnel</div>
                            <h1 className="hero-name">
                                Bâtir<br /><em>l'Avenir</em><br />en Béton.
                            </h1>
                            <p className="hero-title">Conception · Structure · Excellence</p>
                            <p className="hero-desc">
                                Spécialiste en conception structurale, gestion de projets d'infrastructure
                                et suivi de chantier. Chaque projet est une signature de précision,
                                de durabilité et d'innovation.
                            </p>
                            <div className="hero-ctas">
                                <Link href={route('realisations.index')} className="btn-primary">
                                    <span>Voir les Projets</span><span>→</span>
                                </Link>
                                {!isAdmin && (
                                    <Link href={route('contact')} className="btn-outline">
                                        Prendre Contact
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Photo */}
                        <div className={`hero-photo-col ${heroLoaded ? 'loaded' : ''}`}>
                            <div className="hero-photo-frame">
                                <div className="hero-photo-card">
                                    <img src="/images/sidibe1.jpeg" alt="Ingénieur Civil" />
                                </div>
                                <div className="hero-photo-deco" />
                                <div className="hero-photo-deco2" />
                                <div className="hero-photo-sig">
                                    <span className="hero-photo-sig-l1">L'ingénieur</span>
                                    <span className="hero-photo-sig-l2">Génie Civil</span>
                                </div>
                                <div className="hero-photo-badge">
                                    <span className="hero-photo-badge-num">5+</span>
                                    <span className="hero-photo-badge-txt">Années d'exp.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cercles décoratifs */}
                    <div className={`hero-accent ${heroLoaded ? 'loaded' : ''}`}>
                        <div className="accent-ring" />
                        <div className="accent-ring" />
                        <div className="accent-ring" />
                        <div className="accent-cross" />
                        <div className="accent-center" />
                    </div>

                    <div className="hero-scroll">
                        <div className="scroll-line" /><span>Scroll</span>
                    </div>
                </section>

                {/* ══ STATS ═════════════════════════════════════════════ */}
                <section className="stats-section">
                    <div className="section-inner">
                        <div className="stats-grid" ref={statsRef}>
                            <StatItem
                                value={projectsCount}
                                suffix="+"
                                label="Projets réalisés"
                                inView={statsInView}
                            />
                            <StatItem
                                value={testimonialsCount}
                                suffix="+"
                                label="Avis clients"
                                inView={statsInView}
                            />
                            <StatItem
                                value={satisfactionRate}
                                suffix="%"
                                label="Clients satisfaits"
                                inView={statsInView}
                            />
                            <StatItem
                                value={5}
                                suffix="+"
                                label="Années d'expérience"
                                inView={statsInView}
                            />
                        </div>
                    </div>
                </section>

                {/* ══ SERVICES ══════════════════════════════════════════ */}
                <section className="services-section">
                    <div className="section-inner">
                        <div className="services-header">
                            <div>
                                <div className="section-label">Domaines d'expertise</div>
                                <h2 className="section-title">Mes <em>Services</em></h2>
                                <div className="divider" />
                                <p className="section-subtitle">
                                    Une gamme complète de prestations en ingénierie civile,
                                    de la conception à la livraison.
                                </p>
                            </div>
                            <Link href={route('services.index')} className="btn-outline" style={{ whiteSpace: 'nowrap' }}>
                                Tous les services →
                            </Link>
                        </div>

                        {services.length > 0 ? (
                            <div className="services-grid">
                                {services.map((s, i) => (
                                    <Link key={s.id} href={route('services.show', s.slug)} className="service-card">
                                        <div className="service-number">{String(i + 1).padStart(2, '0')}</div>

                                        {/* ✅ Icône Lucide au lieu du texte brut */}
                                        <span className="service-icon" style={{ color: 'var(--gold)', display: 'block', marginBottom: 20 }}>
                    <ServiceIcon name={s.icon} size={36} />
                </span>

                                        <h3 className="service-name">{s.title}</h3>
                                        <p className="service-desc">{s.short_description || s.description}</p>
                                        {s.projects_count > 0 && (
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
                                                {s.projects_count} projet{s.projects_count > 1 ? 's' : ''}
                                            </p>
                                        )}
                                        <div className="service-arrow">→</div>
                                    </Link>
                                ))}

                                {/* ✅ Combler les cases vides pour éviter le slot marron */}
                                {Array.from({ length: (3 - (services.length % 3)) % 3 }).map((_, i) => (
                                    <div key={`empty-${i}`} style={{ background: 'var(--card-bg)' }} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <span className="empty-state-icon">🏗️</span>
                                <p className="empty-state-text">Les services apparaîtront ici.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ══ PROJETS ═══════════════════════════════════════════ */}
                <section className="projects-section">
                    <div className="section-inner">
                        <div className="projects-header">
                            <div>
                                <div className="section-label">Portfolio</div>
                                <h2 className="section-title">Projets <em>Réalisés</em></h2>
                                <div className="divider" />
                            </div>
                            <Link href={route('realisations.index')} className="btn-outline" style={{ whiteSpace: 'nowrap' }}>
                                Tout le portfolio →
                            </Link>
                        </div>

                        {featuredRealisations.length > 0 ? (
                            <div className="projects-grid">
                                {featuredRealisations.slice(0, 3).map((r, i) => (
                                    <ProjectCard key={r.id} realisation={r} isLarge={i === 0} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <span className="empty-state-icon">🏗️</span>
                                <p className="empty-state-text">
                                    Les projets mis en avant apparaîtront ici.<br />
                                    <Link href={route('realisations.index')} style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>
                                        Voir toutes les réalisations →
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ══ TÉMOIGNAGES ═══════════════════════════════════════ */}
                <section className="testimonials-section">
                    <div className="section-inner">
                        {testimonials.length > 0 ? (
                            <div className="testimonials-inner">
                                {/* Carousel */}
                                <div>
                                    <div className="section-label">Ils me font confiance</div>
                                    <h2 className="section-title">Leurs <em>Avis</em></h2>
                                    <div className="divider" />

                                    <div className="testimonial-display">
                                        {testimonials.map((t, i) => (
                                            <div key={t.id} className={`testimonial-item ${i === activeTestimonial ? 'active' : ''}`}>
                                                <div className="t-stars">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <span key={s} className={`tstar ${s <= t.rating ? 'on' : ''}`}>★</span>
                                                    ))}
                                                </div>
                                                <span className="quote-mark">"</span>
                                                <p className="testimonial-content">{t.content}</p>
                                                <div className="testimonial-author">
                                                    {t.avatar_url
                                                        ? <img src={`/storage/${t.avatar_url}`} alt={t.name} className="author-avatar" />
                                                        : <div className="author-placeholder">{t.name?.charAt(0)?.toUpperCase()}</div>
                                                    }
                                                    <div>
                                                        <span className="author-name">{t.name}</span>
                                                        <span className="author-role">
                                                            {[t.position, t.company].filter(Boolean).join(' — ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {testimonials.length > 1 && (
                                        <div className="t-nav">
                                            {testimonials.map((_, i) => (
                                                <button key={i}
                                                        className={`t-dot ${i === activeTestimonial ? 'active' : ''}`}
                                                        onClick={() => setActiveTestimonial(i)} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* CTA card */}
                                <div>
                                    <div className="t-cta-block">
                                        <span className="t-cta-deco">★</span>
                                        <h3 className="t-cta-title">Votre avis nous<br /><em>inspire</em></h3>
                                        <p className="t-cta-text">
                                            Vous avez collaboré sur un projet ? Partagez votre expérience
                                            et aidez d'autres clients à faire le bon choix.
                                        </p>
                                        {/* CTA card côté droit */}
                                        <div className="t-cta-block">
                                            <span className="t-cta-deco">★</span>
                                            <h3 className="t-cta-title">
                                                {isAdmin
                                                    ? <>Les avis de<br />vos <em>clients</em></>
                                                    : <>Votre avis nous<br /><em>inspire</em></>
                                                }
                                            </h3>
                                            <p className="t-cta-text">
                                                {isAdmin
                                                    ? 'Consultez et modérez les témoignages soumis par vos clients. Validez ceux qui reflètent le mieux votre expertise.'
                                                    : 'Vous avez collaboré sur un projet ? Partagez votre expérience et aidez d\'autres clients à faire le bon choix.'
                                                }
                                            </p>
                                            <div className="t-cta-btns">
                                                {!isAdmin && (
                                                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                                                        <span>+ Laisser un avis</span>
                                                    </button>
                                                )}
                                                {isAdmin ? (
                                                    <Link href={route('testimonials.index')} className="btn-primary">
                                                        <span>Gérer les avis →</span>
                                                    </Link>
                                                ) : (
                                                    <Link href={route('testimonials.index')} className="btn-sm-outline">
                                                        Tous les avis →
                                                    </Link>
                                                )}
                                            </div>
                                            {/* mini stats — identiques pour tous */}
                                            <div className="t-mini-stats">
                                                <div>
                                                    <span className="t-mini-num">{satisfactionRate}%</span>
                                                    <span className="t-mini-lbl">Satisfaction</span>
                                                </div>
                                                <div>
                                                    <span className="t-mini-num">{avgRating}★</span>
                                                    <span className="t-mini-lbl">Note moy.</span>
                                                </div>
                                                <div>
                                                    <span className="t-mini-num">{testimonialsCount}</span>
                                                    <span className="t-mini-lbl">Avis publiés</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="t-mini-stats">
                                            <div>
                                                <span className="t-mini-num">{satisfactionRate}%</span>
                                                <span className="t-mini-lbl">Satisfaction</span>
                                            </div>
                                            <div>
                                                <span className="t-mini-num">{avgRating}★</span>
                                                <span className="t-mini-lbl">Note moy.</span>
                                            </div>
                                            <div>
                                                <span className="t-mini-num">{testimonialsCount}</span>
                                                <span className="t-mini-lbl">Avis publiés</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Pas encore de témoignages → afficher uniquement le CTA */<div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
                        <div className="section-label" style={{ justifyContent: 'center' }}>Ils me font confiance</div>
                        <h2 className="section-title">Leurs <em>Avis</em></h2>
                        <div className="divider" style={{ margin: '20px auto 32px' }} />
                        <div className="t-cta-block" style={{ textAlign: 'left' }}>
                            <span className="t-cta-deco">★</span>
                            <h3 className="t-cta-title">Votre retour est<br />notre <em>meilleure vitrine</em></h3>
                            <p className="t-cta-text">
                                Vous avez travaillé avec nous ? Un témoignage sincère aide d'autres
                                clients à faire confiance à notre expertise — et nous honore profondément.
                            </p>
                            <div className="t-cta-btns">
                                {!isAdmin && (
                                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                                        <span>+ Laisser un témoignage</span>
                                    </button>
                                )}
                                <Link href={route('testimonials.index')} className="btn-sm-outline">
                                    Tous les avis →
                                </Link>
                            </div>
                        </div>
                    </div>
                    )}
                    </div>
                </section>

                {/* ══ CTA FINAL ═════════════════════════════════════════ */}
                <section className="cta-section">
                    <div className="section-inner">
                        <div className="cta-content">
                            <div className="section-label" style={{ justifyContent: 'center' }}>Prêt à collaborer</div>
                            <h2 className="cta-title">Construisons <em>ensemble</em><br />votre vision</h2>
                            <p className="cta-subtitle">
                                Expertise technique, intégrité professionnelle et passion pour
                                l'ingénierie au service de vos ambitions.
                            </p>
                            {/* ══ CTA FINAL ═════════════════════════════════════════ */}
                            <section className="cta-section">
                                <div className="section-inner">
                                    <div className="cta-content">
                                        <div className="section-label" style={{ justifyContent: 'center' }}>
                                            {isAdmin ? 'Tableau de bord' : 'Prêt à collaborer'}
                                        </div>
                                        <h2 className="cta-title">
                                            {isAdmin ? (
                                                <>Gérez votre <em>plateforme</em><br />avec précision</>
                                            ) : (
                                                <>Construisons <em>ensemble</em><br />votre vision</>
                                            )}
                                        </h2>
                                        <p className="cta-subtitle">
                                            {isAdmin
                                                ? 'Suivez les projets clients, gérez les demandes entrantes et pilotez votre activité depuis votre espace administrateur.'
                                                : 'Expertise technique, intégrité professionnelle et passion pour l\'ingénierie au service de vos ambitions.'
                                            }
                                        </p>
                                        <div className="cta-btns">
                                            {isAdmin ? (
                                                <Link href={route('admin.client-projects.index')} className="btn-primary">
                                                    <span>Voir les demandes</span><span>→</span>
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link href={route('contact')} className="btn-primary">
                                                        <span>Nous contacter</span><span>→</span>
                                                    </Link>
                                                    <a href={route('cv.download')} className="btn-outline">
                                                        Télécharger le CV
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </div>

            <TestimonialModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </GuestLayout>
    );
}
