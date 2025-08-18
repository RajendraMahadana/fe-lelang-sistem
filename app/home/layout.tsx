
import Navbar from "../components/Navbar";

export default function RootLayout({
  children,
}

: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      
        <section>
        <Navbar></Navbar>
        <main>
          {children}
        </main>
        </section>
      
   
  );
}