export default function About() {
    return(
        <>
        <section className="w-[100vm] min-h-[100vh] flex flex-col justify-center p-5 px-50">
            <div className=" w-120 h-120 bg-transparent rounded-full absolute left-20 top-30 backdrop-blur-2xl z-[-1]"></div>
            <div className=" w-25 h-25 bg-teal-600   rounded-full absolute left-40 top-50  z-[-2] animate-pulse"></div> 
        <div className="mb-14 mt-16">
            <h1 className="font-montserrat font-medium text-5xl">Tentang Kami</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div className="p-8 bg-neutral-200 shadow-md rounded-2xl">
            <h1 className="font-montserrat text-2xl font-medium mb-2 text-gray-800">Mudah, Aman, dan Transparan</h1>
            <p className="font-montserrat  ">Platform lelang modern yang menawarkan pengalaman cepat, terpercaya, dan menyenangkan, dengan komitmen pada kesempatan yang adil bagi semua. dalam <span className="text-blue-600 font-semibold"> proses lelang – tanpa ribet, tanpa biaya tersembunyi, dan tanpa rasa khawatir.</span></p>
        </div>
        <div className="p-8 bg-neutral-200 shadow-md rounded-2xl">
            <h1 className="font-montserrat text-2xl font-medium mb-2 text-gray-800">Siapa Kami?</h1>
            <p className="font-montserrat ">Kami adalah pelajar teknologi yang berpengalaman dan memiliki passion di bidang sistem informasi digital, kami menggabungkan <span className="font-semibold text-blue-600"> desain user-friendly, dan teknologi terkini </span> untuk menciptakan pengalaman lelang terbaik bagi semua pengguna.</p>    
        </div>        
        <div className="p-8 bg-neutral-200 shadow-md rounded-2xl">
            <h1 className="font-montserrat text-2xl font-medium mb-2 text-gray-800">Misi Kami</h1>
            <p className="font-montserrat ">Mendemokratisasi pelelangan digital melalui ekosistem yang <span className="font-semibold text-blue-600"> transparan, inovatif, dan nyaman,</span> serta menciptakan ruang aman bagi penjual dan pembeli untuk bertransaksi dan membangun kepercayaan.</p>    
        </div>        
        <div className="p-8 bg-neutral-200 shadow-md rounded-2xl">
            <h1 className="font-montserrat text-2xl font-medium mb-2 text-gray-800">Visi Kami</h1>
            <p className="font-montserrat ">Menjadi <span className="font-semibold text-blue-600">platform lelang digital terpercaya di Indonesia</span> yang menghadirkan pengalaman lelang yang aman, seru, dan mudah diakses oleh siapa pun, kapan pun.</p>    
        </div>
        </div>

        </section>

        <section className="w-[100vm] min-h-[100vh] justify-center flex flex-col px-24">
        <div className="p-22 shadow-xl rounded-4xl">

        <div className="mb-16 flex flex-col justify-between">
            <p className="font-montserrat mb-2 text-blue-600 font-medium">Kelebihan Kami</p>
            <div className="flex">
                <h1 className="w-3/4 font-montserrat text-5xl text-gray-800 font-medium mb-2">Apa yang Membuat Kami Berbeda?</h1> 
                <p className="w-1/3 font-montserrat">Bukan sekadar platform. Kami hadir dengan kecepatan, kepercayaan, dan kenyamanan yang membuat pelelangan terasa beda dari yang lain.</p>
            </div>
        </div>

        <div className="flex gap-12">
        <div className="">
            <i className="ri-file-list-3-line text-6xl text-blue-600"></i>
            <h1 className="font-montserrat text-2xl font-medium mt-8 mb-2">Proses Pendaftaran Mudah</h1>
            <p className="font-montserrat">Cukup daftar, beli NIPL, dan kamu sudah siap mengikuti lelang.</p>
        </div>
        <div className="">
            <i className="ri-timer-flash-line text-6xl text-blue-600"></i>
            <h1 className="font-montserrat text-2xl font-medium mt-8 mb-2">Sistem Real-time</h1>
            <p className="font-montserrat">Pantau jalannya lelang secara langsung, tanpa delay.</p>    
        </div>        
        <div className="">
            <i className="ri-customer-service-2-line text-6xl text-blue-600"></i>
            <h1 className="font-montserrat text-2xl font-medium mt-8 mb-2">Dukungan Penuh</h1>
            <p className="font-montserrat">Tim support kami siap membantu 24/7.</p>    
        </div>        
        </div>

        </div>
        </section>
        </>
    )
}