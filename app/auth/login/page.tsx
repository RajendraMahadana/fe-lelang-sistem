"use client";

import { apiFetch } from "@/app/lib/Api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

   useEffect(() => {
      
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<LoginResponse>("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response:", data);

      setMessage("Login berhasil!");
      localStorage.setItem("auth_token", data.token);

      if (data.user?.role === "user") {
        router.push("/user/home/index");
      } else if (data.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        throw new Error("Role tidak dikenali");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Terjadi kesalahan.");
      setLoading(false);
    }
  };
    return(
        <>
             <section className="min-h-[100vh] flex flex-col justify-center items-center">

                <div className="flex h-full bg-gradient-to-b from-gray-950 to-gray-900 BG950 shadow-lg w-3/4 justify-center items-center rounded-4xl">

                <div className="flex  items-center justify-center h-full w-full">
                    <h1 className="font-montserrat text-white text-3xl">Selamat Datang.</h1>
                </div>

                <div className="w-full rounded-3xl shadow-lg bg-white flex flex-col justify-center items-center p-15">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="w-3/4 font-montserrat">
                        <div className="mb-8">
                            <h1 className="text-2xl font-medium mb-1">Register</h1>
                            <p className="text-xs">Sudah punya akun? <Link href="/auth/register" className="font-semibold underline text-blue-600">Register</Link> </p>
                        </div>
                        <div className="mb-3">
                            <div className="space-x-2 mb-2">
                                <i className="ri-user-line text-blue-600"></i>
                                <label htmlFor="name" className="text-xs">Email</label>
                            </div>
                            <div>
                                <input
                                    id="emal" 
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className=" shadow-[inset_3px_0_0_0_blue] transition-all duration-150 ease-initial  pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200  w-full" />

                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="space-x-2 mb-2">
                                 <i className="ri-at-line text-blue-600"></i>
                                <label htmlFor="name" className="text-xs">Password</label>
                            </div>
                            <div>
                                <input
                                    id="password" 
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="shadow-[inset_3px_0_0_0_blue] pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200 w-full" />

                            </div>
                        </div>

                        <div className="mt-6">
                            <button className="w-full bg-gray-800 text-white rounded-md flex justify-center items-center shadow font-montserrat  px-5 py-2 transition-all duration-150 ease-initial cursor-pointer" type="submit">{loading ?   <ClipLoader color="#36d7b7" size={24} /> : "Login"}</button>
                        </div>
                    </form>

                    {message && <p>{message}</p>}
                </div>

                </div>
            </section>   
        </>
    )
 }