import { useState } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import type { StudentLog } from "@/types";
import type { Group } from "@/types";
import { Users } from "lucide-react"; // Ikon X sudah ada di Dialog
import { clsx } from "clsx";

// 1. Impor komponen Dialog dari shadcn/ui
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: dashboard().url,
    },
    {
        title: "Rekap Absensi",
        href: "/attendance/groups",
    },
];

export default function AttendanceGroups({ groups }: { groups: Group[] }) {
    const [loading, setLoading] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [students, setStudents] = useState<StudentLog[] | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    async function openGroup(major: string, className: string) {
        setLoading(true);
        setSelectedGroup({ major, class: className });
        setModalOpen(true); // Buka modal dulu agar skeleton terlihat

        try {
            const res = await fetch(`/attendance/groups/${major}/${className}`);
            const data = await res.json();
            setStudents(data.students);
        } catch (e) {
            console.error(e);
            setModalOpen(false); // Tutup modal jika error
        } finally {
            setLoading(false); // Selesai loading setelah data ada
        }
    }

    // 2. Buat handler untuk onOpenChange dari Dialog
    // Ini menggantikan fungsi closeModal()
    function handleOpenChange(open: boolean) {
        setModalOpen(open);

        // Jika dialog ditutup (!open), reset state setelah animasi (default ~150-200ms)
        if (!open) {
            setTimeout(() => {
                setSelectedGroup(null);
                setStudents(null);
            }, 200);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Absensi" />

            {/* --- GRID GROUPS (Tidak berubah) --- */}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:p-6">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {groups.map((g, i) => (
                        <div
                            key={i}
                            onClick={() => openGroup(g.major, g.class)}
                            className="cursor-pointer rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-150 hover:border-blue-500 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-500"
                        >
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                                    <Users size={20} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">
                                        {g.major}
                                    </h2>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Kelas {g.class}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. MODAL DIGANTI DENGAN shadcn/ui Dialog */}
            <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedGroup?.major} – Kelas {selectedGroup?.class}
                        </DialogTitle>
                        <DialogDescription>
                            Status absensi siswa untuk hari ini.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Body Modal (List Siswa) */}
                    <div className="max-h-[60vh] overflow-y-auto pr-3 pt-2">
                        {loading && <StudentListSkeleton />}

                        {!loading && students && students.length > 0 && (
                            <div className="flex flex-col gap-3">
                                {students.map((s) => (
                                    <StudentRow key={s.id} student={s} />
                                ))}
                            </div>
                        )}

                        {/* Menambahkan empty state jika tidak loading dan tidak ada siswa */}
                        {!loading && students?.length === 0 && (
                             <p className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                Belum ada data absensi untuk grup ini.
                             </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

// --- HELPER COMPONENTS (Tidak ada perubahan di sini) ---

function StudentRow({ student }: { student: StudentLog }) {
    const time = student.scanned_at
        ? new Date(student.scanned_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "-";

    // const time = student.scanned_at ? student.scanned_at.substring(0, 5) : "-";

    return (
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
            <p className="font-medium">{student.name}</p>
            <div className="flex items-center gap-3">
                <StatusBadge status={student.status} type={student.type} />
                <span className="w-12 text-right text-sm text-neutral-500 dark:text-neutral-400">
                    {time}
                </span>
            </div>
        </div>
    );
}

function StatusBadge({ status, type }: { status: string | null; type: string | null }) {
    let text = "Belum Absen";
    let classes = "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300";

    if (type === "in") {
        if (status === "Tepat Waktu") {
            text = "Hadir";
            classes = "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400";
        } else if (status === "Terlambat") {
            text = "Terlambat";
            classes = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400";
        }
    } else if (type === "out") {
        text = "Pulang";
        classes = "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400";
    }

    if (status === "Izin" || status === "Sakit") {
         text = status;
         classes = "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400";
    }

    return (
        <span
            className={clsx(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                classes,
            )}
        >
            {text}
        </span>
    );
}

function StudentListSkeleton() {
    return (
        <div className="flex animate-pulse flex-col gap-3">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
                >
                    <div className="h-5 w-3/5 rounded bg-neutral-200 dark:bg-neutral-700" />
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                        <div className="h-5 w-12 rounded bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                </div>
            ))}
        </div>
    );
}
