import { useForm, Link, Head } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Save, ArrowLeft } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { type Student } from "@/types";

interface Props {
    student: Student;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Data Siswa", href: "/admin/students" },
    { title: "Edit Data", href: "#" },
];

export default function Edit({ student }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        uid_card: student.uid_card || "",
        name: student.name || "",
        image: student.image || "",
        parent_phone: student.parent_phone || "",
        address: student.address || "",
        class: student.class || "",
        major: student.major || "",
        email: student.email || "",
        is_active: student.is_active || false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/students/${student.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Siswa - ${student.name}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Edit Data Siswa
                    </h2>
                    <Link
                        href="/admin/students"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className="md:col-span-1">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Nama
                                </label>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Nama lengkap siswa.
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.name && (
                                    <span className="text-xs text-red-600 mt-1">{errors.name}</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className="md:col-span-1">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Email
                                </label>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Email aktif siswa (opsional).
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
                                    placeholder="contoh@email.com"
                                />
                                {errors.email && (
                                    <span className="text-xs text-red-600 mt-1">{errors.email}</span>
                                )}
                            </div>
                        </div>

                        <hr className="border-gray-200 dark:border-gray-700" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className="md:col-span-1">
                                <label
                                    htmlFor="class"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Akademik
                                </label>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Informasi kelas dan jurusan siswa.
                                </p>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="class" className="text-sm font-medium text-gray-700 dark:text-gray-200 md:hidden mb-1 block">Kelas</label>
                                    <input
                                        type="text"
                                        id="class"
                                        value={data.class}
                                        onChange={(e) => setData("class", e.target.value)}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
                                        placeholder="Contoh: 12"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="major" className="text-sm font-medium text-gray-700 dark:text-gray-200 md:hidden mb-1 block">Jurusan</label>
                                    <input
                                        type="text"
                                        id="major"
                                        value={data.major}
                                        onChange={(e) => setData("major", e.target.value)}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
                                        placeholder="Contoh: RPL"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className="md:col-span-1">
                                <label
                                    htmlFor="parent_phone"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Kontak & Alamat
                                </label>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Kontak orang tua dan alamat siswa.
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <label htmlFor="parent_phone" className="text-sm font-medium text-gray-700 dark:text-gray-200 md:hidden mb-1 block">Nomor Orang Tua</label>
                                    <input
                                        type="text"
                                        id="parent_phone"
                                        value={data.parent_phone}
                                        onChange={(e) => setData("parent_phone", e.target.value)}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
                                        placeholder="08..."
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-200 md:hidden mb-1 block">Alamat</label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData("address", e.target.value)}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
                                        placeholder="Masukkan alamat"
                                    />
                                </div>
                            </div>
                        </div>
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className="md:col-span-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Status
                                </label>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Menandakan apakah siswa masih aktif.
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 h-10">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData("is_active", e.target.checked)}
                                        id="is_active"
                                        className="h-4 w-4 text-neutral-900 rounded border-gray-300 dark:border-gray-600 focus:ring-neutral-900"
                                    />
                                    <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-200">
                                        Aktif
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-700 disabled:opacity-50 transition"
                            >
                                <Save className="w-4 h-4" />
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
