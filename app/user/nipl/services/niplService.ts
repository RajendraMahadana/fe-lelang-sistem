// services/niplService.ts
export interface NiplPayload {
  no_telepon: string;
}

// services/nipl.ts
// services/nipl.ts
export async function buyNipl(noTelepon: string) {
  const token = localStorage.getItem("auth_token");

  const res = await fetch("http://localhost:8000/api/nipl/buy", {
    method: "POST",
    headers: {
  "Content-Type": "application/json",
  "Accept": "application/json",
  Authorization: `Bearer ${token}`,
},
    body: JSON.stringify({
      no_telepon: noTelepon,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Error response:", error); // cek detail error
    throw new Error(error.message || "Terjadi kesalahan");
  }

  return res.json(); // { invoice_url, external_id }
}




export const getNiplList = async (token: string) => {
  const res = await fetch("http://127.0.0.1:8000/api/nipl", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengambil daftar NIPL");
  }

  return res.json();
};

