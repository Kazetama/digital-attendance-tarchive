import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { Search, Edit, UserX, Trash } from "lucide-react";
import { type Student } from "@/types";

interface PageProps {
    students: {
        data: Student[];
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: dashboard().url },
    { title: "Data Siswa", href: "/admin/students" },
];

export default function Index({ students, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(`/admin/students`, { search }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900 shadow-sm p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                Data Siswa
                            </h1>
                            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                                Kelola semua data siswa di dalam sistem.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <form onSubmit={handleSearch} className="flex-grow md:flex-grow-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari siswa..."
                                        className="w-full md:w-64 pl-9 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm
                                                   bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100
                                                   focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-200
                                                   focus:border-neutral-900 dark:focus:border-neutral-200 transition-colors"
                                    />
                                </div>
                                <button type="submit" className="hidden">Cari</button>
                            </form>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="w-full bg-white dark:bg-neutral-900">
                            <thead className="bg-neutral-100 dark:bg-neutral-800">
                                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                                    {["Uid", "Nama", "Email", "Kelas", "Jurusan", "Status", "Aksi"].map((h) => (
                                        <th
                                            key={h}
                                            className="p-4 text-left text-xs font-semibold
                                                       text-neutral-600 dark:text-neutral-300
                                                       uppercase tracking-wider"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {students.data.length > 0 ? (
                                    students.data.map((s) => (
                                        <tr
                                            key={s.id}
                                            className="hover:bg-neutral-50 dark:hover:bg-neutral-800
                                                       transition-colors border-b
                                                       border-neutral-200 dark:border-neutral-700"
                                        >
                                            <td className="p-4 text-sm text-neutral-700 dark:text-neutral-300">{s.uid_card}</td>
                                            <td className="p-4 text-sm text-neutral-900 dark:text-neutral-100 font-medium">{s.name}</td>
                                            <td className="p-4 text-sm text-neutral-700 dark:text-neutral-300">{s.email}</td>
                                            <td className="p-4 text-sm text-neutral-700 dark:text-neutral-300">{s.class}</td>
                                            <td className="p-4 text-sm text-neutral-700 dark:text-neutral-300">{s.major}</td>

                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.is_active
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
                                                        }`}
                                                >
                                                    {s.is_active ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </td>

                                            <td className="p-4 flex items-center gap-2">
                                                <Link
                                                    href={`/admin/students/${s.id}/edit`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
                                                               bg-neutral-900 dark:bg-neutral-200
                                                               text-white dark:text-neutral-900
                                                               text-xs font-medium
                                                               hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    Edit
                                                </Link>

                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        if (confirm(`Yakin mau hapus data ${s.name}?`)) {
                                                            router.delete(`/admin/students/${s.id}`);
                                                        }
                                                    }}
                                                >
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
                                                                   bg-red-600 dark:bg-red-700
                                                                   text-white
                                                                   text-xs font-medium
                                                                   hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                                                    >
                                                        <Trash className="h-3 w-3" />
                                                        Hapus
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center p-16 bg-white dark:bg-neutral-900"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <UserX className="h-12 w-12 text-neutral-400 dark:text-neutral-600" />
                                                <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">
                                                    Tidak Ada Siswa
                                                </h3>
                                                <p className="text-neutral-500 dark:text-neutral-400 max-w-xs">
                                                    Tidak ada data siswa yang ditemukan
                                                    {filters.search ? ` dengan pencarian "${filters.search}".` : "."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
