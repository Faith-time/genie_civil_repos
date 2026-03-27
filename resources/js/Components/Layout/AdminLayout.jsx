import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
    {
        group: 'Principal',
        links: [
            {
                label: 'Tableau de bord',
                href: () => route('dashboard.admin'),
                icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                ),
            },
        ],
    },
    {
        group: 'Contenu',
        links: [
            {
                label: 'Projets',
                href: () => route('admin.projects.index'),
                match: 'admin.projects',
                icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                ),
            },
            {
                label: 'Services',
                href: () => route('admin.services.index'),
                match: 'admin.services',
                icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                ),
            },
            {
                label: 'Témoignages',
                href: () => route('admin.testimonials.index'),
                match: 'admin.testimonials',
                icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                ),
            },
        ],
    },
    {
        group: 'Communication',
        links: [
            {
                label: 'Messages',
                href: () => route('admin.conversations.index'),
                match: 'admin.conversations',
                icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                ),
            },
        ],
    },
    {
        group: 'Système',
        links: [
            {
                label: 'Paramètres',
                href: () => route('admin.settings'),
                match: 'admin.settings',
                icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                ),
            },
        ],
    },
];

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentPath = window.location.pathname;

    // Close mobile on resize
    useEffect(() => {
        const fn = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    const isActive = (item) => {
        try {
            if (item.match) {
                // match by route name prefix
                const href = item.href();
                return currentPath.startsWith(new URL(href).pathname.replace(/\/[^/]+$/, ''));
            }
            return currentPath === new URL(item.href()).pathname;
        } catch {
            return false;
        }
    };

    const user = auth?.user;
    const initial = user?.name?.charAt(0).toUpperCase() || 'A';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,300&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

                * { box-sizing: border-box; }

                .admin-root {
                    display: flex;
                    min-height: 100vh;
                    background: #F5F1E8;
                    font-family: 'DM Sans', sans-serif;
                }
                .dark .admin-root {
                    background: #0f0f0f;
                }

                /* ═══ SIDEBAR ═══ */
                .admin-sidebar {
                    position: fixed;
                    top: 0; left: 0; bottom: 0;
                    width: 260px;
                    background: #080d1a;
                    border-right: 1px solid rgba(201,148,58,0.12);
                    display: flex;
                    flex-direction: column;
                    z-index: 200;
                    transition: width 0.3s ease, transform 0.3s ease;
                    overflow: hidden;
                }
                .admin-sidebar.collapsed {
                    width: 68px;
                }
                @media (max-width: 1023px) {
                    .admin-sidebar {
                        transform: translateX(-100%);
                        width: 260px !important;
                    }
                    .admin-sidebar.mobile-open {
                        transform: translateX(0);
                    }
                }

                /* Logo zone */
                .sidebar-logo {
                    padding: 24px 20px;
                    border-bottom: 1px solid rgba(201,148,58,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                    min-height: 72px;
                }
                .sidebar-logo-inner {
                    display: flex;
                    flex-direction: column;
                    line-height: 1;
                    text-decoration: none;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .sidebar-logo-top {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.4rem;
                    letter-spacing: 0.12em;
                    color: #fff;
                }
                .sidebar-logo-top span { color: #c9943a; }
                .sidebar-logo-bottom {
                    font-size: 8px;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: rgba(138,155,181,0.6);
                    margin-top: 2px;
                }
                .sidebar-admin-badge {
                    font-size: 8px;
                    font-weight: 600;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: #c9943a;
                    background: rgba(201,148,58,0.1);
                    border: 1px solid rgba(201,148,58,0.2);
                    padding: 3px 8px;
                    white-space: nowrap;
                    flex-shrink: 0;
                    margin-left: 8px;
                }
                .collapsed .sidebar-admin-badge { display: none; }
                .collapsed .sidebar-logo-inner { opacity: 0; width: 0; }

                /* Collapse toggle */
                .sidebar-collapse-btn {
                    position: absolute;
                    top: 50%;
                    right: -12px;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    background: #080d1a;
                    border: 1px solid rgba(201,148,58,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: rgba(201,148,58,0.7);
                    font-size: 10px;
                    transition: all 0.2s;
                    z-index: 10;
                }
                .sidebar-collapse-btn:hover {
                    background: rgba(201,148,58,0.1);
                    border-color: #c9943a;
                    color: #c9943a;
                }
                @media (max-width: 1023px) { .sidebar-collapse-btn { display: none; } }

                /* Nav */
                .sidebar-nav {
                    flex: 1;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 16px 0;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(201,148,58,0.2) transparent;
                }
                .sidebar-nav::-webkit-scrollbar { width: 4px; }
                .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
                .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(201,148,58,0.2); border-radius: 2px; }

                .nav-group {
                    padding: 0 12px;
                    margin-bottom: 4px;
                }
                .nav-group-label {
                    font-size: 9px;
                    font-weight: 600;
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                    color: rgba(138,155,181,0.4);
                    padding: 12px 8px 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    transition: opacity 0.2s;
                }
                .collapsed .nav-group-label { opacity: 0; height: 20px; padding: 8px; }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 10px;
                    border-radius: 10px;
                    text-decoration: none;
                    color: rgba(138,155,181,0.8);
                    font-size: 13px;
                    font-weight: 400;
                    letter-spacing: 0.02em;
                    transition: all 0.2s;
                    white-space: nowrap;
                    overflow: hidden;
                    position: relative;
                    cursor: pointer;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                }
                .nav-link:hover {
                    background: rgba(201,148,58,0.06);
                    color: #f8f3eb;
                }
                .nav-link.active {
                    background: rgba(201,148,58,0.1);
                    color: #c9943a;
                    font-weight: 500;
                }
                .nav-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 20%; bottom: 20%;
                    width: 2px;
                    background: #c9943a;
                    border-radius: 0 2px 2px 0;
                }
                .nav-icon {
                    width: 18px;
                    height: 18px;
                    flex-shrink: 0;
                }
                .nav-label {
                    transition: opacity 0.2s;
                }
                .collapsed .nav-label { opacity: 0; width: 0; overflow: hidden; }

                /* Tooltip on collapsed */
                .nav-link[data-tooltip] {
                    position: relative;
                }
                .collapsed .nav-link:hover::after {
                    content: attr(data-tooltip);
                    position: absolute;
                    left: 56px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #0f1628;
                    border: 1px solid rgba(201,148,58,0.2);
                    color: #f8f3eb;
                    padding: 6px 12px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 1000;
                    pointer-events: none;
                    border-radius: 6px;
                }

                /* Site link */
                .sidebar-site-link {
                    margin: 0 12px 8px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 10px;
                    border-radius: 10px;
                    border: 1px solid rgba(201,148,58,0.15);
                    color: rgba(201,148,58,0.7);
                    text-decoration: none;
                    font-size: 11px;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    transition: all 0.2s;
                    white-space: nowrap;
                    overflow: hidden;
                }
                .sidebar-site-link:hover {
                    border-color: rgba(201,148,58,0.4);
                    color: #c9943a;
                    background: rgba(201,148,58,0.05);
                }

                /* User zone */
                .sidebar-user {
                    padding: 12px;
                    border-top: 1px solid rgba(201,148,58,0.1);
                    flex-shrink: 0;
                }
                .user-card {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(201,148,58,0.1);
                    overflow: hidden;
                }
                .user-avatar {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #c9943a, #8b6625);
                    color: #080d1a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .user-info {
                    flex: 1;
                    overflow: hidden;
                    transition: opacity 0.2s, width 0.2s;
                }
                .collapsed .user-info { opacity: 0; width: 0; }
                .user-name {
                    font-size: 12px;
                    font-weight: 500;
                    color: #f8f3eb;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .user-role {
                    font-size: 10px;
                    color: #c9943a;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-top: 1px;
                }
                .logout-btn {
                    flex-shrink: 0;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(138,155,181,0.5);
                    cursor: pointer;
                    transition: color 0.2s;
                    background: none;
                    border: none;
                    padding: 0;
                }
                .logout-btn:hover { color: #e05252; }

                /* ═══ TOPBAR ═══ */
                .admin-topbar {
                    position: fixed;
                    top: 0;
                    left: 260px;
                    right: 0;
                    height: 64px;
                    background: rgba(245,241,232,0.95);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 28px;
                    z-index: 100;
                    transition: left 0.3s ease;
                }
                .dark .admin-topbar {
                    background: rgba(15,15,15,0.95);
                    border-bottom-color: rgba(201,148,58,0.1);
                }
                .admin-topbar.sidebar-collapsed { left: 68px; }
                @media (max-width: 1023px) { .admin-topbar { left: 0 !important; } }

                .topbar-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    color: #080d1a;
                    border-radius: 8px;
                    transition: background 0.2s;
                }
                .dark .mobile-menu-btn { color: #f8f3eb; }
                .mobile-menu-btn:hover { background: rgba(0,0,0,0.06); }
                @media (max-width: 1023px) { .mobile-menu-btn { display: flex; } }

                .topbar-breadcrumb {
                    font-size: 13px;
                    color: rgba(0,0,0,0.4);
                    font-weight: 300;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .dark .topbar-breadcrumb { color: rgba(255,255,255,0.3); }
                .topbar-breadcrumb strong {
                    color: #080d1a;
                    font-weight: 500;
                }
                .dark .topbar-breadcrumb strong { color: #f8f3eb; }

                .topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .topbar-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 7px 14px;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                    border: none;
                    cursor: pointer;
                }
                .topbar-btn-ghost {
                    background: transparent;
                    color: rgba(0,0,0,0.5);
                    border: 1px solid rgba(0,0,0,0.1);
                }
                .dark .topbar-btn-ghost {
                    color: rgba(255,255,255,0.4);
                    border-color: rgba(255,255,255,0.08);
                }
                .topbar-btn-ghost:hover {
                    background: rgba(0,0,0,0.05);
                    color: #080d1a;
                    border-color: rgba(0,0,0,0.2);
                }
                .dark .topbar-btn-ghost:hover {
                    background: rgba(255,255,255,0.05);
                    color: #f8f3eb;
                }
                .topbar-btn-gold {
                    background: #c9943a;
                    color: #080d1a;
                }
                .topbar-btn-gold:hover { background: #b8832a; }

                /* ═══ MAIN ═══ */
                .admin-main {
                    flex: 1;
                    margin-left: 260px;
                    margin-top: 64px;
                    min-height: calc(100vh - 64px);
                    transition: margin-left 0.3s ease;
                }
                .admin-main.sidebar-collapsed { margin-left: 68px; }
                @media (max-width: 1023px) { .admin-main { margin-left: 0 !important; } }

                /* Mobile overlay */
                .sidebar-backdrop {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 199;
                    backdrop-filter: blur(2px);
                }
                @media (max-width: 1023px) {
                    .sidebar-backdrop.active { display: block; }
                }

                /* Scrollbar global */
                html { scrollbar-width: thin; scrollbar-color: rgba(201,148,58,0.2) transparent; }
            `}</style>

            <div className="admin-root">

                {/* ── Mobile backdrop ── */}
                <div
                    className={`sidebar-backdrop ${mobileOpen ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                />

                {/* ════════════════════════════════
                    SIDEBAR
                ════════════════════════════════ */}
                <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

                    {/* Logo */}
                    <div className="sidebar-logo" style={{ position: 'relative' }}>
                        <Link href={route('home')} className="sidebar-logo-inner">
                            <div className="sidebar-logo-top">GÉNIE<span>_</span>CIVIL</div>
                            <div className="sidebar-logo-bottom">Ingénieur Professionnel</div>
                        </Link>
                        {!collapsed && <span className="sidebar-admin-badge">Admin</span>}

                        {/* Desktop collapse toggle */}
                        <button
                            className="sidebar-collapse-btn"
                            onClick={() => setCollapsed(!collapsed)}
                            title={collapsed ? 'Étendre' : 'Réduire'}
                        >
                            {collapsed ? '›' : '‹'}
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="sidebar-nav">
                        {NAV_ITEMS.map(group => (
                            <div className="nav-group" key={group.group}>
                                <div className="nav-group-label">{group.group}</div>
                                {group.links.map(item => {
                                    const active = isActive(item);
                                    const href = (() => { try { return item.href(); } catch { return '#'; } })();
                                    return (
                                        <Link
                                            key={item.label}
                                            href={href}
                                            className={`nav-link ${active ? 'active' : ''}`}
                                            data-tooltip={item.label}
                                        >
                                            <span className="nav-icon">{item.icon}</span>
                                            <span className="nav-label">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>

                    {/* View site link */}
                    <a href={route('home')} target="_blank" rel="noopener noreferrer" className="sidebar-site-link">
                        <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="nav-label">Voir le site</span>
                    </a>

                    {/* User */}
                    <div className="sidebar-user">
                        <div className="user-card">
                            <div className="user-avatar">{initial}</div>
                            <div className="user-info">
                                <div className="user-name">{user?.name || 'Administrateur'}</div>
                                <div className="user-role">Admin</div>
                            </div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="logout-btn"
                                title="Déconnexion"
                            >
                                <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* ════════════════════════════════
                    TOPBAR
                ════════════════════════════════ */}
                <header className={`admin-topbar ${collapsed ? 'sidebar-collapsed' : ''}`}>
                    <div className="topbar-left">
                        {/* Mobile hamburger */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            <svg style={{width:20,height:20}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Breadcrumb */}
                        <div className="topbar-breadcrumb">
                            <span>Admin</span>
                            <span>›</span>
                            <strong>{getCurrentPageLabel()}</strong>
                        </div>
                    </div>

                    <div className="topbar-right">
                        {/* View site */}
                        <a
                            href={route('home')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="topbar-btn topbar-btn-ghost"
                            style={{display:'flex',gap:6,alignItems:'center'}}
                        >
                            <svg style={{width:13,height:13}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="hidden sm:inline">Voir le site</span>
                        </a>

                        {/* New project shortcut */}
                        <Link href={route('admin.projects.create')} className="topbar-btn topbar-btn-gold">
                            <svg style={{width:13,height:13}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Nouveau projet</span>
                        </Link>
                    </div>
                </header>

                {/* ════════════════════════════════
                    CONTENT
                ════════════════════════════════ */}
                <main className={`admin-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
                    {children}
                </main>
            </div>
        </>
    );
}

// Helper — returns current page label from nav items
function getCurrentPageLabel() {
    const path = window.location.pathname;
    for (const group of NAV_ITEMS) {
        for (const item of group.links) {
            try {
                const href = item.href();
                const itemPath = new URL(href).pathname;
                if (path.startsWith(itemPath) || path === itemPath) {
                    return item.label;
                }
            } catch { /* skip */ }
        }
    }
    return 'Panneau d\'administration';
}
