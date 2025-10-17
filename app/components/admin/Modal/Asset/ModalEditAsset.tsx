"use client";

import React, { useEffect, useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

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
  const [previewUrl, setPreviewUrl] = useState<string>("");

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
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) =>
      prev ? { ...prev, kategori_id: Number(e.target.value) } : prev
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGambar(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const formData = new FormData();
    const cleanHargaAwal = Number(
      form.harga_awal.toString().replace(/\./g, "").replace(/,.*$/, "")
    );
    formData.append("nama_barang", form.nama_barang);
    formData.append("deskripsi", form.deskripsi);
    formData.append("harga_awal", String(cleanHargaAwal));
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
        alert(
          "Terjadi kesalahan: " + (errData.message || JSON.stringify(errData))
        );
        return;
      }
      alert("Data berhasil diupdate!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div className="bg-white modal-content rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto  flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Barang</h2>
            <p className="text-sm text-gray-500 mt-1">
              Perbarui informasi barang lelang
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gambar Barang
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="gambar-upload"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="gambar-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  {previewUrl || form.gambar_barang ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl || form.gambar_barang}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                      <p className="text-sm text-gray-600 group-hover:text-blue-600">
                        Klik untuk upload gambar
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG hingga 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Nama Barang */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Barang
              </label>
              <input
                type="text"
                name="nama_barang"
                value={form.nama_barang}
                onChange={handleChange}
                placeholder="Masukkan nama barang"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={form.kategori_id}
                onChange={handleCategoryChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                placeholder="Masukkan deskripsi barang"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* Harga Awal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Harga Awal
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={Number(form.harga_awal).toLocaleString("id-ID")}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/\D/g, "");
                    setForm((prev) =>
                      prev ? { ...prev, harga_awal: Number(cleanValue) } : prev
                    );
                  }}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Waktu Mulai & Selesai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Waktu Mulai
                </label>
                <input
                  type="datetime-local"
                  name="waktu_mulai"
                  value={form.waktu_mulai.replace(" ", "T").slice(0, 16)}
                  onChange={(e) => {
                    const datetime = e.target.value.replace("T", " ") + ":00";
                    setForm((prev) =>
                      prev ? { ...prev, waktu_mulai: datetime } : prev
                    );
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Waktu Selesai
                </label>
                <input
                  type="datetime-local"
                  name="waktu_selesai"
                  value={form.waktu_selesai.replace(" ", "T").slice(0, 16)}
                  onChange={(e) => {
                    const datetime = e.target.value.replace("T", " ") + ":00";
                    setForm((prev) =>
                      prev ? { ...prev, waktu_selesai: datetime } : prev
                    );
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}