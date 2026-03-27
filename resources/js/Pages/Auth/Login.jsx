import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Login() {
    const { errors: serverErrors, flash = {} } = usePage().props;
    const [dark, setDark] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('gc-theme') === 'dark';
        return false;
    });

    useEffect(() => {
        localStorage.setItem('gc-theme', dark ? 'dark' : 'light');
    }, [dark]);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

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
                    --left-overlay: rgba(235,227,212,0.92);
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
                    --left-overlay: rgba(15,22,40,0.88);
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
                .auth-left::before {
                    content: '';
                    position: absolute;
                    top: 0; right: 0;
                    width: 1px; height: 100%;
                    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
                    opacity: 0.5;
                }
                .auth-left-logo-zone {
                    position: relative;
                    flex: 0 0 45%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px;
                    overflow: hidden;
                }
                .auth-left-logo-zone::before {
                    content: '';
                    position: absolute;
                    width: 360px; height: 360px;
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--gold-dim) 0%, transparent 70%);
                    pointer-events: none;
                }
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
                    position: relative; z-index: 2;
                    display: flex; align-items: center; justify-content: center;
                    text-decoration: none;
                }
                .auth-logo-img {
                    width: 280px; height: auto; object-fit: contain; display: block;
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
                .auth-left-sep {
                    margin: 0 48px; height: 1px;
                    background: linear-gradient(to right, transparent, var(--gold), transparent);
                    opacity: 0.4; flex-shrink: 0;
                }
                .auth-left-content {
                    flex: 1; display: flex; flex-direction: column;
                    justify-content: center; padding: 40px 48px 32px;
                }
                .auth-left-tag {
                    display: inline-flex; align-items: center; gap: 10px;
                    font-size: 10px; font-weight: 500; letter-spacing: 0.3em;
                    text-transform: uppercase; color: var(--gold); margin-bottom: 20px;
                }
                .auth-left-tag::before { content: ''; width: 28px; height: 1px; background: var(--gold); }
                .auth-left-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(2.6rem, 3.8vw, 4.8rem); font-weight: 300;
                    line-height: 0.95; color: var(--white); letter-spacing: -0.02em; margin-bottom: 24px;
                }
                .auth-left-title em { font-style: italic; color: var(--gold-light); }
                .auth-left-desc {
                    font-size: 0.875rem; font-weight: 300; color: var(--text-muted);
                    line-height: 1.85; max-width: 340px; margin-bottom: 32px;
                }
                .auth-left-pills { display: flex; gap: 10px; flex-wrap: wrap; }
                .auth-pill {
                    display: flex; align-items: center; gap: 7px;
                    padding: 7px 14px; border: 1px solid var(--border);
                    background: var(--gold-dim); font-size: 11px; font-weight: 400;
                    color: var(--text-muted); letter-spacing: 0.05em;
                }
                .auth-pill-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--gold); flex-shrink: 0;
                }
                .auth-left-footer {
                    padding: 20px 48px; font-size: 11px; color: var(--text-muted);
                    letter-spacing: 0.05em; border-top: 1px solid var(--border);
                }
                .auth-left-watermark {
                    position: absolute; bottom: -30px; right: -10px;
                    font-family: 'Bebas Neue', sans-serif; font-size: 16vw;
                    color: var(--grid-line); line-height: 1; pointer-events: none;
                    user-select: none; white-space: nowrap; letter-spacing: -0.02em;
                }

                .auth-right {
                    position: relative; z-index: 2;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    padding: 48px; min-height: 100vh;
                }

                .theme-toggle {
                    position: fixed; top: 24px; right: 24px; z-index: 9999;
                    display: flex; align-items: center; gap: 8px;
                    background: var(--toggle-bg); border: 1px solid var(--toggle-border);
                    padding: 8px 14px 8px 8px; cursor: pointer;
                    font-family: 'DM Sans', sans-serif; font-size: 11px;
                    letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted);
                }
                .theme-toggle:hover { border-color: var(--gold); color: var(--gold); }
                .toggle-track {
                    width: 40px; height: 22px; background: var(--border); border-radius: 11px;
                    position: relative; display: flex; align-items: center; padding: 2px; flex-shrink: 0;
                }
                .toggle-thumb {
                    width: 18px; height: 18px; border-radius: 50%; background: var(--gold);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 10px; color: var(--bg);
                    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1) !important;
                }
                .auth-page.light .toggle-thumb { transform: translateX(0); }
                .auth-page.dark  .toggle-thumb { transform: translateX(18px); }

                .auth-card {
                    width: 100%; max-width: 440px; background: var(--card-bg);
                    border: 1px solid var(--border); padding: 56px 48px;
                    position: relative; box-shadow: var(--shadow);
                }
                .auth-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, transparent 100%);
                }
                .auth-card-label {
                    display: inline-flex; align-items: center; gap: 10px;
                    font-size: 10px; font-weight: 500; letter-spacing: 0.3em;
                    text-transform: uppercase; color: var(--gold); margin-bottom: 12px;
                }
                .auth-card-label::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
                .auth-card-title {
                    font-family: 'Cormorant Garamond', serif; font-size: 2.6rem; font-weight: 300;
                    color: var(--white); line-height: 1.05; margin-bottom: 8px;
                }
                .auth-card-title em { font-style: italic; color: var(--gold-light); }
                .auth-card-subtitle {
                    font-size: 13px; font-weight: 300; color: var(--text-muted);
                    margin-bottom: 40px; line-height: 1.6;
                }

                /* ── Bannière info (projet en attente) ── */
                .info-banner {
                    display: flex; align-items: flex-start; gap: 12px;
                    padding: 14px 16px; margin-bottom: 24px;
                    background: rgba(201,148,58,0.08);
                    border: 1px solid rgba(201,148,58,0.35);
                    border-left: 3px solid var(--gold);
                    font-size: 13px; color: var(--gold); font-weight: 300; line-height: 1.6;
                }

                .form-group { margin-bottom: 20px; }
                .form-label {
                    display: block; font-size: 11px; font-weight: 500;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: var(--text-muted); margin-bottom: 8px;
                }
                .form-input {
                    width: 100%; padding: 14px 16px; background: var(--input-bg);
                    border: 1px solid var(--border); color: var(--text);
                    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300;
                    outline: none; appearance: none;
                }
                .form-input:focus {
                    background: var(--input-focus); border-color: var(--gold);
                    box-shadow: 0 0 0 3px rgba(154,110,30,0.08);
                }
                .form-input::placeholder { color: var(--text-muted); opacity: 0.6; }
                .form-input.has-error { border-color: var(--error); }
                .form-error {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12px; color: var(--error); margin-top: 6px;
                }
                .form-error::before { content: '!'; font-weight: 600; }
                .input-wrap { position: relative; }
                .input-eye {
                    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
                    background: none; border: none; cursor: pointer;
                    color: var(--text-muted); font-size: 16px; padding: 4px; line-height: 1;
                }
                .input-eye:hover { color: var(--gold); }
                .form-row {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 28px;
                }
                .checkbox-label {
                    display: flex; align-items: center; gap: 8px; cursor: pointer;
                    font-size: 13px; font-weight: 300; color: var(--text-muted); user-select: none;
                }
                .checkbox-label input[type="checkbox"] {
                    width: 16px; height: 16px; accent-color: var(--gold); cursor: pointer; flex-shrink: 0;
                }
                .form-link {
                    font-size: 12px; font-weight: 400; color: var(--gold);
                    text-decoration: none; letter-spacing: 0.05em;
                    border-bottom: 1px solid transparent; transition: border-color 0.3s !important;
                }
                .form-link:hover { border-color: var(--gold); }
                .btn-submit {
                    width: 100%; padding: 16px; background: var(--gold); color: var(--bg);
                    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
                    letter-spacing: 0.12em; text-transform: uppercase; border: none; cursor: pointer;
                    position: relative; overflow: hidden; margin-bottom: 24px;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                }
                .btn-submit::before {
                    content: ''; position: absolute; inset: 0; background: var(--gold-light);
                    transform: translateX(-100%); transition: transform 0.35s ease !important;
                }
                .btn-submit:hover:not(:disabled)::before { transform: translateX(0); }
                .btn-submit span { position: relative; z-index: 1; }
                .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
                .spinner {
                    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: var(--bg); border-radius: 50%;
                    animation: spin 0.7s linear infinite; position: relative; z-index: 1;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .auth-card-divider {
                    display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
                    font-size: 11px; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase;
                }
                .auth-card-divider::before, .auth-card-divider::after {
                    content: ''; flex: 1; height: 1px; background: var(--border);
                }
                .auth-card-footer {
                    text-align: center; font-size: 13px; color: var(--text-muted); font-weight: 300;
                }
                .auth-card-footer a {
                    color: var(--gold); text-decoration: none; font-weight: 400;
                    border-bottom: 1px solid transparent; transition: border-color 0.3s !important;
                }
                .auth-card-footer a:hover { border-color: var(--gold); }
                .error-banner {
                    display: flex; align-items: flex-start; gap: 12px;
                    padding: 14px 16px; background: rgba(192,57,43,0.08);
                    border: 1px solid rgba(192,57,43,0.3); border-left: 3px solid var(--error);
                    margin-bottom: 24px; font-size: 13px; color: var(--error); font-weight: 300;
                }

                @media (max-width: 900px) {
                    .auth-page { grid-template-columns: 1fr; }
                    .auth-left { display: none; }
                    .auth-right { padding: 32px 24px; }
                    .auth-card { padding: 40px 28px; }
                }
                @media (max-width: 480px) {
                    .auth-card { padding: 32px 20px; }
                    .auth-card-title { font-size: 2rem; }
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
                    <div className="auth-left-logo-zone">
                        <Link href={route('home')} className="auth-logo-link">
                            <img
                                src={dark ? "/images/LOGO_SIDIBÉ.png" : "/images/logo_light.png"}
                                alt="Sidibé Architecture & Construction"
                                className="auth-logo-img"
                            />
                        </Link>
                    </div>
                    <div className="auth-left-sep" />
                    <div className="auth-left-content">
                        <div className="auth-left-tag">Espace client</div>
                        <h2 className="auth-left-title">
                            Bienvenue<br />dans votre<br /><em>espace</em>
                        </h2>
                        <p className="auth-left-desc">
                            Accédez à votre tableau de bord, consultez l'avancement
                            de vos projets et échangez directement avec l'ingénieur.
                        </p>
                        <div className="auth-left-pills">
                            {['Suivi de projets', 'Messagerie', 'Documents'].map(label => (
                                <div className="auth-pill" key={label}>
                                    <span className="auth-pill-dot" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="auth-left-watermark">GC</div>
                    <div className="auth-left-footer">
                        © {new Date().getFullYear()} Sidibé Architecture & Construction
                    </div>
                </div>

                {/* ══ RIGHT PANEL ══ */}
                <div className="auth-right">
                    <div className="auth-card">
                        <div className="auth-card-label">Connexion</div>
                        <h1 className="auth-card-title">Se <em>connecter</em></h1>
                        <p className="auth-card-subtitle">
                            Entrez vos identifiants pour accéder à votre espace personnel.
                        </p>

                        {/* ── Bannière projet en attente ── */}
                        {flash.info && (
                            <div className="info-banner">
                                ✦ {flash.info}
                            </div>
                        )}

                        {errors.email && !errors.email.includes('@') && (
                            <div className="error-banner">{errors.email}</div>
                        )}

                        <form onSubmit={submit} noValidate>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Adresse e-mail</label>
                                <input
                                    id="email" type="email"
                                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="vous@example.com"
                                    autoComplete="email" autoFocus
                                />
                                {errors.email && <div className="form-error">{errors.email}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Mot de passe</label>
                                <PasswordInput
                                    id="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    hasError={!!errors.password}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                {errors.password && <div className="form-error">{errors.password}</div>}
                            </div>

                            <div className="form-row">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                    />
                                    Se souvenir de moi
                                </label>
                            </div>

                            <button type="submit" className="btn-submit" disabled={processing}>
                                {processing ? (
                                    <span className="spinner" />
                                ) : (
                                    <>
                                        <span>Se connecter</span>
                                        <span style={{ position: 'relative', zIndex: 1 }}>→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="auth-card-divider">ou</div>

                        <div className="auth-card-footer">
                            Pas encore de compte ?{' '}
                            <Link href={route('register')}>Créer un compte</Link>
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
                aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
                {show ? '🙈' : '👁'}
            </button>
        </div>
    );
}
