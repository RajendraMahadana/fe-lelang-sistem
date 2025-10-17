// types/nipl.ts
export interface Nipl {
  id: number;
  user_id: number;
  nomor_nipl?: string;
  nama?: string;
  tanggal_terbit?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface NiplResponse {
  message: string;
  data: Nipl | Nipl[];
}