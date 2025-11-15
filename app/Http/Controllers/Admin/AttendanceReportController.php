<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Carbon\Carbon;

class AttendanceReportController extends Controller
{
    public function index()
    {
        $groups = Student::select('major', 'class')
            ->groupBy('major', 'class')
            ->orderBy('major')
            ->orderBy('class')
            ->get();

        return inertia('admin/attendance/index', [
            'groups' => $groups
        ]);
    }

    public function showGroup($major, $class)
    {
        $today = Carbon::today();

        $students = Student::where('major', $major)
            ->where('class', $class)
            ->with([
                'attendanceLogs' => function ($query) use ($today) {
                    $query->whereDate('scanned_at', $today)
                          ->orderBy('scanned_at', 'desc');
                }
            ])
            ->orderBy('name')
            ->get()
            ->map(function ($student) {
                $log = $student->attendanceLogs->first();

                if (!$log) {
                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                        'class' => $student->class,
                        'major' => $student->major,
                        'status' => 'belum_absen',
                        'type' => null,
                        'scanned_at' => null,
                    ];
                }

                // Ambil status real
                $raw = $log->determineStatus();

                // Convert biar cocok sama Badge
                $statusText = match ($raw) {
                    'on_time'     => 'Tepat Waktu',
                    'late'        => 'Terlambat',
                    'early_leave' => 'Pulang Cepat',
                    'overtime'    => 'Lembur',
                    default       => 'Unknown'
                };

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'class' => $student->class,
                    'major' => $student->major,
                    'status' => $statusText,
                    'type' => $log->type,
                    'scanned_at' => $log->scanned_at
                        ? $log->scanned_at->format('Y-m-d H:i:s')
                        : null,
                ];
            });

        return response()->json([
            'major' => $major,
            'class' => $class,
            'students' => $students
        ]);
    }
}
