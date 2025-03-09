export default function About() {
    return (
        <div className="overflow-hidden bg-gray-950 text-white py-24 sm:py-32">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <div className="max-w-4xl">
                    <p className="text-base/7 font-semibold text-white">À propos de notre hôtel</p>
                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
                        Un séjour luxueux pour chaque invité
                    </h1>
                    <p className="mt-6 text-xl/8 text-balance text-white">
                        Situé au cœur de la ville, notre hôtel offre un mélange parfait de confort et d'élégance. Que
                        vous soyez ici pour affaires ou pour le loisir, nous vous offrons une expérience inoubliable
                        avec un service exceptionnel.
                    </p>
                </div>
                <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
                    <div className="lg:pr-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-pretty text-white">Notre mission</h2>
                        <p className="mt-6 text-base/7 text-white">
                            Notre mission est de fournir à chaque client un séjour relaxant et mémorable. Nous sommes
                            fiers d'offrir des installations de classe mondiale, des chambres spacieuses et des services
                            personnalisés. Dès que vous franchissez les portes de notre hôtel, nous nous engageons à
                            rendre votre visite exceptionnelle.
                        </p>
                        <p className="mt-8 text-base/7 text-white">
                            Nous croyons en la durabilité et en des pratiques respectueuses de l'environnement. Notre
                            hôtel s'efforce de réduire son empreinte écologique tout en offrant les plus hauts standards
                            de confort et de luxe à nos clients.
                        </p>
                    </div>
                    <div className="pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto">
                        <div
                            className="-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8">
                            <div
                                className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10">
                                <img
                                    alt="Chambre de luxe"
                                    src="/about/hotel4.jpg"
                                    className="block size-full object-cover"
                                />
                            </div>
                            <div
                                className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40">
                                <img
                                    alt="Hall d'entrée"
                                    src="/about/hotel1.jpg"
                                    className="block size-full object-cover"
                                />
                            </div>
                            <div
                                className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10">
                                <img
                                    alt="Piscine"
                                    src="/about/hotel2.jpg"
                                    className="block size-full object-cover"
                                />
                            </div>
                            <div
                                className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40">
                                <img
                                    alt="Restaurant"
                                    src="/about/hotel3.jpg"
                                    className="block size-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="max-lg:mt-16 lg:col-span-1">
                        <p className="text-base/7 font-semibold text-white">Nos principaux atouts</p>
                        <hr className="mt-6 border-t border-gray-200"/>
                        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
                                <dt className="text-sm/6 text-white">Chambres de luxe</dt>
                                <dd className="order-first text-6xl font-semibold tracking-tight">
                                    200+
                                </dd>
                            </div>
                            <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
                                <dt className="text-sm/6 text-white">Piscines</dt>
                                <dd className="order-first text-6xl font-semibold tracking-tight">
                                    3
                                </dd>
                            </div>
                            <div
                                className="flex flex-col gap-y-2 max-sm:border-b max-sm:border-dotted max-sm:border-gray-200 max-sm:pb-4">
                                <dt className="text-sm/6 text-white">Restaurants</dt>
                                <dd className="order-first text-6xl font-semibold tracking-tight">
                                    4
                                </dd>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <dt className="text-sm/6 text-white">Spa & Bien-être</dt>
                                <dd className="order-first text-6xl font-semibold tracking-tight">
                                    1
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>
            </div>
        </div>
    );
}

