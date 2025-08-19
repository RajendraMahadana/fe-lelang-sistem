"use client";

import React, { useState } from "react";



interface ModalCategoryProps {
  onClose: () => void;
  onSuccess: () => void; // untuk reload data setelah berhasil tambah
}

export default function ModalCategory({ onClose, onSuccess }: ModalCategoryProps) {
  const [namaCategory, setNamaCategory] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
    const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

      {message && <p className="mb-2 text-sm text-red-600">{message}</p>}
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Tambah Kategori</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="nama_kategori"
            value={namaCategory}
            onChange={(e) => setNamaCategory(e.target.value)}
            placeholder="Nama Kategori"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Deskripsi"
            className="w-full border p-2 rounded"
            rows={3}
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
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
