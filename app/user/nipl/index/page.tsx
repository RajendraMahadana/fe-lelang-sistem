"use client";

import { useEffect, useState } from "react";
import { getNiplList } from "../services/niplService";

export interface Nipl {
  id: number;
  user_id: number;
  no_nipl: string;
  email: string;
  no_rekening: string;
  bank: string;
  no_telepon: string;
  created_at: string;
  updated_at: string;
}


export default function NiplList() {
  const [data, setData] = useState<Nipl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token") || "";
        const res = await getNiplList(token);
        setData(res.data); // backend kirim { message, data }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading daftar NIPL...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-3">Daftar NIPL</h2>
      {data.length === 0 ? (
        <p>Belum ada NIPL</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.id} className="border p-3 rounded">
              <p><strong>No NIPL:</strong> {item.no_nipl}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Bank:</strong> {item.bank}</p>
              <p><strong>No Rekening:</strong> {item.no_rekening}</p>
              <p><strong>No Telepon:</strong> {item.no_telepon}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
