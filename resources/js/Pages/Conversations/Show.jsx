// resources/js/Pages/Conversations/Show.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import GuestLayout from '../../Components/Layout/GuestLayout';

export default function Show({ conversation, auth, conversations, owner, isAdmin = false }) {
    const ownerName    = owner?.name    ?? 'Génie Civil';
    const ownerInitial = owner?.initial ?? ownerName.charAt(0).toUpperCase();

    // Nom du client de cette conversation
    const clientName = conversation.visitor_name
        ?? conversation.client_user?.name
        ?? conversation.clientUser?.name
        ?? 'Client';
    const clientInitial = clientName.charAt(0).toUpperCase();

    const messagesEndRef = useRef(null);
    const textareaRef    = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Route d'envoi de message selon le rôle
    const messageRoute = isAdmin
        ? route('admin.conversations.messages.store', conversation.id)
        : route('conversations.messages.store', conversation.id);

    const { data, setData, post, processing, reset } = useForm({ message: '' });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation.messages]);

    const handleTextareaChange = (e) => {
        setData('message', e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.message.trim()) return;
        post(messageRoute, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (textareaRef.current) textareaRef.current.style.height = '48px';
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            },
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
    };

    // ── Actions admin ────────────────────────────────────────────────────────
    const handleClose = () => {
        router.patch(route('admin.conversations.close', conversation.id), {}, { preserveScroll: true });
    };

    const handleReopen = () => {
        router.patch(route('admin.conversations.reopen', conversation.id), {}, { preserveScroll: true });
    };

    const handleDelete = () => {
        router.delete(route('admin.conversations.destroy', conversation.id));
    };

    // ── Helpers date ─────────────────────────────────────────────────────────
    const formatMessageTime = (d) =>
        new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const formatMessageDate = (d) => {
        const date      = new Date(d);
        const today     = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (date.toDateString() === today.toDateString())     return "Aujourd'hui";
        if (date.toDateString() === yesterday.toDateString()) return 'Hier';
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const formatDate = (d) => {
        if (!d) return '';
        const date = new Date(d);
        const days = Math.floor((new Date() - date) / 86400000);
        if (days === 0) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        if (days === 1) return 'Hier';
        if (days < 7)  return date.toLocaleDateString('fr-FR', { weekday: 'short' });
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    };

    const truncateMessage = (msg, max = 40) =>
        !msg ? '' : msg.length > max ? msg.substring(0, max) + '...' : msg;

    const groupMessagesByDate = (messages) => {
        const groups = {};
        (messages || []).forEach(m => {
            const d = formatMessageDate(m.created_at);
            if (!groups[d]) groups[d] = [];
            groups[d].push(m);
        });
        return groups;
    };

    // ── Liste sidebar ────────────────────────────────────────────────────────
    const allConversations = React.useMemo(() => {
        const list = [...(conversations || [])];
        if (!list.some(c => c.id === conversation.id)) list.unshift(conversation);
        return list;
    }, [conversations, conversation]);

    const filteredList = allConversations.filter(conv => {
        const name = isAdmin
            ? (conv.visitor_name ?? conv.client_user?.name ?? conv.clientUser?.name ?? 'Client')
            : ownerName;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const groupedMessages = groupMessagesByDate(conversation.messages || []);

    // ── Logique d'affichage des bulles ───────────────────────────────────────
    // isMe = le message vient de moi (admin ou client actuellement connecté)
    const isMyMessage = (message) => {
        if (isAdmin) return message.sender_type === 'admin';
        return message.user_id === auth?.user?.id;
    };

    // Nom affiché au-dessus du message de l'autre
    const getSenderName = (message) => {
        if (isAdmin) {
            // L'admin voit les messages client avec le nom du client
            return clientName;
        }
        // Le client voit les messages admin avec le nom du propriétaire
        return ownerName;
    };

    const getSenderInitial = (message) => getSenderName(message).charAt(0).toUpperCase();

    // Lien sidebar selon le rôle
    const convLink = (conv) =>
        isAdmin
            ? route('admin.conversations.show', conv.id)
            : route('conversations.show', conv.id);

    const getSidebarName = (conv) =>
        isAdmin
            ? (conv.visitor_name ?? conv.client_user?.name ?? conv.clientUser?.name ?? 'Client')
            : ownerName;

    return (
        <GuestLayout>
            <br /><br />
            <Head title={isAdmin ? `Conv. — ${clientName}` : 'Conversation'} />

            <style>{`
                .conv-sidebar-item:hover { background: var(--bg-page) !important; }
                .conv-input:focus { border-color: var(--gold) !important; box-shadow: 0 0 0 3px rgba(201,148,58,0.15); }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
                @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
                .anim-fade  { animation: fadeIn  0.2s ease-out; }
                .anim-scale { animation: scaleIn 0.2s ease-out; }
            `}</style>

            <div style={{ height: '100vh', display: 'flex', background: 'var(--bg-page)', paddingTop: 72 }}>

                {/* ── Sidebar ── */}
                <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--dropdown-bg)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div>
                                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                    Messages
                                </h1>
                                {isAdmin && (
                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                        Vue Admin
                                    </span>
                                )}
                            </div>
                            {/* Bouton retour liste admin */}
                            {isAdmin && (
                                <Link
                                    href={route('admin.conversations.index')}
                                    style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-page)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                                    title="Retour à la liste"
                                >
                                    <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                    </svg>
                                </Link>
                            )}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }}
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="conv-input"
                                style={{ width: '100%', padding: '9px 14px 9px 36px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 999, color: 'var(--text-main)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredList.map(conv => {
                            const isActive    = conv.id === conversation.id;
                            const lastMessage = (conv.messages || [])[(conv.messages || []).length - 1];
                            const sidebarName = getSidebarName(conv);
                            const sidebarInit = sidebarName.charAt(0).toUpperCase();

                            return (
                                <Link
                                    key={conv.id}
                                    href={convLink(conv)}
                                    className="conv-sidebar-item"
                                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid var(--border)', background: isActive ? 'var(--bg-page)' : 'transparent', textDecoration: 'none', transition: 'background 0.15s' }}
                                >
                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                                            {sidebarInit}
                                        </div>
                                        {conv.status === 'open' && (
                                            <span style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: '2px solid var(--dropdown-bg)' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {sidebarName}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>
                                                {formatDate(conv.last_message_at)}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
                                            {truncateMessage(lastMessage?.message) || 'Aucun message'}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* ── Zone de chat ── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                    {/* Header */}
                    <div style={{ background: 'var(--dropdown-bg)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                                    {/* Admin voit l'initiale du client, client voit l'initiale du proprio */}
                                    {isAdmin ? clientInitial : ownerInitial}
                                </div>
                                {conversation.status === 'open' && (
                                    <span style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: '2px solid var(--dropdown-bg)' }} />
                                )}
                            </div>
                            <div>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                                    {isAdmin ? clientName : ownerName}
                                </p>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                                    {conversation.status === 'open' ? (isAdmin ? 'Client en attente' : 'En ligne') : 'Conversation fermée'}
                                </p>
                            </div>
                        </div>

                        {/* Droite header : badge statut + actions admin */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ padding: '5px 14px', borderRadius: 999, background: conversation.status === 'open' ? 'rgba(34,197,94,0.12)' : 'var(--bg-page)', color: conversation.status === 'open' ? 'rgb(74,222,128)' : 'var(--text-muted)', border: `1px solid ${conversation.status === 'open' ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`, fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                                {conversation.status === 'open' ? 'Active' : 'Fermée'}
                            </span>

                            {/* Actions admin uniquement */}
                            {isAdmin && (
                                <>
                                    {conversation.status === 'open' ? (
                                        <button
                                            onClick={handleClose}
                                            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-page)', color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e05252'; e.currentTarget.style.color = '#e05252'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                        >
                                            Fermer
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleReopen}
                                            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-page)', color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                        >
                                            Rouvrir
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-page)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#e05252'; e.currentTarget.style.color = '#e05252'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                        title="Supprimer la conversation"
                                    >
                                        <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-page)', padding: '24px' }}>
                        <div style={{ maxWidth: 760, margin: '0 auto' }}>
                            {Object.entries(groupedMessages).map(([date, messages]) => (
                                <div key={date}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 16px' }}>
                                        <span style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 500, padding: '5px 16px', borderRadius: 999 }}>
                                            {date}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {messages.map(message => {
                                            const isMe = isMyMessage(message);
                                            return (
                                                <div key={message.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: '72%', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                                                        {!isMe && (
                                                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>
                                                                {getSenderInitial(message)}
                                                            </div>
                                                        )}
                                                        <div style={{ background: isMe ? 'var(--gold)' : 'var(--dropdown-bg)', border: isMe ? 'none' : '1px solid var(--border)', color: isMe ? '#fff' : 'var(--text-main)', padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}>
                                                            {!isMe && (
                                                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', margin: '0 0 4px' }}>
                                                                    {getSenderName(message)}
                                                                </p>
                                                            )}
                                                            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                                                                {message.message}
                                                            </p>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
                                                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', opacity: isMe ? 0.8 : 1, color: isMe ? '#fff' : 'var(--text-muted)' }}>
                                                                    {formatMessageTime(message.created_at)}
                                                                </span>
                                                                {isMe && (
                                                                    <svg style={{ width: 14, height: 14, opacity: message.is_read ? 1 : 0.5, color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Zone de saisie */}
                    <div style={{ background: 'var(--dropdown-bg)', borderTop: '1px solid var(--border)', padding: '12px 24px 14px', flexShrink: 0 }}>
                        {conversation.status === 'open' ? (
                            <>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                                    <textarea
                                        ref={textareaRef}
                                        value={data.message}
                                        onChange={handleTextareaChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder={isAdmin ? 'Répondre au client...' : 'Écrivez votre message...'}
                                        rows="1"
                                        className="conv-input"
                                        style={{ flex: 1, padding: '12px 16px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 24, color: 'var(--text-main)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', outline: 'none', resize: 'none', minHeight: 48, maxHeight: 128, transition: 'border-color 0.2s', lineHeight: 1.6 }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing || !data.message.trim()}
                                        style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, background: processing || !data.message.trim() ? 'var(--border)' : 'var(--gold)', border: 'none', cursor: processing || !data.message.trim() ? 'not-allowed' : 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                                    >
                                        {processing ? (
                                            <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                                                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                            </svg>
                                        ) : (
                                            <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                            </svg>
                                        )}
                                    </button>
                                </form>
                                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                                    Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne
                                </p>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '12px 0' }}>
                                <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem' }}>
                                    Cette conversation est fermée.{' '}
                                    {isAdmin && (
                                        <button onClick={handleReopen} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 600, padding: 0 }}>
                                            Rouvrir
                                        </button>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Confirm suppression (admin) ── */}
            {isAdmin && showDeleteConfirm && (
                <div className="anim-fade" onClick={() => setShowDeleteConfirm(false)} style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                    <div className="anim-scale" onClick={e => e.stopPropagation()} style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 420, padding: 32, boxShadow: '0 24px 80px rgba(0,0,0,0.4)', textAlign: 'center' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(224,82,82,0.12)', border: '1px solid rgba(224,82,82,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <svg style={{ width: 24, height: 24, color: '#e05252' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>
                            Supprimer la conversation ?
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', marginBottom: 28 }}>
                            Cette action est irréversible. Tous les messages seront supprimés.
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-page)', color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                Annuler
                            </button>
                            <button onClick={handleDelete} style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#e05252', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
