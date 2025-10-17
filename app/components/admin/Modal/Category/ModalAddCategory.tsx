"use client";

import React, { useState } from "react";
import { X, FolderPlus } from "lucide-react";

interface ModalCategoryProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCategory({ onClose, onSuccess }: ModalCategoryProps) {
  const [namaCategory, setNamaCategory] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("auth_token");
      const formData = new FormData();

      formData.append("nama_kategori", namaCategory);
      formData.append("deskripsi", deskripsi);

      const res = await fetch("http://127.0.0.1:8000/api/categories", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat kategori");
      }

      alert("Kategori berhasil dibuat!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FolderPlus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Tambah Kategori</h2>
              <p className="text-sm text-gray-500 mt-0.5">Buat kategori baru untuk barang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {message && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{message}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Nama Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Kategori
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="nama_kategori"
                value={namaCategory}
                onChange={(e) => setNamaCategory(e.target.value)}
                placeholder="Contoh: Elektronik, Furniture, dll"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan kategori ini (opsional)"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isLoading || !namaCategory}
          >
            {isLoading ? (
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
      </div>
    </div>
  );
}