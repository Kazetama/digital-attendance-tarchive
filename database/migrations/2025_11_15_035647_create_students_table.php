<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('uid_card')->unique();
            $table->string('name')->nullable();
            $table->string('image')->nullable();
            $table->string('parent_phone')->nullable();
            $table->text('address')->nullable();
            $table->string('class')->nullable();
            $table->string('major')->nullable();
            $table->string('email')->nullable()->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('students');
    }
};
