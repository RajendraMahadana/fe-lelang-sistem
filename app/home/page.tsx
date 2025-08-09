import Link from "next/link";
import Footer from "../components/Footer";
import Product from "../components/Product";


export default function Home() {
  return (
    <>
    <section className="w-[100vm] min-h-[100vh] flex flex-col justify-center">

    <div className=" w-120 h-120 bg-transparent rounded-full absolute left-50 top-20 backdrop-blur-2xl z-[-1]"></div>
    <div className=" w-25 h-25 bg-blue-600 rounded-full absolute left-70 top-40  z-[-2] animate-pulse"></div>
    <Product></Product> 
      <div className="flex justify-center mb-20 mt-12">
        <div className="flex flex-col w-3/5">

        <h1 className="font-montserrat font-semibold text-5xl text-gray-800 mb-2 text-center">Tempat Terpercaya untuk  <span className="text-blue-600">Mendapatkan Barang Impianmu!</span></h1>
        <p className=" text-lg font-montserrat text-center">Nikmati pengalaman berburu barang dengan cara paling menantang dan menguntungkan.
              Kami menghadirkan berbagai pilihan barang menarik yang siap dilelang — kamu hanya tinggal pilih, <span className="text-blue-600 font-semibold">tawar, dan menangkan</span></p>
        </div>

      </div>
      <div className="w-full flex justify-center">
        <ul className="font-montserrat text-xs flex gap-10">
          <li className="bg-gray-700 shadow-md rounded-xl px-8 py-3 text-white">🕒 Lelang Real-Time</li>
          <li className="bg-gray-700 shadow-md rounded-xl px-8 py-3 text-white">🔐 Transaksi Aman </li>
          <li className="bg-gray-700 shadow-md rounded-xl px-8 py-3 text-white">📈 Penawaran Terbaik</li>
          <li className="bg-gray-700 shadow-md rounded-xl px-8 py-3 text-white">⏱️ Real-Time Bidding, Tanpa Ribet</li>
        </ul>
      </div>

    </section>

    <section className=" flex flex-col justify-center">

      <section className="w-[100vm] flex justify-center">
        <div className="shadow-md z-10 w-2/3 overflow-hidden relative p-18 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950   rounded-3xl">
        <div className="absolute animate-pulse w-120 h-120 border rounded-full right-[-100] bottom-[100] border-blue-800 shadow-blue-900 shadow-2xl"></div>
          <i className="ri-search-eye-line text-5xl text-blue-600"></i>
          <div className="flex flex-row-reverse gap-10 mt-8">
            <h1 className="w-3/4 font-montserrat z-10 text-end font-medium text-4xl mb-10 text-zinc-100">Temukan Barang Impian mu</h1>
            <p className="w-8/12 font-montserrat text-zinc-300 text-lg"> <span className=" text-3xl text-zinc-50 opacity-100">Barang impianmu cuma sejauh satu klik.</span> <br /> Temukan, bidik, dan miliki sekarang!</p>
          </div>
          <p className="text-white font-montserrat mb-2 opacity-70">Click disini</p>
          <Link href="/auctions">
            <button className="px-8 py-2 bg-sky-900 shadow rounded-lg text-zinc-100 font-medium font-montserrat hover:bg-sky-950 hover:text-white transition-all duration-300 ease-initial cursor-pointer">Get Started</button>
          </Link>
        </div>
      </section>

      <footer className="-mt-50 flex items-end py-10 bg-gray-900 rounded-t-3xl min-h-[60vh]">
        <Footer></Footer>
      </footer>

    </section>

    </>
  );
}
