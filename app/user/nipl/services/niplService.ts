// services/niplService.ts
export interface NiplPayload {
  email: string;
  no_rekening: string;
  bank: string;
  no_telepon: string;
}

export const createNipl = async (payload: NiplPayload, token: string) => {
  const res = await fetch("http://127.0.0.1:8000/api/nipl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal membuat NIPL");
  }

  return res.json();
};



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

