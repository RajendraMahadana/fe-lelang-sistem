/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useActionState, useEffect } from "react";
import { X, FolderEdit } from "lucide-react";
import { toast } from "sonner"; // ✅ Highly recommended: npm install sonner

// ✅ Import Server Action
import { updateCategoryAction } from "@/lib/actions/category";
import type { Category } from "@/lib/types/category";

interface ModalEditCategoryProps {
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalEditCategory({
  category,
  onClose,
  onSuccess,
}: ModalEditCategoryProps) {
  // ✅ useActionState: [state, action, isPending]
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await updateCategoryAction(category.id, formData);
      if (result.success) {
        toast.success("✅ Kategori berhasil diperbarui!");
        onSuccess();
        onClose();
      } else {
        toast.error(`❌ ${result.message || "Gagal memperbarui kategori"}`);
      }
      return result;
    },
    { success: false }
  );

  // ✅ Reset form saat category berubah
  useEffect(() => {
    // Tidak perlu setState manual — form control pakai `defaultValue`
  }, [category]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderEdit className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-gray-800">Edit Kategori</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Perbarui informasi kategori
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
        <form action={formAction} className="p-6">
          {/* Hidden field untuk FormData */}
          <input type="hidden" name="id" value={category.id} />

          <div className="space-y-5">
            {/* Nama Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Kategori
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                name="nama_kategori"
                defaultValue={category.nama_kategori}
                placeholder="Contoh: Elektronik, Furniture, dll"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                disabled={isPending}
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="deskripsi"
                defaultValue={category.deskripsi}
                placeholder="Jelaskan kategori ini"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                required
                disabled={isPending}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow shadow-blue-500/30 disabled:opacity-50 flex items-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <FolderEdit className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}