// app/admin/asset/create-lelang/page.tsx
import { fetchCategoriesAction } from "@/lib/actions/category";

import Link from "next/link";
import CreateLelangForm from "./CreateLelangForm";

export default async function CreateLelangPage() {
  // ✅ Fetch kategori di server — aman & efisien
  const categories = await fetchCategoriesAction();

  return (
    <section className="font-poppins">
      <div className="mb-6 flex justify-between flex-row-reverse">
        <Link 
          href="/admin/asset/lelang" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Kembali ke Daftar
        </Link>
        <h1 className="text-2xl font-medium text-gray-900">Tambah Barang Lelang</h1>
        {/* <p className="text-sm text-gray-500 mt-1">
          Isi informasi lengkap untuk membuat lelang baru
        </p> */}
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <CreateLelangForm categories={categories} />
      </div>
    </section>
  );
}