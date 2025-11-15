<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    // GET /api/students
    public function index(): JsonResponse
    {
        $students = Student::latest()->paginate(10);
        return $this->success('Student list fetched successfully', $students);
    }

    // POST /api/students
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateRequest($request);

        // Buat query cek duplikat dinamis
        $query = Student::query();

        if ($request->filled('uid_card')) {
            $query->orWhere('uid_card', $request->uid_card);
        }

        if ($request->filled('email')) {
            $query->orWhere('email', $request->email);
        }

        $exists = $query->first();

        if ($exists) {
            return $this->error('Student with same UID card or email already exists', 409);
        }

        $student = Student::create($validated);

        return $this->success('Student created successfully', $student, 201);
    }

    // GET /api/students/{student}
    public function show(Student $student): JsonResponse
    {
        return $this->success('Student detail fetched successfully', $student);
    }

    // PUT/PATCH /api/students/{student}
    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $this->validateRequest($request, $student->id);

        $student->update($validated);

        return $this->success('Student updated successfully', $student);
    }

    // DELETE /api/students/{student}
    public function destroy(Student $student): JsonResponse
    {
        try {
            $student->delete();
            return $this->success('Student deleted successfully');
        } catch (\Throwable $e) {
            Log::error('Failed to delete student: '.$e->getMessage());
            return $this->error('Failed to delete student', 500);
        }
    }

    // --- VALIDATION HANDLER ---
    private function validateRequest(Request $request, $studentId = null): array
    {
        return $request->validate([
            'uid_card' => [
                'sometimes',
                'string',
                Rule::unique('students', 'uid_card')->ignore($studentId),
            ],
            'name' => 'sometimes|string|max:255',
            'image' => 'sometimes|string',
            'parent_phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'class' => 'sometimes|string|max:100',
            'major' => 'sometimes|string|max:100',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('students', 'email')->ignore($studentId),
            ],
            'is_active' => 'sometimes|boolean',
        ]);
    }

    // --- RESPONSE HELPERS ---
    private function success(string $message, $data = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    private function error(string $message, int $code = 400): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], $code);
    }
}
