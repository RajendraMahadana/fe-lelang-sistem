"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash } from "lucide-react";
import ModalUpdate from "@/app/components/admin/Modal";
import { pusher } from "@/utils/pusher";

interface LelangBarang {
  id: number;
  gambar_barang: string;
  nama_barang: string;
  deskripsi: string;
  harga_awal: number;
  waktu_mulai: string;
  waktu_selesai: string;
  status: 'aktif' | 'selesai' | 'dibatalkan';
}


export default function DataTable()  {
  const [data, setData] = useState<LelangBarang[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarang, setSelectedBarang] = useState<LelangBarang | null>(null);

  const fetchBarang = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/lelang-barang", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!res.ok) throw new Error("Gagal fetch data");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   

    const channel = pusher.subscribe("lelang");
    fetchBarang();
    // handler terpisah supaya bisa unbind secara spesifik
    const onLelangSelesai = (payload: { lelangId: number; status: "aktif" | "selesai" | "dibatalkan" }) => {
      setData(prev =>
        prev.map(l => (l.id === payload.lelangId ? { ...l, status: payload.status } : l))
      );
    };

    channel.bind("LelangUpdateStatusEvent", onLelangSelesai);

    return () => {
      channel.unbind("LelangUpdateStatusEvent", onLelangSelesai);
      pusher.unsubscribe("lelang");
    };
  }, []);

  if (loading) return <p>Loading...</p>;


  return (
    <section>
      <div>
        <Link href={`/admin/asset/create-lelang`}>
          <button className="bg-indigo-800 px-4 py-2 text-white rounded-md text-sm cursor-pointer">Add</button>
        </Link>
      </div>
      <div className="mt-3 bg-gray-100 ">
        <table className="overflow-hidden w-full rounded-lg shadow">
          <thead className="bg-gray-800 text-zinc-200">
            <tr className="text-sm font-light">
              <th className="py-2 px-4 text-start">ID</th>
              <th className="py-2 px-4 text-start">Gambar</th>
              <th className="py-2 px-4 text-start">Nama Barang</th>
              <th className="py-2 px-4 text-start">Harga Awal</th>
              <th className="py-2 px-4 text-start">Waktu Mulai</th>
              <th className="py-2 px-4 text-start">Waktu Selesai</th>
              <th className="py-2 px-4 text-start">Status</th>
              <th className="py-2 px-4 text-start">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-t border-gray-300 text-xs">
                  <td className="py-2 px-4 text-start">{item.id}</td>
                  <td className="py-2 px-4 text-start">
                    <Image
                      src={`http://127.0.0.1:8000/${item.gambar_barang}`}
                      alt={item.nama_barang}
                      width={200}
                      height={200}
                      className="w-15 h-15 object-cover aspect-square rounded-md"
                    />
                  </td>
                  <td className="py-2 px-4 text-start">{item.nama_barang}</td>
                  <td className="py-2 px-4 text-start">Rp {item.harga_awal.toLocaleString()}</td>
                  <td className="py-2 px-4 text-start">{new Date(item.waktu_mulai).toLocaleString()}</td>
                  <td className="py-2 px-4 text-start">{new Date(item.waktu_selesai).toLocaleString()}</td>
                  <td className="py-2 px-4 text-start">
                  <div className="flex items-center font-montserrat space-x-2">
                    {/* Titik warna */}
                    <span
                      className={`w-3 h-3 rounded-full font-light ${
                        item.status === 'aktif'
                          ? 'bg-green-500/70 outline outline-green-400 shadow shadow-green-500'
                          : item.status === 'selesai'
                          ? 'bg-gray-500/70 outline outline-gray-400 shadow shadow-gray-500'
                          : 'bg-red-500'
                      }`}
                    ></span>
                    {/* Teks status dengan warna sama */}
                    <span
                      className={`text-xs font-medium ${
                        item.status === 'aktif'
                          ? 'text-green-500'
                          : item.status === 'selesai'
                          ? 'text-gray-500'
                          : 'text-red-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </td>
                  <td className="py-2 px-4 text-start space-x-2">
                    <button
                      className="p-2 bg-blue-500 cursor-pointer shadow hover:bg-blue-700 text-white rounded"
                      onClick={() => setSelectedBarang(item)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="bg-red-600 cursor-pointer hover:bg-red-700 text-white p-2 rounded-md shadow text-xs"
                      onClick={async () => {
                        if (confirm("Yakin ingin menghapus data ini?")) {
                          try {
                            const res = await fetch(
                              `http://127.0.0.1:8000/api/lelang-barang/${item.id}/barang`,
                              {
                                method: "DELETE",
                                headers: {
                                  Accept: "application/json",
                                  Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                                },
                              }
                            );
                            if (!res.ok) throw new Error("Gagal menghapus data");
                            setData((prev) => prev.filter((d) => d.id !== item.id));
                          } catch {
                            alert("Gagal menghapus data");
                          }
                        }
                      }}
                    >
                      <Trash size={16}/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Update */}
      {selectedBarang && (
        <ModalUpdate
          barang={selectedBarang}
          onClose={() => setSelectedBarang(null)}
          onSuccess={fetchBarang}
        />
      )}
    </section>
  );
}
