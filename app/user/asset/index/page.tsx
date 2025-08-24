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
  aktif: "bg-green-300 text-green-600",
  selesai: "bg-gray-300 text-gray-600",
  dibatalkan: "bg-red-300 text-red-600",
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
        setData(result);
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
      <section className="font-poppins mb-8">
        <div className="flex justify-between items-center">

        <div>
          <h1 className="text-xl mb-2">Asset Lelang</h1>
        </div>
        <div>
          <Link href={`/user/nipl/create`} className="">
          <button className="flex items-center gap-1 cursor-pointer rounded-sm px-4 py-2 text-sm text-white bg-gray-800">
            <Plus size={18}></Plus>  Buat NIPL
          </button>
          </Link>
        </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 font-poppins lg:grid-cols-3 gap-4">
        {data.map(item => (
          <div
            key={item.id}
            className="group bg-white rounded-md shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="relative w-full h-52 overflow-hidden bg-gray-100">
              <Image
                src={`http://127.0.0.1:8000/${item.gambar_barang}`}
                alt={item.nama_barang}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-sm text-xs font-medium ${STATUS_STYLES[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-5 space-y-3">
              <div className="bg-gray-800 p-3 rounded-sm text-white">
                <p className="text-xs mb-1">Harga Awal</p>
                <p className="text-xl">{formatCurrency(item.harga_awal)}</p>
              </div>

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {item.nama_barang}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <p className="text-sm text-gray-600 font-medium">
                    {item.category?.nama_kategori || "Kategori tidak tersedia"}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">Periode Lelang</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Mulai:</span> {formatDate(item.waktu_mulai)}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Selesai:</span> {formatDate(item.waktu_selesai)}
                  </p>
                </div>
              </div>

              <Link href={`/user/asset/${item.id}`} className="block w-full">
  <button className="w-full outline rounded-sm text-blue-600 outline-blue-600 py-2 text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors duration-200 text-center">
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
