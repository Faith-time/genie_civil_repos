<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use libphonenumber\PhoneNumberUtil;
use libphonenumber\NumberParseException;

class AuthController extends Controller
{
    // ========== LOGIN ==========

    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'Identifiants incorrects.']);
        }

        $user = auth()->user();

        if (!$user->is_active) {
            Auth::logout();
            return back()->withErrors(['email' => 'Compte désactivé.']);
        }

        $user->update(['last_login_at' => now()]);
        $request->session()->regenerate();

        // ── Finaliser un projet soumis depuis la page Contact sans être connecté
        ContactController::createPendingProject($user->id);

        return redirect()->route('home');
    }

    // ========== REGISTER ==========

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'phone'    => ['nullable', 'string', 'max:25', function ($attribute, $value, $fail) {
                if (!$value) return;

                $phoneUtil = PhoneNumberUtil::getInstance();
                try {
                    // On parse sans région par défaut → l'indicatif doit être inclus (+221, +33…)
                    $parsed = $phoneUtil->parse($value, null);
                    if (!$phoneUtil->isValidNumber($parsed)) {
                        $fail('Le numéro de téléphone est invalide pour ce pays.');
                    }
                } catch (NumberParseException $e) {
                    $fail('Format invalide. Incluez l\'indicatif pays (ex: +221 77 000 0000).');
                }
            }],
        ]);

        // Normaliser le numéro au format E.164 (+221771234567)
        if (!empty($validated['phone'])) {
            $phoneUtil = PhoneNumberUtil::getInstance();
            $parsed    = $phoneUtil->parse($validated['phone'], null);
            $validated['phone'] = $phoneUtil->format($parsed, \libphonenumber\PhoneNumberFormat::E164);
        }

        $user = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'phone'     => $validated['phone'] ?? null,
            'is_active' => true,
        ]);

        $user->assignRole('client');
        Auth::login($user);
        ContactController::createPendingProject($user->id);

        return redirect()->route('home');
    }

    // ========== LOGOUT ==========

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
