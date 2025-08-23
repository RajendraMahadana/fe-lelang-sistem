"use client";

import React, { useEffect, useState } from "react";

interface LelangBarang {
  id: number;
  kategori_id: number;
  nama_barang: string;
  deskripsi: string;
  gambar_barang: string;
  harga_awal: number;
  waktu_mulai: string;
  waktu_selesai: string;
}

interface Category {
  id: number;
  nama_kategori: string;
}

interface ModalUpdateProps {
  barang: LelangBarang | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalUpdate({
  barang,
  onClose,
  onSuccess,
}: ModalUpdateProps) {
  const [form, setForm] = useState<LelangBarang | null>(barang);
  const [gambarBarang, setGambar] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setForm(barang);
  }, [barang]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://127.0.0.1:8000/api/categories", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Gagal ambil kategori", err);
      }
    };
    fetchCategories();
  }, []);

  if (!form) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => prev ? { ...prev, kategori_id: Number(e.target.value) } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const formData = new FormData();
    formData.append("nama_barang", form.nama_barang);
    formData.append("deskripsi", form.deskripsi);
    formData.append("harga_awal", String(form.harga_awal));
    formData.append("waktu_mulai", form.waktu_mulai);
    formData.append("waktu_selesai", form.waktu_selesai);
    formData.append("kategori_id", String(form.kategori_id));
    if (gambarBarang) formData.append("gambar_barang", gambarBarang);
    formData.append("_method", "PUT");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/lelang-barang/${form.id}/barang`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error detail:", errData);
        throw new Error("Gagal update data");
      }

      alert("Data berhasil diupdate!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Barang</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="file"
            onChange={(e) => setGambar(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="nama_barang"
            value={form.nama_barang}
            onChange={handleChange}
            placeholder="Nama Barang"
            className="w-full border p-2 rounded"
          />
          <div>
            <label>Kategori</label>
            <select
              value={form.kategori_id}
              onChange={handleCategoryChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nama_kategori}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            placeholder="Deskripsi"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="harga_awal"
            value={form.harga_awal}
            onChange={handleChange}
            placeholder="Harga Awal"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="waktu_mulai"
            value={form.waktu_mulai}
            onChange={handleChange}
            placeholder="YYYY-MM-DD HH:mm:ss"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="waktu_selesai"
            value={form.waktu_selesai}
            onChange={handleChange}
            placeholder="YYYY-MM-DD HH:mm:ss"
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
