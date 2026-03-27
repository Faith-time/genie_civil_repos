import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import GuestLayout from '@/Components/Layout/GuestLayout';


const ABOUT_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

/* ── ABOUT PAGE ── */
.about-page {
    min-height: 100vh;
    background: var(--bg-page);
    color: var(--text-main);
    overflow-x: hidden;
}

/* ── HERO ── */
.about-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 120px 6vw 80px;
    overflow: hidden;
}

.about-hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
}

.about-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(to right, var(--border) 1px, transparent 1px),
        linear-gradient(to bottom, var(--border) 1px, transparent 1px);
    background-size: 80px 80px;
    opacity: 0.4;
}

.about-hero-orb {
    position: absolute;
    border-radius: 50%;
    border: 1px solid var(--border);
}
.about-hero-orb-1 {
    width: 700px; height: 700px;
    top: -200px; right: -200px;
}
.about-hero-orb-2 {
    width: 400px; height: 400px;
    top: -50px; right: 50px;
}
.about-hero-orb-3 {
    width: 200px; height: 200px;
    bottom: 100px; left: 10vw;
    opacity: 0.5;
}

.about-hero-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.about-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    width: 100%;
}

/* ── LEFT COLUMN ── */
.about-hero-left {}

.about-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 28px;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 0.1s;
}
.about-eyebrow::before {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: var(--gold);
}

.about-hero-heading {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(3.5rem, 6vw, 5.5rem);
    line-height: 1.05;
    margin: 0 0 32px;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 0.25s;
}
.about-hero-heading em {
    font-style: italic;
    color: var(--gold);
    font-weight: 300;
}

.about-hero-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    line-height: 1.8;
    color: var(--text-muted);
    max-width: 460px;
    margin: 0 0 48px;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 0.4s;
}

.about-hero-ctas {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 0.55s;
}

.btn-gold {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #fff;
    background: var(--gold);
    text-decoration: none;
    padding: 14px 28px;
    transition: background 0.3s, transform 0.3s;
    display: inline-block;
}
.btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); }

.btn-outline {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-main);
    text-decoration: none;
    padding: 13px 26px;
    border: 1px solid var(--border);
    transition: border-color 0.3s, color 0.3s, transform 0.3s;
    display: inline-block;
}
.btn-outline:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

/* ── RIGHT COLUMN - PHOTO CARD ── */
.about-hero-right {
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    animation: fadeLeft 0.9s ease forwards;
    animation-delay: 0.3s;
}

.about-photo-frame {
    position: relative;
    width: 400px;
    max-width: 100%;
}

.about-photo-card {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
    background: var(--bg-page);
    border: 1px solid var(--border);
    overflow: hidden;
}

.about-photo-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(201,148,58,0.06) 0%, transparent 60%);
    flex-direction: column;
    gap: 16px;
}

.about-photo-icon {
    width: 80px;
    height: 80px;
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    opacity: 0.6;
}

.about-photo-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    opacity: 0.5;
}

.about-photo-deco {
    position: absolute;
    top: -16px; right: -16px;
    width: 100px; height: 100px;
    border: 1px solid var(--border);
    pointer-events: none;
}
.about-photo-deco-2 {
    position: absolute;
    bottom: -16px; left: -16px;
    width: 80px; height: 80px;
    border: 1px solid var(--border);
    pointer-events: none;
}

.about-photo-badge {
    position: absolute;
    bottom: 24px;
    right: -24px;
    background: var(--gold);
    color: #fff;
    padding: 16px 20px;
    font-family: 'DM Sans', sans-serif;
    z-index: 2;
    min-width: 140px;
}
.about-photo-badge-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.4rem;
    line-height: 1;
    display: block;
}
.about-photo-badge-text {
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0.85;
    display: block;
    margin-top: 4px;
}

.about-photo-signature {
    position: absolute;
    top: 24px;
    left: -16px;
    background: var(--dropdown-bg, #0f1628);
    border: 1px solid var(--border);
    padding: 12px 16px;
    z-index: 2;
}
.about-photo-signature-line1 {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1rem;
    color: var(--text-main);
    display: block;
}
.about-photo-signature-line2 {
    font-family: 'DM Sans', sans-serif;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    display: block;
    margin-top: 4px;
}

/* ── STATS BAR ── */
.about-stats {
    position: relative;
    padding: 0 6vw;
    z-index: 1;
}

.about-stats-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid var(--border);
    border-top: none;
}

.about-stat {
    padding: 40px 32px;
    border-right: 1px solid var(--border);
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
}
.about-stat:last-child { border-right: none; }
.about-stat:hover { background: rgba(201,148,58,0.04); }
.about-stat::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
}
.about-stat:hover::before { transform: scaleX(1); }

.about-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3.5rem;
    color: var(--gold);
    line-height: 1;
    display: block;
}
.about-stat-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-top: 8px;
    display: block;
}

/* ── MAIN CONTENT ── */
.about-main {
    padding: 120px 6vw;
}
.about-main-inner {
    max-width: 1280px;
    margin: 0 auto;
}

/* ── SECTION HEADER ── */
.section-header {
    margin-bottom: 64px;
}
.section-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
}
.section-eyebrow::before {
    content: '';
    width: 32px; height: 1px;
    background: var(--gold);
}
.section-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    line-height: 1.1;
    margin: 0;
}
.section-title em {
    font-style: italic;
    color: var(--gold);
}

/* ── PHILOSOPHY / BIO ── */
.about-bio-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
    margin-bottom: 120px;
}

.about-bio-text p {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    line-height: 1.85;
    color: var(--text-muted);
    margin: 0 0 20px;
}
.about-bio-text p:first-child {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem;
    line-height: 1.7;
    color: var(--text-main);
    font-weight: 300;
}

.about-bio-aside {}

.about-quote {
    border-left: 2px solid var(--gold);
    padding: 24px 32px;
    margin-bottom: 40px;
    background: rgba(201,148,58,0.04);
}
.about-quote-text {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.4rem;
    line-height: 1.6;
    color: var(--text-main);
    display: block;
    margin-bottom: 16px;
}
.about-quote-attr {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
}

.about-values {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: var(--border);
}
.about-value {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 24px;
    background: var(--bg-page);
    transition: background 0.3s;
    cursor: default;
}
.about-value:hover { background: rgba(201,148,58,0.04); }
.about-value-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    color: var(--gold);
    opacity: 0.5;
    min-width: 28px;
}
.about-value-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--text-main);
    text-transform: uppercase;
}
.about-value-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: var(--text-muted);
    margin-left: auto;
    text-align: right;
    max-width: 160px;
    line-height: 1.5;
}

/* ── FORMATION / DIPLOMES ── */
.about-formation {
    margin-bottom: 120px;
}

.about-diplomes {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 48px;
}

.diplome-card {
    position: relative;
    border: 1px solid var(--border);
    padding: 40px 36px;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.3s;
    cursor: default;
}
.diplome-card:hover {
    border-color: var(--gold);
    transform: translateY(-4px);
}
.diplome-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
}
.diplome-card:hover::before { transform: scaleX(1); }

.diplome-card-deco {
    position: absolute;
    top: 20px; right: 24px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 4rem;
    color: var(--gold);
    opacity: 0.06;
    line-height: 1;
    pointer-events: none;
    user-select: none;
}

.diplome-badge {
    display: inline-block;
    background: rgba(201,148,58,0.12);
    border: 1px solid rgba(201,148,58,0.3);
    color: var(--gold);
    font-family: 'DM Sans', sans-serif;
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    padding: 6px 12px;
    margin-bottom: 20px;
}

.diplome-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: 1.6rem;
    color: var(--text-main);
    margin: 0 0 8px;
    line-height: 1.2;
}

.diplome-specialty {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    margin: 0 0 16px;
}

.diplome-school {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text-muted);
    margin: 0 0 8px;
}

.diplome-year {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    color: var(--text-muted);
    letter-spacing: 0.1em;
}

/* ── COMPETENCES ── */
.about-skills {
    margin-bottom: 120px;
}

.about-skills-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    background: var(--border);
    margin-top: 48px;
}

.skill-block {
    background: var(--bg-page);
    padding: 36px 28px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
}
.skill-block:hover { background: rgba(201,148,58,0.04); }

.skill-block-icon {
    width: 44px; height: 44px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold);
    margin-bottom: 20px;
    transition: border-color 0.3s, background 0.3s;
}
.skill-block:hover .skill-block-icon {
    border-color: var(--gold);
    background: rgba(201,148,58,0.1);
}

.skill-block-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-main);
    margin: 0 0 12px;
}

.skill-block-list {
    list-style: none;
    margin: 0; padding: 0;
    display: flex; flex-direction: column; gap: 8px;
}
.skill-block-list li {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 8px;
}
.skill-block-list li::before {
    content: '';
    width: 4px; height: 4px;
    background: var(--gold);
    border-radius: 50%;
    flex-shrink: 0;
    opacity: 0.6;
}

/* ── TIMELINE PARCOURS ── */
.about-parcours {
    margin-bottom: 120px;
}

.about-timeline {
    position: relative;
    margin-top: 48px;
    padding-left: 48px;
}
.about-timeline::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 1px;
    background: var(--border);
}

.timeline-item {
    position: relative;
    padding: 0 0 56px 40px;
}
.timeline-item:last-child { padding-bottom: 0; }

.timeline-dot {
    position: absolute;
    left: -48px; top: 4px;
    width: 10px; height: 10px;
    background: var(--gold);
    border-radius: 50%;
    box-shadow: 0 0 0 4px var(--bg-page), 0 0 0 5px var(--border);
    transform: translateX(-50%);
}

.timeline-year {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
    display: block;
}

.timeline-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--text-main);
    margin: 0 0 6px;
}

.timeline-org {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 12px;
    display: block;
}

.timeline-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    line-height: 1.7;
    color: var(--text-muted);
    max-width: 560px;
    margin: 0;
}

/* ── CTA SECTION ── */
.about-cta {
    padding: 0 6vw 120px;
}
.about-cta-inner {
    max-width: 1280px;
    margin: 0 auto;
    border: 1px solid var(--border);
    padding: 72px 80px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
}

.about-cta-inner::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.about-cta-deco {
    position: absolute;
    right: -40px; top: 50%;
    transform: translateY(-50%);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 10rem;
    color: var(--gold);
    opacity: 0.04;
    line-height: 1;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
}

.about-cta-left {}
.about-cta-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
}
.about-cta-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }

.about-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(2rem, 3vw, 2.8rem);
    line-height: 1.1;
    margin: 0;
}
.about-cta-title em { font-style: italic; color: var(--gold); }

.about-cta-right {
    display: flex;
    gap: 16px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
}

/* ── ANIMATIONS ── */
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeLeft {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
}

.reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
    opacity: 1;
    transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
    .about-hero-inner { grid-template-columns: 1fr; gap: 60px; }
    .about-hero-right { order: -1; }
    .about-photo-frame { width: 320px; }
    .about-stats-inner { grid-template-columns: repeat(2, 1fr); }
    .about-bio-grid { grid-template-columns: 1fr; gap: 48px; }
    .about-diplomes { grid-template-columns: 1fr; }
    .about-skills-grid { grid-template-columns: repeat(2, 1fr); }
    .about-cta-inner { flex-direction: column; padding: 48px 40px; }
    .about-photo-badge { right: 0; }
    .about-photo-signature { left: 0; }
}
@media (max-width: 640px) {
    .about-hero { padding: 100px 6vw 60px; }
    .about-stats-inner { grid-template-columns: repeat(2, 1fr); }
    .about-skills-grid { grid-template-columns: 1fr; }
    .about-main { padding: 80px 6vw; }
    .about-stat { padding: 28px 20px; }
    .about-cta-inner { padding: 40px 24px; }
    .about-cta-right { flex-direction: column; }
}
`;

export default function About() {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => (r?.name ?? r) === 'admin');
    const revealRefs = useRef([]);

    useEffect(() => {
        if (!document.getElementById('gc-about-styles')) {
            const el = document.createElement('style');
            el.id = 'gc-about-styles';
            el.textContent = ABOUT_STYLES;
            document.head.appendChild(el);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.12 }
        );
        revealRefs.current.forEach(el => { if (el) observer.observe(el); });
        return () => observer.disconnect();
    }, []);

    const addReveal = (index) => (el) => { revealRefs.current[index] = el; };

    const skills = [
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="1"/>
                    <path d="M3 9h18M9 21V9"/>
                </svg>
            ),
            title: 'Conception Structurale',
            items: ['Calcul des structures béton', 'Dimensionnement des fondations', 'Analyse sismique', 'Modélisation BIM'],
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            ),
            title: 'Gestion de Projets',
            items: ['Planification & suivi', 'Coordination des équipes', 'Contrôle budgétaire', 'Gestion des risques'],
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
            ),
            title: 'Suivi de Chantier',
            items: ['Direction des travaux', 'Contrôle qualité', 'Rapports techniques', 'Réception des ouvrages'],
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
            ),
            title: 'Études & Rapports',
            items: ['Études géotechniques', 'Rapports d\'expertise', 'Diagnostics structurels', 'Métrés & devis'],
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            ),
            title: 'Logiciels & Outils',
            items: ['AutoCAD / Revit', 'Robot Structural', 'MS Project', 'Suite Office'],
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
            ),
            title: 'Soft Skills',
            items: ['Leadership technique', 'Communication client', 'Résolution de problèmes', 'Rigueur & précision'],
        },
    ];

    const timeline = [
        {
            year: '2022 — Présent',
            title: 'Ingénieur Civil Senior',
            org: 'Bureau d\'Études & Conseil',
            desc: 'Pilotage de projets d\'infrastructure complexes, conception de structures en béton armé, coordination multi-corps d\'état et suivi technique de chantiers.',
        },
        {
            year: '2019 — 2022',
            title: 'Ingénieur Chargé d\'Affaires',
            org: 'Entreprise de BTP',
            desc: 'Gestion opérationnelle de projets de construction résidentiel et tertiaire. Encadrement d\'équipes de terrain, contrôle qualité et respect des délais contractuels.',
        },
        {
            year: '2017 — 2019',
            title: 'Technicien Supérieur Génie Civil',
            org: 'Cabinet d\'Architecture Technique',
            desc: 'Réalisation de plans d\'exécution, métrés et études de prix. Suivi de chantier en phase d\'exécution sous la supervision d\'ingénieurs seniors.',
        },
    ];

    return (
        <GuestLayout>

        <div className="about-page">
            {/* ── HERO ── */}
            <section className="about-hero">
                <div className="about-hero-bg">
                    <div className="about-hero-grid" />
                    <div className="about-hero-orb about-hero-orb-1" />
                    <div className="about-hero-orb about-hero-orb-2" />
                    <div className="about-hero-orb about-hero-orb-3" />
                    <div className="about-hero-accent" />
                </div>

                <div className="about-hero-inner">
                    <div className="about-hero-left">
                        <div className="about-eyebrow">Ingénieur Civil Professionnel</div>
                        <h1 className="about-hero-heading">
                            Bâtir avec<br /><em>précision,</em><br />durer dans<br />le temps.
                        </h1>
                        <p className="about-hero-desc">
                            Passionné par les structures qui défient le temps, je mets mon expertise
                            en génie civil au service de projets ambitieux — des fondations aux finitions,
                            chaque détail compte.
                        </p>
                        <div className="about-hero-ctas">
                            {!isAdmin && (
                                <Link href={route('contact')} className="btn-gold">
                                    Travailler Ensemble
                                </Link>
                            )}
                            <Link href={route('realisations.index')} className="btn-outline">
                                Voir mes Réalisations
                            </Link>
                        </div>
                    </div>

                    <div className="about-hero-right">
                        <div className="about-photo-frame">
                            <div className="about-photo-card">
                                <img
                                    src="/images/sidibe2.jpeg"
                                    alt="Ingénieur Civil"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center top',
                                        display: 'block',
                                    }}
                                />
                            </div>
                            <div className="about-photo-deco" />
                            <div className="about-photo-deco-2" />
                            <div className="about-photo-signature">
                                <span className="about-photo-signature-line1">L'ingénieur</span>
                                <span className="about-photo-signature-line2">Génie Civil · BTP</span>
                            </div>
                            <div className="about-photo-badge">
                                <span className="about-photo-badge-num">5+</span>
                                <span className="about-photo-badge-text">Années d'expérience</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="about-stats">
                <div className="about-stats-inner" ref={addReveal(0)}>
                    {[
                        { num: '40+', label: 'Projets réalisés' },
                        { num: '12+', label: 'Clients satisfaits' },
                        { num: '98%', label: 'Taux de satisfaction' },
                        { num: '5+', label: "Années d'expertise" },
                    ].map((s, i) => (
                        <div key={i} className="about-stat">
                            <span className="about-stat-num">{s.num}</span>
                            <span className="about-stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── MAIN ── */}
            <section className="about-main">
                <div className="about-main-inner">

                    {/* BIO */}
                    <div className="about-bio-grid reveal" ref={addReveal(1)}>
                        <div>
                            <div className="section-header">
                                <div className="section-eyebrow">À Propos</div>
                                <h2 className="section-title">
                                    Une vision,<br /><em>une signature</em>
                                </h2>
                            </div>
                            <div className="about-bio-text">
                                <p>
                                    Ingénieur en Génie Civil diplômé, je conjugue rigueur scientifique
                                    et sensibilité technique pour concevoir des ouvrages solides, durables
                                    et esthétiquement cohérents avec leur environnement.
                                </p>
                                <p>
                                    Fort d'un parcours alliant une Licence en Génie Civil et un BTS
                                    spécialisé dans la même discipline, j'ai développé une double
                                    compétence théorique et pratique qui me permet d'aborder chaque
                                    projet avec une vision globale — de la conception à la livraison.
                                </p>
                                <p>
                                    Que ce soit pour des constructions résidentielles, des infrastructures
                                    publiques ou des projets industriels, mon approche reste constante :
                                    écoute, précision, et engagement total envers la qualité.
                                </p>
                            </div>
                        </div>

                        <div className="about-bio-aside">
                            <div className="about-quote">
                                <span className="about-quote-text">
                                    "Un bon ingénieur ne construit pas seulement des structures —
                                    il bâtit la confiance, pierre après pierre."
                                </span>
                                <span className="about-quote-attr">Ma philosophie</span>
                            </div>

                            <div className="about-values">
                                {[
                                    { num: '01', label: 'Précision', desc: 'Chaque calcul, chaque détail' },
                                    { num: '02', label: 'Durabilité', desc: 'Construire pour les générations' },
                                    { num: '03', label: 'Intégrité', desc: 'Transparence & honnêteté' },
                                    { num: '04', label: 'Innovation', desc: 'Solutions modernes & adaptées' },
                                ].map((v) => (
                                    <div key={v.num} className="about-value">
                                        <span className="about-value-num">{v.num}</span>
                                        <span className="about-value-label">{v.label}</span>
                                        <span className="about-value-desc">{v.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FORMATION */}
                    <div className="about-formation reveal" ref={addReveal(2)}>
                        <div className="section-header">
                            <div className="section-eyebrow">Formation Académique</div>
                            <h2 className="section-title">
                                Des diplômes au<br /><em>service du terrain</em>
                            </h2>
                        </div>

                        <div className="about-diplomes">
                            <div className="diplome-card reveal reveal-delay-1" ref={addReveal(3)}>
                                <span className="diplome-card-deco">Lic</span>
                                <span className="diplome-badge">Licence · Bac +3</span>
                                <h3 className="diplome-title">Licence en<br />Génie Civil</h3>
                                <p className="diplome-specialty">Structures & Infrastructure</p>
                                <p className="diplome-school">École Supérieure d'Ingénierie</p>
                                <span className="diplome-year">Promotion 2021</span>
                            </div>

                            <div className="diplome-card reveal reveal-delay-2" ref={addReveal(4)}>
                                <span className="diplome-card-deco">BTS</span>
                                <span className="diplome-badge">BTS · Bac +2</span>
                                <h3 className="diplome-title">BTS en<br />Génie Civil</h3>
                                <p className="diplome-specialty">Construction & Travaux Publics</p>
                                <p className="diplome-school">Institut Technique Supérieur</p>
                                <span className="diplome-year">Promotion 2020</span>
                            </div>
                        </div>
                    </div>

                    {/* COMPÉTENCES */}
                    <div className="about-skills reveal" ref={addReveal(5)}>
                        <div className="section-header">
                            <div className="section-eyebrow">Compétences</div>
                            <h2 className="section-title">
                                L'expertise<br /><em>en pratique</em>
                            </h2>
                        </div>

                        <div className="about-skills-grid">
                            {skills.map((s, i) => (
                                <div key={i} className="skill-block">
                                    <div className="skill-block-icon">{s.icon}</div>
                                    <div className="skill-block-title">{s.title}</div>
                                    <ul className="skill-block-list">
                                        {s.items.map((item, j) => (
                                            <li key={j}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PARCOURS */}
                    <div className="about-parcours reveal" ref={addReveal(6)}>
                        <div className="section-header">
                            <div className="section-eyebrow">Parcours Professionnel</div>
                            <h2 className="section-title">
                                Une trajectoire<br /><em>d'excellence</em>
                            </h2>
                        </div>

                        <div className="about-timeline">
                            {timeline.map((item, i) => (
                                <div key={i} className="timeline-item">
                                    <div className="timeline-dot" />
                                    <span className="timeline-year">{item.year}</span>
                                    <h3 className="timeline-title">{item.title}</h3>
                                    <span className="timeline-org">{item.org}</span>
                                    <p className="timeline-desc">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* ── CTA ── */}
            <section className="about-cta">
                <div className="about-cta-inner reveal" ref={addReveal(7)}>
        <span className="about-cta-deco">
            {isAdmin ? 'ADMIN' : 'PROJET'}
        </span>
                    <div className="about-cta-left">
                        <div className="about-cta-eyebrow">
                            {isAdmin ? 'Espace administrateur' : 'Collaborons'}
                        </div>
                        <h2 className="about-cta-title">
                            {isAdmin ? (
                                <>Gérez votre activité<br /><em>efficacement.</em></>
                            ) : (
                                <>Votre projet mérite<br /><em>le meilleur.</em></>
                            )}
                        </h2>
                    </div>
                    <div className="about-cta-right">
                        {isAdmin ? (
                            <>
                                <Link href={route('admin.client-projects.index')} className="btn-gold">
                                    Voir les demandes
                                </Link>
                                <Link href={route('realisations.index')} className="btn-outline">
                                    Gérer le portfolio
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('contact')} className="btn-gold">
                                    Demander un Devis
                                </Link>
                                <Link href={route('realisations.index')} className="btn-outline">
                                    Mes Réalisations
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
        </GuestLayout>
    );
}
