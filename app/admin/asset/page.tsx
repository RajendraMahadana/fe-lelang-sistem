"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownToLine, ChevronDown, Pencil, Plus, Trash } from "lucide-react";
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


export default function DataTable()  {
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
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   

    const channel = pusher.subscribe("lelang");
    fetchBarang();
    // handler terpisah supaya bisa unbind secara spesifik
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




  return (
    <section className="font-poppins">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">Data Asset Lelang</h1>
        </div>

        <div className="flex gap-2 items-center">

          

      <div>
        <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 flex gap-1 items-center bg-none text-sm text-sky-500 outline-1 rounded-sm"
      >
        Menu <ChevronDown size={16}/>
      </button>

      {open && (
        <div className="absolute mt-2 w-40 bg-white text-sm rounded-sm shadow-lg z-10">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Import
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Export
          </a>
        </div>
      )}
    </div>
     </div>


     <div>

        <Link href={`/admin/asset/create-lelang`}>
          <button className="bg-sky-400 px-4 py-2 text-white flex items-center gap-1 rounded-sm text-sm cursor-pointer">
            <Plus size={16}/> Tambah Asset</button>
        </Link>
          </div>
      </div>
      </div>

      
      <div className="mt-3 bg-white p-7 shadow-sm rounded-md">
        <table className="overflow-hidden w-full rounded-sm ">
          <thead className="">
            <tr className="text-sm">
              <th className="py-2 px-4 text-start font-normal">ID</th>
              <th className="py-2 px-4 text-start font-normal">Gambar</th>
              <th className="py-2 px-4 text-start font-normal">Nama Barang</th>
              <th className="py-2 px-4 text-start font-normal">Category</th>
              <th className="py-2 px-4 text-start font-normal">Harga Awal</th>
              <th className="py-2 px-4 text-start font-normal">Waktu Mulai</th>
              <th className="py-2 px-4 text-start font-normal">Waktu Selesai</th>
              <th className="py-2 px-4 text-start font-normal">Status</th>
              <th className="py-2 px-4 text-start font-normal">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center justify-center items-center py-4 self-center">
                  Loading...
                </td>
              </tr>
            ): data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-t border-gray-200 text-xs">
                  <td className="py-2 px-4 text-start">{item.id}</td>
                  <td className="py-2 px-4 text-start">
                    <Image
                      src={`http://127.0.0.1:8000/${item.gambar_barang}`}
                      alt={item.nama_barang}
                      width={50}
                      height={50}
                      className=" object-cover aspect-square rounded-md"
                    />
                  </td>
                  <td className="py-2 px-4 text-start">{item.nama_barang}</td>
                  <td className="py-2 px-4 text-start">{item.category?.nama_kategori || "-"}</td>
                  <td className="py-2 px-4 text-start">Rp{new Intl.NumberFormat("id-ID").format(item.harga_awal)}</td>
                 <td className="py-2 px-4 text-start">
  {new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(item.waktu_mulai)) }
</td>
                  <td className="py-2 px-4 text-start">
  {new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(item.waktu_mulai)) }
</td>
                 <td className="py-2 px-4 text-start">
  <div className="flex items-center">
    <span
      className={`px-3 py-1 rounded-sm text-xs font-medium
        ${
          item.status === "aktif"
            ? "bg-green-100 text-green-600"
            : item.status === "selesai"
            ? "bg-gray-100 text-gray-600"
            : "bg-red-100 text-red-600"
        }`}
    >
      {item.status}
    </span>
  </div>
</td>
                  <td className="py-2 px-4 text-start space-x-2">
                    <button
                      className="p-2 bg-blue-500 cursor-pointer shadow hover:bg-blue-700 text-white rounded-sm"
                      onClick={() => setSelectedBarang(item)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="bg-red-600 cursor-pointer hover:bg-red-700 text-white p-2 rounded-sm shadow text-xs"
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
                    >
                      <Trash size={16}/>
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
