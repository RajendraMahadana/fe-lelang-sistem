"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

const handleLogout = async () => {
  try {

    const res = await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      localStorage.removeItem("token");
      router.push("/auth/login");
    } else {
      alert("Gagal logout: " + data.message);
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
