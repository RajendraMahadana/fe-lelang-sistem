"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"

export default function NavbarAdmin() {
    const pathName = usePathname();

    const titles: Record<string, string> = {
        "/admin/dashboard": "Dashboard",
        "/admin/users": "Manage Users",
        "/admin/asset": "Asset",
        "/admin/reports": "Reports",
        "/admin/analytics": "Analytics",
    }

    const title = titles[pathName] || "Halaman";

    return(
        <>
        <section className="fixed flex w-[100%]  items-center h-20">
            <div className="flex items-center">
                
                <div className="w-50">
                    <h1 className="font-montserrat font-medium">{title}</h1>
                </div>

                <div>
                    <div>
                        <Link href={"/admin/asset"}>
                            <button className="px-6 py-2 shadow bg-gray-800 rounded-md text-sm cursor-pointer hover:bg-gray-950 transition-all duration-150 ease-in-out text-white">Asset</button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}