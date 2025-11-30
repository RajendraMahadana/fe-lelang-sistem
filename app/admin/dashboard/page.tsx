"use client";

import { Gavel, Users, Package, Bell, LogOut, PlusCircle, BarChart3, TrendingUp, Clock, DollarSign, Eye, Trash2, Edit, Search, Filter, Calendar } from "lucide-react";
import { useState } from "react";

export default function DashboardAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const auctionData = [
    { id: 1, name: "Laptop Asus ROG Strix G15", startPrice: 5000000, currentBid: 6500000, status: "active", bids: 23, timeLeft: "2j 34m", image: "💻" },
    { id: 2, name: "iPhone 14 Pro Max 256GB", startPrice: 3200000, currentBid: 4100000, status: "active", bids: 45, timeLeft: "5j 12m", image: "📱" },
    { id: 3, name: "Sony PlayStation 5", startPrice: 4500000, currentBid: 7200000, status: "completed", bids: 67, timeLeft: "Selesai", image: "🎮" },
    { id: 4, name: "Samsung Galaxy Watch 5", startPrice: 1500000, currentBid: 1500000, status: "pending", bids: 0, timeLeft: "Belum dimulai", image: "⌚" },
    { id: 5, name: "Canon EOS R6 Mark II", startPrice: 12000000, currentBid: 14500000, status: "active", bids: 34, timeLeft: "1j 45m", image: "📷" },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-blue-100", text: "text-blue-700", label: "Berlangsung" },
      completed: { bg: "bg-green-100", text: "text-green-700", label: "Selesai" },
      pending: { bg: "bg-gray-100", text: "text-gray-700", label: "Pending" },
    };
    const config = statusConfig[status];
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm font-medium`}>
        {config.label}
      </span>
    );
  };

  const filteredData = auctionData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}

      <div className="p-6 max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Gavel className="text-blue-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Lelang</h3>
            <p className="text-3xl font-bold text-gray-900">24</p>
            <p className="text-xs text-gray-500 mt-2">8 aktif sekarang</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+8%</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Pengguna</h3>
            <p className="text-3xl font-bold text-gray-900">150</p>
            <p className="text-xs text-gray-500 mt-2">23 aktif hari ini</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Package className="text-orange-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+15%</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Barang Terdaftar</h3>
            <p className="text-3xl font-bold text-gray-900">87</p>
            <p className="text-xs text-gray-500 mt-2">12 menunggu persetujuan</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="text-purple-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+24%</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Transaksi</h3>
            <p className="text-3xl font-bold text-gray-900">Rp 245M</p>
            <p className="text-xs text-gray-500 mt-2">Bulan ini</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 flex items-center gap-3 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
            <PlusCircle size={24} />
            <div className="text-left">
              <p className="font-semibold">Buat Lelang Baru</p>
              <p className="text-xs text-blue-100">Tambah lelang baru ke sistem</p>
            </div>
          </button>

          <button className="bg-white border border-gray-200 text-gray-700 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm hover:shadow">
            <BarChart3 size={24} className="text-blue-600" />
            <div className="text-left">
              <p className="font-semibold">Lihat Laporan</p>
              <p className="text-xs text-gray-500">Analisis & statistik lengkap</p>
            </div>
          </button>

          <button className="bg-white border border-gray-200 text-gray-700 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm hover:shadow">
            <Users size={24} className="text-green-600" />
            <div className="text-left">
              <p className="font-semibold">Kelola Pengguna</p>
              <p className="text-xs text-gray-500">Manajemen user & hak akses</p>
            </div>
          </button>
        </div>

        {/* Main Content - Auction Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manajemen Lelang</h2>
              <p className="text-sm text-gray-500 mt-1">Kelola semua lelang yang sedang berjalan</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari barang..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="active">Berlangsung</option>
                <option value="completed">Selesai</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Barang</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Harga Awal</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Bid Tertinggi</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Total Bid</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Waktu Tersisa</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-2xl">
                          {item.image}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">ID: #{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{formatCurrency(item.startPrice)}</td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.currentBid)}</p>
                      {item.currentBid > item.startPrice && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp size={12} />
                          +{Math.round(((item.currentBid - item.startPrice) / item.startPrice) * 100)}%
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {item.bids} bid
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={16} className="text-gray-400" />
                        {item.timeLeft}
                      </div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Lihat Detail">
                          <Eye size={18} className="text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Edit">
                          <Edit size={18} className="text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Hapus">
                          <Trash2 size={18} className="text-gray-600 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Menampilkan <span className="font-semibold">1-5</span> dari <span className="font-semibold">24</span> lelang</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Sebelumnya
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}