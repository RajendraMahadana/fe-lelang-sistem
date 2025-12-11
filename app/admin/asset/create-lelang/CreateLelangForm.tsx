// app/admin/asset/create-lelang/CreateLelangForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Package, Clock, Tag, DollarSign, Image as ImageIcon } from "lucide-react";
import type { Category } from "@/lib/types/category";
import { createLelangAction } from "@/lib/actions/lelang";

interface CreateLelangFormProps {
  categories: Category[];
}

export default function CreateLelangForm({ categories }: CreateLelangFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await createLelangAction(null, formData); // prevState = null
        if (result.success) {
          toast.success("✅ Barang lelang berhasil dibuat!");
          setTimeout(() => router.push("/admin/asset/lelang"), 500);
        } else {
          setGlobalError(result.message || "Gagal membuat lelang");
          if (result.errors) {
            setErrors(result.errors);
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
        setGlobalError(msg);
        toast.error(`❌ ${msg}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error global */}
      {globalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{globalError}</p>
        </div>
      )}

      {/* Upload Gambar */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <ImageIcon size={18} />
          Gambar Barang <span className="text-red-500">*</span>
        </label>
        <input
          name="gambar_barang"
          type="file"
          accept="image/*"
          required
          className="w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {errors.gambar_barang && (
          <p className="text-xs text-red-500">{errors.gambar_barang}</p>
        )}
      </div>

      {/* Grid Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama Barang */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Package size={18} />
            Nama Barang <span className="text-red-500">*</span>
          </label>
          <input
            name="nama_barang"
            type="text"
            placeholder="Contoh: Laptop Dell XPS"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.nama_barang && (
            <p className="text-xs text-red-500">{errors.nama_barang}</p>
          )}
        </div>

        {/* Kategori */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Tag size={18} />
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="kategori_id"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nama_kategori}
              </option>
            ))}
          </select>
          {errors.kategori_id && (
            <p className="text-xs text-red-500">{errors.kategori_id}</p>
          )}
        </div>

        {/* Harga Awal */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <DollarSign size={18} />
            Harga Awal (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            name="harga_awal"
            type="number"
            min="1000"
            placeholder="1.000.000"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.harga_awal && (
            <p className="text-xs text-red-500">{errors.harga_awal}</p>
          )}
        </div>

        {/* Waktu Mulai */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock size={18} />
            Waktu Mulai <span className="text-red-500">*</span>
          </label>
          <input
            name="waktu_mulai"
            type="datetime-local"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.waktu_mulai && (
            <p className="text-xs text-red-500">{errors.waktu_mulai}</p>
          )}
        </div>

        {/* Waktu Selesai */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock size={18} />
            Waktu Selesai <span className="text-red-500">*</span>
          </label>
          <input
            name="waktu_selesai"
            type="datetime-local"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.waktu_selesai && (
            <p className="text-xs text-red-500">{errors.waktu_selesai}</p>
          )}
        </div>
      </div>

      {/* Deskripsi */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Package size={18} />
          Deskripsi
        </label>
        <textarea
          name="deskripsi"
          rows={4}
          placeholder="Jelaskan kondisi, spesifikasi, atau catatan penting..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        {errors.deskripsi && (
          <p className="text-xs text-red-500">{errors.deskripsi}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Link
          href="/admin/asset/lelang"
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors text-center"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Package size={18} />
              Buat Lelang
            </>
          )}
        </button>
      </div>
    </form>
  );
}