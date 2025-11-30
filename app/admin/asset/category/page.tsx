"use client";

import { useState, useEffect } from "react";
import { Pencil, Plus, Trash, FolderOpen, Tag, Search, Filter, Grid3x3 } from "lucide-react";
import ModalAddCategory from "@/app/components/admin/Modal/Category/ModalAddCategory";
import ModalEditCategory from "@/app/components/admin/Modal/Category/ModalEditCategory";

interface Category {
  id: number;
  nama_kategori: string;
  deskripsi: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!res.ok) throw new Error("Gagal fetch data kategori");

      const result = await res.json();
      setCategories(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch {
      alert("Gagal menghapus data");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="font-poppins">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
            <FolderOpen className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola kategori untuk asset lelang</p>
          </div>
        </div>

        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari kategori..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter size={18} />
              Filter
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white flex items-center gap-2 rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus size={18} /> Tambah Kategori
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kategori</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Deskripsi</th>
                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                      <p className="text-gray-500 text-sm">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {cat.id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Tag className="text-blue-600" size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{cat.nama_kategori}</p>
                          <p className="text-xs text-gray-500">Kategori #{cat.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700 line-clamp-2">{cat.deskripsi}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm hover:shadow group"
                          onClick={() => setSelectedCategory(cat)}
                          title="Edit Kategori"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm hover:shadow group"
                          onClick={() => handleDelete(cat.id)}
                          title="Hapus Kategori"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <FolderOpen size={48} className="text-gray-300" />
                      <div>
                        <p className="text-gray-900 font-semibold">Tidak ada data</p>
                        <p className="text-gray-500 text-sm mt-1">Belum ada kategori yang terdaftar</p>
                      </div>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Tambah Kategori Pertama
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {categories.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold">{categories.length}</span> kategori
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

      {/* Modals */}
      {isAddModalOpen && (
        <ModalAddCategory
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            fetchCategories();
            setIsAddModalOpen(false);
          }}
        />
      )}

      {selectedCategory && (
        <ModalEditCategory
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onSuccess={fetchCategories}
        />
      )}
    </section>
  );
}