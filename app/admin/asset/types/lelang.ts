// types/lelang.ts
export interface LelangBarang {
  id: number;
  gambar_barang: string;
  nama_barang: string;
  deskripsi?: string;
  harga_awal: number;
  waktu_mulai: string;
  waktu_selesai: string;
  bid_time?: string;
  status: string;
}
