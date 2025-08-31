"use client";

// import Link from "next/link";
import { usePathname } from "next/navigation"

export default function NavbarAdmin() {
    const pathName = usePathname();

    const titles: { pattern: RegExp; title: string }[] = [
  { pattern: /^\/user\/home/, title: "Home" },
  { pattern: /^\/user\/nipl\/index/, title: "NIPL" },
  { pattern: /^\/user\/asset/, title: "Asset" }, // id angka
  { pattern: /^\/user\/asset\/\d+$/, title: "Detail Asset" }, // id angka
  { pattern: /^\/admin\/reports$/, title: "Reports" },
  { pattern: /^\/admin\/analytics$/, title: "Analytics" },
];

   const currentTitle =
  titles.find(({ pattern }) => pattern.test(pathName))?.title || "";

    return(
        <>
        <section className="fixed  flex w-[100%] border-gray-200 border-b bg-white items-center h-20">
            <div className="flex items-center">
                
                <div className="w-50 flex ml-5">
                    <h1 className="font-montserrat font-medium">{currentTitle}</h1>
                </div>

                <div>
                    
                </div>
            </div>
        </section>
        </>
    )
}