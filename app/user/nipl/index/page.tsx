// app/nipl/page.tsx
"use client";

import { useState } from "react";
import { buyNipl } from "../services/niplService";


export default function NiplPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setLoading(true);
      const { invoice_url } = await buyNipl(phone);
      window.location.href = invoice_url; // redirect ke Xendit
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Beli NIPL</h1>
      <input
        type="text"
        placeholder="Nomor Telepon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        onClick={handleBuy}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Beli (Rp 25.000)"}
      </button>
    </div>
  );
}
