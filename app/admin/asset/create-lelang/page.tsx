"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreateLelangBarang() {
  const [namaBarang, setNamaBarang] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [deskripsi, setDeskripsi] = useState("");
  const [hargaAwal, setHargaAwal] = useState<number>(0);
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [bidTime, setBidTime] = useState<number | null>(null);
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
      setNamaBarang("");
      setCategoryId("");
      setDeskripsi("");
      setHargaAwal(0);
      setWaktuMulai("");
      setWaktuSelesai("");
      setBidTime(null);
      setGambar(null);
    } else {
      setMessage(data.message || "Gagal membuat barang");
    }
  } catch (error) {
    console.error(error);
    setMessage("Terjadi kesalahan server");
  }
};


  return (
    <div className="bg-white p-5 rounded-lg">
      <h1 className="text-xl font-bold mb-4">Tambah Barang Lelang</h1>

      {message && <p className="mb-2 text-sm text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
      <input
            type="file"
            onChange={(e) => setGambar(e.target.files?.[0] || null)}
            className="transition-all duration-150 ease-initial shadow-md pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200  w-full"
            required
          />
        <input
          type="text"
          placeholder="Nama Barang"
          value={namaBarang}
          onChange={(e) => setNamaBarang(e.target.value)}
          className="transition-all duration-150 ease-initial shadow-md pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200  w-full"
          required
        />

        <div>
        <label>Kategori</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
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
          placeholder="Deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="transition-all duration-150 ease-initial shadow-md pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200  w-full"
        />

        <input
          type="number"
          placeholder="Harga Awal"
          value={hargaAwal}
          onChange={(e) => setHargaAwal(Number(e.target.value))}
          className="transition-all duration-150 ease-initial shadow-md pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200  w-full"
          required
        />

        <input
          type="datetime-local"
          value={waktuMulai}
          onChange={(e) => setWaktuMulai(e.target.value.replace("T", " ") + ":00")}
          className="transition-all duration-150 ease-initial shadow-md pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200  w-full"
          required
        />

        <input
          type="datetime-local"
          value={waktuSelesai}
          onChange={(e) => setWaktuSelesai(e.target.value.replace("T", " ") + ":00")}
          className="transition-all duration-150 ease-initial shadow-md pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200  w-full"
          required
        />

        <input
          type="number"
          placeholder="Bid Time (menit)"
          value={bidTime ?? ""}
          onChange={(e) => setBidTime(Number(e.target.value))}
          className="transition-all duration-150 ease-initial shadow-md pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200  w-full"
        />

        <div className="w-full flex justify-end">
          <div className="flex w-1/3 space-x-2">
            <Link href={`/admin/asset`} className="w-full bg-red-600 flex justify-center items-center text-white py-2 font-medium font-montserrat rounded-md shadow-md">
              <button
                className=""
                >
                Batal
              </button>
            </Link>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 font-medium font-montserrat rounded-md shadow-md"
              >
              Simpan
            </button>
          </div>  
        </div>
      </form>
    </div>
  );
}
