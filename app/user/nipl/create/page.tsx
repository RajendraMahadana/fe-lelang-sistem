"use client";

import { useState } from "react";
// Pastikan path import ini benar sesuai struktur foldermu
import { buyNipl } from "../services/niplService";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";


export default function NiplPage() {
  const [noTelepon, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Harga NIPL (Hardcode sesuai logic kamu Rp 25.000)
  const NIPL_PRICE = 25000;

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true);

    if (!noTelepon) {
        Swal.fire("Gagal", "Nomor Telepon wajib diisi!", "warning");
        setLoading(false);
        return;
    }

    try {
      // 1. Panggil Service Backend (Xendit)
      const { invoice_url } = await buyNipl(noTelepon);

      // 2. Jika sukses, redirect user ke halaman pembayaran Xendit
      // Kita tidak pakai router.push karena ini link eksternal
      window.location.href = invoice_url; 

    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: err.message || "Gagal memproses pembayaran. Silakan coba lagi.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-montserrat p-6">
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI: FORM --- */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-white/50">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Beli Tiket NIPL</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Dapatkan Nomor Induk Peserta Lelang untuk mulai menawar barang impianmu.
          </p>

          <form onSubmit={handleBuy} className="flex flex-col gap-6">
            
            {/* Display Harga */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                <div>
                    <span className="block text-xs text-blue-600 font-bold uppercase tracking-wider">Biaya NIPL</span>
                    <span className="text-gray-500 text-xs">Sekali bayar untuk satu sesi lelang</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                    Rp {NIPL_PRICE.toLocaleString("id-ID")}
                </div>
            </div>

            {/* Input No Telepon */}
            <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-semibold text-gray-700 ml-1">
                    Nomor WhatsApp / Telepon
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="ri-phone-line text-gray-400"></i>
                    </div>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="Contoh: 081234567890"
                        value={noTelepon}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-800"
                        required
                    />
                </div>
            </div>

            {/* Tombol Bayar */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-400/20 hover:bg-gray-800 hover:scale-[1.01] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {loading ? (
                    <>
                        <ClipLoader color="#ffffff" size={20} />
                        <span>Memproses Pembayaran...</span>
                    </>
                ) : (
                    <>
                        <span>Bayar Sekarang via Xendit</span>
                        <i className="ri-arrow-right-line"></i>
                    </>
                )}
            </button>
          </form>
        </div>

        {/* --- KOLOM KANAN: INFO --- */}
        <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-6 shadow-lg h-full relative overflow-hidden">
                {/* Dekorasi Background */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute -left-10 bottom-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4">Informasi Penting</h3>
                    <ul className="space-y-4 text-sm text-blue-50">
                        <li className="flex gap-3">
                            <i className="ri-shield-check-line text-xl"></i>
                            <span>Pembayaran aman & terverifikasi otomatis oleh sistem.</span>
                        </li>
                        <li className="flex gap-3">
                            <i className="ri-time-line text-xl"></i>
                            <span>NIPL akan aktif instan setelah pembayaran berhasil.</span>
                        </li>
                        <li className="flex gap-3">
                            <i className="ri-whatsapp-line text-xl"></i>
                            <span>Pastikan nomor telepon aktif untuk menerima notifikasi.</span>
                        </li>
                    </ul>

                    <div className="mt-8 pt-6 border-t border-blue-500/30">
                        <p className="text-xs opacity-70 mb-1">Butuh bantuan?</p>
                        <p className="font-semibold">+62 812-3456-7890</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}