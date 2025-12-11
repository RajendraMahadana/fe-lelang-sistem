/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/actions/lelang.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { LelangBarang } from '@/lib/types/lelang';
import { redirect } from 'next/navigation';
import { z } from 'zod'; 

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) throw new Error('Unauthorized');
  return token;
}

// lib/actions/lelang.ts
export async function fetchLelangBarangAction(): Promise<LelangBarang[]> {
  try {
    const token = await getAuthToken();
    const res = await fetch('http://127.0.0.1:8000/api/lelang-barang', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[API Error]', res.status, err);
      return []; // atau throw new Error(...)
    }

    const rawData = await res.json();
    
    // ✅ Handle semua format:
    if (Array.isArray(rawData)) {
      return rawData; // format: [...]
    }
    if (Array.isArray(rawData.data)) {
      return rawData.data; // format: { data: [...] }
    }
    if (Array.isArray(rawData.result)) {
      return rawData.result; // format: { result: [...] }
    }

    console.warn('[API Warning] Format tidak dikenali:', rawData);
    return [];
  } catch (error) {
    console.error('[fetchLelangBarangAction]', error);
    return [];
  }
}

// ✅ Validasi input dengan Zod
const createLelangSchema = z.object({
  nama_barang: z.string().min(3, "Nama barang minimal 3 karakter"),
  kategori_id: z.string().min(1, "Kategori wajib dipilih"),
  harga_awal: z.coerce.number().min(1000, "Harga awal minimal Rp1.000"),
  waktu_mulai: z.string().datetime(),
  waktu_selesai: z.string().datetime(),
  deskripsi: z.string().optional(),
});

export async function createLelangAction(
  prevState: any,
  formData: FormData
) {
  try {
    // ✅ Ambil token dari cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return {
        success: false,
        message: "Sesi tidak valid. Silakan login ulang.",
        errors: {},
      };
    }

    // ✅ Ambil data dari form
    const nama_barang = formData.get('nama_barang')?.toString() || '';
    const kategori_id = formData.get('kategori_id')?.toString() || '';
    const harga_awal = formData.get('harga_awal')?.toString() || '';
    const waktu_mulai = formData.get('waktu_mulai')?.toString() || '';
    const waktu_selesai = formData.get('waktu_selesai')?.toString() || '';
    const deskripsi = formData.get('deskripsi')?.toString() || '';
    const gambarFile = formData.get('gambar_barang') as File;

    // ✅ Validasi manual (tanpa Zod)
    const errors: Record<string, string> = {};

    if (!nama_barang.trim()) errors.nama_barang = "Nama barang wajib diisi";
    else if (nama_barang.length < 3) errors.nama_barang = "Nama barang minimal 3 karakter";

    if (!kategori_id) errors.kategori_id = "Kategori wajib dipilih";

    const hargaNum = parseInt(harga_awal);
    if (isNaN(hargaNum) || hargaNum < 1000) errors.harga_awal = "Harga awal minimal Rp1.000";

    if (!waktu_mulai) errors.waktu_mulai = "Waktu mulai wajib diisi";
    if (!waktu_selesai) errors.waktu_selesai = "Waktu selesai wajib diisi";

    if (!gambarFile || !gambarFile.name) {
      errors.gambar_barang = "Gambar barang wajib diunggah";
    } else if (gambarFile.size > 5 * 1024 * 1024) { // 5MB
      errors.gambar_barang = "Ukuran gambar maksimal 5MB";
    }

    // ✅ Jika ada error validasi
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Mohon perbaiki data berikut",
        errors,
      };
    }

    // ✅ Format datetime untuk backend (YYYY-MM-DD HH:mm:ss)
    const formatDateTime = (isoStr: string): string => {
      const dt = new Date(isoStr);
      return dt.toISOString().slice(0, 19).replace('T', ' ');
    };

    const body = new FormData();
    body.append('gambar_barang', gambarFile);
    body.append('nama_barang', nama_barang.trim());
    body.append('kategori_id', kategori_id);
    body.append('harga_awal', hargaNum.toString());
    body.append('waktu_mulai', formatDateTime(waktu_mulai));
    body.append('waktu_selesai', formatDateTime(waktu_selesai));
    if (deskripsi.trim()) body.append('deskripsi', deskripsi.trim());

    // ✅ Kirim ke backend
    const res = await fetch('http://127.0.0.1:8000/api/lelang-barang', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
      cache: 'no-store',
    });

    if (res.ok) {
      return { success: true };
    } else {
      const errorData = await res.json().catch(() => ({}));
      
      // ✅ Ambil error dari backend (Laravel biasanya kirim { message, errors })
      const backendErrors = errorData.errors || {};
      const fieldErrors: Record<string, string> = {};
      
      // Konversi error Laravel ke format frontend
      for (const [field, messages] of Object.entries(backendErrors)) {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = messages[0]; // ambil pesan pertama
        }
      }

      return {
        success: false,
        message: errorData.message || "Gagal membuat lelang",
        errors: fieldErrors,
      };
    }
  } catch (error) {
    console.error('[createLelangAction]', error);
    
    let message = "Terjadi kesalahan sistem";
    if (error instanceof Error) {
      message = error.message.includes("fetch") 
        ? "Gagal terhubung ke server backend" 
        : error.message;
    }

    return {
      success: false,
      message,
      errors: {},
    };
  }
}

export async function updateLelangAction(
  id: number,
  formData: FormData
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return {
        success: false,
        message: "Sesi tidak valid",
        errors: {},
      };
    }

    // 🔥 DEBUG: Log data untuk troubleshooting
    console.log("Updating lelang ID:", id);
    
    // ✅ Tampilkan semua field untuk debugging
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}:`, value);
      }
    });

    // ✅ Gunakan endpoint yang benar sesuai route Laravel
    const endpoint = `http://127.0.0.1:8000/api/lelang-barang/${id}/barang`;
    console.log("Endpoint:", endpoint);

    // ✅ Kirim dengan FormData asli
    const res = await fetch(endpoint, {
      method: 'POST', // Laravel butuh POST untuk FormData dengan _method
      headers: { 
        Authorization: `Bearer ${token}`,
        // JANGAN set Content-Type untuk FormData (biarkan browser set otomatis)
      },
      body: formData,
      cache: 'no-store',
    });

    const responseText = await res.text();
    console.log("Response status:", res.status);
    console.log("Response body:", responseText);

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return {
        success: false,
        message: "Format response tidak valid",
        errors: {},
      };
    }

    if (res.ok) {
      console.log("✅ Update berhasil:", responseData);
      revalidatePath('/admin/asset/lelang', 'page');
      return { 
        success: true,
        data: responseData,
        message: "Barang lelang berhasil diperbarui"
      };
    } else {
      console.error("❌ Update gagal:", responseData);
      
      // Format errors dari Laravel
      const errors: Record<string, string> = {};
      if (responseData.errors) {
        Object.entries(responseData.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            errors[field] = messages.join(', ');
          } else {
            errors[field] = String(messages);
          }
        });
      }

      return {
        success: false,
        message: responseData.message || "Gagal memperbarui lelang",
        errors,
      };
    }
  } catch (error) {
    console.error('[updateLelangAction] Error:', error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return {
      success: false,
      message: errorMessage,
      errors: {},
    };
  }
}


export async function deleteLelangAction(id: number): Promise<boolean> {
  const token = await getAuthToken();
  const res = await fetch(`http://127.0.0.1:8000/api/lelang-barang/${id}/barang`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (res.ok) {
    revalidatePath('/admin/asset');
    return true;
  }
  return false;
}