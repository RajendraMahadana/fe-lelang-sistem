/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingDetailAsset from "@/app/components/user/Loading/LoadingDetailAsset";
import { Heart, Share2, Tags, AlertCircle, CheckCircle, XCircle, Lock } from "lucide-react";
import Image from "next/image";
import { use } from "react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

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

interface AlertMessage {
  type: "success" | "error" | "warning" | "nipl_required";
  message: string;
  additionalData?: any;
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
  const router = useRouter();

  const [data, setData] = useState<LelangBarang | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

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

  /* --- HANDLE SUBMIT BID --- */
  const handleSubmitBid = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const harga = (e.currentTarget.elements.namedItem("harga") as HTMLInputElement).value;
    if (!harga) return;

    setLoading(true);
    setAlertMessage(null);

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
          lelang_id: data?.id,
        }),
      });

      const result = await res.json();

      // Handle different response statuses
      if (res.status === 403) {
        // Check if it's NIPL required error
        if (result.message.toLowerCase().includes("nipl")) {
          setAlertMessage({
            type: "nipl_required",
            message: result.message,
          });
        } else if (result.message.toLowerCase().includes("lelang telah ditutup")) {
          setAlertMessage({
            type: "warning",
            message: result.message,
          });
        } else {
          setAlertMessage({
            type: "error",
            message: result.message,
            additionalData: result["harga tertinggi saat ini"],
          });
        }
      } else if (res.status === 422) {
        setAlertMessage({
          type: "error",
          message: result.message || "Data yang dimasukkan tidak valid",
        });
      } else if (res.ok) {
        setAlertMessage({
          type: "success",
          message: result.message,
        });
        await fetchBarang(); // Update harga_akhir
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(result.message || "Gagal submit tawaran");
      }
    } catch (err: any) {
      setAlertMessage({
        type: "error",
        message: err.message || "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* --- RENDER LOADING --- */
  if (!data) {
    return <LoadingDetailAsset />;
  }

  return (
    <section className="font-poppins max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kartu Detail Barang - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              {/* Gambar */}
              <div className="lg:w-1/2">
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={`http://127.0.0.1:8000/storage/${data.gambar_barang}`}
                    alt={data.nama_barang}
                    width={500}
                    height={500}
                    className="object-cover aspect-video w-full"
                  />
                </div>
              </div>

              {/* Info Barang */}
              <div className="lg:w-1/2 flex flex-col">
                {/* Judul + Action Buttons */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 leading-tight">
                    {data.nama_barang}
                  </h1>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="hover:bg-gray-100 p-2 hover:text-red-600 rounded-full transition">
                      <Heart size={20} />
                    </button>
                    <button className="hover:bg-gray-100 p-2 hover:text-blue-600 rounded-full transition">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold ${STATUS_STYLES[data.status]} uppercase tracking-wide`}
                  >
                    {data.status}
                  </span>
                </div>

                {/* Kategori */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Tags size={18} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {data.category?.nama_kategori || "Tidak ada kategori"}
                  </span>
                </div>

                {/* Harga Awal */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Harga Awal
                  </span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(data.harga_awal)}
                  </div>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {data.deskripsi}
              </p>
            </div>

            {/* Waktu Lelang */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Waktu Lelang</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TimeCard
                  title="Waktu Mulai"
                  date={data.waktu_mulai}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
                <TimeCard
                  title="Waktu Selesai"
                  date={data.waktu_selesai}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kartu Tawaran - Sticky sidebar on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Buat Tawaran</h2>

              {/* Harga Tertinggi */}
              {data.harga_akhir && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                    Harga Tertinggi Saat Ini
                  </span>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {formatCurrency(data.harga_akhir)}
                  </div>
                </div>
              )}

              {/* Form Tawaran */}
              <div>
                {data.status === "aktif" ? (
                  <form onSubmit={handleSubmitBid} className="space-y-4">
                    <div>
                      <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-2">
                        Masukkan Tawaran Anda
                      </label>
                      <input
                        type="number"
                        name="harga"
                        id="harga"
                        min={data.harga_akhir ?? data.harga_awal}
                        placeholder="Contoh: 5000000"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum: {formatCurrency(data.harga_akhir ?? data.harga_awal)}
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? "Mengajukan..." : "Ajukan Tawaran"}
                    </button>
                  </form>
                ) : (
                  <DisabledButton />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Modals */}
      {alertMessage && (
        <AlertModal
          alert={alertMessage}
          onClose={() => setAlertMessage(null)}
          onNavigateToNIPL={() => router.push("/user/nipl")}
        />
      )}
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
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </div>
      <div className="text-base font-semibold text-gray-900">{formatDate(date)}</div>
      <div className="text-sm text-gray-600 mt-1">{formatTime(date)}</div>
    </div>
  );
}

function DisabledButton() {
  return (
    <button
      className="w-full bg-gray-200 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
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

/* --- ALERT MODAL WITH DIFFERENT TYPES --- */
function AlertModal({
  alert,
  onClose,
  onNavigateToNIPL,
}: {
  alert: AlertMessage;
  onClose: () => void;
  onNavigateToNIPL: () => void;
}) {
  const getModalConfig = () => {
    switch (alert.type) {
      case "success":
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />,
          title: "Berhasil!",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          buttonColor: "bg-green-600 hover:bg-green-700",
        };
      case "error":
        return {
          icon: <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
          title: "Tawaran Gagal",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          buttonColor: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />,
          title: "Perhatian",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          buttonColor: "bg-orange-600 hover:bg-orange-700",
        };
      case "nipl_required":
        return {
          icon: <Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />,
          title: "NIPL Diperlukan",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          icon: <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />,
          title: "Notifikasi",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          buttonColor: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  const config = getModalConfig();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
        {/* Header with colored background */}
        <div className={`${config.bgColor} border-b ${config.borderColor} px-6 pt-6 pb-4 rounded-t-2xl`}>
          {config.icon}
          <h2 className="text-2xl font-bold text-gray-800 text-center">{config.title}</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 text-center leading-relaxed mb-2">
            {alert.message}
          </p>
          
          {/* Additional data for error messages */}
          {alert.additionalData && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-semibold">Harga tertinggi saat ini:</span>
                <br />
                <span className="text-lg font-bold text-gray-800">
                  Rp {new Intl.NumberFormat("id-ID").format(alert.additionalData)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          {alert.type === "nipl_required" ? (
            <div className="space-y-3">
              <button
                onClick={onNavigateToNIPL}
                className={`w-full ${config.buttonColor} text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2`}
              >
                <Lock size={18} />
                Buat NIPL Sekarang
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition"
              >
                Nanti Saja
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className={`w-full ${config.buttonColor} text-white font-semibold px-6 py-3 rounded-lg transition`}
            >
              {alert.type === "success" ? "OK, Mengerti" : "Tutup"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

