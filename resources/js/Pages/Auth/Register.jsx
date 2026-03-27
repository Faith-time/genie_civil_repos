import { Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Register() {
    const [dialCode, setDialCode] = useState('+221');

    const [dark, setDark] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('gc-theme') === 'dark';
        return false;
    });

    useEffect(() => {
        localStorage.setItem('gc-theme', dark ? 'dark' : 'light');
    }, [dark]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Assemble indicatif + numéro local avant envoi
        const fullPhone = data.phone ? `${dialCode}${data.phone.replace(/^0+/, '')}` : '';
        setData('phone', fullPhone);
        // Petit timeout pour laisser le state se mettre à jour
        setTimeout(() => post(route('register')), 0);
    };

    const strength = (() => {
        const p = data.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8)           s++;
        if (/[A-Z]/.test(p))         s++;
        if (/[0-9]/.test(p))         s++;
        if (/[^A-Za-z0-9]/.test(p))  s++;
        return s;
    })();

    const strengthLabel = ['', 'Faible', 'Moyen', 'Bon', 'Fort'][strength];
    const strengthColor = ['', '#e05252', '#e8a84a', '#5aa46b', '#2d8c4e'][strength];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

                /* ══ LIGHT ══ */
                .auth-page.light {
                    --bg:           #f4ede0;
                    --bg-mid:       #ebe3d4;
                    --gold:         #9a6e1e;
                    --gold-light:   #c9943a;
                    --gold-dim:     rgba(154,110,30,0.15);
                    --white:        #1c1407;
                    --text:         #2e2210;
                    --text-muted:   #7a6545;
                    --border:       rgba(154,110,30,0.22);
                    --grid-line:    rgba(154,110,30,0.07);
                    --card-bg:      #faf6ef;
                    --input-bg:     #f0e9da;
                    --input-focus:  #ebe3d4;
                    --shadow:       0 24px 80px rgba(100,70,20,0.12);
                    --error:        #c0392b;
                    --toggle-bg:    #ebe3d4;
                    --toggle-border:rgba(154,110,30,0.3);
                }

                /* ══ DARK ══ */
                .auth-page.dark {
                    --bg:           #080d1a;
                    --bg-mid:       #0f1628;
                    --gold:         #c9943a;
                    --gold-light:   #e8b96a;
                    --gold-dim:     rgba(201,148,58,0.12);
                    --white:        #ffffff;
                    --text:         #f8f3eb;
                    --text-muted:   #8a9bb5;
                    --border:       rgba(201,148,58,0.18);
                    --grid-line:    rgba(201,148,58,0.06);
                    --card-bg:      #0f1628;
                    --input-bg:     #1a2340;
                    --input-focus:  #1f2a4a;
                    --shadow:       0 24px 80px rgba(0,0,0,0.5);
                    --error:        #e05252;
                    --toggle-bg:    #1a2340;
                    --toggle-border:rgba(201,148,58,0.3);
                }

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .auth-page {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: var(--bg);
                    color: var(--text);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    transition: background 0.45s ease, color 0.45s ease;
                    overflow: hidden;
                }
                .auth-page * {
                    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease;
                }
                .auth-page input, .auth-page button { transition: all 0.25s ease !important; }

                .auth-grid-bg {
                    position: fixed; inset: 0;
                    pointer-events: none; z-index: 0;
                    background-image:
                        linear-gradient(var(--grid-line) 1px, transparent 1px),
                        linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
                    background-size: 60px 60px;
                }

                /* ══════════════════════════════════════════
                   LEFT PANEL
                ══════════════════════════════════════════ */
                .auth-left {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-mid);
                    border-right: 1px solid var(--border);
                    z-index: 1;
                    overflow: hidden;
                    min-height: 100vh;
                }

                /* Ligne dorée verticale */
                .auth-left::before {
                    content: '';
                    position: absolute;
                    top: 0; right: 0;
                    width: 1px; height: 100%;
                    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
                    opacity: 0.5;
                }

                /* ── Zone logo ── */
                .auth-left-logo-zone {
                    position: relative;
                    flex: 0 0 40%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px;
                    overflow: hidden;
                }

                /* Halo doré */
                .auth-left-logo-zone::before {
                    content: '';
                    position: absolute;
                    width: 360px; height: 360px;
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--gold-dim) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* Cercle animé */
                .auth-left-logo-zone::after {
                    content: '';
                    position: absolute;
                    width: 300px; height: 300px;
                    border-radius: 50%;
                    border: 1px solid var(--border);
                    pointer-events: none;
                    animation: slowSpin 30s linear infinite;
                    opacity: 0.6;
                }
                @keyframes slowSpin { to { transform: rotate(360deg); } }

                .auth-logo-link {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                }

                .auth-logo-img {
                    width: 280px;
                    height: auto;
                    object-fit: contain;
                    display: block;
                    filter: drop-shadow(0 8px 32px rgba(201,148,58,0.25));
                    transition: transform 0.4s ease, filter 0.4s ease !important;
                }
                .auth-page.dark .auth-logo-img {
                    mix-blend-mode: screen;
                    filter: drop-shadow(0 8px 40px rgba(201,148,58,0.35));
                }
                .auth-page.light .auth-logo-img {
                    mix-blend-mode: multiply;
                    filter: drop-shadow(0 4px 20px rgba(154,110,30,0.2));
                }
                .auth-logo-link:hover .auth-logo-img {
                    transform: scale(1.04);
                    filter: drop-shadow(0 12px 48px rgba(201,148,58,0.5));
                }

                /* Séparateur doré */
                .auth-left-sep {
                    margin: 0 48px;
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--gold), transparent);
                    opacity: 0.4;
                    flex-shrink: 0;
                }

                /* ── Zone texte ── */
                .auth-left-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 36px 48px 28px;
                }

                .auth-left-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 10px; font-weight: 500;
                    letter-spacing: 0.3em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 18px;
                }
                .auth-left-tag::before {
                    content: ''; width: 28px; height: 1px; background: var(--gold);
                }

                .auth-left-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(2.4rem, 3.5vw, 4.4rem);
                    font-weight: 300; line-height: 0.95;
                    color: var(--white); letter-spacing: -0.02em;
                    margin-bottom: 20px;
                }
                .auth-left-title em { font-style: italic; color: var(--gold-light); }

                .auth-left-desc {
                    font-size: 0.875rem; font-weight: 300;
                    color: var(--text-muted); line-height: 1.85;
                    max-width: 340px; margin-bottom: 28px;
                }

                /* Bénéfices */
                .auth-benefits {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .benefit-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 12px; font-weight: 300;
                    color: var(--text-muted);
                }
                .benefit-dot {
                    width: 20px; height: 20px;
                    border: 1px solid var(--border);
                    background: var(--gold-dim);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 10px; color: var(--gold);
                    flex-shrink: 0;
                }

                /* Filigrane */
                .auth-left-watermark {
                    position: absolute;
                    bottom: -30px; right: -10px;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 16vw;
                    color: var(--grid-line);
                    line-height: 1;
                    pointer-events: none; user-select: none;
                    white-space: nowrap; letter-spacing: -0.02em;
                }

                /* Footer */
                .auth-left-footer {
                    padding: 20px 48px;
                    font-size: 11px; color: var(--text-muted);
                    letter-spacing: 0.05em;
                    border-top: 1px solid var(--border);
                }

                /* ══════════════════════════════════════════
                   RIGHT PANEL
                ══════════════════════════════════════════ */
                .auth-right {
                    position: relative; z-index: 2;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    padding: 48px;
                    min-height: 100vh;
                    overflow-y: auto;
                }

                /* Theme toggle */
                .theme-toggle {
                    position: fixed; top: 24px; right: 24px; z-index: 9999;
                    display: flex; align-items: center; gap: 8px;
                    background: var(--toggle-bg); border: 1px solid var(--toggle-border);
                    padding: 8px 14px 8px 8px; cursor: pointer;
                    font-family: 'DM Sans', sans-serif; font-size: 11px;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    color: var(--text-muted);
                }
                .theme-toggle:hover { border-color: var(--gold); color: var(--gold); }
                .toggle-track {
                    width: 40px; height: 22px; background: var(--border);
                    border-radius: 11px; position: relative;
                    display: flex; align-items: center; padding: 2px; flex-shrink: 0;
                }
                .toggle-thumb {
                    width: 18px; height: 18px; border-radius: 50%;
                    background: var(--gold);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 10px; color: var(--bg);
                    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1) !important;
                }
                .auth-page.light .toggle-thumb { transform: translateX(0); }
                .auth-page.dark  .toggle-thumb { transform: translateX(18px); }

                /* ── FORM CARD ── */
                .auth-card {
                    width: 100%; max-width: 460px;
                    background: var(--card-bg);
                    border: 1px solid var(--border);
                    padding: 48px 44px;
                    position: relative;
                    box-shadow: var(--shadow);
                }
                .auth-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, transparent 100%);
                }

                .auth-card-label {
                    display: inline-flex; align-items: center; gap: 10px;
                    font-size: 10px; font-weight: 500;
                    letter-spacing: 0.3em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 12px;
                }
                .auth-card-label::before { content: ''; width: 24px; height: 1px; background: var(--gold); }

                .auth-card-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 2.4rem; font-weight: 300;
                    color: var(--white); line-height: 1.05;
                    margin-bottom: 8px;
                }
                .auth-card-title em { font-style: italic; color: var(--gold-light); }

                .auth-card-subtitle {
                    font-size: 13px; font-weight: 300;
                    color: var(--text-muted); margin-bottom: 36px; line-height: 1.6;
                }

                .form-group { margin-bottom: 18px; }
                .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

                .form-label {
                    display: block;
                    font-size: 11px; font-weight: 500;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: var(--text-muted); margin-bottom: 8px;
                }
                .form-label-opt {
                    font-size: 9px; font-weight: 300;
                    color: var(--text-muted); opacity: 0.6;
                    margin-left: 6px; text-transform: none; letter-spacing: 0;
                }

                .form-input {
                    width: 100%;
                    padding: 13px 16px;
                    background: var(--input-bg);
                    border: 1px solid var(--border);
                    color: var(--text);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px; font-weight: 300;
                    outline: none; appearance: none;
                }
                .form-input:focus {
                    background: var(--input-focus);
                    border-color: var(--gold);
                    box-shadow: 0 0 0 3px rgba(154,110,30,0.08);
                }
                .form-input::placeholder { color: var(--text-muted); opacity: 0.55; }
                .form-input.has-error { border-color: var(--error); }

                .form-error {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12px; color: var(--error); margin-top: 6px;
                }
                .form-error::before { content: '!'; font-weight: 600; }

                .input-wrap { position: relative; }
                .input-eye {
                    position: absolute; right: 14px; top: 50%;
                    transform: translateY(-50%);
                    background: none; border: none; cursor: pointer;
                    color: var(--text-muted); font-size: 16px; padding: 4px;
                }
                .input-eye:hover { color: var(--gold); }

                /* Strength bar */
                .strength-bar { display: flex; gap: 4px; margin-top: 8px; }
                .strength-seg {
                    flex: 1; height: 2px; background: var(--border);
                    border-radius: 2px; transition: background 0.3s !important;
                }
                .strength-label {
                    font-size: 11px; margin-top: 4px;
                    font-weight: 400; letter-spacing: 0.05em;
                }

                /* Submit */
                .btn-submit {
                    width: 100%; padding: 16px;
                    background: var(--gold); color: var(--bg);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px; font-weight: 500;
                    letter-spacing: 0.12em; text-transform: uppercase;
                    border: none; cursor: pointer;
                    position: relative; overflow: hidden;
                    margin-bottom: 24px;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                }
                .btn-submit::before {
                    content: ''; position: absolute; inset: 0;
                    background: var(--gold-light);
                    transform: translateX(-100%);
                    transition: transform 0.35s ease !important;
                }
                .btn-submit:hover:not(:disabled)::before { transform: translateX(0); }
                .btn-submit span { position: relative; z-index: 1; }
                .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

                .spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: var(--bg);
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    position: relative; z-index: 1;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .auth-card-divider {
                    display: flex; align-items: center; gap: 12px;
                    margin-bottom: 20px;
                    font-size: 11px; color: var(--text-muted);
                    letter-spacing: 0.1em; text-transform: uppercase;
                }
                .auth-card-divider::before, .auth-card-divider::after {
                    content: ''; flex: 1; height: 1px; background: var(--border);
                }

                .auth-card-footer {
                    text-align: center; font-size: 13px;
                    color: var(--text-muted); font-weight: 300;
                }
                .auth-card-footer a {
                    color: var(--gold); text-decoration: none; font-weight: 400;
                    border-bottom: 1px solid transparent;
                    transition: border-color 0.3s !important;
                }
                .auth-card-footer a:hover { border-color: var(--gold); }

                @media (max-width: 900px) {
                    .auth-page { grid-template-columns: 1fr; }
                    .auth-left { display: none; }
                    .auth-right { padding: 32px 24px; }
                    .auth-card { padding: 36px 24px; }
                    .form-row-2 { grid-template-columns: 1fr; }
                }
                @media (max-width: 480px) {
                    .auth-card { padding: 28px 18px; }
                    .auth-card-title { font-size: 1.9rem; }
                }
            `}</style>

            <div className={`auth-page ${dark ? 'dark' : 'light'}`}>
                <div className="auth-grid-bg" />

                {/* Theme toggle */}
                <button className="theme-toggle" onClick={() => setDark(d => !d)} aria-label="Changer le thème">
                    <span className="toggle-track">
                        <span className="toggle-thumb">{dark ? '☀' : '☽'}</span>
                    </span>
                    <span>{dark ? 'Clair' : 'Sombre'}</span>
                </button>

                {/* ══ LEFT PANEL ══ */}
                <div className="auth-left">

                    {/* Zone logo */}
                    <div className="auth-left-logo-zone">
                        <Link href={route('home')} className="auth-logo-link">
                            <img
                                src={dark ? "/images/LOGO_SIDIBÉ.png" : "/images/logo_light.png"}
                                alt="Sidibé Architecture & Construction"
                                className="auth-logo-img"
                            />
                        </Link>
                    </div>

                    {/* Séparateur doré */}
                    <div className="auth-left-sep" />

                    {/* Contenu texte */}
                    <div className="auth-left-content">
                        <div className="auth-left-tag">Nouveau compte</div>
                        <h2 className="auth-left-title">
                            Rejoignez<br />notre<br /><em>réseau</em>
                        </h2>
                        <p className="auth-left-desc">
                            Créez votre compte pour suivre vos projets en temps réel
                            et communiquer directement avec l'ingénieur.
                        </p>

                        <ul className="auth-benefits">
                            {[
                                'Suivi en temps réel de vos projets',
                                'Messagerie directe sécurisée',
                                'Accès aux documents techniques',
                                "Notifications d'avancement",
                            ].map((b, i) => (
                                <li key={i} className="benefit-item">
                                    <span className="benefit-dot">✓</span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="auth-left-watermark">GC</div>

                    <div className="auth-left-footer">
                        © {new Date().getFullYear()} Sidibé Architecture & Construction
                    </div>
                </div>

                {/* ══ RIGHT PANEL ══ */}
                <div className="auth-right">
                    <div className="auth-card">
                        <div className="auth-card-label">Inscription</div>
                        <h1 className="auth-card-title">Créer un <em>compte</em></h1>
                        <p className="auth-card-subtitle">
                            Remplissez le formulaire pour accéder à votre espace personnel.
                        </p>

                        <form onSubmit={submit} noValidate>

                            {/* Nom complet — pleine largeur */}
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Nom complet</label>
                                <input
                                    id="name" type="text"
                                    className={`form-input ${errors.name ? 'has-error' : ''}`}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Prénom et Nom"
                                    autoFocus autoComplete="name"
                                />
                                {errors.name && <div className="form-error">{errors.name}</div>}
                            </div>

                            {/* Téléphone — pleine largeur */}
                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">
                                    Téléphone
                                    <span className="form-label-opt">(optionnel)</span>
                                </label>
                                <PhoneInput
                                    dialCode={dialCode}
                                    onDialCodeChange={setDialCode}
                                    value={data.phone}
                                    onChange={val => setData('phone', val)}
                                    hasError={!!errors.phone}
                                />
                                {errors.phone && <div className="form-error">{errors.phone}</div>}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Adresse e-mail</label>
                                <input
                                    id="email" type="email"
                                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="vous@example.com"
                                    autoComplete="email"
                                />
                                {errors.email && <div className="form-error">{errors.email}</div>}
                            </div>

                            {/* Mot de passe */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Mot de passe</label>
                                <PasswordInput
                                    id="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    hasError={!!errors.password}
                                    placeholder="8 caractères minimum"
                                    autoComplete="new-password"
                                />
                                {data.password.length > 0 && (
                                    <>
                                        <div className="strength-bar">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className="strength-seg"
                                                     style={{ background: i <= strength ? strengthColor : undefined }} />
                                            ))}
                                        </div>
                                        <div className="strength-label" style={{ color: strengthColor }}>
                                            {strengthLabel}
                                        </div>
                                    </>
                                )}
                                {errors.password && <div className="form-error">{errors.password}</div>}
                            </div>

                            {/* Confirmation mot de passe */}
                            <div className="form-group">
                                <label htmlFor="password_confirmation" className="form-label">
                                    Confirmer le mot de passe
                                </label>
                                <PasswordInput
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    hasError={!!errors.password_confirmation || (
                                        data.password_confirmation.length > 0 &&
                                        data.password !== data.password_confirmation
                                    )}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                {data.password_confirmation.length > 0 && data.password !== data.password_confirmation && (
                                    <div className="form-error">Les mots de passe ne correspondent pas</div>
                                )}
                                {errors.password_confirmation && (
                                    <div className="form-error">{errors.password_confirmation}</div>
                                )}
                            </div>

                            <div style={{ marginTop: 8 }}>
                                <button type="submit" className="btn-submit" disabled={processing}>
                                    {processing ? (
                                        <span className="spinner" />
                                    ) : (
                                        <>
                                            <span>Créer mon compte</span>
                                            <span style={{ position: 'relative', zIndex: 1 }}>→</span>
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>

                        <div className="auth-card-divider">ou</div>

                        <div className="auth-card-footer">
                            Déjà inscrit ?{' '}
                            <Link href={route('login')}>Se connecter</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function PasswordInput({ id, value, onChange, hasError, placeholder, autoComplete }) {
    const [show, setShow] = useState(false);
    return (
        <div className="input-wrap">
            <input
                id={id}
                type={show ? 'text' : 'password'}
                className={`form-input ${hasError ? 'has-error' : ''}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                style={{ paddingRight: '48px' }}
            />
            <button
                type="button" className="input-eye"
                onClick={() => setShow(s => !s)}
                tabIndex={-1}
                aria-label={show ? 'Masquer' : 'Afficher'}
            >
                {show ? '🙈' : '👁'}
            </button>
        </div>
    );
}

// ── Liste des indicatifs les plus courants ──
const DIAL_CODES = [
    { code: '+221', flag: '🇸🇳', label: 'SN +221' },
    { code: '+33',  flag: '🇫🇷', label: 'FR +33'  },
    { code: '+1',   flag: '🇺🇸', label: 'US +1'   },
    { code: '+44',  flag: '🇬🇧', label: 'GB +44'  },
    { code: '+212', flag: '🇲🇦', label: 'MA +212' },
    { code: '+213', flag: '🇩🇿', label: 'DZ +213' },
    { code: '+216', flag: '🇹🇳', label: 'TN +216' },
    { code: '+225', flag: '🇨🇮', label: 'CI +225' },
    { code: '+226', flag: '🇧🇫', label: 'BF +226' },
    { code: '+227', flag: '🇳🇪', label: 'NE +227' },
    { code: '+228', flag: '🇹🇬', label: 'TG +228' },
    { code: '+229', flag: '🇧🇯', label: 'BJ +229' },
    { code: '+230', flag: '🇲🇺', label: 'MU +230' },
    { code: '+232', flag: '🇸🇱', label: 'SL +232' },
    { code: '+233', flag: '🇬🇭', label: 'GH +233' },
    { code: '+234', flag: '🇳🇬', label: 'NG +234' },
    { code: '+235', flag: '🇹🇩', label: 'TD +235' },
    { code: '+237', flag: '🇨🇲', label: 'CM +237' },
    { code: '+241', flag: '🇬🇦', label: 'GA +241' },
    { code: '+244', flag: '🇦🇴', label: 'AO +244' },
    { code: '+245', flag: '🇬🇼', label: 'GW +245' },
    { code: '+248', flag: '🇸🇨', label: 'SC +248' },
    { code: '+249', flag: '🇸🇩', label: 'SD +249' },
    { code: '+251', flag: '🇪🇹', label: 'ET +251' },
    { code: '+253', flag: '🇩🇯', label: 'DJ +253' },
    { code: '+260', flag: '🇿🇲', label: 'ZM +260' },
    { code: '+261', flag: '🇲🇬', label: 'MG +261' },
    { code: '+263', flag: '🇿🇼', label: 'ZW +263' },
    { code: '+27',  flag: '🇿🇦', label: 'ZA +27'  },
    { code: '+32',  flag: '🇧🇪', label: 'BE +32'  },
    { code: '+34',  flag: '🇪🇸', label: 'ES +34'  },
    { code: '+39',  flag: '🇮🇹', label: 'IT +39'  },
    { code: '+41',  flag: '🇨🇭', label: 'CH +41'  },
    { code: '+49',  flag: '🇩🇪', label: 'DE +49'  },
    { code: '+86',  flag: '🇨🇳', label: 'CN +86'  },
    { code: '+91',  flag: '🇮🇳', label: 'IN +91'  },
];

function PhoneInput({ dialCode, onDialCodeChange, value, onChange, hasError }) {
    return (
        <>
            <style>{`
                .phone-wrap {
                    display: flex; gap: 0;
                }
                .dial-select {
                    flex-shrink: 0; width: 110px;
                    padding: 0 8px;
                    background: var(--input-bg);
                    border: 1px solid var(--border);
                    border-right: none;
                    color: var(--text);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    outline: none; appearance: none;
                    cursor: pointer;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a9bb5'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 8px center;
                    padding-right: 24px;
                }
                .dial-select:focus {
                    border-color: var(--gold);
                    background-color: var(--input-focus);
                }
                .phone-wrap .form-input {
                    flex: 1;
                    border-left: 1px solid var(--border);
                }
                .phone-wrap .form-input.has-error,
                .phone-wrap .dial-select.has-error {
                    border-color: var(--error);
                }
                .phone-wrap:focus-within .dial-select,
                .phone-wrap:focus-within .form-input {
                    border-color: var(--gold);
                }
            `}</style>
            <div className="phone-wrap">
                <select
                    className={`dial-select ${hasError ? 'has-error' : ''}`}
                    value={dialCode}
                    onChange={e => onDialCodeChange(e.target.value)}
                >
                    {DIAL_CODES.map(d => (
                        <option key={d.code} value={d.code}>
                            {d.flag} {d.code}
                        </option>
                    ))}
                </select>
                <input
                    type="tel"
                    className={`form-input ${hasError ? 'has-error' : ''}`}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="77 000 0000"
                    autoComplete="tel-national"
                />
            </div>
        </>
    );
}
