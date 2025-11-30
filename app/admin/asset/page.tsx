"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownToLine, ChevronDown, Pencil, Plus, Trash, Package, Clock, DollarSign, Filter, Search, Download, Upload } from "lucide-react";
import ModalUpdate from "@/app/components/admin/Modal/Asset/ModalEditAsset";
import { pusher } from "@/utils/pusher";

interface LelangBarang {
  id: number;
  gambar_barang: string;
  nama_barang: string;
  deskripsi: string;
  kategori_id: number;
  harga_awal: number;
  waktu_mulai: string;
  waktu_selesai: string;
  status: 'aktif' | 'selesai' | 'dibatalkan';
  category?: {
    id: number;
    nama_kategori: string;
  };
}

export default function DataTable() {
  const [data, setData] = useState<LelangBarang[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarang, setSelectedBarang] = useState<LelangBarang | null>(null);
  const [open, setOpen] = useState(false);

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
      setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      aktif: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
      selesai: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" },
      dibatalkan: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-2`}>
        <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const statsData = {
    total: data.length,
    aktif: data.filter(item => item.status === 'aktif').length,
    selesai: data.filter(item => item.status === 'selesai').length,
  };

  return (
    <section className="font-poppins">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Asset Lelang</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola semua asset lelang dalam sistem</p>
          </div>
        </div>

        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari asset..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="px-4 py-2 flex gap-2 items-center bg-white border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Menu <ChevronDown size={16} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-sm rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                  <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <Upload size={16} className="text-gray-600" />
                    Import Data
                  </a>
                  <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100">
                    <Download size={16} className="text-gray-600" />
                    Export Data
                  </a>
                </div>
              )}
            </div>

            <Link href={`/admin/asset/create-lelang`}>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white flex items-center gap-2 rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium">
                <Plus size={18} /> Tambah Asset
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gambar</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Barang</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kategori</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Harga Awal</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Waktu Mulai</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Waktu Selesai</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                      <p className="text-gray-500 text-sm">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">#{item.id}</td>
                    <td className="py-4 px-6">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                        <Image
                          src={`http://127.0.0.1:8000/storage/${item.gambar_barang}`}
                          alt={item.nama_barang}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-gray-900">{item.nama_barang}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.deskripsi}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {item.category?.nama_kategori || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.harga_awal)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={14} className="text-gray-400" />
                        {formatDateTime(item.waktu_mulai)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={14} className="text-gray-400" />
                        {formatDateTime(item.waktu_selesai)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm hover:shadow group"
                          onClick={() => setSelectedBarang(item)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm hover:shadow group"
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
                          title="Hapus"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Package size={48} className="text-gray-300" />
                      <div>
                        <p className="text-gray-900 font-semibold">Tidak ada data</p>
                        <p className="text-gray-500 text-sm mt-1">Belum ada asset lelang yang terdaftar</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold">{data.length}</span> asset
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors">
                Sebelumnya
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Selanjutnya
              </button>
            </div>
          </div>
        )}
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