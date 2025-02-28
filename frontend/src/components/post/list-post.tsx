import {StarIcon} from "@heroicons/react/20/solid";

const products = [
    {
        id: 1,
        name: 'Machined Pen',
        color: 'Black',
        price: '$35',
        href: '#',
        imageSrc: 'https://assets.graydientcreative.com/files/outlets/platinum/images/marquis-3-min.jpg',
        imageAlt: 'Black machined steel pen with hexagonal grip and small white logo at top.',
        availableColors: [
            { name: 'Black', colorBg: '#111827' },
            { name: 'Brass', colorBg: '#FDE68A' },
            { name: 'Chrome', colorBg: '#E5E7EB' },
        ],
    },
    // More products...
]

export default function Example() {
    return (
        <div className="bg-white">
            <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8">
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending products</h2>
                    <a href="#" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
                        See everything
                        <span aria-hidden="true"> &rarr;</span>
                    </a>
                </div>

                <div className="relative mt-8">
                    <div className="relative -mb-6 w-full overflow-x-auto pb-6">
                        <ul
                            role="list"
                            className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0"
                        >
                            {products.map((product) => (
                                <li key={product.id} className="inline-flex w-64 flex-col text-center lg:w-auto">
                                    <div className="group relative">
                                        <img
                                            alt={product.imageAlt}
                                            src={product.imageSrc}
                                            className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75"
                                        />
                                        <div className="mt-6">
                                            <p className="text-sm text-gray-500">{product.color}</p>
                                            <h3 className="mt-1 font-semibold text-gray-900">
                                                <a href={product.href}>
                                                    <span className="absolute inset-0"/>
                                                    {product.name}
                                                </a>
                                            </h3>
                                            <p className="mt-1 text-gray-900">{product.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center ">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                aria-hidden="true"
                                                className='text-yellow-400 w-5 '
                                            />
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex px-4 sm:hidden">
                    <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                        See everything
                        <span aria-hidden="true"> &rarr;</span>
                    </a>
                </div>
            </div>
        </div>
    )
}
