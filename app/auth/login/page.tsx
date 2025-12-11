// app/auth/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useId, } from "react";
import Link from "next/link";
import { toast } from "sonner"; // ✅ Rekomendasi: install `sonner`

// ✅ Tipe terpusat (nanti pindah ke lib/types/auth.ts)
interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
  };
}

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Auto-generate ID untuk a11y
  const emailId = useId();
  const passwordId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ 1. Kirim ke backend (Laravel/Golang) seperti biasa
      const backendRes = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!backendRes.ok) {
        const errorData = await backendRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Email atau password salah");
      }

      const { token, user } = await backendRes.json() as LoginResponse;

      // ✅ 2. Simpan token di HTTP-only cookie via Next.js API route
      const cookieRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, user }),
      });

      if (!cookieRes.ok) {
        throw new Error("Gagal menyimpan sesi");
      }

      // ✅ 3. Redirect sesuai role
      if (user.role === "user") {
        router.push("/user/home");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        throw new Error("Role tidak dikenali");
      }

      toast.success(`Selamat datang, ${user.name}!`);
    } catch (err: any) {
      toast.error(err.message || "Login gagal. Coba lagi.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-950 to-gray-900 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left: Hero */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 text-center text-white">
          <h1 className="font-montserrat text-3xl md:text-4xl font-bold mb-4">
            Selamat Datang.
          </h1>
          <p className="text-gray-300 max-w-md">
            Masuk untuk mengelola aset, kategori, dan lelang dengan mudah.
          </p>
        </div>

        {/* Right: Form */}
        <div className="flex-1 bg-white p-6 md:p-10">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h1>
              <p className="text-sm text-gray-600 mt-1">
                Belum punya akun?{" "}
                <Link href="/auth/register" className="font-semibold text-blue-600 hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor={emailId} className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id={emailId}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor={passwordId} className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id={passwordId}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sedang masuk...
                  </span>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}