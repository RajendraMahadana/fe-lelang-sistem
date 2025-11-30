"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Bell,
  ShieldCheck,
  Camera,
  Mail,
  Phone,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function SettingsAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: "Admin Lelang",
    email: "admin@lelang.com",
    phone: "0812-3456-7890",
    bio: "Administrator sistem lelang online",
  });

  const handleLogout = async () => {
    const confirmLogout = confirm(
      "Kamu yakin mau logout? Lelang yang aktif tidak akan disimpan."
    );
    if (!confirmLogout) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("nipl");
        localStorage.removeItem("last_bid");
        localStorage.removeItem("lelang_cart");

        alert("Logout berhasil!");
        router.push("/auth/login");
      } else {
        alert("Gagal logout: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi masalah saat logout.");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      id: "profile",
      label: "Edit Profil",
      icon: User,
      description: "Kelola informasi profil Anda",
    },
    {
      id: "password",
      label: "Keamanan",
      icon: Lock,
      description: "Ubah password dan pengaturan keamanan",
    },
    {
      id: "notifications",
      label: "Notifikasi",
      icon: Bell,
      description: "Atur preferensi notifikasi sistem",
    },
  ];

  const handleSaveProfile = () => alert("Profil berhasil diperbarui!");
  const handleChangePassword = () => alert("Password berhasil diubah!");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pengaturan Admin
          </h1>
          <p className="text-gray-600">
            Kelola profil dan preferensi akun administrator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeMenu === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full text-left p-5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]"
                      : "bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md border border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-lg ${
                        isActive ? "bg-blue-700" : "bg-gray-100"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.label}</h3>
                      <p
                        className={`text-xs ${
                          isActive ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                  </div>
                </button>
              );
            })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={loading}
              className={`w-full text-left p-5 rounded-xl transition-all duration-200 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-50 hover:bg-red-100 border border-red-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-red-100">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-700 mb-1">
                    {loading ? "Memproses..." : "Logout"}
                  </h3>
                  <p className="text-xs text-red-600">Keluar dari sistem</p>
                </div>
              </div>
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* PROFILE TAB */}
              {activeMenu === "profile" && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Edit Profil
                    </h2>
                    <p className="text-gray-600">
                      Perbarui informasi profil administrator Anda
                    </p>
                  </div>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden shadow-lg">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Foto Profil
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Format: JPG, PNG. Maksimal 2MB
                      </p>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Upload Foto
                      </button>
                    </div>
                  </div>

                  {/* FORM INPUTS */}
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        Nama Admin
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        Email Admin
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        Deskripsi atau Bio
                      </label>
                      <textarea
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              )}

              {/* PASSWORD TAB */}
              {activeMenu === "password" && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Keamanan
                    </h2>
                    <p className="text-gray-600">
                      Kelola password dan pengaturan keamanan akun
                    </p>
                  </div>

                  {/* Change Password Box */}
                  <div className="space-y-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <Lock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Ganti Password
                          </h3>

                          <div className="space-y-4">
                            <input
                              type="password"
                              placeholder="Password lama"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                              type="password"
                              placeholder="Password baru"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                              type="password"
                              placeholder="Konfirmasi password baru"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                              onClick={handleChangePassword}
                              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
                            >
                              Simpan Password Baru
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2FA Example */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <ShieldCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Autentikasi Dua Faktor
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Tambahkan lapisan keamanan tambahan pada akun Anda.
                          </p>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                            Aktifkan 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeMenu === "notifications" && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Notifikasi
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Atur preferensi notifikasi sistem
                  </p>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
                      <span>Notifikasi Lelang Baru</span>
                      <input type="checkbox" className="toggle-checkbox" />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
                      <span>Notifikasi Penawaran Masuk</span>
                      <input type="checkbox" />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
                      <span>Notifikasi Pembayaran</span>
                      <input type="checkbox" />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
                      <span>Notifikasi Maintenance Sistem</span>
                      <input type="checkbox" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
