<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/bills', function () {
    return Inertia::render('BillsIndex');
})->middleware(['auth'])->name('bills.index');

Route::get('/bills/{id}', function ($id) {
    return Inertia::render('BillShow', ['id' => $id]);
})->middleware(['auth'])->name('bills.show');

Route::get('/guest-access', function () {
    return Inertia::render('GuestAccess');
})->name('guest.access');

require __DIR__.'/settings.php';
