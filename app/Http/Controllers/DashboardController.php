<?php

namespace App\Http\Controllers;

use App\Models\ClientProject;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\Conversation;
use App\Models\Realisation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user()->load('roles');
        $role = $user->roles->first()?->name ?? 'visiteur';
        $data = ['user' => $user, 'role' => $role];

        if ($role === 'admin') {
            $data['stats'] = [
                'total_realisations'    => Realisation::count(),
                'published_realisations'=> Realisation::where('is_published', true)->count(),
                'total_services'        => Service::count(),
                'pending_testimonials'  => Testimonial::where('is_published', false)->count(),
                'open_conversations'    => Conversation::where('status', 'open')->count(),
                'unread_messages'       => Conversation::sum('unread_admin_count'),
                'total_client_projects' => ClientProject::count(),
            ];
            $data['pendingTestimonials'] = Testimonial::where('is_published', false)
                ->latest()->limit(5)->get();
            $data['recentConversations'] = Conversation::with([
                'messages' => fn($q) => $q->latest()->limit(1)
            ])->where('status', 'open')
                ->orderByDesc('last_message_at')->limit(5)->get();
            $data['recentClientProjects'] = ClientProject::with('user')
                ->latest()->limit(5)->get();
        }

        if ($role === 'client') {
            $data['projects'] = ClientProject::where('user_id', $user->id)
                ->with(['service', 'media'])->latest()->get();
            $data['conversations'] = Conversation::where('client_user_id', $user->id)
                ->with(['messages' => fn($q) => $q->latest()->limit(1)])
                ->latest()->get();
            $data['stats'] = [
                'total_projects'    => ClientProject::where('user_id', $user->id)->count(),
                'ongoing_projects'  => ClientProject::where('user_id', $user->id)
                    ->where('status', 'in_progress')->count(),
                'open_conversations'=> Conversation::where('client_user_id', $user->id)
                    ->where('status', 'open')->count(),
            ];
        }

        if ($role === 'visiteur') {
            $data['conversations'] = Conversation::where('client_user_id', $user->id)
                ->with(['messages' => fn($q) => $q->latest()->limit(1)])
                ->latest()->get();
            $data['services'] = Service::active()->get();
        }

        return Inertia::render('Dashboard', $data);
    }
}
