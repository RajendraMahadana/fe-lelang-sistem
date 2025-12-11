"use client";

import { useState, useMemo, startTransition, useLayoutEffect } from "react";
import { Pencil, Plus, Trash, FolderOpen, Tag, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/lib/types/category";
import { useActionState } from "react"; // pastikan React ≥18.3 atau pakai alternatif

import { fetchCategoriesAction } from "@/lib/actions/category";
import { deleteCategoryAction } from "@/lib/actions/category";
import ModalEditCategory from "@/app/components/admin/Modal/Category/ModalEditCategory";
import ModalAddCategory from "@/app/components/admin/Modal/Category/ModalAddCategory";

const LoadingRow = () => (
  <tr>
    <td colSpan={4} className="py-12 text-center">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        {/* <p className="text-gray-500 text-sm">Memuat data...</p> */}
      </div>
    </td>
  </tr>
);



export default function CategoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // ✅ State untuk search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "with-description" | "empty-description">("all");

  const [state, formAction, isPending] = useActionState(
    async (prevState: { categories: Category[] } | null, formData: FormData) => {
      const actionType = formData.get("action") as string;
      if (actionType === "fetch") {
        const categories = await fetchCategoriesAction();
        return { categories };
      }
      return prevState;
    },
    null
  );

  useLayoutEffect(() => {
    const form = new FormData();
    form.append("action", "fetch");
    
    startTransition(() => {
      formAction(form); // ✅ Sekarang di dalam transition
    });
  }, [formAction, startTransition]); 

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      const success = await deleteCategoryAction(id);
      if (success) {
        toast.success("Kategori berhasil dihapus");
        const form = new FormData();
        form.append("action", "fetch");
        formAction(form);
      }
    } catch {
      toast.error("Gagal menghapus kategori");
    }
  };

  const categories = state?.categories || [];
  const loading = isPending && !state;

  // ✅ Filter & search client-side
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = 
        cat.nama_kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filter === "all" ||
        (filter === "with-description" && cat.deskripsi.trim() !== "") ||
        (filter === "empty-description" && cat.deskripsi.trim() === "");

      return matchesSearch && matchesFilter;
    });
  }, [categories, searchQuery, filter]);

  return (
    <section className="font-poppins">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
            <FolderOpen className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola kategori untuk aset lelang</p>
          </div>
        </div>

        {/* Action Bar — Diperbarui */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-md shadow-sm border border-gray-200 p-4">
          <div className="flex gap-3 flex-wrap items-center">
            {/* 🔍 Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kategori..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-48 sm:w-64"
              />
            </div>

            {/* 🎯 Filter Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter size={18} />
                {filter === "all" && "Semua"}
                {filter === "with-description" && "Ada Deskripsi"}
                {filter === "empty-description" && "Tanpa Deskripsi"}

              </button>
              {/* Dropdown menu */}
              <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block">
                <button
                  onClick={() => setFilter("all")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Semua Kategori
                </button>
                <button
                  onClick={() => setFilter("with-description")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Ada Deskripsi
                </button>
                <button
                  onClick={() => setFilter("empty-description")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Tanpa Deskripsi
                </button>
              </div>
            </div>

            {/* Info hasil */}
            <span className="text-xs text-gray-500 hidden sm:inline">
              {filteredCategories.length} dari {categories.length} kategori
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white flex items-center gap-2 rounded-md text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus size={18} /> Tambah Kategori
          </button>
        </div>
      </div>

      {/* Table — Gunakan filteredCategories */}
      <div className="bg-white shadow-sm rounded-md border border-gray-200 overflow-hidden">
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
                <LoadingRow />
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
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
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {cat.deskripsi || <span className="text-gray-400 italic">—</span>}
                      </p>
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
                          disabled={isPending}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Search size={48} className="text-gray-300" />
                      <div>
                        <p className="text-gray-900 font-semibold">Tidak ada hasil</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {searchQuery || filter !== "all" 
                            ? "Coba ubah kata kunci atau filter" 
                            : "Belum ada kategori"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — opsional: bisa diaktifkan nanti */}
        {filteredCategories.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold">{filteredCategories.length}</span> dari{" "}
              <span className="font-semibold">{categories.length}</span> kategori
            </p>
          </div>
        )}
      </div>

      {/* Modals — tetap sama */}
      {isAddModalOpen && (
        <ModalAddCategory
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            const form = new FormData();
            form.append("action", "fetch");
            formAction(form);
          }}
        />
      )}
      {selectedCategory && (
        <ModalEditCategory
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onSuccess={() => {
            const form = new FormData();
            form.append("action", "fetch");
            formAction(form);
          }}
        />
      )}
    </section>
  );
}