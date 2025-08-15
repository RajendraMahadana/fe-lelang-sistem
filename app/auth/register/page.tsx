"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
      const router = useRouter();

    type RegisterFormData = {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        avatar: File | null;
    };


    const [formData, setFormData] = useState<RegisterFormData>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        avatar: null , 
    });

    const [message, setMeassage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "avatar" && e.target.files) {
        setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData();
            form.append("name", formData.name);
            form.append("email", formData.email);
            form.append("password", formData.password);
            form.append("password_confirmation", formData.password_confirmation);

        if (formData.avatar) {
            form.append("avatar", formData.avatar);
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                body: form,
            });

            const data = await res.json();
            if (res.ok) {
                setMeassage("Registrasi Berhasil");
            } else {
                setMeassage(data.error || "Registrasi Galal.");
            }

            router.push("/auth/login")

        } catch (error) {
            setMeassage("Terjadi Kesalahan")
        }
    }

     return (
        <>
            <section className="min-h-[100vh] flex flex-col justify-center items-center">

                <div className="flex h-full bg-gradient-to-b from-gray-950 to-gray-900 BG950 shadow-lg w-3/4 justify-center items-center rounded-4xl">

                <div className="flex  items-center justify-center h-full w-full">
                    <h1 className="font-montserrat text-white text-3xl">Selamat Datang.</h1>
                </div>

                <div className="w-full rounded-3xl shadow-lg bg-white flex flex-col justify-center items-center p-15">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="w-3/4 font-montserrat">
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-medium mb-1">Register</h1>
                            <Link href={`/`} className="text-xs text-blue-600 font-semibold font-montserrat hover:underline">Home</Link>
                            </div>
                            <p className="text-xs">Sudah punya akun? <Link href="/auth/login" className="font-semibold underline text-blue-600">Login</Link> </p>
                        </div>
                        <div className="mb-3">
                            <div className="space-x-2 mb-2">
                                <i className="ri-user-line text-blue-600"></i>
                                <label htmlFor="name" className="text-xs">Username</label>
                            </div>
                            <div>
                                <input
                                    id="name" 
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className=" shadow-[inset_3px_0_0_0_blue] transition-all duration-150 ease-initial  pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200  w-full" />

                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="space-x-2 mb-2">
                               <i className="ri-at-line text-blue-600"></i>
                                <label htmlFor="email" className="text-xs">Email</label>
                            </div>
                            <div>
                                <input
                                    id="email" 
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="shadow-[inset_3px_0_0_0_blue] pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200 w-full" />

                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="space-x-2 mb-2">
                                <i className="ri-lock-password-line text-blue-600"></i>
                                <label htmlFor="password" className="text-xs">Password</label>
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
                        <div className="mb-3">
                            <div className="space-x-2 mb-2">
                               <i className="ri-lock-password-line text-blue-600"></i>
                                <label htmlFor="password_confirmation" className="text-xs">Konfirmasi Password</label>
                            </div>
                            <div>
                                <input
                                    id="password_confirmation" 
                                    type="password"
                                    placeholder="Konfirmasi Password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    className="shadow-[inset_3px_0_0_0_blue] pl-5 bg-gray-200 pr-4 py-2 text-sm rounded-md  placeholder:text-sm focus:outline-none focus:ring-0 focus:border-none focus:bg-gray-200 w-full" />

                            </div>
                        </div>

                         <label className="flex items-center space-x-2">
                            <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" required/>
                            <span className="text-xs text-gray-700">
                            Saya setuju dengan 
                            <a href="/terms" className="text-blue-500 hover:underline">  Syarat & Ketentuan </a>
                            yang berlaku.
                            </span>
                        </label>

                        <div className="mt-6">
                            <button className="w-full bg-gray-800 text-white rounded-md shadow font-montserrat  px-5 py-2 transition-all duration-150 ease-initial cursor-pointer" type="submit">Register</button>
                        </div>
                    </form>

                    {message && <p>{message}</p>}
                </div>

                </div>
            </section>
        </>
     )

}