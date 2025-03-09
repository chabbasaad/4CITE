import Footer from "../../../components/footer/footer";
import HotelList from "../../user/hotel/hotel-list";

export default function Home() {
    return (
        <>
            <div
                className="relative bg-cover bg-center "
                style={{backgroundImage: 'url("/about/hotel4.jpg")'}}
                data-testid="background-image"
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>

                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 text-center">
                    <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        Profitez d'un séjour inoubliable dans notre hôtel de luxe.
                    </h2>
                    <p className="mt-4 max-w-xl text-lg text-gray-200 mx-auto">
                        Découvrez un cadre exceptionnel avec des services haut de gamme pour un confort absolu.
                    </p>
                    <div className="mt-10 flex justify-center">
                        <a
                            href="#"
                            className="rounded-md bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-white hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Réserver maintenant
                        </a>
                    </div>
                </div>
            </div>

            <HotelList/>
            <Footer/>
        </>

    )
}
