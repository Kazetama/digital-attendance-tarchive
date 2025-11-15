<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Http\Requests\UpdateStudentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DataStudentController extends Controller
{
    // Menampilkan daftar siswa
    public function index(Request $request)
    {
        $query = Student::query();

        // Pencarian opsional
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('uid_card', 'like', '%' . $request->search . '%');
            });
        }

        $students = $query->orderBy('name', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'filters' => $request->only('search'),
        ]);
    }

    // Halaman edit data siswa
    public function edit(Student $student)
    {
        return Inertia::render('admin/students/edit', [
            'student' => $student,
        ]);
    }

    // Proses update data siswa
    public function update(UpdateStudentRequest $request, Student $student)
    {
        $student->update($request->validated());

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    // Hapus data siswa
    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()
            ->back()
            ->with('success', 'Data siswa berhasil dihapus.');
    }
}
