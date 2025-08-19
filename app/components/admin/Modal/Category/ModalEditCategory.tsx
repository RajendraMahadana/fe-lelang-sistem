"use client";

import { useEffect, useState } from "react";

export interface Category {
  id: number;
  nama_kategori: string;
  deskripsi: string;
}

interface ModalEditCategoryProps {
  category: Category;          // data yang mau diedit
  onClose: () => void;         // tutup modal
  onSuccess: () => void;       // refetch setelah sukses
}

export default function ModalEditCategory({ category, onClose, onSuccess }: ModalEditCategoryProps) {
  const [namaKategori, setNamaKategori] = useState(category.nama_kategori);
  const [deskripsi, setDeskripsi] = useState(category.deskripsi);
  const [saving, setSaving] = useState(false);

  // sinkron saat kategori yang dipilih berubah
  useEffect(() => {
    setNamaKategori(category.nama_kategori);
    setDeskripsi(category.deskripsi);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/categories/${category.id}`, {
        method: "PUT", 
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_kategori: namaKategori,
          deskripsi,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Gagal update kategori");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Kategori</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            placeholder="Nama Kategori"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Deskripsi"
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
