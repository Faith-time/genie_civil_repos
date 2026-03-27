import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const THEME_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

:root,
html[data-theme="dark"] {
    --gold:            #c9943a;
    --gold-light:      #e8b96a;
    --text-main:       #f8f3eb;
    --text-muted:      #8a9bb5;
    --border:          rgba(201,148,58,0.2);
    --bg-page:         #080d1a;
    --nav-bg-top:      #000000;
    --nav-bg-scroll:   rgba(8,13,26,0.97);
    --nav-shadow:      0 4px 40px rgba(0,0,0,0.4);
    --dropdown-bg:     #0f1628;
    --toggle-bg:       rgba(201,148,58,0.12);
    --toggle-border:   rgba(201,148,58,0.3);
    --footer-bg:       #05090f;
    --footer-border:   rgba(201,148,58,0.15);
    --footer-water:    rgba(201,148,58,0.03);
}

html[data-theme="light"] {
    --gold:            #b8832a;
    --gold-light:      #d4a050;
    --text-main:       #1a1208;
    --text-muted:      #6b5c3e;
    --border:          rgba(184,131,42,0.25);
    --bg-page:         #f5efe2;
    --nav-bg-top:      #ffffff;
    --nav-bg-scroll:   rgba(255,255,255,0.97);
    --nav-shadow:      0 4px 40px rgba(100,80,30,0.12);
    --dropdown-bg:     #f0ebe0;
    --toggle-bg:       rgba(184,131,42,0.1);
    --toggle-border:   rgba(184,131,42,0.35);
    --footer-bg:       #ffffff;
    --footer-border:   rgba(184,131,42,0.18);
    --footer-water:    rgba(184,131,42,0.04);
}

html, body {
    background-color: var(--bg-page);
    color: var(--text-main);
    transition: background-color 0.4s ease, color 0.4s ease;
}

.navbar {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 1000; padding: 0 6vw;
    transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease;
}
.navbar.transparent {
    background: var(--nav-bg-top);
    padding-top: 8px;
}
.navbar.scrolled {
    background: var(--nav-bg-scroll);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--nav-shadow);
    padding-top: 0;
}

.navbar-inner {
    max-width: 1280px; margin: 0 auto; height: 100px;
    display: flex; align-items: center; justify-content: space-between; gap: 32px;
}

.navbar-logo {
    text-decoration: none; display: flex; align-items: center;
    flex-shrink: 0; transition: opacity 0.3s ease;
}
.navbar-logo:hover { opacity: 0.85; }

.navbar-logo-img {
    height: 100px; width: 175px; max-width: 220px;
    display: block; object-fit: contain; transition: filter 0.4s ease;
}

.navbar-links { display: flex; align-items: center; gap: 0; list-style: none; margin: 0; padding: 0; }
.nav-link {
    position: relative; text-decoration: none;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); padding: 8px 16px; transition: color 0.3s;
}
.nav-link::after {
    content: ''; position: absolute; bottom: 0; left: 16px; right: 16px;
    height: 1px; background: var(--gold);
    transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
}
.nav-link:hover { color: var(--text-main); }
.nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
.nav-link.active { color: var(--gold); }

.navbar-auth { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.btn-nav-ghost {
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 400;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); text-decoration: none; padding: 8px 16px; transition: color 0.3s;
}
.btn-nav-ghost:hover { color: var(--text-main); }
.btn-nav-gold {
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #fff; background: var(--gold); text-decoration: none;
    padding: 10px 22px; transition: background 0.3s; white-space: nowrap;
}
.btn-nav-gold:hover { background: var(--gold-light); }
.btn-nav-outline {
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 400;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-main); text-decoration: none; padding: 9px 20px;
    border: 1px solid var(--border); transition: border-color 0.3s, color 0.3s;
}
.btn-nav-outline:hover { border-color: var(--gold); color: var(--gold); }

.theme-toggle {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid var(--toggle-border);
    background: var(--toggle-bg); cursor: pointer;
    color: var(--gold); transition: background 0.3s, border-color 0.3s, transform 0.35s;
    flex-shrink: 0;
}
.theme-toggle:hover { background: rgba(201,148,58,0.22); border-color: var(--gold); transform: rotate(22deg); }

.user-menu { position: relative; }
.user-trigger {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    background: none; border: 1px solid var(--border); padding: 8px 14px;
    color: var(--text-main); font-family: 'DM Sans', sans-serif; font-size: 12px;
    transition: border-color 0.3s;
}
.user-trigger:hover { border-color: var(--gold); }
.user-avatar {
    width: 26px; height: 26px; border-radius: 50%; background: var(--gold); color: #fff;
    display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600;
}
.user-caret { font-size: 10px; color: var(--text-muted); transition: transform 0.3s; }
.user-menu.open .user-caret { transform: rotate(180deg); }
.user-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0; min-width: 200px;
    background: var(--dropdown-bg); border: 1px solid var(--border); overflow: hidden;
    opacity: 0; transform: translateY(-8px); pointer-events: none;
    transition: all 0.25s ease; z-index: 100;
}
.user-menu.open .user-dropdown { opacity: 1; transform: translateY(0); pointer-events: auto; }
.dropdown-item {
    display: block; padding: 12px 20px;
    font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-muted);
    text-decoration: none; letter-spacing: 0.05em; transition: background 0.2s, color 0.2s;
    border-bottom: 1px solid var(--border); cursor: pointer;
    background: none; border-left: none; border-right: none; border-top: none;
    width: 100%; text-align: left;
}
.dropdown-item:last-child { border-bottom: none; }
.dropdown-item:hover { background: rgba(201,148,58,0.06); color: var(--text-main); }
.dropdown-item.danger:hover { color: #e05252; }

.hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 8px; }
.ham-line { display: block; width: 24px; height: 1px; background: var(--text-main); transition: all 0.3s ease; transform-origin: center; }
.hamburger.open .ham-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.hamburger.open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open .ham-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

.mobile-drawer { position: fixed; inset: 0; z-index: 999; pointer-events: none; }
.drawer-backdrop { position: absolute; inset: 0; background: rgba(8,13,26,0.7); opacity: 0; transition: opacity 0.3s; }
.mobile-drawer.open .drawer-backdrop { opacity: 1; pointer-events: auto; }
.drawer-panel {
    position: absolute; top: 0; right: 0; bottom: 0; width: min(320px, 85vw);
    background: var(--dropdown-bg); border-left: 1px solid var(--border);
    transform: translateX(100%); transition: transform 0.35s ease; pointer-events: auto;
    display: flex; flex-direction: column; padding: 88px 32px 48px; gap: 8px; overflow-y: auto;
}
.mobile-drawer.open .drawer-panel { transform: translateX(0); }

.mobile-drawer-logo { position: absolute; top: 20px; left: 32px; }
.mobile-drawer-logo img {
    height: 32px; width: auto; max-width: 150px; display: block; object-fit: contain;
}

.mobile-link {
    display: block; font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 300;
    color: var(--text-muted); text-decoration: none; padding: 12px 0;
    border-bottom: 1px solid var(--border); transition: color 0.3s;
}
.mobile-link:hover, .mobile-link.active { color: var(--gold); }

.mobile-theme-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted);
}
.mobile-auth { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; padding-top: 32px; border-top: 1px solid var(--border); }

@media (max-width: 1024px) {
    .navbar-links { display: none; }
    .navbar-auth  { display: none; }
    .hamburger    { display: flex; }
    .mobile-controls { display: flex !important; }
}
`;

export default function Navbar() {
    const { auth, ziggy } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDark,   setIsDark]   = useState(true);
    const currentRoute = ziggy?.location || window.location.pathname;

    useEffect(() => {
        if (!document.getElementById('gc-theme-styles')) {
            const el = document.createElement('style');
            el.id = 'gc-theme-styles';
            el.textContent = THEME_STYLES;
            document.head.prepend(el);
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('gc-theme') || 'dark';
        setIsDark(saved === 'dark');
        document.documentElement.setAttribute('data-theme', saved);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [currentRoute]);

    const toggleTheme = () => {
        const next = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('gc-theme', next);
    };

    const isAdmin     = auth?.user?.roles?.some(r => (r?.name ?? r) === 'admin');
    const isClient    = auth?.user?.roles?.some(r => (r?.name ?? r) === 'client');
    const isClientLike = isClient || (auth?.user && !isAdmin && !isClient);

    const isActive = (href) =>
        window.location.href === href ||
        window.location.pathname === new URL(href, window.location.origin).pathname;

    // ── Construction des liens selon le rôle ─────────────────────────────────
    const buildNavLinks = () => {
        const base = [
            { label: 'A propos',  href: route('about') },
            { label: 'Services',  href: route('services.index') },
        ];

        if (isAdmin) {
            base.push({ label: 'Réalisations',    href: route('realisations.index') });        // ← AJOUTÉ
            base.push({ label: 'Demandes', href: route('admin.client-projects.index') });
        } else if (isClientLike) {
            base.push({ label: 'Réalisations', href: route('realisations.index') });
            base.push({ label: 'Mes projets',  href: route('client-projects.index') });
        } else {
            base.push({ label: 'Réalisations', href: route('realisations.index') });
        }

        base.push({ label: 'Temoignages', href: route('testimonials.index') });

        if (isClientLike || isAdmin) {
            base.push({ label: 'Messages', href: route('conversations.index') });
        } else if (!isAdmin) {
            base.push({ label: 'Contact', href: route('contact') });
        }

        return base;
    };
    const navLinks = buildNavLinks();

    const SunIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1"  x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1"  y1="12" x2="3"  y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
            <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
        </svg>
    );

    const MoonIcon = () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
    );

    const ThemeBtn = () => (
        <button className="theme-toggle" onClick={toggleTheme}
                title={isDark ? 'Mode clair' : 'Mode sombre'}
                aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
            {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
    );

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`}>
                <div className="navbar-inner">

                    {/* ── LOGO ── */}
                    <Link href={route('home')} className="navbar-logo">
                        {/* Logo navbar principale */}
                        <img
                            src={document.documentElement.getAttribute('data-theme') === 'light'
                                ? "/images/logo_light.png"
                                : "/images/LOGO_SIDIBÉ.png"}
                            alt="Génie Civil — Ingénieur Professionnel"
                            className="navbar-logo-img"
                            key={isDark ? 'dark' : 'light'}
                        />
                    </Link>

                    {/* ── NAV LINKS desktop ── */}
                    <ul className="navbar-links">
                        {navLinks.map(link => (
                            <li key={link.label}>
                                <Link href={link.href}
                                      className={`nav-link ${isActive(link.href) ? 'active' : ''}`}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* ── Desktop auth + toggle ── */}
                    <div className="navbar-auth">
                        <ThemeBtn />
                        {auth?.user ? (
                            <UserMenu user={auth.user} />
                        ) : (
                            <>
                                <Link href={route('login')}   className="btn-nav-ghost">Connexion</Link>
                                <Link href={route('contact')} className="btn-nav-gold">Devis gratuit</Link>
                            </>
                        )}
                    </div>

                    {/* ── Mobile controls ── */}
                    <div className="mobile-controls" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
                        <ThemeBtn />
                        <button
                            className={`hamburger ${menuOpen ? 'open' : ''}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menu">
                            <span className="ham-line" />
                            <span className="ham-line" />
                            <span className="ham-line" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── MOBILE DRAWER ── */}
            <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
                <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="drawer-panel">

                    <div className="mobile-drawer-logo">
                        <img
                            src={document.documentElement.getAttribute('data-theme') === 'light'
                                ? "/images/logo_light.png"
                                : "/images/LOGO_SIDIBÉ.png"}
                            alt="Logo"
                            key={isDark ? 'dark-m' : 'light-m'}
                        />
                    </div>

                    <div className="mobile-theme-row">
                        <span>Apparence</span>
                        <ThemeBtn />
                    </div>

                    {/* Tous les liens (déjà construits selon le rôle) */}
                    {navLinks.map(link => (
                        <Link key={link.label} href={link.href}
                              className={`mobile-link ${isActive(link.href) ? 'active' : ''}`}>
                            {link.label}
                        </Link>
                    ))}

                    <div className="mobile-auth">
                        {auth?.user ? (
                            <>
                                <Link href={route('dashboard')} className="btn-nav-gold"
                                      style={{ textAlign: 'center', padding: '14px' }}>
                                    Mon espace
                                </Link>
                                <Link href={route('logout')} method="post" as="button"
                                      className="btn-nav-outline"
                                      style={{ textAlign: 'center', padding: '13px', width: '100%', cursor: 'pointer' }}>
                                    Déconnexion
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="btn-nav-outline"
                                      style={{ textAlign: 'center', padding: '13px' }}>
                                    Connexion
                                </Link>
                                <Link href={route('contact')} className="btn-nav-gold"
                                      style={{ textAlign: 'center', padding: '14px' }}>
                                    Devis gratuit
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function UserMenu({ user }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const initial  = user.name?.charAt(0).toUpperCase() || '?';
    const isAdmin  = user.roles?.some(r => (r?.name ?? r) === 'admin');
    const isClient = user.roles?.some(r => (r?.name ?? r) === 'client');

    return (
        <div className={`user-menu ${open ? 'open' : ''}`} ref={ref}>
            <button className="user-trigger" onClick={() => setOpen(!open)}>
                <div className="user-avatar">{initial}</div>
                <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                </span>
                <span className="user-caret">▾</span>
            </button>

            <div className="user-dropdown">

                {/* ── Admin ── */}
                {isAdmin && (
                    <>
                        <Link href={route('admin.settings')} className="dropdown-item">Paramètres</Link>
                        <Link href={route('admin.client-projects.index')} className="dropdown-item">Demandes clients</Link>
                    </>
                )}

                {/* ── Client ── */}
                {(isClient || (!isAdmin && !isClient)) && (
                    <>
                        <Link href={route('client-projects.index')} className="dropdown-item">
                            Mes projets
                        </Link>
                        <Link href={route('client-projects.create')} className="dropdown-item">
                            Soumettre un projet
                        </Link>
                    </>
                )}

                <Link href={route('conversations.index')} className="dropdown-item">
                    Mes messages
                </Link>

                <Link href={route('logout')} method="post" as="button" className="dropdown-item danger">
                    Déconnexion
                </Link>
            </div>
        </div>
    );
}
