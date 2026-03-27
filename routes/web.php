<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{ClientProjectController,
    ContactController,
    HomeController,
    AuthController,
    DashboardController,
    ServiceController,
    RealisationController,
    TestimonialController,
    ConversationController,
    ChatMessageController,
    SiteSettingController};

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Home
Route::get('/', [HomeController::class, 'index'])->name('home');

// About + dépôt témoignage
Route::get('/about', [TestimonialController::class, 'about'])->name('about');
Route::post('/testimonial/store', [TestimonialController::class, 'store'])
    ->name('testimonials.store');

// Services
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{service:slug}', [ServiceController::class, 'show'])->name('services.show');

// Réalisations (portfolio public)
Route::get('/realisations', [RealisationController::class, 'index'])->name('realisations.index');
Route::get('/realisations/{realisation}', [RealisationController::class, 'show'])->name('realisations.show'); // ← AJOUTÉ
Route::get('/portfolio/{folder}', [RealisationController::class, 'showFolder'])->name('realisations.show-folder');

// Testimonials (public listing)
Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');

// CV Download
Route::get('/cv/download', [SiteSettingController::class, 'downloadCv'])->name('cv.download');

Route::get('/contact',  [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');


/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');


/*
|--------------------------------------------------------------------------
| DASHBOARDS
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');


/*
|--------------------------------------------------------------------------
| CLIENT PROJECTS (Demandes de projets côté client)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->prefix('mes-projets')->name('client-projects.')->group(function () {

    Route::get('/', [ClientProjectController::class, 'index'])->name('index');

    Route::get('/nouveau', [ClientProjectController::class, 'create'])->name('create');
    Route::post('/', [ClientProjectController::class, 'store'])->name('store');

    Route::get('/{clientProject}', [ClientProjectController::class, 'show'])->name('show');
    Route::delete('/{clientProject}', [ClientProjectController::class, 'destroy'])->name('destroy');
});


/*
|--------------------------------------------------------------------------
| CONVERSATIONS (Messagerie)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->prefix('conversations')->name('conversations.')->group(function () {

    Route::get('/', [ConversationController::class, 'index'])->name('index');
    Route::get('/{conversation}', [ConversationController::class, 'show'])->name('show');
    Route::post('/', [ConversationController::class, 'store'])->name('store');

    Route::post('/{conversation}/messages', [ChatMessageController::class, 'store'])
        ->name('messages.store');

    Route::delete('/messages/{message}', [ChatMessageController::class, 'destroy'])
        ->name('messages.destroy');
});


/*
|--------------------------------------------------------------------------
| ADMIN PANEL
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        /*
        |----------------------------------------------------------------------
        | SETTINGS
        |----------------------------------------------------------------------
        */

        Route::get('/settings', [SiteSettingController::class, 'edit'])->name('settings');
        Route::put('/settings', [SiteSettingController::class, 'update'])->name('settings.update');


        /*
        |----------------------------------------------------------------------
        | SERVICES
        |----------------------------------------------------------------------
        */

        Route::resource('services', ServiceController::class)
            ->except(['index', 'show']);

        Route::patch('/services/{service}/toggle', [ServiceController::class, 'toggleStatus'])
            ->name('services.toggle');


        /*
        |----------------------------------------------------------------------
        | RÉALISATIONS (portfolio vidéo admin)
        |----------------------------------------------------------------------
        */

        Route::get('/realisations', [RealisationController::class, 'adminIndex'])
            ->name('realisations.index');

        Route::get('/realisations/create', [RealisationController::class, 'create'])
            ->name('realisations.create');

        Route::post('/realisations', [RealisationController::class, 'store'])
            ->name('realisations.store');

        Route::delete('/realisations/{realisation}', [RealisationController::class, 'destroy'])
            ->name('realisations.destroy');

        Route::patch('/realisations/{realisation}/toggle', [RealisationController::class, 'togglePublish'])
            ->name('realisations.toggle-publish'); // ← RENOMMÉ pour correspondre au JSX


        /*
        |----------------------------------------------------------------------
        | DEMANDES DE PROJETS CLIENTS (admin)
        |----------------------------------------------------------------------
        */

        Route::get('/client-projects', [ClientProjectController::class, 'adminIndex'])
            ->name('client-projects.index');

        Route::get('/client-projects/{clientProject}', [ClientProjectController::class, 'adminShow'])
            ->name('client-projects.show');

        Route::patch('/client-projects/{clientProject}/status', [ClientProjectController::class, 'updateStatus'])
            ->name('client-projects.update-status');

        Route::delete('/client-projects/{clientProject}', [ClientProjectController::class, 'destroy'])
            ->name('client-projects.destroy');


        /*
        |----------------------------------------------------------------------
        | TESTIMONIALS
        |----------------------------------------------------------------------
        */

        Route::resource('testimonials', TestimonialController::class)
            ->except(['index', 'show', 'store']);

        Route::patch('/testimonials/{testimonial}/publish', [TestimonialController::class, 'togglePublish'])
            ->name('testimonials.publish');

        Route::patch('/testimonials/{testimonial}/feature', [TestimonialController::class, 'toggleFeatured'])
            ->name('testimonials.feature');


        /*
        |----------------------------------------------------------------------
        | CONVERSATIONS ADMIN
        |----------------------------------------------------------------------
        */

        Route::get('/conversations', [ConversationController::class, 'adminIndex'])
            ->name('conversations.index');

        Route::get('/conversations/{conversation}', [ConversationController::class, 'adminShow'])
            ->name('conversations.show');

        Route::post('/conversations/{conversation}/messages', [ChatMessageController::class, 'store'])
            ->name('conversations.messages.store');

        Route::patch('/conversations/{conversation}/close', [ConversationController::class, 'close'])
            ->name('conversations.close');

        Route::patch('/conversations/{conversation}/reopen', [ConversationController::class, 'reopen'])
            ->name('conversations.reopen');

        Route::delete('/conversations/{conversation}', [ConversationController::class, 'destroy'])
            ->name('conversations.destroy');
    });

Route::post('/conversations/project/{clientProject}', [ConversationController::class, 'storeForProject'])
    ->middleware('auth')
    ->name('conversations.store-for-project');
