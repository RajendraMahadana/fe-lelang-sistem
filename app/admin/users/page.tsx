"use client";

import { Users, Search, Filter, Plus, Edit, Trash2, Eye, Mail, Phone, Calendar, Shield, UserCheck, UserX, MoreVertical, Download, Upload } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const usersData = [
    { 
      id: 1, 
      name: "Ahmad Rifai", 
      email: "ahmad.rifai@email.com", 
      phone: "+62 812-3456-7890",
      role: "buyer", 
      status: "active",
      joinDate: "15 Jan 2024",
      totalBids: 45,
      wonAuctions: 12,
      avatar: "AR"
    },
    { 
      id: 2, 
      name: "Siti Nurhaliza", 
      email: "siti.nur@email.com", 
      phone: "+62 813-9876-5432",
      role: "seller", 
      status: "active",
      joinDate: "20 Feb 2024",
      totalBids: 23,
      wonAuctions: 8,
      avatar: "SN"
    },
    { 
      id: 3, 
      name: "Budi Santoso", 
      email: "budi.santoso@email.com", 
      phone: "+62 821-1234-5678",
      role: "buyer", 
      status: "suspended",
      joinDate: "10 Mar 2024",
      totalBids: 67,
      wonAuctions: 15,
      avatar: "BS"
    },
    { 
      id: 4, 
      name: "Dewi Lestari", 
      email: "dewi.lestari@email.com", 
      phone: "+62 856-7890-1234",
      role: "seller", 
      status: "active",
      joinDate: "5 Apr 2024",
      totalBids: 34,
      wonAuctions: 10,
      avatar: "DL"
    },
    { 
      id: 5, 
      name: "Maya Puspita", 
      email: "maya.puspita@email.com", 
      phone: "+62 819-2468-1357",
      role: "buyer", 
      status: "inactive",
      joinDate: "28 Dec 2023",
      totalBids: 12,
      wonAuctions: 3,
      avatar: "MP"
    },
  ];

  const getRoleBadge = (role) => {
    const roleConfig = {
      buyer: { bg: "bg-blue-100", text: "text-blue-700", label: "Pembeli", icon: UserCheck },
      seller: { bg: "bg-green-100", text: "text-green-700", label: "Penjual", icon: Users },
      admin: { bg: "bg-purple-100", text: "text-purple-700", label: "Admin", icon: Shield },
    };
    const config = roleConfig[role];
    const Icon = config.icon;
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-700", label: "Aktif" },
      inactive: { bg: "bg-gray-100", text: "text-gray-700", label: "Tidak Aktif" },
      suspended: { bg: "bg-red-100", text: "text-red-700", label: "Suspended" },
    };
    const config = statusConfig[status];
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium`}>
        {config.label}
      </span>
    );
  };

  const filteredData = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = usersData.length;
  const activeUsers = usersData.filter(u => u.status === "active").length;
  const buyersCount = usersData.filter(u => u.role === "buyer").length;
  const sellersCount = usersData.filter(u => u.role === "seller").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola semua pengguna dalam sistem</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Pengguna</h3>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
            <p className="text-xs text-gray-500 mt-2">{activeUsers} aktif</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pengguna Aktif</h3>
            <p className="text-3xl font-bold text-gray-900">{activeUsers}</p>
            <p className="text-xs text-gray-500 mt-2">{Math.round((activeUsers/totalUsers)*100)}% dari total</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCheck className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pembeli</h3>
            <p className="text-3xl font-bold text-gray-900">{buyersCount}</p>
            <p className="text-xs text-gray-500 mt-2">Total pembeli aktif</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Penjual</h3>
            <p className="text-3xl font-bold text-gray-900">{sellersCount}</p>
            <p className="text-xs text-gray-500 mt-2">Total penjual terdaftar</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Semua Role</option>
                <option value="buyer">Pembeli</option>
                <option value="seller">Penjual</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <Download size={18} />
                Export
              </button>
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm font-medium">
                <Plus size={18} />
                Tambah User
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Pengguna</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Kontak</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Role</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Aktivitas</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Bergabung</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone size={14} className="text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-4 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-700">{user.totalBids} bid</p>
                        <p className="text-xs text-gray-500">{user.wonAuctions} menang</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        {user.joinDate}
                      </div>
                    </td>
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
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group" title="Lainnya">
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <UserX size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada pengguna ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold">{filteredData.length}</span> dari <span className="font-semibold">{totalUsers}</span> pengguna
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Sebelumnya
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}