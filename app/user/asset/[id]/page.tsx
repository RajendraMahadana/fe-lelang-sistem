"use client";

import LoadingDetailAsset from "@/app/components/user/Loading/LoadingDetailAsset";
import { Heart, Share2, Tags } from "lucide-react";
import Image from "next/image";
import { JSX, use } from "react";
import { useEffect, useState, useCallback } from "react";

/* --- INTERFACE --- */
interface LelangBarang {
  id: number;
  gambar_barang: string;
  nama_barang: string;
  deskripsi: string;
  kategori_id: number;
  harga_awal: number;
  harga_akhir?: number;
  waktu_mulai: string;
  waktu_selesai: string;
  status: "aktif" | "selesai" | "dibatalkan";
  category?: {
    id: number;
    nama_kategori: string;
  };
}

/* --- STATUS STYLE --- */
const STATUS_STYLES: Record<LelangBarang["status"], string> = {
  aktif: "bg-green-400 text-white",
  selesai: "bg-gray-300 text-gray-600",
  dibatalkan: "bg-red-300 text-red-600",
};

/* --- MAIN COMPONENT --- */
export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [data, setData] = useState<LelangBarang | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /* --- FORMATTER --- */
  const formatCurrency = (value: number) =>
    `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* --- FETCH DATA --- */
  const fetchBarang = useCallback(async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/lelang-barang/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!res.ok) throw new Error("Gagal fetch data");

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchBarang();
  }, [fetchBarang]);

  /* --- RENDER LOADING --- */
  if (!data) {
    return <LoadingDetailAsset />;
  }

  return (
    <section className="font-poppins flex gap-4">
      {/* Kartu Detail Barang */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-5 lg:p-12 flex flex-col justify-between space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row lg:flex-row-reverse gap-8 lg:justify-between">
            {/* Gambar */}
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={`http://127.0.0.1:8000/${data.gambar_barang}`}
                alt={data.nama_barang}
                width={500}
                height={500}
                className="object-cover aspect-video"
              />
            </div>

            {/* Info Barang */}
            <div className="flex flex-col w-full lg:w-1/2">
              {/* Judul + Status */}
              <div className="flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-5">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center rounded-sm px-4 py-2 text-xs font-medium ${STATUS_STYLES[data.status]}`}
                  >
                    {data.status}
                  </span>
                  <button className="hover:bg-gray-100 p-3 hover:text-red-600 rounded-full">
                    <Heart />
                  </button>
                  <button className="hover:bg-gray-100 p-3 hover:text-blue-600 rounded-full">
                    <Share2 />
                  </button>
                </div>
                <h1 className="text-3xl font-medium leading-tight">{data.nama_barang}</h1>
              </div>

              {/* Kategori */}
              <div className="flex items-center gap-2 mb-6 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Tags size={16} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium">
                  {data.category?.nama_kategori || "Tidak ada kategori"}
                </span>
              </div>

              {/* Harga Awal */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Harga Awal</span>
                <div className="text-xl font-medium text-gray-900 mt-1">
                  {formatCurrency(data.harga_awal)}
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1">
                <h2 className="text-lg font-medium text-gray-900">Deskripsi</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{data.deskripsi}</p>
              </div>
            </div>
          </div>

          {/* Waktu Lelang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TimeCard title="Waktu Mulai" date={data.waktu_mulai} formatDate={formatDate} formatTime={formatTime} />
            <TimeCard title="Waktu Selesai" date={data.waktu_selesai} formatDate={formatDate} formatTime={formatTime} />
          </div>
        </div>
      </div>

      {/* Kartu Tawaran */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-5">
        {/* Harga Tertinggi */}
        {data.harga_akhir && (
          <div>
            <span className="text-sm font-medium text-gray-600">Harga Tertinggi Saat Ini</span>
            <div className="text-xl font-bold text-green-600 mt-1">
              {formatCurrency(data.harga_akhir)}
            </div>
          </div>
        )}

        {/* Form Tawaran */}
        <div className="mt-4">
          {data.status === "aktif" ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const harga = (e.currentTarget.elements.namedItem("harga") as HTMLInputElement).value;
                if (!harga) return;

                setLoading(true);
                setMessage(null);
                try {
                  const res = await fetch(`http://127.0.0.1:8000/api/harga-bid`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                    },
                    body: JSON.stringify({
                      harga: Number(harga),
                      lelang_id: data.id,
                    }),
                  });

                  const result = await res.json();
                  if (!res.ok) throw new Error(result.message || "Gagal submit tawaran");

                  setMessage(result.message);
                  await fetchBarang(); // update harga_akhir
                } catch (err: any) {
                  setMessage(err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className=" "
            >
              <input
                type="number"
                name="harga"
                min={data.harga_akhir ?? data.harga_awal}
                placeholder="Masukkan harga tawaran"
                className="flex-1 border rounded-md px-4 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 w-full rounded-md hover:bg-gray-700 transition"
                disabled={loading}
              >
                {loading ? "Mengajukan..." : "Ajukan Tawaran"}
              </button>
            </form>
          ) : (
            <DisabledButton />
          )}

          {message && <p className="text-center text-sm mt-2 text-blue-600">{message}</p>}
        </div>
      </div>
    </section>
  );
}

/* --- REUSABLE COMPONENTS --- */
function TimeCard({
  title,
  date,
  formatDate,
  formatTime,
}: {
  title: string;
  date: string;
  formatDate: (d: string) => string;
  formatTime: (d: string) => string;
}) {
  return (
    <div className="bg-gray-50 rounded-md p-4 shadow">
      <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
      <div className="text-gray-900 font-semibold">{formatDate(date)}</div>
      <div className="text-sm text-gray-600">{formatTime(date)}</div>
    </div>
  );
}

function DisabledButton() {
  return (
    <button
      className="w-full bg-gray-300 text-gray-500 py-4 px-8 rounded-2xl font-semibold text-lg cursor-not-allowed flex items-center justify-center gap-3"
      disabled
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      Lelang Telah Ditutup
    </button>
  );
}
