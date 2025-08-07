import Product from "../components/Product";


export default function Home() {
  return (
    <>
    <div className=" w-120 h-120 bg-transparent rounded-full absolute left-50 top-20 backdrop-blur-2xl z-[-1]"></div>
    <div className=" w-25 h-25 bg-blue-600   rounded-full absolute left-70 top-40  z-[-2] animate-pulse"></div>
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
    </>
  );
}
