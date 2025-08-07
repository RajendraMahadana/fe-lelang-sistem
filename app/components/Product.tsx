export default function Product() {
    const products = [
        { icon: "ri-car-line", label: "Mobil" },
        { icon: "ri-motorbike-line", label: "Motor" },
        { icon: "ri-tv-2-line", label: "Elektronik" },
        { icon: "ri-smartphone-line", label: "Handphone" },
        { icon: "ri-macbook-line", label: "Laptop" },
    ]
    
    return (
    <div className="w-full flex justify-center">
        <ul className="flex gap-5 bg-neutral-200 shadow-md rounded-lg font-montserrat">
            {products.map((item, index) => (
                <li key={index} className="px-8 py-3">
                    <i className={`${item.icon} text-blue-600`}></i> {item.label}
                </li>
            ))}
        </ul>
    </div>
)
}

