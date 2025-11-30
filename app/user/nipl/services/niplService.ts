import { apiFetch } from "@/app/lib/Api";

// --- Tipe Data (Interfaces) ---

export interface NiplPurchaseResponse {
  invoice_url: string;
  external_id: string;
  status: string;
}

export interface NiplData {
  id: number;
  amount: number;
  status: 'pending' | 'paid' | 'expired';
  created_at: string;
}

// --- Service Functions ---

/**
 * Membeli NIPL baru (Request ke Xendit via Backend)
 */
export const buyNipl = async (noTelepon: string) => {
  try {
    // apiFetch otomatis menambahkan Base URL dan Header JSON
    const data = await apiFetch<NiplPurchaseResponse>("/nipl/buy", {
      method: "POST",
      // Token biasanya sudah dihandle di apiFetch atau bisa diambil manual di sini
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
      body: JSON.stringify({
        no_telepon: noTelepon,
      }),
    });

    return data; 
  } catch (error) {
    console.error("Error buying NIPL:", error);
    throw error;
  }
};

/**
 * Mengambil daftar riwayat NIPL User
 */
export const getNiplList = async () => {
  try {
    const data = await apiFetch<NiplData[]>("/nipl", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching NIPL list:", error);
    throw error;
  }
};