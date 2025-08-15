export default function Footer() {
    return(
        <>
            <footer className="text-zinc-300  font-montserrat px-20">
                <div className="flex justify-between">

                    <div className="w-1/2">
                        <div className="mb-10">
                            <h1 className="mb-4 text-white">Lelangin</h1>
                            <p className=" text-xs w-1/2">Platform lelang modern yang menawarkan pengalaman cepat, terpercaya, dan menyenangkan, dengan komitmen pada kesempatan yang adil bagi semua.</p>
                        </div>

                        <div className="flex gap-10">
                            <div>
                                <h1 className="text-white mb-2">Telephone</h1>
                                <p className="text-xs">+62 858 1343 0008</p>
                            </div>
                            <div>
                                <h1 className="text-white mb-2">Email</h1>
                                <p className="text-xs">lelangin@gmail.com</p>
                            </div>
                            <div className="flex mt-auto">
                                <p className="text-xs">&copy; 2025 Lelangin. All rights reserved.</p>
                            </div>
                        </div>
                    </div>

                    

                    <div className="flex gap-15">
                        <div>
                            <h1 className="text-white mb-4">Quick Links</h1>
                            <ul className="text-xs space-y-2">
                                <li>Pricing</li>
                                <li>Resources</li>
                                <li>About</li>
                                <li>FAQ</li>
                                <li>Contact Us</li>
                            </ul>
                        </div>
                        <div>
                            <h1 className="text-white mb-4">Social Media</h1>
                            <ul className="text-xs space-y-2">
                                <li>Facebook</li>
                                <li>Instagram</li>
                                <li>Linkedin</li>
                                <li>Twitter</li>
                            </ul>
                        </div>
                        <div>
                            <h1 className="text-white mb-4">Legal</h1>
                            <ul className="text-xs space-y-2">
                                <li className="underline">Terms</li>
                                <li className="underline">Privacy</li>
                                <li className="underline">Cookie</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </footer>
        </>
    )
}