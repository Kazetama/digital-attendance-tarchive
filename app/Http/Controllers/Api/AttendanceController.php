<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceLog;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AttendanceController extends Controller
{
    public function scan(Request $request)
    {
        // Validasi
        $request->validate([
            'uid_card' => 'required',
        ]);

        // Cari siswa
        $student = Student::where('uid_card', $request->uid_card)->first();
        if (!$student) {
            return response()->json([
                'status' => false,
                'message' => 'Siswa tidak ditemukan.',
            ], 404);
        }

        $now = Carbon::now();

        // Jadwal
        $scheduleInStart = '06:30';
        $scheduleInEnd = '07:00';
        $scheduleOutEnd = '15:00';

        // Cek IN hari ini
        $todayCheckIn = $student->attendanceLogs()
            ->where('type', 'in')
            ->whereDate('scanned_at', $now->toDateString())
            ->first();

        // Tentukan type
        $type = $todayCheckIn ? 'out' : 'in';

        // Cek apakah boleh OUT
        if ($type === 'out') {
            if ($now->format('H:i') < $scheduleOutEnd) {
                return response()->json([
                    'status' => false,
                    'message' => "Belum bisa absen pulang. Jadwal pulang pukul $scheduleOutEnd.",
                ], 400);
            }
        }

        // Simpan log
        $log = AttendanceLog::create([
            'student_id' => $student->id,
            'type' => $type,
            'scanned_at' => $now,
            'schedule_in_start' => $scheduleInStart,
            'schedule_in_end' => $scheduleInEnd,
            'schedule_out_end' => $scheduleOutEnd,
        ]);

        // Tentukan status (panggil method dari model)
        $status = $log->determineStatus();
        $log->status = $status;
        $log->save();

        // Kirim WA ke orang tua
        if ($student->parent_phone) {

            // Sanitasi nomor
            $phone = preg_replace('/[^0-9+]/', '', $student->parent_phone);

            if (substr($phone, 0, 1) === '0') {
                $phone = '+62' . substr($phone, 1);
            }

            // Pesan WA
            $message = "Assalamualaikum Bapak/Ibu,\n\n";
            $message .= "Informasi absensi anak Anda:\n";
            $message .= "Nama: {$student->name}\n";
            $message .= "Kelas: {$student->class}\n";
            $message .= "Kegiatan: " . ($type === 'in' ? 'Absen Masuk' : 'Absen Pulang') . "\n";
            $message .= "Status: $status\n";
            $message .= "Waktu: {$now->format('H:i d-m-Y')}\n\n";
            $message .= "Terima kasih.";

            try {
                $token = env('FONNTE_TOKEN');

                $response = Http::asForm()->withHeaders([
                    'Authorization' => $token,
                    'Accept' => 'application/json',
                ])->post('https://api.fonnte.com/send', [
                    'target'   => $phone,
                    'message'  => $message,
                    'delay'    => 0,
                    'schedule' => 0,
                ]);

                if ($response->failed()) {
                    \Log::error("WA API failed: " . $response->body());
                } else {
                    \Log::info("WA API response: " . $response->body());
                }
            } catch (\Exception $e) {
                \Log::error("Error sending WA message: " . $e->getMessage());
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Absensi berhasil dan notifikasi dikirim.',
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'class' => $student->class,
                    'uid_card' => $student->uid_card,
                ],
                'type' => $type,
                'status' => $status,
                'scanned_at' => $now->toDateTimeString(),
            ],
        ]);
    }
}
