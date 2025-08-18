"use client";

import React, { useState } from "react";

interface LelangBarang {
  id: number;
  nama_barang: string;
  deskripsi: string;
  harga_awal: number;
  waktu_mulai: string;
  waktu_selesai: string;
}

interface ModalUpdateProps {
  barang: LelangBarang | null;
  onClose: () => void;
  onSuccess: () => void; // untuk reload data setelah update
}

export default function ModalUpdate({ barang, onClose, onSuccess }: ModalUpdateProps) {
  const [form, setForm] = useState<LelangBarang | null>(barang);

  if (!barang) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/lelang-barang/${barang.id}/barang`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
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
            type="text"
            name="nama_barang"
            value={form?.nama_barang || ""}
            onChange={handleChange}
            placeholder="Nama Barang"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="deskripsi"
            value={form?.deskripsi || ""}
            onChange={handleChange}
            placeholder="Deskripsi"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="harga_awal"
            value={form?.harga_awal || ""}
            onChange={handleChange}
            placeholder="Harga Awal"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="waktu_mulai"
            value={form?.waktu_mulai || ""}
            onChange={handleChange}
            placeholder="YYYY-MM-DD HH:mm:ss"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="waktu_selesai"
            value={form?.waktu_selesai || ""}
            onChange={handleChange}
            placeholder="YYYY-MM-DD HH:mm:ss"
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
              Batal
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
