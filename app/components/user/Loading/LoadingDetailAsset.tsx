export default function LoadingDetailAsset() {
  return (
    <section className="font-poppins animate-pulse">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 lg:p-12 flex flex-col justify-between space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row lg:flex-row-reverse gap-8 lg:justify-between">
            {/* Gambar */}
            <div className="w-full lg:w-1/2 h-64 bg-gray-200 rounded-lg" />

            {/* Info Barang */}
            <div className="flex flex-col justify-between space-y-4 w-full lg:w-1/2">
              {/* Judul + Status + Action */}
              <div className="flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-6 bg-gray-200 rounded-sm" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                </div>
                <div className="w-48 h-8 bg-gray-200 rounded" />
              </div>

              {/* Kategori */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                <div className="w-24 h-4 bg-gray-200 rounded" />
              </div>

              {/* Harga */}
              <div>
                <div className="w-20 h-4 bg-gray-200 rounded" />
                <div className="w-32 h-6 bg-gray-200 rounded mt-2" />
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <div className="w-32 h-5 bg-gray-200 rounded" />
                <div className="w-full h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Waktu Lelang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-md p-4 shadow-md space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded" />
              <div className="w-32 h-5 bg-gray-200 rounded" />
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
            <div className="bg-gray-50 rounded-md p-4 shadow-md space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded" />
              <div className="w-32 h-5 bg-gray-200 rounded" />
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Tombol */}
          <div className="w-full h-12 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </section>
  );
}
