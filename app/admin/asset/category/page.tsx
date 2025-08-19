"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import ModalAddCategory from "@/app/components/admin/Modal/Category/ModalAddCategory";
import ModalEditCategory from "@/app/components/admin/Modal/Category/ModalEditCategory";

interface Category {
  id: number;
  nama_kategori: string;
  deskripsi: string;
}

export default function CategoryPage() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      console.log("API result:", result); // cek bentuk response

      setData(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      console.error("Error fetch:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <section>
        {/* Tombol Tambah Kategori */}
        <div>
        <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-800 px-4 py-2 text-white rounded-md text-sm cursor-pointer"
        >
            Tambah Kategori
        </button>
        </div>

        <div className="mt-3 bg-gray-100 ">
          
            
     
            <table className="overflow-hidden w-full rounded-lg shadow">
              <thead className="bg-gray-800 text-zinc-200">
                <tr className="text-sm font-light">
                  <th className="py-2 px-4 text-start">ID</th>
                  <th className="py-2 px-4 text-start">Category</th>
                  <th className="py-2 px-4 text-start">Description</th>
                  <th className="py-2 px-4 text-start">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 border-t border-gray-300 text-xs"
                    >
                      <td className="py-2 px-4 text-start">{item.id}</td>
                      <td className="py-2 px-4 text-start">{item.nama_kategori}</td>
                      <td className="py-2 px-4 text-start">{item.deskripsi}</td>

                      <td className="py-2 px-4 text-start space-x-2">
                        <button
                          className="p-2 bg-blue-500 cursor-pointer shadow hover:bg-blue-700 text-white rounded"
                          onClick={() => setSelectedCategory(item)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="bg-red-600 cursor-pointer hover:bg-red-700 text-white p-2 rounded-md shadow text-xs"
                          onClick={async () => {
                            if (confirm("Yakin ingin menghapus data ini?")) {
                              try {
                                const res = await fetch(
                                  `http://127.0.0.1:8000/api/categories/${item.id}`,
                                  {
                                    method: "DELETE",
                                    headers: {
                                      Accept: "application/json",
                                      Authorization: `Bearer ${localStorage.getItem(
                                        "auth_token"
                                      )}`,
                                    },
                                  }
                                );
                                if (!res.ok) throw new Error("Gagal menghapus data");
                                setData((prev) =>
                                  prev.filter((d) => d.id !== item.id)
                                );
                              } catch {
                                alert("Gagal menghapus data");
                              }
                            }
                          }}
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
     
        </div>

        {/* Modal Tambah */}
{isModalOpen && (
  <ModalAddCategory
    onClose={() => setIsModalOpen(false)}
    onSuccess={() => {
      fetchCategories();
      setIsModalOpen(false);
    }}
  />
)}

{/* Modal Edit */}
{selectedCategory && (
  <ModalEditCategory
    category={selectedCategory}
    onClose={() => setSelectedCategory(null)}
    onSuccess={fetchCategories}
  />
)}

      </section>
    </>
  );
}
