"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { pusher } from "@/utils/pusher";
import { Plus } from "lucide-react";
import Link from "next/link";

interface LelangBarang {
  id: number;
  gambar_barang: string;
  nama_barang: string;
  deskripsi: string;
  kategori_id: number;
  harga_awal: number;
  waktu_mulai: string;
  waktu_selesai: string;
  status: "aktif" | "selesai" | "dibatalkan";
  category?: {
    id: number;
    nama_kategori: string;
  };
}

const STATUS_STYLES: Record<string, string> = {
  aktif: "bg-green-100 text-green-600 border border-green-300",
  selesai: "bg-gray-100 text-gray-600 border border-gray-300",
  dibatalkan: "bg-red-100 text-red-600 border border-red-300",
};

const formatCurrency = (value: number) =>
  `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

export default function Home() {
  const [data, setData] = useState<LelangBarang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setData(result?.data ?? result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const channel = pusher.subscribe("lelang");
    fetchBarang();

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

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* HEADER */}
      <section className="font-poppins mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Asset Lelang</h1>

          <Link href="/user/nipl/create">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all shadow-md">
              <Plus size={18} /> Buat NIPL
            </button>
          </Link>
        </div>
      </section>

      {/* LIST CARD */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(item => (
          <div
            key={item.id}
            className="group bg-white rounded-lg shadow hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200"
          >
            {/* IMAGE */}
            <div className="relative w-full h-56 overflow-hidden bg-gray-100">
              <Image
                src={`http://127.0.0.1:8000/${item.gambar_barang}`}
                alt={item.nama_barang}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* STATUS BADGE */}
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[item.status]}`}
                >
                  {item.status.toUpperCase()}
                </span>
              </div>

              {/* DARK GRADIENT HOVER */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-4">
              {/* HARGA */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                <p className="text-xs text-gray-500">Harga Awal</p>
                <p className="text-xl font-semibold text-blue-700 mt-1">
                  {formatCurrency(item.harga_awal)}
                </p>
              </div>

              {/* TITLE + CATEGORY */}
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
                  {item.nama_barang}
                </h2>

                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 border border-blue-300">
                  {item.category?.nama_kategori || "Kategori?"}
                </span>
              </div>

              {/* PERIODE */}
              <div className="text-gray-600 text-xs space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Mulai:</span>{" "}
                  {formatDate(item.waktu_mulai)}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Selesai:</span>{" "}
                  {formatDate(item.waktu_selesai)}
                </p>
              </div>

              {/* BUTTON */}
              <Link href={`/user/asset/${item.id}`} className="block">
                <button className="w-full text-center py-2 text-sm font-medium rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                  {item.status === "aktif"
                    ? "Ikuti Lelang"
                    : item.status === "selesai"
                    ? "Lihat Hasil"
                    : "Detail"}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
