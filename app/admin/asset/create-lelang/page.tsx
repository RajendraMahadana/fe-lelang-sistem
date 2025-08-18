"use client";

import { useState } from "react";

export default function CreateLelangBarang() {
  const [namaBarang, setNamaBarang] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [hargaAwal, setHargaAwal] = useState<number>(0);
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [bidTime, setBidTime] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [gambarBarang, setGambar] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("auth_token");
    const formData = new FormData();

    // PENTING: key harus 'gambar_barang', bukan 'gambar'
    if (gambarBarang) formData.append("gambar_barang", gambarBarang);

    formData.append("nama_barang", namaBarang);
    formData.append("deskripsi", deskripsi);
    formData.append("harga_awal", String(hargaAwal));
    formData.append("waktu_mulai", waktuMulai);       // format: YYYY-MM-DD HH:mm:ss
    formData.append("waktu_selesai", waktuSelesai);   // format: YYYY-MM-DD HH:mm:ss
    // formData.append("bid_time", someDateTimeString );

    const res = await fetch("http://127.0.0.1:8000/api/lelang-barang", {
      method: "POST",
      headers: {
        // JANGAN set Content-Type manual; biarkan browser set boundary multipart
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Barang lelang berhasil dibuat!");
      setNamaBarang("");
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Tambah Barang Lelang</h1>

      {message && <p className="mb-2 text-sm text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
      <input
            type="file"
            onChange={(e) => setGambar(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded"
            required
          />
        <input
          type="text"
          placeholder="Nama Barang"
          value={namaBarang}
          onChange={(e) => setNamaBarang(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Harga Awal"
          value={hargaAwal}
          onChange={(e) => setHargaAwal(Number(e.target.value))}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="datetime-local"
          value={waktuMulai}
          onChange={(e) => setWaktuMulai(e.target.value.replace("T", " ") + ":00")}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="datetime-local"
          value={waktuSelesai}
          onChange={(e) => setWaktuSelesai(e.target.value.replace("T", " ") + ":00")}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Bid Time (menit)"
          value={bidTime ?? ""}
          onChange={(e) => setBidTime(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
