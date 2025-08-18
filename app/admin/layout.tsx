import NavbarAdmin from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";

export default function RootLayout({
  children,
}

: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
    <main className="flex ">
      <aside className="h-screen sticky top-0 z-5">
        <Sidebar></Sidebar>
      </aside>

      <div className="flex-1">
      <nav className="ml fixed z-10 ">
        <NavbarAdmin></NavbarAdmin>
      </nav>

      <section className="pt-25 p-5">
        {children}
      </section>
      </div>
    </main>
    </>
  )

 }