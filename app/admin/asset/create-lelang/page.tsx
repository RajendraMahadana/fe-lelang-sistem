/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateLelangBarang() {
  const router = useRouter(); 
  const [namaBarang, setNamaBarang] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [deskripsi, setDeskripsi] = useState("");
  const [hargaAwal, setHargaAwal] = useState<number>(0);
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [message, setMessage] = useState("");
  const [gambarBarang, setGambar] = useState<File | null>(null);

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
        setCategories(data.data || []); // sesuaikan dengan response API kamu
      } catch (err) {
        console.error("Gagal ambil kategori", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("auth_token");
    const formData = new FormData();

    // PENTING: key harus 'gambar_barang', bukan 'gambar'
    if (gambarBarang) formData.append("gambar_barang", gambarBarang);

    formData.append("nama_barang", namaBarang);
    formData.append("kategori_id", categoryId);
    formData.append("deskripsi", deskripsi);
    formData.append("harga_awal", String(hargaAwal));
    formData.append("waktu_mulai", waktuMulai);       // format: YYYY-MM-DD HH:mm:ss
    formData.append("waktu_selesai", waktuSelesai);   // format: YYYY-MM-DD HH:mm:ss
    // formData.append("bid_time", someDateTimeString );

    const res = await fetch("http://127.0.0.1:8000/api/lelang-barang", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Barang lelang berhasil dibuat!");
      // Reset form
      setNamaBarang("");
      setCategoryId("");
      setDeskripsi("");
      setHargaAwal(0);
      setWaktuMulai("");
      setWaktuSelesai("");
      setGambar(null);

      // **Redirect ke halaman admin/asset**
      router.push("/admin/asset"); // <--- letakkan di sini
    } else {
      setMessage(data.message || "Gagal membuat barang");
    }
  } catch (error) {
    console.error(error);
    setMessage("Terjadi kesalahan server");
  }
};


  return (
    <>
      <h1 className="text-2xl mb-5">Tambah Barang Lelang</h1>
    <div className="bg-white p-5 rounded-lg shadow-md">

      {message && <p className="mb-2 text-sm text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

  <div>
    <label htmlFor="gambar" className="block text-sm font-semibold text-gray-700 mb-2">Tambahkan Gambar</label>
    <input
      name="gambar"
      type="file"
      onChange={(e) => setGambar(e.target.files?.[0] || null)}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      required
    />
  </div>

  {/* Flex container responsif */}
  <div className="flex flex-wrap gap-4">
    <div className="flex-1  min-w-[200px]">
      <label>Nama Barang</label>
      <input
        type="text"
        placeholder="Nama Barang"
        value={namaBarang}
        onChange={(e) => setNamaBarang(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        required
      />
    </div>

    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      >
        <option value="">-- Pilih Kategori --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nama_kategori}
          </option>
        ))}
      </select>
    </div>

    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Awal</label>
      <input
        type="number"
        placeholder="Harga Awal"
        value={hargaAwal}
        onChange={(e) => setHargaAwal(Number(e.target.value))}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        required
      />
    </div>
  </div>

  {/* Flex container untuk tanggal */}
  <div className="flex flex-wrap gap-4">
    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Tentukan Waktu Mulai</label>
      <input
        type="datetime-local"
        value={waktuMulai}
        onChange={(e) => setWaktuMulai(e.target.value.replace("T", " ") + ":00")}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        required
      />
    </div>

    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Tentukan Waktu Akhir</label>
      <input
        type="datetime-local"
        value={waktuSelesai}
        onChange={(e) => setWaktuSelesai(e.target.value.replace("T", " ") + ":00")}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        required
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">Masukan Deskripsi</label>
    <textarea
      placeholder="Deskripsi"
      value={deskripsi}
      onChange={(e) => setDeskripsi(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
    />
  </div>

  <div className="w-full flex justify-end mt-4">
  <div className="flex gap-2 w-full md:w-1/3">
    {/* Batal */}
    <Link href="/admin/asset" className="w-full">
      <button
        type="button"
        className="w-full cursor-pointer bg-red-600 text-white py-2 font-medium rounded-md shadow-md hover:bg-red-700 transition-colors"
      >
        Batal
      </button>
    </Link>

    {/* Simpan */}
    <button
      type="submit"
      className="w-full cursor-pointer bg-blue-600 text-white py-2 font-medium rounded-md shadow-md hover:bg-blue-700 transition-colors"
    >
      Simpan
    </button>
  </div>
</div>


</form>

    </div>
    </>

  );
}
