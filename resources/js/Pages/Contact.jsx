import { Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Components/Layout/GuestLayout';
import { useState, useEffect, useRef } from 'react';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

/* ══ CONTACT PAGE ══════════════════════════════════════ */
.cpage {
    min-height: 100vh;
    background: var(--bg-page);
    color: var(--text-main);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
}

/* ── HERO ── */
.cpage-hero {
    position: relative;
    padding: 160px 6vw 80px;
    overflow: hidden;
}
.cpage-hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
        linear-gradient(to right, var(--border) 1px, transparent 1px),
        linear-gradient(to bottom, var(--border) 1px, transparent 1px);
    background-size: 80px 80px;
    opacity: 0.3;
}
.cpage-hero-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.cpage-hero-glow {
    position: absolute; top: -80px; left: -80px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,148,58,0.05) 0%, transparent 65%);
    pointer-events: none;
}
.cpage-hero-glow2 {
    position: absolute; bottom: -120px; right: -120px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,148,58,0.04) 0%, transparent 65%);
    pointer-events: none;
}
.cpage-hero-inner {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    text-align: center;
}
.cpage-eyebrow {
    display: inline-flex; align-items: center; gap: 14px;
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 24px;
    opacity: 0; animation: cFadeUp 0.7s ease forwards 0.1s;
}
.cpage-eyebrow::before,
.cpage-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold); }
.cpage-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: clamp(3.2rem, 6vw, 6rem);
    line-height: 1.05; margin: 0 0 24px; color: var(--text-main);
    opacity: 0; animation: cFadeUp 0.7s ease forwards 0.2s;
}
.cpage-hero-title em { font-style: italic; color: var(--gold); }
.cpage-hero-desc {
    font-size: 15px; line-height: 1.8; color: var(--text-muted);
    max-width: 560px; margin: 0 auto;
    opacity: 0; animation: cFadeUp 0.7s ease forwards 0.35s;
}

/* ── MAIN LAYOUT ── */
.cpage-main {
    padding: 80px 6vw 120px;
}
.cpage-main-inner {
    max-width: 1280px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 440px;
    gap: 80px; align-items: start;
}

/* ── FORM ── */
.cpage-form-wrap {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
}
.cpage-form-wrap.visible { opacity: 1; transform: translateY(0); }

.cform-header { margin-bottom: 40px; }
.cform-label-top {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 14px;
}
.cform-label-top::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
.cform-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: clamp(2rem, 3.5vw, 3rem);
    line-height: 1.1; color: var(--text-main); margin: 0 0 12px;
}
.cform-title em { font-style: italic; color: var(--gold); }
.cform-subtitle {
    font-size: 14px; color: var(--text-muted); line-height: 1.7; max-width: 420px;
}

/* Section divider */
.cform-section-divider {
    display: flex; align-items: center; gap: 16px;
    margin: 32px 0 24px;
}
.cform-section-divider-line {
    flex: 1; height: 1px; background: var(--border);
}
.cform-section-divider-label {
    font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); white-space: nowrap; padding: 0 4px;
}

.cform-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.cform-group { margin-bottom: 20px; }
.cform-lbl {
    display: block; font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;
}
.cform-lbl span { color: var(--gold); }
.cform-input,
.cform-select,
.cform-textarea {
    width: 100%; background: transparent;
    border: 1px solid var(--border);
    color: var(--text-main); font-family: 'DM Sans', sans-serif;
    font-size: 14px; padding: 13px 16px;
    transition: border-color 0.25s, background 0.25s; outline: none;
    -webkit-appearance: none; border-radius: 0;
    box-sizing: border-box;
}
.cform-input:focus,
.cform-select:focus,
.cform-textarea:focus {
    border-color: var(--gold);
    background: rgba(201,148,58,0.03);
}
.cform-input::placeholder,
.cform-textarea::placeholder { color: var(--text-muted); opacity: 0.45; }
.cform-select { cursor: pointer; }
.cform-select option { background: var(--bg-page); color: var(--text-main); }
.cform-textarea { resize: vertical; min-height: 150px; }
.cform-error { font-size: 11px; color: #e05252; margin-top: 5px; display: block; }

.cform-char-count {
    font-size: 10px; color: var(--text-muted);
    text-align: right; margin-top: 5px; display: block;
}

/* Budget slider */
.cform-budget-display {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
}
.cform-budget-val {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem;
    color: var(--gold); letter-spacing: 0.05em;
}
.cform-range {
    width: 100%; -webkit-appearance: none; appearance: none;
    height: 2px; background: var(--border); outline: none; cursor: pointer;
}
.cform-range::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--gold); cursor: pointer;
    box-shadow: 0 0 0 4px rgba(201,148,58,0.15);
    transition: box-shadow 0.2s;
}
.cform-range::-webkit-slider-thumb:hover { box-shadow: 0 0 0 7px rgba(201,148,58,0.2); }

/* Urgency buttons */
.curgency-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 10px;
}
.curgency-btn {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 14px 10px; border: 1px solid var(--border);
    background: transparent; color: var(--text-muted);
    cursor: pointer; transition: all 0.2s; position: relative;
    font-family: 'DM Sans', sans-serif;
}
.curgency-btn.active {
    border-color: var(--gold);
    background: rgba(201,148,58,0.06);
    color: var(--gold);
}
.curgency-btn-label {
    font-size: 12px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em;
}
.curgency-btn-desc {
    font-size: 10px; color: var(--text-muted); line-height: 1.3; text-align: center;
}
.curgency-check {
    position: absolute; top: 6px; right: 6px;
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--gold); display: flex; align-items: center; justify-content: center;
}

/* Drop zone */
.cdrop-zone {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    width: 100%; padding: 36px 24px;
    border: 1px dashed var(--border);
    background: transparent;
    cursor: pointer; transition: all 0.2s; box-sizing: border-box;
}
.cdrop-zone.drag-over {
    border-color: var(--gold);
    background: rgba(201,148,58,0.04);
}
.cdrop-zone-icon {
    width: 44px; height: 44px; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); margin-bottom: 12px;
}
.cdrop-btn {
    margin-top: 12px; padding: 8px 20px;
    border: 1px solid var(--gold); background: transparent;
    color: var(--gold); font-family: 'DM Sans', sans-serif;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    cursor: pointer; transition: background 0.2s, color 0.2s;
}
.cdrop-btn:hover { background: var(--gold); color: #fff; }

.cmedia-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 8px; margin-top: 16px;
}
.cmedia-item {
    position: relative; border: 1px solid var(--border);
    overflow: hidden;
}
.cmedia-item img { width: 100%; height: 72px; object-fit: cover; display: block; }
.cmedia-doc {
    width: 100%; height: 72px; background: var(--bg-page);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 4px; padding: 0 4px; box-sizing: border-box;
}
.cmedia-doc span {
    font-size: 9px; color: var(--text-muted); text-align: center;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;
}
.cmedia-remove {
    position: absolute; top: 4px; right: 4px;
    width: 18px; height: 18px; border-radius: 50%;
    background: rgb(239,68,68); color: #fff; border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s;
}
.cmedia-item:hover .cmedia-remove { opacity: 1; }

/* Submit */
.cform-submit-row { display: flex; align-items: center; gap: 20px; margin-top: 32px; }
.cform-submit {
    flex: 1; padding: 17px 32px;
    background: var(--gold); color: #fff; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 12px;
    letter-spacing: 0.2em; text-transform: uppercase;
    cursor: pointer; transition: background 0.3s, opacity 0.3s;
    position: relative; overflow: hidden;
}
.cform-submit::before {
    content: ''; position: absolute; inset: 0;
    background: var(--gold-light); transform: translateX(-100%);
    transition: transform 0.3s ease;
}
.cform-submit:hover::before { transform: translateX(0); }
.cform-submit span { position: relative; z-index: 1; }
.cform-submit:disabled { opacity: 0.55; cursor: not-allowed; }
.cform-submit-note {
    font-size: 10px; color: var(--text-muted); line-height: 1.5;
    letter-spacing: 0.05em;
}

/* Success */
.cform-success {
    text-align: center; padding: 80px 32px;
    border: 1px solid var(--border);
    background: rgba(201,148,58,0.03);
}
.cform-success-icon {
    font-family: 'Bebas Neue', sans-serif; font-size: 4rem;
    color: var(--gold); display: block; margin-bottom: 24px; line-height: 1;
}
.cform-success-title {
    font-family: 'Cormorant Garamond', serif; font-size: 2rem;
    font-weight: 300; color: var(--text-main); margin-bottom: 14px;
}
.cform-success-desc { font-size: 14px; color: var(--text-muted); line-height: 1.8; }

/* ── SIDEBAR ── */
.cpage-sidebar {
    opacity: 0; transform: translateX(20px);
    transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
    display: flex; flex-direction: column; gap: 2px;
}
.cpage-sidebar.visible { opacity: 1; transform: translateX(0); }

/* Info card */
.cinfo-card {
    border: 1px solid var(--border);
    background: var(--bg-page);
    padding: 32px 28px;
    position: relative; overflow: hidden;
    transition: border-color 0.3s;
}
.cinfo-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s ease;
}
.cinfo-card:hover { border-color: rgba(201,148,58,0.4); }
.cinfo-card:hover::before { transform: scaleX(1); }
.cinfo-icon {
    width: 44px; height: 44px; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); margin-bottom: 16px;
}
.cinfo-card-label {
    font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 6px; display: block;
}
.cinfo-card-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; color: var(--text-main); display: block;
    text-decoration: none; transition: color 0.2s;
}
a.cinfo-card-value:hover { color: var(--gold); }
.cinfo-card-sub {
    font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;
}

/* Disponibilité */
.cinfo-avail {
    border: 1px solid var(--border);
    background: var(--bg-page);
    padding: 28px;
}
.cinfo-avail-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 0 4px rgba(74,222,128,0.15);
    display: inline-block; margin-right: 10px;
    animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
    0%,100% { box-shadow: 0 0 0 4px rgba(74,222,128,0.15); }
    50%      { box-shadow: 0 0 0 8px rgba(74,222,128,0.05); }
}
.cinfo-avail-text {
    font-size: 13px; color: var(--text-main); font-weight: 500;
}
.cinfo-avail-sub {
    font-size: 11px; color: var(--text-muted); margin-top: 8px; line-height: 1.5;
}

/* Map déco */
.cmap-deco {
    border: 1px solid var(--border);
    background: var(--bg-page);
    padding: 28px;
    position: relative; overflow: hidden;
}
.cmap-deco-title {
    font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 16px; display: block;
}
.cmap-grid {
    display: grid; grid-template-columns: repeat(8, 1fr);
    gap: 4px; margin-bottom: 16px;
}
.cmap-cell {
    height: 8px; border-radius: 1px;
    background: var(--border);
    transition: background 0.3s;
}
.cmap-cell.active { background: var(--gold); opacity: 0.6; }
.cmap-cell.active:hover { opacity: 1; }
.cmap-location {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--text-muted);
}
.cmap-pin { color: var(--gold); font-size: 14px; }

/* Réseaux sociaux */
.csocials {
    border: 1px solid var(--border);
    background: var(--bg-page);
    padding: 28px;
}
.csocials-title {
    font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 18px; display: block;
}
.csocials-links { display: flex; gap: 10px; flex-wrap: wrap; }
.csocial-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 16px; border: 1px solid var(--border);
    background: none; color: var(--text-muted);
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    letter-spacing: 0.08em; text-transform: uppercase;
    text-decoration: none; cursor: pointer;
    transition: border-color 0.25s, color 0.25s;
}
.csocial-btn:hover { border-color: var(--gold); color: var(--gold); }

/* ── ANIMATIONS ── */
@keyframes cFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
    .cpage-main-inner { grid-template-columns: 1fr; gap: 56px; }
    .cpage-sidebar { transform: none; }
}
@media (max-width: 640px) {
    .cpage-hero { padding: 130px 6vw 60px; }
    .cform-row { grid-template-columns: 1fr; }
    .cform-submit-row { flex-direction: column; align-items: stretch; }
    .curgency-grid { grid-template-columns: 1fr; }
}

/* ── MODAL SUCCÈS ── */
.cmodal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(8, 13, 26, 0.82);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    opacity: 0; animation: cModalIn 0.35s ease forwards;
}
@keyframes cModalIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}
.cmodal-box {
    background: var(--dropdown-bg);
    border: 1px solid var(--border);
    max-width: 520px; width: 100%;
    position: relative; overflow: hidden;
    transform: translateY(24px);
    animation: cModalSlide 0.35s ease forwards 0.05s;
}
@keyframes cModalSlide {
    from { transform: translateY(24px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
}
.cmodal-top-bar {
    height: 3px; width: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
}
.cmodal-inner { padding: 40px 40px 36px; }
.cmodal-icon-wrap {
    width: 56px; height: 56px;
    border: 1px solid rgba(201,148,58,0.3);
    background: rgba(201,148,58,0.06);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px;
}
.cmodal-eyebrow {
    font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 10px; display: block;
}
.cmodal-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 1.85rem;
    color: var(--text-main); margin: 0 0 14px; line-height: 1.15;
}
.cmodal-title em { font-style: italic; color: var(--gold); }
.cmodal-desc {
    font-size: 13.5px; color: var(--text-muted);
    line-height: 1.75; margin-bottom: 28px;
}
.cmodal-reassurance {
    display: flex; align-items: flex-start; gap: 12px;
    background: rgba(201,148,58,0.05);
    border: 1px solid rgba(201,148,58,0.18);
    padding: 14px 16px; margin-bottom: 28px;
}
.cmodal-reassurance-icon { color: var(--gold); flex-shrink: 0; margin-top: 1px; }
.cmodal-reassurance-text {
    font-size: 12px; color: var(--text-muted); line-height: 1.65;
}
.cmodal-reassurance-text strong { color: var(--text-main); font-weight: 500; }
.cmodal-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.cmodal-btn-primary {
    flex: 1; min-width: 160px;
    padding: 14px 24px;
    background: var(--gold); color: #fff; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.3s;
}
.cmodal-btn-primary:hover { background: var(--gold-light); }
.cmodal-btn-ghost {
    padding: 13px 20px;
    background: none; color: var(--text-muted);
    border: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; transition: border-color 0.25s, color 0.25s;
}
.cmodal-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
.cmodal-close {
    position: absolute; top: 16px; right: 16px;
    width: 32px; height: 32px;
    background: none; border: 1px solid var(--border);
    color: var(--text-muted); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, color 0.2s;
}
.cmodal-close:hover { border-color: var(--gold); color: var(--gold); }
`;

const URGENCY_OPTIONS = [
    { value: 'flexible', label: 'Flexible', desc: 'Pas de contrainte de délai' },
    { value: 'normal',   label: 'Normal',   desc: 'Dans les délais habituels' },
    { value: 'urgent',   label: 'Urgent',   desc: 'Démarrage rapide requis' },
];

/* ── Icônes SVG inline ── */
const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
);
const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
);
const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
    </svg>
);
const UploadIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
    </svg>
);
const DocIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}>
        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
    </svg>
);
const CheckIcon = () => (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
    </svg>
);
const XIcon = () => (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 18L18 6M6 6l12 12"/>
    </svg>
);

/* ── MapDeco : grille décorative ── */
const MAP_PATTERN = [
    0,0,0,1,1,0,0,0,
    0,0,1,1,1,1,0,0,
    0,1,1,1,1,1,1,0,
    1,1,1,1,1,1,1,1,
    0,1,1,1,1,1,1,0,
    0,0,1,1,1,1,0,0,
    0,0,0,1,1,0,0,0,
    0,0,0,0,0,0,0,0,
];
function MapDeco() {
    return (
        <div className="cmap-deco">
            <span className="cmap-deco-title">Localisation</span>
            <div className="cmap-grid">
                {MAP_PATTERN.map((v, i) => (
                    <div key={i} className={`cmap-cell ${v ? 'active' : ''}`} />
                ))}
            </div>
            <div className="cmap-location">
                <span className="cmap-pin">◎</span>
                <span>Dakar, Sénégal — Afrique de l'Ouest</span>
            </div>
        </div>
    );
}

/* ── Section divider ── */
function SectionDivider({ label }) {
    return (
        <div className="cform-section-divider">
            <div className="cform-section-divider-line" />
            <span className="cform-section-divider-label">{label}</span>
            <div className="cform-section-divider-line" />
        </div>
    );
}


function SuccessModal({ onClose, onNewProject }) {
    // Fermer sur Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <div className="cmodal-overlay" onClick={onClose}>
            <div className="cmodal-box" onClick={e => e.stopPropagation()}>
                <div className="cmodal-top-bar" />
                <button className="cmodal-close" onClick={onClose} aria-label="Fermer">
                    <XIcon />
                </button>
                <div className="cmodal-inner">

                    {/* Icône */}
                    <div className="cmodal-icon-wrap">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="var(--gold)" strokeWidth="1.5"
                             strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                    </div>

                    <span className="cmodal-eyebrow">Projet enregistré</span>
                    <h2 className="cmodal-title">
                        Votre projet a été<br /><em>bien reçu !</em>
                    </h2>
                    <p className="cmodal-desc">
                        Merci pour votre confiance. Notre équipe analysera
                        votre demande et vous recontactera sous{' '}
                        <strong style={{ color: 'var(--gold)' }}>24 heures</strong>.
                    </p>

                    {/* Bloc rassurant */}
                    <div className="cmodal-reassurance">
                        <span className="cmodal-reassurance-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </span>
                        <p className="cmodal-reassurance-text">
                            <strong>Vos données sont en sécurité.</strong> Toutes les
                            informations saisies ont été sauvegardées. Vous pouvez
                            consulter et suivre l'avancement de votre projet à tout
                            moment depuis <strong>votre espace client</strong>.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="cmodal-actions">
                        <Link href={route('client-projects.index')} className="cmodal-btn-primary">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                            Voir mes projets
                        </Link>
                        <button className="cmodal-btn-ghost" onClick={onNewProject}>
                            + Nouveau projet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
/* ══ PAGE PRINCIPALE ════════════════════════════════════ */
export default function Contact({ services = [] }) {
    const { flash = {} } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        // Champs contact
        name: '', email: '', phone: '', subject: '', message: '',
        // Champs projet
        service_id: '',
        location: '',
        budget_estimate_min: '',
        budget_estimate_max: '',
        desired_start_date: '',
        urgency: 'normal',
        media: [],
    });

    const [showModal, setShowModal] = useState(false);
    const [mediaFiles,  setMediaFiles]  = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [dragOver,    setDragOver]    = useState(false);
    const formRef = useRef(null);
    const sideRef = useRef(null);

    /* ── Injection CSS ── */
    useEffect(() => {
        if (!document.getElementById('gc-contact-styles')) {
            const el = document.createElement('style');
            el.id = 'gc-contact-styles';
            el.textContent = STYLES;
            document.head.appendChild(el);
        }
    }, []);

    /* ── Scroll reveal ── */
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1 }
        );
        [formRef, sideRef].forEach(r => r.current && observer.observe(r.current));
        return () => observer.disconnect();
    }, []);

    /* ── Flash success ── */
    useEffect(() => {
        if (flash?.success) setShowModal(true);
    }, [flash?.success]);

    /* ── Gestion médias ── */
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            forceFormData: true,
            preserveState: true,   // ← empêche Inertia de remonter le composant
            onSuccess: () => setShowModal(true),
        });
    };

    const formatBudget = (val) => {
        const n = parseInt(val);
        if (!n || n === 0)   return 'À définir';
        if (n < 1000000)     return `${(n / 1000).toFixed(0)}K FCFA`;
        return `${(n / 1000000).toFixed(1)}M FCFA`;
    };

    // Le sujet devient le titre du projet — on le map sur subject ET on l'utilise comme title
    const subjects = [
        'Étude de sol & Géotechnique',
        'Conception structurale',
        'Suivi et coordination de chantier',
        'Expertise technique & Contrôle qualité',
        'Réalisation de plans',
        'Devis & Estimation de coûts',
        'Autre demande',
    ];

    return (
        <GuestLayout>
            <style>{`body { background: var(--bg-page); }`}</style>
            <div className="cpage">

                {/* ── HERO ── */}
                <section className="cpage-hero">
                    <div className="cpage-hero-grid" />
                    <div className="cpage-hero-accent" />
                    <div className="cpage-hero-glow" />
                    <div className="cpage-hero-glow2" />
                    <div className="cpage-hero-inner">
                        <div className="cpage-eyebrow">Prise de contact</div>
                        <h1 className="cpage-hero-title">
                            Parlons de votre<br /><em>projet ensemble</em>
                        </h1>
                        <p className="cpage-hero-desc">
                            Chaque grande construction commence par une conversation.
                            Décrivez votre vision — nous vous répondons sous 24h
                            avec une analyse et une estimation gratuite.
                        </p>
                    </div>
                </section>

                {/* ── MAIN ── */}
                <div className="cpage-main">
                    <div className="cpage-main-inner">

                        {/* ── FORMULAIRE ── */}
                        <div className="cpage-form-wrap" ref={formRef}>
                            <div className="cform-header">
                                <div className="cform-label-top">Votre message</div>
                                <h2 className="cform-title">
                                    Décrivez votre<br /><em>projet</em>
                                </h2>
                                <p className="cform-subtitle">
                                    Remplissez ce formulaire et recevez une réponse personnalisée
                                    de notre équipe d'ingénierie.
                                </p>
                            </div>

                            {showModal && (
                                <SuccessModal
                                    onClose={() => setShowModal(false)}
                                    onNewProject={() => {
                                        setShowModal(false);
                                        reset();
                                        setMediaFiles([]);
                                        setPreviewUrls([]);
                                    }}
                                />
                            )}

                                <form onSubmit={handleSubmit}>

                                    {/* ─ SECTION 1 : Coordonnées ─ */}
                                    <SectionDivider label="Vos coordonnées" />

                                    {/* Nom + Email */}
                                    <div className="cform-row">
                                        <div>
                                            <label className="cform-lbl">Nom complet <span>*</span></label>
                                            <input
                                                className="cform-input" type="text"
                                                placeholder="Votre nom"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                            {errors.name && <span className="cform-error">{errors.name}</span>}
                                        </div>
                                        <div>
                                            <label className="cform-lbl">Adresse e-mail <span>*</span></label>
                                            <input
                                                className="cform-input" type="email"
                                                placeholder="votre@email.com"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                            />
                                            {errors.email && <span className="cform-error">{errors.email}</span>}
                                        </div>
                                    </div>

                                    {/* Téléphone */}
                                    <div className="cform-group">
                                        <label className="cform-lbl">Téléphone</label>
                                        <input
                                            className="cform-input" type="tel"
                                            placeholder="+221 XX XXX XX XX"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                        />
                                    </div>

                                    {/* ─ SECTION 2 : Informations projet ─ */}
                                    <SectionDivider label="Votre projet" />

                                    {/* Type de service + Sujet/Titre */}
                                    <div className="cform-row">
                                        <div>
                                            <label className="cform-lbl">Type de service <span>*</span></label>
                                            <select
                                                className="cform-select"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                            >
                                                <option value="" disabled>Sélectionner...</option>
                                                {subjects.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            {errors.subject && <span className="cform-error">{errors.subject}</span>}
                                        </div>
                                        <div>
                                            <label className="cform-lbl">Spécialité</label>
                                            <select
                                                className="cform-select"
                                                value={data.service_id}
                                                onChange={e => setData('service_id', e.target.value)}
                                            >
                                                <option value="">— Optionnel —</option>
                                                {services.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Localisation */}
                                    <div className="cform-group">
                                        <label className="cform-lbl">Localisation du projet</label>
                                        <input
                                            className="cform-input" type="text"
                                            placeholder="Ex: Dakar, Sénégal"
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="cform-group">
                                        <label className="cform-lbl">Description du projet <span>*</span></label>
                                        <textarea
                                            className="cform-textarea"
                                            placeholder="Décrivez votre projet : nature des travaux, localisation, délais souhaités, contraintes particulières..."
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            rows={6}
                                        />
                                        {errors.message && <span className="cform-error">{errors.message}</span>}
                                        <span className="cform-char-count">{data.message.length} / 3000</span>
                                    </div>

                                    {/* ─ SECTION 3 : Budget & Planning ─ */}
                                    <SectionDivider label="Budget & Planning" />

                                    {/* Budget min / max */}
                                    <div className="cform-group">
                                        <label className="cform-lbl">Fourchette budgétaire (FCFA)</label>
                                        <div className="cform-row" style={{ marginBottom: 0 }}>
                                            <div>
                                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>Minimum</p>
                                                <div style={{ position: 'relative' }}>
                                                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, pointerEvents: 'none', fontFamily: "'DM Sans',sans-serif" }}>FCFA</span>
                                                    <input
                                                        className="cform-input" type="number"
                                                        placeholder="5 000 000"
                                                        value={data.budget_estimate_min}
                                                        onChange={e => setData('budget_estimate_min', e.target.value)}
                                                        style={{ paddingLeft: 52 }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>Maximum</p>
                                                <div style={{ position: 'relative' }}>
                                                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, pointerEvents: 'none', fontFamily: "'DM Sans',sans-serif" }}>FCFA</span>
                                                    <input
                                                        className="cform-input" type="number"
                                                        placeholder="15 000 000"
                                                        value={data.budget_estimate_max}
                                                        onChange={e => setData('budget_estimate_max', e.target.value)}
                                                        style={{ paddingLeft: 52 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date + Urgence */}
                                    <div className="cform-row">
                                        <div>
                                            <label className="cform-lbl">Date de début souhaitée</label>
                                            <input
                                                className="cform-input" type="date"
                                                value={data.desired_start_date}
                                                onChange={e => setData('desired_start_date', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="cform-lbl">Niveau d'urgence</label>
                                            <div className="curgency-grid">
                                                {URGENCY_OPTIONS.map(opt => {
                                                    const active = data.urgency === opt.value;
                                                    return (
                                                        <button
                                                            key={opt.value} type="button"
                                                            className={`curgency-btn ${active ? 'active' : ''}`}
                                                            onClick={() => setData('urgency', opt.value)}
                                                        >
                                                            <span className="curgency-btn-label">{opt.label}</span>
                                                            <span className="curgency-btn-desc">{opt.desc}</span>
                                                            {active && (
                                                                <span className="curgency-check">
                                                                    <CheckIcon />
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ─ SECTION 4 : Documents ─ */}
                                    <SectionDivider label={`Documents & Photos ${mediaFiles.length > 0 ? `(${mediaFiles.length}/10)` : ''}`} />

                                    <div className="cform-group">
                                        <label
                                            className={`cdrop-zone ${dragOver ? 'drag-over' : ''}`}
                                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                                        >
                                            <div className="cdrop-zone-icon"><UploadIcon /></div>
                                            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                                                Glissez vos fichiers ici
                                            </p>
                                            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                                                Images, PDF · max 10 fichiers · 10 MB chacun
                                            </p>
                                            <span className="cdrop-btn">Parcourir</span>
                                            <input
                                                type="file" multiple accept="image/*,.pdf"
                                                style={{ display: 'none' }}
                                                onChange={e => addFiles(e.target.files)}
                                            />
                                        </label>

                                        {previewUrls.length > 0 && (
                                            <div className="cmedia-grid">
                                                {previewUrls.map((preview, i) => (
                                                    <div key={i} className="cmedia-item">
                                                        {preview.type === 'image' ? (
                                                            <img src={preview.url} alt={preview.name} />
                                                        ) : (
                                                            <div className="cmedia-doc">
                                                                <DocIcon />
                                                                <span>{preview.name}</span>
                                                            </div>
                                                        )}
                                                        <button type="button" className="cmedia-remove" onClick={() => removeFile(i)}>
                                                            <XIcon />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <div className="cform-submit-row">
                                        <button type="submit" className="cform-submit" disabled={processing}>
                                            <span>{processing ? 'Envoi en cours...' : 'Soumettre le projet →'}</span>
                                        </button>
                                        <p className="cform-submit-note">
                                            Réponse garantie<br />sous 24 heures
                                        </p>
                                    </div>
                                </form>
                        </div>

                        {/* ── SIDEBAR ── */}
                        <aside className="cpage-sidebar" ref={sideRef}>

                            {/* Email */}
                            <div className="cinfo-card">
                                <div className="cinfo-icon"><MailIcon /></div>
                                <span className="cinfo-card-label">Adresse e-mail</span>
                                <a href="mailto:contact@sidibe-gc.com" className="cinfo-card-value">
                                    contact@sidibe-gc.com
                                </a>
                                <span className="cinfo-card-sub">Réponse sous 24h ouvrées</span>
                            </div>

                            {/* Téléphone */}
                            <div className="cinfo-card">
                                <div className="cinfo-icon"><PhoneIcon /></div>
                                <span className="cinfo-card-label">Téléphone & WhatsApp</span>
                                <a href="tel:+221782953453" className="cinfo-card-value">
                                    +221 78 295 34 53
                                </a>
                                <span className="cinfo-card-sub">Lun. – Sam. · 8h00 – 18h00</span>
                            </div>

                            {/* Disponibilité */}
                            <div className="cinfo-avail">
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                    <span className="cinfo-avail-dot" />
                                    <span className="cinfo-avail-text">Disponible pour de nouveaux projets</span>
                                </div>
                                <p className="cinfo-avail-sub">
                                    Capacité disponible pour des missions démarrant
                                    <strong style={{ color: 'var(--gold)' }}> immédiatement</strong>.
                                    Consultations gratuites sur demande.
                                </p>
                            </div>

                            {/* Localisation graphique */}
                            <MapDeco />

                            {/* Horaires */}
                            <div className="cinfo-card">
                                <div className="cinfo-icon"><ClockIcon /></div>
                                <span className="cinfo-card-label">Horaires de bureau</span>
                                <span className="cinfo-card-value" style={{ fontSize: '1rem' }}>
                                    Lundi — Vendredi
                                </span>
                                <span className="cinfo-card-sub">08h00 – 18h00 (GMT+0)</span>
                                <div style={{
                                    marginTop: 16, display: 'grid',
                                    gridTemplateColumns: '1fr 1fr', gap: '8px 16px',
                                }}>
                                    {[
                                        ['Lun – Ven', '08h – 18h'],
                                        ['Samedi',    '09h – 13h'],
                                        ['Dimanche',  'Fermé'],
                                        ['Urgences',  'Sur demande'],
                                    ].map(([d, h]) => (
                                        <div key={d}>
                                            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{d}</span>
                                            <span style={{ fontSize: 13, color: h === 'Fermé' ? 'var(--text-muted)' : 'var(--text-main)' }}>{h}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Lien espace client */}
                            <div style={{
                                border: '1px solid var(--border)',
                                padding: '24px 28px',
                                background: 'rgba(201,148,58,0.03)',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                                    background: 'linear-gradient(90deg, var(--gold), transparent)',
                                }} />
                                <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>
                                    Espace client
                                </p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 18 }}>
                                    Vous avez déjà un compte ? Accédez à votre messagerie privée et suivez l'avancement de vos projets.
                                </p>
                                <Link href={route('login')} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                                    color: 'var(--gold)', textDecoration: 'none',
                                    borderBottom: '1px solid var(--gold)', paddingBottom: 2,
                                    transition: 'opacity 0.2s',
                                }}
                                      onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    Accéder à mon espace →
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
