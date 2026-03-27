<?php

namespace App\Http\Controllers;

use App\Models\ClientProject;
use App\Models\Conversation;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConversationController extends Controller
{
    // ─── Propriétaire du site (user id=2) ────────────────────────────────────
    private function ownerData(): array
    {
        $owner = User::find(2);
        if (!$owner) {
            return ['name' => 'Génie Civil', 'initial' => 'G'];
        }
        return [
            'name'    => $owner->name,
            'initial' => mb_strtoupper(mb_substr($owner->name, 0, 1)),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | PUBLIC — FORMULAIRE CONTACT
    |--------------------------------------------------------------------------
    */

    public function contact()
    {
        return Inertia::render('Contact');
    }

    public function storeContact(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'phone'   => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $user = auth()->user();

        $conversation = Conversation::create([
            'client_user_id'  => $user?->id,
            'visitor_name'    => $user ? null : $validated['name'],
            'visitor_email'   => $user ? null : $validated['email'],
            'visitor_ip'      => $request->ip(),
            'status'          => 'open',
            'last_message_at' => now(),
        ]);

        ChatMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type'     => $user ? 'client' : 'visitor',
            'user_id'         => $user?->id,
            'message'         => "**Sujet:** {$validated['subject']}\n\n"
                . "{$validated['message']}\n\n"
                . "**Téléphone:** " . ($validated['phone'] ?? 'Non renseigné'),
            'is_read'         => false,
        ]);

        return redirect()->route('contact')
            ->with('success', 'Message envoyé avec succès.');
    }

    /*
    |--------------------------------------------------------------------------
    | UTILISATEUR CONNECTÉ (CLIENT)
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            return redirect()->route('admin.conversations.index');
        }

        $conversations = Conversation::where('client_user_id', $user->id)
            ->with(['messages' => fn($q) => $q->latest()->limit(1)])
            ->withCount(['messages as unread_visitor_count' => fn($q) =>
            $q->where('is_read', false)->where('sender_type', 'admin')
            ])
            ->orderByDesc('last_message_at')
            ->get();

        return Inertia::render('Conversations/Index', [
            'conversations' => $conversations,
            'owner'         => $this->ownerData(),
            'isAdmin'       => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $user = auth()->user();

        $conversation = Conversation::create([
            'client_user_id'  => $user->id,
            'visitor_name'    => null,
            'visitor_email'   => null,
            'visitor_ip'      => $request->ip(),
            'status'          => 'open',
            'last_message_at' => now(),
        ]);

        ChatMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type'     => 'client',
            'user_id'         => $user->id,
            'message'         => "**Sujet:** {$validated['subject']}\n\n{$validated['message']}",
            'is_read'         => false,
        ]);

        return redirect()->route('conversations.show', $conversation->id)
            ->with('success', 'Conversation créée avec succès.');
    }

    public function show(Conversation $conversation)
    {
        $user = auth()->user();

        // ✅ L'admin est redirigé vers sa vue dédiée
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.conversations.show', $conversation->id);
        }

        if ($conversation->client_user_id !== $user->id) {
            abort(403);
        }

        $conversation->load(['messages.user']);

        // Marquer les messages admin comme lus
        $conversation->messages()
            ->where('sender_type', 'admin')
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        $conversations = Conversation::where('client_user_id', $user->id)
            ->with(['messages' => fn($q) => $q->latest()->limit(1)])
            ->orderByDesc('last_message_at')
            ->get();

        return Inertia::render('Conversations/Show', [
            'conversation'  => $conversation,
            'conversations' => $conversations,
            'owner'         => $this->ownerData(),
            'auth'          => ['user' => $user],
            'isAdmin'       => false,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN — mêmes vues JSX, avec isAdmin: true
    |--------------------------------------------------------------------------
    */

    public function adminIndex(Request $request)
    {
        abort_unless(auth()->user()?->hasRole('admin'), 403);

        $query = Conversation::with([
            'clientUser',
            'messages' => fn($q) => $q->latest()->limit(1),
        ])->withCount([
            // Messages non lus côté admin = messages de type client/visitor non lus
            'messages as unread_admin_count' => fn($q) =>
            $q->where('is_read', false)
                ->whereIn('sender_type', ['client', 'visitor']),
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Conversations/Index', [     // ← même fichier que client
            'conversations' => $query->orderByDesc('last_message_at')->paginate(20),
            'owner'         => $this->ownerData(),
            'isAdmin'       => true,                        // ← différenciateur
        ]);
    }

    public function adminShow(Conversation $conversation)
    {
        abort_unless(auth()->user()?->hasRole('admin'), 403);

        $conversation->load(['messages.user', 'clientUser']);

        // Marquer les messages client comme lus
        $conversation->messages()
            ->where('sender_type', 'client')
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        // Sidebar admin : toutes les conversations récentes
        $conversations = Conversation::with([
            'clientUser',
            'messages' => fn($q) => $q->latest()->limit(1),
        ])
            ->orderByDesc('last_message_at')
            ->limit(30)
            ->get();

        return Inertia::render('Conversations/Show', [      // ← même fichier que client
            'conversation'  => $conversation,
            'conversations' => $conversations,
            'owner'         => $this->ownerData(),
            'auth'          => ['user' => auth()->user()],
            'isAdmin'       => true,                        // ← différenciateur
        ]);
    }

    public function close(Conversation $conversation)
    {
        abort_unless(auth()->user()?->hasRole('admin'), 403);
        $conversation->update(['status' => 'closed']);
        return back()->with('success', 'Conversation fermée.');
    }

    public function reopen(Conversation $conversation)
    {
        abort_unless(auth()->user()?->hasRole('admin'), 403);
        $conversation->update(['status' => 'open']);
        return back()->with('success', 'Conversation rouverte.');
    }

    public function destroy(Conversation $conversation)
    {
        abort_unless(auth()->user()?->hasRole('admin'), 403);
        $conversation->delete();
        return redirect()
            ->route('admin.conversations.index')
            ->with('success', 'Conversation supprimée.');
    }

    public function storeForProject(Request $request, ClientProject $clientProject)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin') && $clientProject->user_id !== $user->id) {
            abort(403);
        }

        $conversation = Conversation::where('client_project_id', $clientProject->id)->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'client_user_id'    => $clientProject->user_id,
                'client_project_id' => $clientProject->id,
                'visitor_name'      => null,
                'visitor_email'     => null,
                'visitor_ip'        => $request->ip(),
                'status'            => 'open',
                'last_message_at'   => now(),
            ]);

            ChatMessage::create([
                'conversation_id' => $conversation->id,
                'sender_type'     => $user->hasRole('admin') ? 'admin' : 'client',
                'user_id'         => $user->id,
                'message'         => "Conversation ouverte pour le projet : **{$clientProject->title}**",
                'is_read'         => false,
            ]);
        }

        if ($user->hasRole('admin')) {
            return redirect()->route('admin.conversations.show', $conversation->id);
        }

        return redirect()->route('conversations.show', $conversation->id);
    }
}
