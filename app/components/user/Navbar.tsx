"use client";

// import Link from "next/link";
import { usePathname } from "next/navigation"

export default function NavbarAdmin() {
    const pathName = usePathname();

    const titles: Record<string, string> = {
        "/user/home": "Home",
        "/user/nipl/index": "NIPL",
        "/admin/asset": "Asset",
        "/admin/reports": "Reports",
        "/admin/analytics": "Analytics",
    }

    const title = titles[pathName] || "Halaman";

    return(
        <>
        <section className="fixed  flex w-[100%] border-gray-200 border-b bg-white items-center h-20">
            <div className="flex items-center">
                
                <div className="w-50 flex ml-5">
                    <h1 className="font-montserrat font-medium">{title}</h1>
                </div>

                <div>
                    
                </div>
            </div>
        </section>
        </>
    )
}