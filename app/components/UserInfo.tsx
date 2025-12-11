// components/UserInfo.tsx
"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ✅ Tidak perlu kirim token — server baca dari cookies otomatis
        const res = await fetch("/api/user/me");
        
        if (!res.ok) throw new Error("Unauthorized");
        
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Fetch user failed", err);
        // Opsional: redirect ke login
        // window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="text-sm">Loading...</p>;
  if (!user) return <p className="text-sm text-gray-500">Guest</p>;

  return (
    <div className="whitespace-nowrap">
      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
      <p className="text-xs text-gray-500 truncate">{user.email}</p>
    </div>
  );
}