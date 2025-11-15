<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AttendanceController;

Route::post('/attendance/scan', [AttendanceController::class, 'scan']);
Route::apiResource('students', StudentController::class);
