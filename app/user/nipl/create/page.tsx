"use client";

import { useState } from "react";
import { createNipl } from "../services/niplService";


export default function NiplForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email") as string,
      no_rekening: formData.get("no_rekening") as string,
      bank: formData.get("bank") as string,
      no_telepon: formData.get("no_telepon") as string,
    };

    try {
      const token = localStorage.getItem("auth_token") || "";
      const res = await createNipl(payload, token);
      setMessage(res.message);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
      <input type="email" name="email" placeholder="Email" required className="border p-2" />
      <input type="text" name="no_rekening" placeholder="No Rekening" required className="border p-2" />
      <input type="text" name="bank" placeholder="Bank" required className="border p-2" />
      <input type="text" name="no_telepon" placeholder="No Telepon" required className="border p-2" />
      
      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
        {loading ? "Membuat..." : "Buat NIPL"}
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </form>
  );
}
