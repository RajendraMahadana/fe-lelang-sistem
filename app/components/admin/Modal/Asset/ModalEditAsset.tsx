"use client";

import { useState, useTransition, useEffect } from "react";
import { X, Upload, Image as ImageIcon, ChevronDown, AlertCircle, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { LelangBarang } from "@/lib/types/lelang";
import type { Category } from "@/lib/types/category";
import { updateLelangAction } from "@/lib/actions/lelang";
import Image from "next/image";
import { getStatusBadgeClass } from '@/utils/statusBadge';

interface ModalEditAssetProps {
  barang: LelangBarang;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalEditAsset({
  barang,
  categories,
  onClose,
  onSuccess,
}: ModalEditAssetProps) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState<FormData>(new FormData());
  const { bg, text } = getStatusBadgeClass(barang.status);

  // Format datetime untuk input
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData.has(name)) {
      formData.set(name, value);
    } else {
      formData.append(name, value);
    }
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (formData.has('gambar_barang')) {
        formData.set('gambar_barang', file);
      } else {
        formData.append('gambar_barang', file);
      }
      
      // Preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    // Debug log
    console.log("Form Data sebelum submit:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    startTransition(async () => {
      try {
        // Tambah _method untuk Laravel
        formData.append('_method', 'PUT');
        
        const result = await updateLelangAction(barang.id, formData);
        
        if (result.success) {
          toast.success("✅ Barang lelang berhasil diperbarui!");
          onSuccess();
          onClose();
        } else {
          toast.error(`❌ ${result.message || "Gagal memperbarui lelang"}`);
          if (result.errors) setErrors(result.errors);
        }
      } catch (err) {
        console.error("Error in handleSubmit:", err);
        toast.error(`❌ Terjadi kesalahan sistem`);
      }
    });
  };

 return (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 r-sm z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Barang Lelang</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">ID #{barang.id}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Tutup"
          disabled={isPending}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
        {/* Gambar */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gambar Barang</label>
          <input
            type="file"
            name="gambar_barang"
            id="gambar-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="gambar-upload"
            className="block cursor-pointer group"
          >
            <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 min-h-[180px]">
              {previewUrl || barang.gambar_barang ? (
                <div className="relative aspect-video rounded-md overflow-hidden">
                  <Image
                    src={previewUrl || `http://127.0.0.1:8000/storage/${barang.gambar_barang}`}
                    alt="Preview barang"
                    fill
                    className="object-cover"
                    sizes="(max-width: 700px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                    <span className="ml-2 text-white text-sm font-medium">Ganti gambar</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="mt-3 text-gray-600 text-sm font-medium">
                    Klik untuk upload gambar
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Format: JPG, PNG, JPEG &bull; Maks. 2 MB
                  </p>
                </div>
              )}
            </div>
          </label>
          {errors.gambar_barang && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.gambar_barang}
            </p>
          )}
        </div>  
        
        <div className="flex gap-2">

          {/* Nama Barang */}
          <div className="space-y-2 w-full">
            <label htmlFor="nama_barang" className="block text-sm font-medium text-gray-700">
              Nama Barang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama_barang"
              name="nama_barang"
              defaultValue={barang.nama_barang}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
            {errors.nama_barang && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.nama_barang}
              </p>
            )}
          </div>

          {/* Kategori */}
          <div className="space-y-2 w-full">
            <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700">
              Kategori <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="kategori_id"
                name="kategori_id"
                defaultValue={barang.kategori_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>-- Pilih kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nama_kategori}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            </div>
            {errors.kategori_id && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.kategori_id}
              </p>
            )}
          </div>
        
        </div>

        {/* Waktu Mulai & Selesai */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Jadwal Lelang</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="waktu_mulai" className="block text-sm font-medium text-gray-700">
                Mulai <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="datetime-local"
                  id="waktu_mulai"
                  name="waktu_mulai"
                  defaultValue={formatDateTime(barang.waktu_mulai)}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              {errors.waktu_mulai && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.waktu_mulai}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="waktu_selesai" className="block text-sm font-medium text-gray-700">
                Selesai <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="datetime-local"
                  id="waktu_selesai"
                  name="waktu_selesai"
                  defaultValue={formatDateTime(barang.waktu_selesai)}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              {errors.waktu_selesai && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.waktu_selesai}
                </p>
              )}
            </div>
          </div>
        </div>

        

        {/* Harga Awal */}
        <div className="space-y-2">
          <label htmlFor="harga_awal" className="block text-sm font-medium text-gray-700">
            Harga Awal <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
            <input
              type="number"
              id="harga_awal"
              name="harga_awal"
              defaultValue={barang.harga_awal}
              onChange={handleInputChange}
              min="1000"
              step="1000"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          {errors.harga_awal && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.harga_awal}
            </p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            defaultValue={barang.deskripsi}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.deskripsi && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.deskripsi}
            </p>
          )}
        </div>

        

        {/* Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <div className="px-4 py-3 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-between">
          <span className={`text-xs ${bg} ${text} px-3 py-1 rounded-md font-medium`}>
            {barang.status}
          </span>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
              Tidak bisa diubah
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Status lelang dikelola otomatis oleh sistem berdasarkan waktu dan aktivitas.
          </p>
        </div>

        {/* Error Summary (opsional — bisa di-hide jika error sedikit) */}
        {Object.keys(errors).length > 2 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-700">Perbaiki kesalahan berikut:</h4>
                <ul className="mt-1 text-sm text-red-600 list-disc pl-5 space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 text-gray-700 font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-60 transition"
            disabled={isPending}
          >
            Batal
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 min-w-[120px]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}