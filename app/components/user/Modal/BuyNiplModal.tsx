"use client";

import { useState } from "react";

export default function LelangPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState("");
  const [hasNipl, setHasNipl] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // simulasi proses pembuatan NIPL
      await new Promise((res) => setTimeout(res, 1500));

      setHasNipl(true);
      setShowModal(false);
      alert("NIPL Anda berhasil dibuat!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat membuat NIPL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Ikut Lelang Barang</h1>

        {!hasNipl ? (
          <>
            <p className="text-gray-600 mb-4">
              Untuk mengikuti lelang, Anda perlu memiliki NIPL (Nomor Identitas Peserta Lelang).
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
            >
              Beli NIPL Sekarang
            </button>
          </>
        ) : (
          <p className="text-green-600 font-semibold">
            ✅ NIPL Anda aktif! Silakan lanjut mengikuti lelang.
          </p>
        )}
      </div>

      {/* Modal Manual */}
      {showModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => !loading && setShowModal(false)}
          ></div>

          {/* Modal Box */}
          <div className="fixed z-50 inset-0 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
              <h2 className="text-xl font-semibold text-center mb-2">
                Buat NIPL Baru
              </h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                NIPL (Nomor Identitas Peserta Lelang) diperlukan untuk mengikuti
                pelelangan.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Harga NIPL</label>
                  <input
                    type="text"
                    value="Rp 25.000"
                    disabled
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
                  <select
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">-- Pilih Metode --</option>
                    <option value="bank">Transfer Bank</option>
                    <option value="ewallet">E-Wallet (DANA, OVO, GoPay)</option>
                    <option value="qris">QRIS</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => !loading && setShowModal(false)}
                  className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !payment}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    loading || !payment
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Memproses..." : "Beli & Aktifkan"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
