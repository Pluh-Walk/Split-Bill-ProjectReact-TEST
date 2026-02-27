<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/register', function () {
    return Inertia::render('auth/register');
})->name('register');

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/settings.php';
