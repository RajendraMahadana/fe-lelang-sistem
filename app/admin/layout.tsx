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
      <aside>
        <Sidebar></Sidebar>
      </aside>

      <nav>
        <NavbarAdmin></NavbarAdmin>
      </nav>

      <section className="p-10">
        {children}
      </section>
    </main>
    </>
  )

 }