<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class AttendanceLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'type',
        'scanned_at',
        'status',
        'schedule_in_start',
        'schedule_in_end',
        'schedule_out_end',
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function determineStatus()
    {
        $scan = Carbon::parse($this->scanned_at);

        if ($this->type === 'in') {
            return $scan->lte(Carbon::parse($this->schedule_in_end))
                ? 'on_time'
                : 'late';
        }

        if ($this->type === 'out') {
            if ($scan->lt(Carbon::parse($this->schedule_out_end))) {
                return 'early_leave';
            }
            if ($scan->gt(Carbon::parse($this->schedule_out_end))) {
                return 'overtime';
            }
        }

        return 'unknown';
    }
}
