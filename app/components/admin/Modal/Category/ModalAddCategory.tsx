"use client";

import { useState, useTransition } from "react";
import { X, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { createCategoryAction } from "@/lib/actions/category";

interface ModalAddCategoryProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalAddCategory({
  onClose,
  onSuccess,
}: ModalAddCategoryProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await createCategoryAction(null, formData); // prevState = null
        if (result.success) {
          toast.success("✅ Kategori baru berhasil dibuat!");
          onSuccess();
          onClose();
        } else {
          setError(result.message || "Gagal membuat kategori");
          toast.error(`❌ ${result.message}`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(msg);
        toast.error(`❌ ${msg}`);
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FolderPlus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-gray-800">Tambah Kategori</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Buat kategori baru untuk barang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            disabled={isPending}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Kategori <span className="text-red-500">*</span>
              </label>
              <input
                name="nama_kategori"
                placeholder="Contoh: Elektronik"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                placeholder="Opsional"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors"
              disabled={isPending}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  Simpan Kategori
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}