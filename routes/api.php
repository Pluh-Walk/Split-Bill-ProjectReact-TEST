<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BillController;
use App\Http\Controllers\API\ExpenseController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/invite-guest', [AuthController::class, 'inviteGuest']);
    Route::post('/upgrade-guest', [AuthController::class, 'upgradeGuest']);

    Route::get('/bills', [BillController::class, 'index']);
    Route::get('/bills/code/{code}', [BillController::class, 'viewByCode']);
    Route::post('/bills', [BillController::class, 'store']);
Route::get('/bills/{id}', [BillController::class, 'show']);
    Route::put('/bills/{id}', [BillController::class, 'update']);
    Route::delete('/bills/{id}', [BillController::class, 'destroy']);
    Route::post('/bills/{id}/regenerate-code', [BillController::class, 'regenerateCode']);
    Route::post('/bills/{id}/archive', [BillController::class, 'archive']);
    Route::post('/bills/{id}/unarchive', [BillController::class, 'unarchive']);
    Route::post('/bills/code/{code}/join', [BillController::class, 'addParticipantByCode']);
    
    // Participants
    Route::post('/bills/{billId}/participants', [BillController::class, 'addParticipant']);
    Route::delete('/bills/{billId}/participants/{participantId}', [BillController::class, 'removeParticipant']);
    Route::get('/users/search', [BillController::class, 'searchUsers']);

    // Expenses
    Route::post('/bills/{billId}/expenses', [ExpenseController::class, 'store']);
    Route::put('/bills/{billId}/expenses/{expenseId}', [ExpenseController::class, 'update']);
    Route::delete('/bills/{billId}/expenses/{expenseId}', [ExpenseController::class, 'destroy']);
});
