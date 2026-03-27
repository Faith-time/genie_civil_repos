// resources/js/Pages/Conversations/Index.jsx
import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import GuestLayout from '../../Components/Layout/GuestLayout';

export default function Index({ conversations, owner, isAdmin = false }) {
    const ownerName    = owner?.name    ?? 'Génie Civil';
    const ownerInitial = owner?.initial ?? ownerName.charAt(0).toUpperCase();

    // Pour admin : conversations est paginé (conversations.data)
    // Pour client : conversations est un tableau simple
    const convList = isAdmin ? (conversations?.data ?? []) : (conversations ?? []);

    const [searchQuery,  setSearchQuery]  = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal,    setShowModal]    = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        message: '',
    });

    // ── Filtrage ────────────────────────────────────────────────────────────
    const filteredConversations = convList.filter(conv => {
        const clientName = conv.visitor_name ?? conv.client_user?.name ?? conv.clientUser?.name ?? 'Client';
        const matchesSearch =
            clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.messages?.[0]?.message?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // ── Helpers ─────────────────────────────────────────────────────────────
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const days = Math.floor((new Date() - date) / 86400000);
        if (days === 0) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        if (days === 1) return 'Hier';
        if (days < 7)  return date.toLocaleDateString('fr-FR', { weekday: 'short' });
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    };

    const truncateMessage = (message, maxLength = 60) => {
        if (!message) return '';
        return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
    };

    // ── Admin : filtrage serveur par status ─────────────────────────────────
    const handleAdminFilter = (val) => {
        setFilterStatus(val);
        router.get(
            route('admin.conversations.index'),
            { status: val === 'all' ? undefined : val },
            { preserveState: true, replace: true }
        );
    };

    // ── Client : créer une conversation ─────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('conversations.store'), {
            onSuccess: () => { setShowModal(false); reset(); },
        });
    };
    const closeModal = () => { setShowModal(false); reset(); };

    // ── Styles réutilisables ─────────────────────────────────────────────────
    const inputStyle = {
        width: '100%', padding: '10px 16px',
        background: 'var(--bg-page)', border: '1px solid var(--border)',
        borderRadius: 12, color: 'var(--text-main)',
        fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
        outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
    };

    const filterBtn = (active) => ({
        padding: '6px 16px', borderRadius: 999,
        border: active ? '1px solid var(--gold)' : '1px solid var(--border)',
        background: active ? 'var(--gold)' : 'var(--bg-page)',
        color: active ? '#fff' : 'var(--text-muted)',
        fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600,
        cursor: 'pointer', transition: 'all 0.2s',
    });

    // ── Lien selon le rôle ───────────────────────────────────────────────────
    const convLink = (conv) =>
        isAdmin
            ? route('admin.conversations.show', conv.id)
            : route('conversations.show', conv.id);

    // ── Nom affiché dans la liste ────────────────────────────────────────────
    const getDisplayName = (conv) => {
        if (isAdmin) {
            return conv.visitor_name
                ?? conv.client_user?.name
                ?? conv.clientUser?.name
                ?? 'Client inconnu';
        }
        return ownerName;
    };

    const getInitial = (conv) => {
        const name = getDisplayName(conv);
        return name.charAt(0).toUpperCase();
    };

    return (
        <GuestLayout>
            <br />
            <Head title={isAdmin ? 'Conversations — Admin' : 'Mes conversations'} />

            <style>{`
                .conv-item:hover { background: var(--bg-page) !important; }
                .conv-input:focus { border-color: var(--gold) !important; box-shadow: 0 0 0 3px rgba(201,148,58,0.15); }
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
                .anim-fade  { animation: fadeIn  0.2s ease-out; }
                .anim-scale { animation: scaleIn 0.2s ease-out; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
            `}</style>

            <div style={{ height: '100vh', display: 'flex', background: 'var(--bg-page)', paddingTop: 72 }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', height: '100%' }}>

                    {/* ── Sidebar ── */}
                    <div style={{ width: 380, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--dropdown-bg)', display: 'flex', flexDirection: 'column' }}>

                        {/* Header */}
                        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', background: 'var(--dropdown-bg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div>
                                    <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                        Messages
                                    </h1>
                                    {isAdmin && (
                                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                            Vue Admin
                                        </span>
                                    )}
                                </div>

                                {/* Bouton "+" uniquement pour le client */}
                                {!isAdmin && (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-light)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
                                    >
                                        <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <div style={{ position: 'relative', marginBottom: 12 }}>
                                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }}
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Rechercher une conversation..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="conv-input"
                                    style={{ ...inputStyle, paddingLeft: 38, borderRadius: 999 }}
                                />
                            </div>

                            {/* Filtres */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[['all','Tous'],['open','Actives'],['closed','Fermées']].map(([val, label]) => (
                                    <button
                                        key={val}
                                        onClick={() => isAdmin ? handleAdminFilter(val) : setFilterStatus(val)}
                                        style={filterBtn(filterStatus === val)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Liste */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {filteredConversations.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
                                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg-page)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                        <svg style={{ width: 32, height: 32, color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                        </svg>
                                    </div>
                                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6 }}>
                                        {searchQuery ? 'Aucun résultat' : 'Aucune conversation'}
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', marginBottom: 20 }}>
                                        {searchQuery ? "Essayez avec d'autres mots-clés" : (isAdmin ? 'Aucun message reçu pour le moment' : 'Commencez une nouvelle conversation')}
                                    </p>
                                    {!isAdmin && !searchQuery && (
                                        <button
                                            onClick={() => setShowModal(true)}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, padding: '10px 20px', borderRadius: 999 }}
                                        >
                                            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                                            </svg>
                                            Nouvelle conversation
                                        </button>
                                    )}
                                </div>
                            ) : filteredConversations.map(conv => {
                                const lastMessage  = conv.messages?.[0];
                                const hasUnread    = isAdmin
                                    ? (conv.unread_admin_count > 0)
                                    : (conv.unread_visitor_count > 0);
                                const displayName  = getDisplayName(conv);
                                const avatarLetter = getInitial(conv);

                                return (
                                    <Link
                                        key={conv.id}
                                        href={convLink(conv)}
                                        className="conv-item"
                                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border)', textDecoration: 'none', transition: 'background 0.15s' }}
                                    >
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: conv.status === 'closed' ? 'var(--text-muted)' : 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                                                {avatarLetter}
                                            </div>
                                            {conv.status === 'open' && (
                                                <span style={{ position: 'absolute', bottom: 0, right: 0, width: 13, height: 13, borderRadius: '50%', background: '#22c55e', border: '2px solid var(--dropdown-bg)' }} />
                                            )}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: hasUnread ? 700 : 500, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {displayName}
                                                </span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>
                                                    {formatDate(conv.last_message_at)}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                                <p style={{ fontSize: '0.8rem', color: hasUnread ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: hasUnread ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
                                                    {truncateMessage(lastMessage?.message) || 'Aucun message'}
                                                </p>
                                                {hasUnread && (
                                                    <span style={{ background: 'var(--gold)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, minWidth: 20, height: 20, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', flexShrink: 0 }}>
                                                        {isAdmin ? conv.unread_admin_count : conv.unread_visitor_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination admin */}
                        {isAdmin && conversations?.last_page > 1 && (
                            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: 8 }}>
                                {Array.from({ length: conversations.last_page }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => router.get(route('admin.conversations.index'), { page }, { preserveState: true })}
                                        style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: conversations.current_page === page ? 'var(--gold)' : 'var(--bg-page)', color: conversations.current_page === page ? '#fff' : 'var(--text-muted)', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600 }}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right panel (empty state) ── */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
                        <div style={{ textAlign: 'center', padding: 32 }}>
                            <div style={{ width: 112, height: 112, borderRadius: '50%', background: 'var(--dropdown-bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <svg style={{ width: 52, height: 52, color: 'var(--gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                            </div>
                            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>
                                {isAdmin ? 'Messagerie Admin' : 'Vos messages'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', maxWidth: 320, margin: '0 auto' }}>
                                {isAdmin
                                    ? 'Sélectionnez une conversation pour répondre à un client'
                                    : 'Sélectionnez une conversation pour voir les messages ou créez-en une nouvelle'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modal nouvelle conversation (client uniquement) ── */}
            {!isAdmin && showModal && (
                <div className="anim-fade" onClick={closeModal} style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                    <div className="anim-scale" onClick={e => e.stopPropagation()} style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                Nouvelle conversation
                            </h2>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, letterSpacing: '0.05em' }}>
                                    Sujet <span style={{ color: '#e05252' }}>*</span>
                                </label>
                                <input type="text" value={data.subject} onChange={e => setData('subject', e.target.value)}
                                       placeholder="Ex: Question sur un projet, Demande de devis..."
                                       className="conv-input" style={inputStyle} required autoFocus />
                                {errors.subject && <p style={{ marginTop: 6, fontSize: '0.8rem', color: '#e05252', fontFamily: "'DM Sans',sans-serif" }}>{errors.subject}</p>}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, letterSpacing: '0.05em' }}>
                                    Votre message <span style={{ color: '#e05252' }}>*</span>
                                </label>
                                <textarea value={data.message} onChange={e => setData('message', e.target.value)}
                                          placeholder="Décrivez votre projet ou votre question en détail..."
                                          rows="5" className="conv-input" style={{ ...inputStyle, resize: 'none', lineHeight: 1.7 }} required />
                                {errors.message && <p style={{ marginTop: 6, fontSize: '0.8rem', color: '#e05252', fontFamily: "'DM Sans',sans-serif" }}>{errors.message}</p>}
                            </div>

                            <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <svg style={{ width: 18, height: 18, color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <div>
                                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                                            Conseils pour une meilleure réponse
                                        </p>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            {['Soyez le plus précis possible', 'Incluez les détails techniques si nécessaire', 'Mentionnez vos contraintes (budget, délais)'].map((tip, i) => (
                                                <li key={i} style={{ display: 'flex', gap: 8, color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem' }}>
                                                    <span style={{ color: 'var(--gold)' }}>·</span>{tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-page)', color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                    Annuler
                                </button>
                                <button type="submit" disabled={processing} style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: 'var(--gold)', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 600, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.6 : 1 }}
                                        onMouseEnter={e => { if (!processing) e.currentTarget.style.background = 'var(--gold-light)'; }}
                                        onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}>
                                    {processing ? 'Envoi...' : 'Démarrer la conversation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
