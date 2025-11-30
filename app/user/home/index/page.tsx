"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { pusher } from "@/utils/pusher";
import { Plus, Gavel, Clock, TrendingUp, Search, Filter, Grid, List, Tag } from "lucide-react";
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
  aktif: "bg-green-100 text-green-700",
  selesai: "bg-gray-100 text-gray-700",
  dibatalkan: "bg-red-100 text-red-700",
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

  const statsData = {
    total: data.length,
    aktif: data.filter(item => item.status === 'aktif').length,
    selesai: data.filter(item => item.status === 'selesai').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Memuat lelang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins">
  

      {/* Filter Section */}
      <section className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-3 flex-wrap flex-1">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari barang lelang..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter size={18} />
                Filter
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Grid size={20} className="text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <List size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(item => (
          <div
            key={item.id}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Image Section */}
            <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={`http://127.0.0.1:8000/storage/${item.gambar_barang}`}
                alt={item.nama_barang}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${STATUS_STYLES[item.status]}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-4">
              {/* Title & Category */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                  {item.nama_barang}
                </h2>
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600 font-medium px-2 py-1 bg-gray-100 rounded-full">
                    {item.category?.nama_kategori || "Tidak ada kategori"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg text-white shadow-md">
                <p className="text-xs mb-1 text-blue-100 font-medium">Harga Awal</p>
                <p className="text-2xl font-bold">{formatCurrency(item.harga_awal)}</p>
              </div>

              {/* Time Info */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Periode Lelang</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Mulai:</span>
                    <span className="text-gray-700 font-semibold">{formatDate(item.waktu_mulai)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Selesai:</span>
                    <span className="text-gray-700 font-semibold">{formatDate(item.waktu_selesai)}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href={`/user/asset/${item.id}`} className="block w-full">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-200 text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  {item.status === "aktif"
                    ? "🔨 Ikuti Lelang"
                    : item.status === "selesai"
                    ? "📊 Lihat Hasil"
                    : "📄 Detail"}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Gavel size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Lelang</h3>
          <p className="text-gray-500 mb-6">Saat ini belum ada lelang yang tersedia</p>
          <Link href="/user/nipl/create">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2">
              <Plus size={20} />
              Buat NIPL
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}