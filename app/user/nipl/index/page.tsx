// components/NiplList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Nipl, NiplResponse } from '../types/nipl';


export default function NiplList() {
  const [niplList, setNiplList] = useState<Nipl[]>([]);
  const [selectedNipl, setSelectedNipl] = useState<Nipl | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch daftar NIPL
  useEffect(() => {
    fetchNiplList();
  }, []);

  const fetchNiplList = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/nipl', {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) throw new Error('Gagal mengambil data NIPL');

      const result: NiplResponse = await response.json();
      setNiplList(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // Fetch detail NIPL
  const fetchNiplDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/nipl/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) throw new Error('Gagal mengambil detail NIPL');

      const result: NiplResponse = await response.json();
      setSelectedNipl(result.data as Nipl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewDetail = (id: number) => {
    fetchNiplDetail(id);
  };

  const closeDetail = () => {
    setSelectedNipl(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Daftar NIPL</h1>

      {niplList.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Tidak ada data NIPL</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {niplList.map((nipl) => (
            <div
              key={nipl.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {nipl.nomor_nipl || `NIPL #${nipl.id}`}
                </h3>
                {nipl.nama && (
                  <p className="text-gray-600">{nipl.nama}</p>
                )}
              </div>

              {nipl.status && (
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      nipl.status === 'aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {nipl.status}
                  </span>
                </div>
              )}

              <div className="text-sm text-gray-500 mb-4">
                <p>Dibuat: {formatDate(nipl.created_at)}</p>
              </div>

              <button
                onClick={() => handleViewDetail(nipl.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedNipl && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Detail NIPL
                </h2>
                <button
                  onClick={closeDetail}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {detailLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <p className="text-sm text-gray-500 mb-1">Nomor NIPL</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedNipl.nomor_nipl || '-'}
                    </p>
                  </div>

                  <div className="border-b pb-3">
                    <p className="text-sm text-gray-500 mb-1">Nama</p>
                    <p className="text-gray-800">{selectedNipl.nama || '-'}</p>
                  </div>

                  <div className="border-b pb-3">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedNipl.status === 'aktif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedNipl.status || '-'}
                    </span>
                  </div>

                  <div className="border-b pb-3">
                    <p className="text-sm text-gray-500 mb-1">Tanggal Terbit</p>
                    <p className="text-gray-800">
                      {selectedNipl.tanggal_terbit
                        ? formatDate(selectedNipl.tanggal_terbit)
                        : '-'}
                    </p>
                  </div>

                  <div className="border-b pb-3">
                    <p className="text-sm text-gray-500 mb-1">Dibuat Pada</p>
                    <p className="text-gray-800">
                      {formatDate(selectedNipl.created_at)}
                    </p>
                  </div>

                  <div className="pb-3">
                    <p className="text-sm text-gray-500 mb-1">
                      Terakhir Diperbarui
                    </p>
                    <p className="text-gray-800">
                      {formatDate(selectedNipl.updated_at)}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeDetail}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}