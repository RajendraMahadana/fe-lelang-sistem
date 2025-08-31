// app/nipl/page.tsx (atau pages/nipl.tsx kalau pakai pages dir)
"use client";

import { useState } from "react";
import { buyNipl } from "../services/niplService";


export default function NiplPage() {
  const [noTelepon, setPhone] = useState("");

  const handleBuy = async () => {
    try {
      const { invoice_url } = await buyNipl(noTelepon);
      window.location.href = invoice_url; // redirect ke Xendit
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Beli NIPL</h1>
      <input
        type="text"
        placeholder="Nomor Telepon"
        value={noTelepon}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        onClick={handleBuy}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Beli (Rp 25.000)
      </button>
    </div>
  );
}
