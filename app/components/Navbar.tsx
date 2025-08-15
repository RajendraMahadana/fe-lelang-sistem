'use client' 

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Home", href: "/home" },
        { name: "About", href: "/home/about" },
        { name: "Auctions", href: "/home/auctions" },
        { name: "Contact", href: "/home/contact" }
    ];
    return (
        <>
        <nav className="fixed flex gap-3 top-0 z-50 backdrop-blur-2xl p-5 w-full justify-center items-center">

        <div className="p-5 fixed left-0">
             <Link href="/">
                <h1 className="font-montserrat tracking-widest font-semibold text-2xl">Lelangin</h1>
            </Link> 
        </div>
    <div className="flex bg-gray-800 shadow py-4 px-15 rounded-lg">
      <ul className="flex gap-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link href={item.href}>
                <span
                  className={`underline-animate ${isActive ? "underline-active " : ""} font-montserrat`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  


            <div className="p-5 fixed right-0">
                <div className="flex gap-2">
                    <Link href="/auth/login">
                    <button className="font-montserrat bg-gray-800 shadow text-white px-8 rounded-lg py-2 hover:bg-sky-900 hover:text-white transition-all duration-300 ease-initial cursor-pointer">Login</button>
                    </Link>
                    <Link href="/auth/register">
                      <button className="font-montserrat px-5 py-2 transition-all duration-150 ease-initial cursor-pointer">Register</button>
                    </Link>
                </div> 
            </div>
        </nav>
        </>
    )
}