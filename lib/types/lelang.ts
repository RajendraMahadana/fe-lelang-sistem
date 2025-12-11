// lib/types/lelang.ts
export interface LelangBarang {
  id: number;
  gambar_barang: string;
  nama_barang: string;
  deskripsi: string;
  kategori_id: number;
  harga_awal: number;
  harga_akhir: number;
  waktu_mulai: string;
  created_at: string; 
  waktu_selesai: string;
  status: 'aktif' | 'selesai' | 'dibatalkan';
  category?: {
    id: number;
    nama_kategori: string;
  };
}