
import Navbar from "../components/Navbar";

export default function RootLayout({
  children,
}

: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
    rel="stylesheet"
/>
      </head>
      <body>
        <section>
        <Navbar></Navbar>
        <main>
          {children}
        </main>
        </section>
      </body>
    </html>
  );
}