export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
