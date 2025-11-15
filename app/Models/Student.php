<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid_card',
        'name',
        'image',
        'parent_phone',
        'address',
        'class',
        'major',
        'email',
        'is_active',
    ];
}
