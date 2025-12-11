// app/admin/asset/page.tsx
// ⚠️ Catatan: Nanti pindah ke app/admin/lelang/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownToLine, ChevronDown, Pencil, Plus, Trash, Package, Clock, DollarSign, Filter, Search, Download, Upload, CardSim, WalletCards, Currency, BadgeDollarSignIcon, CircleDollarSign, ChevronUp, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { fetchCategoriesAction } from "@/lib/actions/category";
import ModalUpdate from "@/app/components/admin/Modal/Asset/ModalEditAsset";
import { pusher } from "@/utils/pusher";
import { LelangBarang } from "@/lib/types/lelang";
import { deleteLelangAction } from "@/lib/actions/lelang";
import { Happy_Monkey } from "next/font/google";
import React from "react";
import { Category } from "@/lib/types/category";
import { useRouter } from "next/navigation";

interface DataTableProps {
  initialData: LelangBarang[];
}

export default function DataTable({ initialData }: DataTableProps) {
  const [data, setData] = useState<LelangBarang[]>(initialData);
  const [selectedBarang, setSelectedBarang] = useState<LelangBarang | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  type SortField = 'harga_awal' | 'harga_akhir' | 'created_at';
  type SortDirection = 'asc' | 'desc';

  // Ambil semua kategori unik dari data (termasuk handling null/undefined)
  const categories = Array.from(
    new Set(
      data
        .map(item => item.category?.nama_kategori || "Tanpa Kategori")
        .filter(Boolean)
    )
  );

  const [sortConfig, setSortConfig] = useState<{
      field: SortField;
      direction: SortDirection;
  } | null>(null);

  const handleClick = () => {
    setIsLoading(true);
    // Opsional: Simulasi delay (misalnya jika ada validasi async)
    // setTimeout(() => {
    //   router.push('/admin/asset/create-lelang');
    // }, 500);
    
    // Biasanya langsung redirect:
    router.push('/admin/asset/create-lelang');
    // setIsLoading(false); // Tidak perlu — karena halaman akan pindah
  };

  // ✅ Real-time update via Pusher (boleh di client)
  useEffect(() => {
    const channel = pusher.subscribe("lelang");
    
    const onLelangUpdate = (payload: { lelangId: number; status: "aktif" | "selesai" | "dibatalkan" }) => {
      setData(prev =>
        prev.map(l => l.id === payload.lelangId ? { ...l, status: payload.status } : l)
      );
    };

    channel.bind("LelangUpdateStatusEvent", onLelangUpdate);

    return () => {
      channel.unbind("LelangUpdateStatusEvent", onLelangUpdate);
      pusher.unsubscribe("lelang");
    };
  }, []);


   useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategoriesAction();
        if (categoriesData) {
          setAllCategories(categoriesData);
        }
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      }
    };
    
    loadCategories();
  }, []);

    const categoryNames = Array.from(
    new Set(
      data
        .map(item => item.category?.nama_kategori || "Tanpa Kategori")
        .filter(Boolean)
    )
  );

  // 🔍 Filter dulu (search & kategori)
const preSortedData = data.filter(item => {
  const matchesSearch =
    item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category?.nama_kategori || "").toLowerCase().includes(searchQuery.toLowerCase());

  const matchesCategory =
    selectedCategory === null ||
    (item.category?.nama_kategori || "Tanpa Kategori") === selectedCategory;

  return matchesSearch && matchesCategory;
});

  // 🔁 Lalu sort
  const filteredData = React.useMemo(() => {
  if (!sortConfig) return preSortedData;

  const { field, direction } = sortConfig; // ✅ safe destructuring

  return [...preSortedData].sort((a, b) => {
    if (field === 'harga_awal') {
      return direction === 'asc' 
        ? a.harga_awal - b.harga_awal 
        : b.harga_awal - a.harga_awal;
      
    } else if (field === 'harga_akhir') {
      const isANull = a.harga_akhir === 0 || a.harga_akhir === null;
      const isBNull = b.harga_akhir === 0 || b.harga_akhir === null;
      
      if (isANull && !isBNull) return direction === 'asc' ? 1 : -1;
      if (!isANull && isBNull) return direction === 'asc' ? -1 : 1;
      if (isANull && isBNull) return 0;
      
      return direction === 'asc'
        ? a.harga_akhir! - b.harga_akhir!
        : b.harga_akhir! - a.harga_akhir!;

    } else if (field === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    return 0;
  });
}, [preSortedData, sortConfig]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSort = (field: SortField) => {
    if (!field) return;

    setSortConfig(prev => {
      if (!prev || prev.field !== field) {
        // First click: sort ascending
        return { field, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        // Second click: sort descending
        return { field, direction: 'desc' };
      }
      // Third click: reset
      return null;
    });
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
    let bg: string, text: string, dot: string;

    switch (status) {
      case 'aktif':
        bg = 'bg-green-100';
        text = 'text-green-700';
        dot = 'bg-green-500';
        break;
      case 'dibatalkan':
        bg = 'bg-red-100';
        text = 'text-red-700';
        dot = 'bg-red-500';
        break;
      default: // 'selesai' atau status tidak dikenal
        bg = 'bg-gray-100';
        text = 'text-gray-700';
        dot = 'bg-gray-500';
    }

    return (
      <span className={`${bg} ${text} px-3 py-1 rounded-sm text-xs font-medium inline-flex items-center gap-2`}>
        <span className={`w-2 h-2 rounded-full ${dot}`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // ✅ Optimistic delete
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus lelang ini? Semua data terkait akan hilang.")) return;

    // Optimistic update
    const prevData = data;
    setData(prev => prev.filter(item => item.id !== id));

    try {
      const success = await deleteLelangAction(id);
      if (!success) throw new Error();
      toast.success("Lelang berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus lelang");
      setData(prevData); // rollback
    }
  };

  const stats = {
    total: data.length,
    aktif: data.filter(item => item.status === 'aktif').length,
    selesai: data.filter(item => item.status === 'selesai').length,
    
    // ✅ Total harga awal (semua)
    totalHargaAwal: data.reduce((sum, item) => sum + item.harga_awal, 0),
    
    // ✅ Total harga akhir (hanya yang tidak null & status 'selesai')
    totalHargaAkhir: data.reduce((sum, item) => sum + (item.harga_akhir ?? 0), 0),
  };

  return (
    <section className="font-poppins">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Data Asset Lelang</h1>
            {/* <p className="text-sm text-gray-500">Kelola semua asset lelang dalam sistem</p> */}
          </div>
        </div>

        {/* Stats Cards (opsional) */}

      <div className="">

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            
            <div>
              <p className="text-xs mb-2 font-medium tracking-wide">TOTAL ASSET</p>
              <p className="text-xl font-medium text-gray-900">{stats.total}</p>
            </div>

            <div className="p-2 bg-blue-100 outline outline-blue-300 rounded-md">
              <Package className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between gap-3">
            
            <div>
              <p className="text-xs mb-2 font-medium tracking-wide">AKTIF</p>
              <p className="text-xl font-medium text-gray-900">{stats.aktif}</p>
            </div>

            <div className="p-2 bg-green-100 outline outline-green-300 rounded-md">
              <ArrowDownToLine className="text-green-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between gap-3">
            
            <div>
              <p className="text-xs mb-2 font-medium tracking-wide">SELESAI</p>
              <p className="text-xl font-medium text-gray-900">{stats.selesai}</p>
            </div>

            <div className="p-2 bg-gray-100 outline outline-gray-300 rounded-md">
              <Clock className="text-gray-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide mb-2">TOTAL HARGA AWAL</p>
            <p className="text-xl font-medium text-gray-900">
              {formatCurrency(stats.totalHargaAwal)}
            </p>
          </div>
          <div className="p-2 bg-yellow-100 outline outline-yellow-300 rounded-md">
            <DollarSign className="text-yellow-600" size={20} />
          </div>
        </div>
        </div>
        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-wide mb-2">TOTAL HARGA TERTINGGI</p>
              <p className="text-xl font-medium text-gray-900">
                {formatCurrency(stats.totalHargaAkhir)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {/* ({data.filter(i => i.status === 'selesai' && i.harga_akhir).length} lelang selesai) */}
              </p>
            </div>
            <div className="p-2 bg-emerald-100 outline outline-emerald-300 rounded-md">
              <BadgeDollarSignIcon className="text-emerald-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      </div>


        {/* Action Bar */}
        <div className=" flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-md shadow-sm border border-gray-100 p-4">
          
          <div className="flex justify-between w-full mb-2">

          
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari asset"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-48 sm:w-64"
              />
            </div>
            <span className="text-xs text-gray-500 hidden sm:inline">
              {filteredData.length} dari {data.length} item
            </span>
          </div>

         
             <div className="flex gap-2 items-center">
            {/* Menu dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="px-4 py-2 flex gap-2 items-center bg-white border border-gray-300 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Menu <ChevronDown size={16} />
              </button>
              
              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-sm rounded-lg shadow-md border border-gray-200 z-10 overflow-hidden">
                  <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 w-full text-left">
                    <Upload size={16} className="text-gray-600" />
                    Import Data
                  </button>
                  <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 w-full text-left border-t border-gray-100">
                    <Download size={16} className="text-gray-600" />
                    Export Data
                  </button>
                </div>
              )}
            </div>

            <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${
        isLoading 
          ? 'cursor-not-allowed opacity-75' 
          : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
      } bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white flex items-center gap-2 rounded-md text-sm transition-all shadow-md font-medium`}
    >
      {isLoading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
         Tambah Asset
        </>
      ) : (
        <>
          <Plus size={18} /> Tambah Asset
        </>
      )}
    </button>


          </div>

          </div>

          <div className="flex gap-2">

          {/* Filter Kategori */}
          <div className="relative">
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white appearance-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-33 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          
          <div className="flex gap-2">
  {/* Tombol: Terbaru */}
  <button
    onClick={() => {
      setSortConfig(prev =>
        prev?.field === 'created_at' && prev.direction === 'desc'
          ? null
          : { field: 'created_at', direction: 'desc' }
      );
    }}
    className={`px-4 py-2 text-sm rounded-md font-medium flex items-center gap-1.5 transition-colors ${
      sortConfig?.field === 'created_at' && sortConfig.direction === 'desc'
        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
    }`}
    title="Urutkan: Terbaru (baru → lama)"
  >
    {/* <ArrowDown size={14} className="stroke-current" /> */}
    <Clock size={14} className="stroke-current" />
    <span>Terbaru</span>
  </button>

  {/* Tombol: Terlama */}
  <button
    onClick={() => {
      setSortConfig(prev =>
        prev?.field === 'created_at' && prev.direction === 'asc'
          ? null
          : { field: 'created_at', direction: 'asc' }
      );
    }}
    className={`px-4 py-2 text-sm rounded-md font-medium flex items-center gap-1.5 transition-colors ${
      sortConfig?.field === 'created_at' && sortConfig.direction === 'asc'
        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
    }`}
    title="Urutkan: Terlama (lama → baru)"
  >
    {/* <ArrowUp size={14} className="stroke-current" /> */}
    <Clock size={14} className="stroke-current" />
    <span>Terlama</span>
  </button>
</div>
         
          </div>


           
        </div>
      </div>

      

      {/* Table */}
      
      <div className="bg-white shadow-sm rounded-md border border-gray-200 overflow-hidden">
        <div className="">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gambar</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Barang</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kategori</th>
                <th 
                  title="Klik untuk urutkan"
                  className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer group"
                  onClick={() => handleSort('harga_awal')}
                >
                  <div className="flex items-center gap-[5px]">
                    Harga Awal
                    {sortConfig?.field === 'harga_awal' ? (
                      sortConfig.direction === 'asc' ? (
                        <ChevronDown size={14} className="text-blue-600" />
                      ) : (
                        <ChevronUp size={14} className="text-blue-600" />
                      )
                    ) : (
                      <div>
                      <ChevronUp size={14} className="text-gray-400 group-hover:text-gray-600" />
                      <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                      </div>
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer group"
                  onClick={() => handleSort('harga_akhir')}
                >
                  <div className="flex items-center gap-[5px]">
                    Harga Tertinggi
                    {sortConfig?.field === 'harga_akhir' ? (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUp size={14} className="text-blue-600" />
                      ) : (
                        <ChevronDown size={14} className="text-blue-600" />
                      )
                    ) : (
                      <div>
                      <ChevronUp size={14} className="text-gray-400 group-hover:text-gray-600" />
                      <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                      </div>
                    )}
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Waktu Mulai</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Waktu Selesai</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
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
                          unoptimized // karena dari backend lokal
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-gray-900">{item.nama_barang}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.deskripsi}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-medium bg-blue-50 text-blue-700">
                        {item.category?.nama_kategori || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.harga_awal)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.harga_akhir !== null && item.harga_akhir > 0
                          ? formatCurrency(item.harga_akhir)
                          : "—"}
                      </p>
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
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition-colors shadow-sm hover:shadow group"
                          onClick={() => setSelectedBarang(item)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-sm transition-colors shadow-sm hover:shadow group"
                          onClick={() => handleDelete(item.id)}
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
                      <Search size={48} className="text-gray-300" />
                      <div>
                        <p className="text-gray-900 font-semibold">Tidak ada hasil</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {searchQuery ? "Coba kata kunci lain" : "Belum ada asset lelang"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedBarang && allCategories.length > 0 && (
        <ModalUpdate
          barang={selectedBarang}
          categories={allCategories}
          onClose={() => setSelectedBarang(null)}
          onSuccess={() => {
            // 🔄 Nanti bisa dipanggil dari Server Action via callback
            window.location.reload();
          }}
        />
      )}
      {selectedBarang && allCategories.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}
    </section>
  );
}