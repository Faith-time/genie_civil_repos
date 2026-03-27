// ─── Footer.jsx ─────────────────────────────────────────────────────────────
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const FOOTER_STYLES = `
.site-footer {
    position: relative;
    background: var(--footer-bg);          /* ← PAS de fallback hardcodé */
    border-top: 1px solid var(--footer-border);
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    z-index: 1;
    transition: background 0.4s ease, border-color 0.4s ease;
}

/* Watermark décoratif */
.footer-watermark {
    position: absolute;
    bottom: -20px; right: -20px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(6rem, 14vw, 16rem);
    color: var(--footer-water, rgba(201,148,58,0.03));
    line-height: 1; letter-spacing: 0.05em;
    pointer-events: none; user-select: none; white-space: nowrap;
    transition: color 0.4s ease;
}

/* ── Top grid ── */
.footer-top {
    padding: 72px 6vw 56px;
    max-width: 1280px; margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 64px;
}

/* ── Logo image (comme navbar) ── */
.footer-logo-link {
    display: inline-block;
    margin-bottom: 24px;
    text-decoration: none;
    transition: opacity 0.3s;
}
.footer-logo-link:hover { opacity: 0.8; }
.footer-logo-img {
    height: 80px; width: auto; max-width: 200px;
    display: block; object-fit: contain;
    transition: filter 0.4s ease;
}

.footer-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-size: 1.05rem; font-weight: 300;
    color: var(--text-muted); line-height: 1.7;
    margin-bottom: 28px; max-width: 280px;
    transition: color 0.4s ease;
}

.footer-contact-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.footer-contact-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: var(--text-muted);
    text-decoration: none; transition: color 0.3s;
}
.footer-contact-item:hover { color: var(--gold); }
.contact-icon {
    width: 28px; height: 28px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: var(--gold); flex-shrink: 0;
    transition: border-color 0.4s ease;
}

/* ── Titres de colonnes ── */
.footer-col-title {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
}
.footer-col-title::before {
    content: ''; display: block;
    width: 20px; height: 1px; background: var(--gold);
}

/* ── Liens nav ── */
.footer-nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.footer-nav-link {
    font-size: 13px; font-weight: 300;
    color: var(--text-muted); text-decoration: none;
    transition: color 0.3s, padding-left 0.3s;
    display: block; padding: 2px 0;
}
.footer-nav-link:hover { color: var(--text-main); padding-left: 6px; }

/* ── Boutons CTA ── */
.footer-cta-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 20px;
    background: var(--toggle-bg);
    border: 1px solid var(--border);
    color: var(--gold); text-decoration: none;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 14px;
    transition: background 0.3s, border-color 0.3s;
}
.footer-cta-btn:hover { background: rgba(201,148,58,0.15); border-color: var(--gold); }
.footer-cta-btn.outline {
    color: var(--text-main);
    background: transparent;
    border-color: var(--border);
}
.footer-cta-btn.outline:hover { border-color: var(--gold); color: var(--gold); }
.cta-icon {
    width: 32px; height: 32px;
    background: var(--gold); color: #080d1a;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
}
.cta-icon.ghost {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--gold);
}

/* ── Réseaux sociaux ── */
.footer-social-title {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 14px; margin-top: 28px;
}
.footer-socials { display: flex; gap: 10px; }
.social-btn {
    width: 40px; height: 40px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--text-muted); text-decoration: none;
    font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.3s, color 0.3s, background 0.3s, transform 0.3s;
}
.social-btn:hover {
    border-color: var(--gold); color: var(--gold);
    background: var(--toggle-bg);
    transform: translateY(-2px);
}

/* ── Séparateur ── */
.footer-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--border) 30%, var(--border) 70%, transparent 100%);
    margin: 0 6vw;
    transition: background 0.4s ease;
}

/* ── Barre bottom ── */
.footer-bottom {
    max-width: 1280px; margin: 0 auto;
    padding: 24px 6vw;
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px; flex-wrap: wrap;
}
.footer-copy { font-size: 12px; color: var(--text-muted); font-weight: 300; letter-spacing: 0.03em; }
.footer-copy span { color: var(--gold); }

.footer-bottom-links { display: flex; align-items: center; gap: 24px; }
.footer-bottom-link {
    font-size: 11px; color: var(--text-muted);
    text-decoration: none; letter-spacing: 0.08em;
    transition: color 0.3s;
}
.footer-bottom-link:hover { color: var(--gold); }

.footer-badge {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; color: var(--text-muted);
    letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5;
}
.badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold); opacity: 0.5;
    animation: badge-pulse 2s ease-in-out infinite;
}
@keyframes badge-pulse {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.8; }
}

/* ── Responsive ── */
@media (max-width: 1024px) {
    .footer-top { grid-template-columns: 1fr 1fr; gap: 48px; }
    .footer-brand { grid-column: span 2; }
}
@media (max-width: 640px) {
    .footer-top { grid-template-columns: 1fr; gap: 40px; padding: 56px 6vw 48px; }
    .footer-brand { grid-column: span 1; }
    .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
    .footer-bottom-links { gap: 16px; }
}
`;

export default function Footer() {
    const { auth, ziggy } = usePage().props;
    const { settings }    = usePage().props;
    const year            = new Date().getFullYear();

    // ── Sync thème avec le Navbar ─────────────────────────────────────────────
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (!document.getElementById('gc-footer-styles')) {
            const el = document.createElement('style');
            el.id = 'gc-footer-styles';
            el.textContent = FOOTER_STYLES;
            document.head.appendChild(el);   // ← appendChild, pas prepend
        }

        // Lire le thème courant
        const saved = localStorage.getItem('gc-theme') || 'dark';
        setIsDark(saved === 'dark');

        // Écouter les changements de thème déclenchés par le Navbar
        const observer = new MutationObserver(() => {
            const theme = document.documentElement.getAttribute('data-theme');
            setIsDark(theme !== 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        return () => observer.disconnect();
    }, []);

    // ── Logo selon le mode ────────────────────────────────────────────────────
    const logoSrc = isDark ? '/images/LOGO_SIDIBÉ.png' : '/images/logo_light.png';

    // ── Liens navigation ──────────────────────────────────────────────────────
    const isAdmin = auth?.user?.roles?.some(r => (r?.name ?? r) === 'admin');

    const navLinks = [
        { label: 'Accueil',      href: route('home') },
        { label: 'Services',     href: route('services.index') },
        { label: 'Réalisations', href: isAdmin ? route('admin.realisations.index') : route('realisations.index') },
        { label: 'Témoignages',  href: route('testimonials.index') },
        { label: 'À propos',     href: route('about') },
        { label: 'Contact',      href: route('contact') },
    ];

    const socialLinks = [
        { label: 'LinkedIn',  href: settings?.linkedin_url,  icon: 'in' },
        { label: 'Facebook',  href: settings?.facebook_url,  icon: 'f'  },
        { label: 'Instagram', href: settings?.instagram_url, icon: '◎'  },
    ].filter(s => s.href);

    return (
        <footer className="site-footer">
            <div className="footer-watermark">GC</div>

            {/* ── Grille principale ── */}
            <div className="footer-top">

                {/* ── Colonne marque ── */}
                <div className="footer-brand">
                    <Link href={route('home')} className="footer-logo-link">
                        <img
                            src={logoSrc}
                            alt="Génie Civil — Ingénieur Professionnel"
                            className="footer-logo-img"
                            key={isDark ? 'f-dark' : 'f-light'}
                        />
                    </Link>

                    <p className="footer-tagline">
                        "Concevoir des structures qui résistent au temps,
                        inspirer des espaces qui élèvent l'humain."
                    </p>

                    <ul className="footer-contact-list">
                        <li>
                            <a href={`mailto:${settings?.email_contact || 'sidibeismaila043@gmail.com'}`}
                               className="footer-contact-item">
                                <span className="contact-icon">@</span>
                                {settings?.email_contact || 'sidibeismaila043@gmail.com'}
                            </a>
                        </li>
                        {settings?.phone && (
                            <li>
                                <a href={`tel:${settings.phone}`} className="footer-contact-item">
                                    <span className="contact-icon">✆</span>
                                    {settings.phone}
                                </a>
                            </li>
                        )}
                        {settings?.address && (
                            <li>
                                <span className="footer-contact-item">
                                    <span className="contact-icon">⊕</span>
                                    {settings.address}
                                </span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* ── Navigation ── */}
                <div>
                    <div className="footer-col-title">Navigation</div>
                    <ul className="footer-nav-list">
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className="footer-nav-link">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Services ── */}
                <div>
                    <div className="footer-col-title">Services</div>
                    <ul className="footer-nav-list">
                        {[
                            'Conception Structurale',
                            'Études Géotechniques',
                            "Maîtrise d'Œuvre",
                            "Ouvrages d'Art",
                            'Hydraulique Urbaine',
                            'Bâtiments Industriels',
                        ].map(s => (
                            <li key={s}>
                                <Link href={route('services.index')} className="footer-nav-link">{s}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Documents + Réseaux ── */}
                <div>
                    <div className="footer-col-title">Documents</div>

                    <a href={route('cv.download')} className="footer-cta-btn">
                        <span className="cta-icon">↓</span>
                        <div>
                            <div style={{ fontWeight: 500 }}>Télécharger le CV</div>
                            <div style={{ fontSize: '10px', opacity: 0.7, marginTop: 2, letterSpacing: '0.05em' }}>
                                Format PDF
                            </div>
                        </div>
                    </a>

                    <Link href={route('contact')} className="footer-cta-btn outline">
                        <span className="cta-icon ghost">→</span>
                        <div>
                            <div style={{ fontWeight: 400 }}>Demander un devis</div>
                            <div style={{ fontSize: '10px', opacity: 0.5, marginTop: 2 }}>
                                Gratuit &amp; sans engagement
                            </div>
                        </div>
                    </Link>

                    <div className="footer-social-title">Réseaux sociaux</div>
                    <div className="footer-socials">
                        {(socialLinks.length > 0 ? socialLinks : [
                            { label: 'LinkedIn',  href: '#', icon: 'in' },
                            { label: 'Facebook',  href: '#', icon: 'f'  },
                            { label: 'Instagram', href: '#', icon: '◎'  },
                        ]).map(s => (
                            <a key={s.label} href={s.href}
                               target={s.href !== '#' ? '_blank' : undefined}
                               rel="noopener noreferrer"
                               className="social-btn" title={s.label}>
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Séparateur ── */}
            <div className="footer-divider" />

            {/* ── Barre inférieure ── */}
            <div className="footer-bottom">
                <p className="footer-copy">
                    © {year} <span>Génie Civil</span> — Tous droits réservés.
                    Ingénieur en Génie Civil Professionnel.
                </p>

                <div className="footer-bottom-links">
                    <Link href={route('about')}   className="footer-bottom-link">À propos</Link>
                    <Link href={route('contact')}  className="footer-bottom-link">Contact</Link>
                    <Link href={route('login')}    className="footer-bottom-link">Connexion</Link>
                </div>

                <div className="footer-badge">
                    <span className="badge-dot" />
                    Disponible pour projets
                </div>
            </div>
        </footer>
    );
}
