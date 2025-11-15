<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->enum('type', ['in', 'out']);
            $table->timestamp('scanned_at');
            $table->enum('status', ['on_time','late','early_leave','overtime','unknown'])->nullable();
            $table->string('schedule_in_start')->nullable();
            $table->string('schedule_in_end')->nullable();
            $table->string('schedule_out_end')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_logs');
    }
};
