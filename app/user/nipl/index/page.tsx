// components/NiplList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Nipl, NiplResponse } from '../types/nipl';
import { FileText, Calendar, CheckCircle, Clock, X, Eye, AlertCircle, Plus, Save } from 'lucide-react';

export default function NiplList() {
  const [niplList, setNiplList] = useState<Nipl[]>([]);
  const [selectedNipl, setSelectedNipl] = useState<Nipl | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal Buat NIPL
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomor_nipl: "",
    nama: "",
    tanggal_terbit: "",
  });

  const BASE_URL = "http://127.0.0.1:8000/api/nipl";

  useEffect(() => {
    fetchNiplList();
  }, []);

  const fetchNiplList = async () => {
    try {
      setLoading(true);
      const response = await fetch(BASE_URL, {
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

  const fetchNiplDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`${BASE_URL}/${id}`, {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCreateNipl = async () => {
    try {
      setCreateLoading(true);

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal menambahkan NIPL");

      setShowCreateModal(false);
      await fetchNiplList();
      setFormData({ nomor_nipl: "", nama: "", tanggal_terbit: "" });

    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Memuat data NIPL...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-red-800 font-semibold mb-1">Terjadi Kesalahan</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 font-poppins">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <FileText className="text-white" size={28} />
            </div>
          
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Buat NIPL Baru
          </button>
        </div>

      </div>

      {/* NIPL Cards */}
      {niplList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada NIPL</h3>
          <p className="text-gray-500 mb-6">Anda belum memiliki NIPL yang terdaftar</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Buat NIPL Pertama
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {niplList.map((nipl) => (
            <div
              key={nipl.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
            >
              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FileText size={24} />
                  </div>
                  {nipl.status && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        nipl.status === 'aktif'
                          ? 'bg-green-400 text-green-900'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {nipl.status.charAt(0).toUpperCase() + nipl.status.slice(1)}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">
                  {nipl.nomor_nipl || `NIPL #${nipl.id}`}
                </h3>
                {nipl.nama && (
                  <p className="text-blue-100 text-sm">{nipl.nama}</p>
                )}
              </div>

              {/* Body Card */}
              <div className="p-5">
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Dibuat Pada</p>
                      <p className="text-gray-700 font-medium">{formatDate(nipl.created_at)}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => fetchNiplDetail(nipl.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group-hover:scale-[1.02]"
                >
                  <Eye size={18} />
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form Buat NIPL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Buat NIPL Baru</h2>
                    <p className="text-green-100 text-sm mt-1">Isi form untuk membuat NIPL baru</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor NIPL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan nomor NIPL"
                    value={formData.nomor_nipl}
                    onChange={(e) => setFormData({ ...formData, nomor_nipl: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Terbit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.tanggal_terbit}
                    onChange={(e) => setFormData({ ...formData, tanggal_terbit: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Batal
              </button>

              <button
                onClick={handleCreateNipl}
                disabled={createLoading}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail NIPL */}
      {selectedNipl && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Detail NIPL</h2>
                    <p className="text-blue-100 text-sm mt-1">Informasi lengkap NIPL</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNipl(null)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {detailLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 font-medium">Memuat detail...</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <FileText size={20} className="text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Nomor NIPL</p>
                        <p className="text-lg font-bold text-gray-900">{selectedNipl.nomor_nipl || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Nama</p>
                    <p className="text-gray-900 font-semibold">{selectedNipl.nama || '-'}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Status</p>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedNipl.status === 'aktif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selectedNipl.status === 'aktif' ? <CheckCircle size={16} /> : <Clock size={16} />}
                      {selectedNipl.status || '-'}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Tanggal Terbit</p>
                        <p className="text-gray-900 font-semibold">
                          {selectedNipl.tanggal_terbit ? formatDate(selectedNipl.tanggal_terbit) : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-xs text-blue-600 mb-3 font-semibold uppercase tracking-wide">Timeline</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Dibuat Pada</p>
                          <p className="text-gray-900 font-semibold text-sm">{formatDate(selectedNipl.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Terakhir Diperbarui</p>
                          <p className="text-gray-900 font-semibold text-sm">{formatDate(selectedNipl.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedNipl(null)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}