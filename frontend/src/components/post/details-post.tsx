'use client'
import {

    Radio,
    RadioGroup,

} from '@headlessui/react'
import {

    ShieldCheckIcon,

} from '@heroicons/react/24/outline'
import { CheckIcon, QuestionMarkCircleIcon, StarIcon } from '@heroicons/react/20/solid'
import {useState} from "react";

const product = {
    name: 'Everyday Ruck Snack',
    href: '#',
    price: '$220',
    description:
        "Don't compromise on snack-carrying capacity with this lightweight and spacious bag. The drawstring top keeps all your favorite chips, crisps, fries, biscuits, crackers, and cookies secure.",
    imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-04-featured-product-shot.jpg',
    imageAlt: 'Light green canvas bag with black straps, handle, front zipper pouch, and drawstring top.',
    breadcrumbs: [
        { id: 1, name: 'Travel', href: '#' },
        { id: 2, name: 'Bags', href: '#' },
    ],
    sizes: [
        { name: '18L', description: 'Perfect for a reasonable amount of snacks.' },
        { name: '20L', description: 'Enough room for a serious amount of snacks.' },
    ],
}
const policies = [
    {
        name: 'Free delivery all year long',
        description:
            'Name another place that offers year long free delivery? We’ll be waiting. Order now and you’ll get delivery absolutely free.',
        imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce/icons/icon-delivery-light.svg',
    },
    {
        name: '24/7 Customer Support',
        description:
            'Or so we want you to believe. In reality our chat widget is powered by a naive series of if/else statements that churn out canned responses. Guaranteed to irritate.',
        imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce/icons/icon-chat-light.svg',
    },
    {
        name: 'Fast Shopping Cart',
        description:
            "Look at the cart in that icon, there's never been a faster cart. What does this mean for the actual checkout experience? I don't know.",
        imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce/icons/icon-fast-checkout-light.svg',
    },
    {
        name: 'Gift Cards',
        description:
            "We sell these hoping that you will buy them for your friends and they will never actually use it. Free money for us, it's great.",
        imageSrc: 'https://tailwindui.com/plus-assets/img/ecommerce/icons/icon-gift-card-light.svg',
    },
]
const reviews = {
    average: 4,
    totalCount: 1624,
    counts: [
        { rating: 5, count: 1019 },
        { rating: 4, count: 162 },
        { rating: 3, count: 97 },
        { rating: 2, count: 199 },
        { rating: 1, count: 147 },
    ],
    featured: [
        {
            id: 1,
            rating: 5,
            content: `
        <p>This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.</p>
      `,
            author: 'Emily Selman',
            avatarSrc:
                'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        },
        // More reviews...
    ],
}
const footerNavigation = {
    products: [
        { name: 'Bags', href: '#' },
        { name: 'Tees', href: '#' },
        { name: 'Objects', href: '#' },
        { name: 'Home Goods', href: '#' },
        { name: 'Accessories', href: '#' },
    ],
    company: [
        { name: 'Who we are', href: '#' },
        { name: 'Sustainability', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Terms & Conditions', href: '#' },
        { name: 'Privacy', href: '#' },
    ],
    customerService: [
        { name: 'Contact', href: '#' },
        { name: 'Shipping', href: '#' },
        { name: 'Returns', href: '#' },
        { name: 'Warranty', href: '#' },
        { name: 'Secure Payments', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Find a store', href: '#' },
    ],
}


function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}


export default function DetailsPost() {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0])

    return (
        <div className="bg-gray-50">
            <main>
                <div className="bg-white">
                    <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:max-w-lg lg:self-end">
                            <nav aria-label="Breadcrumb">
                                <ol role="list" className="flex items-center space-x-2">
                                    {product.breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
                                        <li key={breadcrumb.id}>
                                            <div className="flex items-center text-sm">
                                                <a href={breadcrumb.href} className="font-medium text-gray-500 hover:text-gray-900">
                                                    {breadcrumb.name}
                                                </a>
                                                {breadcrumbIdx !== product.breadcrumbs.length - 1 ? (
                                                    <svg
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        aria-hidden="true"
                                                        className="ml-2 size-5 shrink-0 text-gray-300"
                                                    >
                                                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                                    </svg>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            <div className="mt-4">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
                            </div>

                            <section aria-labelledby="information-heading" className="mt-4">
                                <h2 id="information-heading" className="sr-only">
                                    Product information
                                </h2>

                                <div className="flex items-center">
                                    <p className="text-lg text-gray-900 sm:text-xl">{product.price}</p>

                                    <div className="ml-4 border-l border-gray-300 pl-4">
                                        <h2 className="sr-only">Reviews</h2>
                                        <div className="flex items-center">
                                            <div>
                                                <div className="flex items-center">
                                                    {[0, 1, 2, 3, 4].map((rating) => (
                                                        <StarIcon
                                                            key={rating}
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                reviews.average > rating ? 'text-yellow-400' : 'text-gray-300',
                                                                'size-5 shrink-0',
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="sr-only">{reviews.average} out of 5 stars</p>
                                            </div>
                                            <p className="ml-2 text-sm text-gray-500">{reviews.totalCount} reviews</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-6">
                                    <p className="text-base text-gray-500">{product.description}</p>
                                </div>

                                <div className="mt-6 flex items-center">
                                    <CheckIcon aria-hidden="true" className="size-5 shrink-0 text-green-500" />
                                    <p className="ml-2 text-sm text-gray-500">In stock and ready to ship</p>
                                </div>
                            </section>
                        </div>

                        {/* Product image */}
                        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
                            <img
                                alt={product.imageAlt}
                                src={product.imageSrc}
                                className="aspect-square w-full rounded-lg object-cover"
                            />
                        </div>

                        {/* Product form */}
                        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
                            <section aria-labelledby="options-heading">
                                <h2 id="options-heading" className="sr-only">
                                    Product options
                                </h2>

                                <form>
                                    <div className="sm:flex sm:justify-between">
                                        {/* Size selector */}
                                        <fieldset>
                                            <legend className="block text-sm font-medium text-gray-700">Size</legend>
                                            <RadioGroup
                                                value={selectedSize}
                                                onChange={setSelectedSize}
                                                className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2"
                                            >
                                                {product.sizes.map((size) => (
                                                    <Radio
                                                        key={size.name}
                                                        as="div"
                                                        value={size}
                                                        aria-label={size.name}
                                                        aria-description={size.description}
                                                        className="group relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-hidden data-focus:ring-2 data-focus:ring-indigo-500"
                                                    >
                                                        <p className="text-base font-medium text-gray-900">{size.name}</p>
                                                        <p className="mt-1 text-sm text-gray-500">{size.description}</p>
                                                        <div
                                                            aria-hidden="true"
                                                            className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-checked:border-indigo-500 group-data-focus:border"
                                                        />
                                                    </Radio>
                                                ))}
                                            </RadioGroup>
                                        </fieldset>
                                    </div>
                                    <div className="mt-4">
                                        <a href="#" className="group inline-flex text-sm text-gray-500 hover:text-gray-700">
                                            <span>What size should I buy?</span>
                                            <QuestionMarkCircleIcon
                                                aria-hidden="true"
                                                className="ml-2 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                                            />
                                        </a>
                                    </div>
                                    <div className="mt-10">
                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
                                        >
                                            Add to bag
                                        </button>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <a href="#" className="group inline-flex text-base font-medium">
                                            <ShieldCheckIcon
                                                aria-hidden="true"
                                                className="mr-2 size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                                            />
                                            <span className="text-gray-500 hover:text-gray-700">Lifetime Guarantee</span>
                                        </a>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
                    {/* Details section */}
                    <section aria-labelledby="details-heading">
                        <div className="flex flex-col items-center text-center">
                            <h2 id="details-heading" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                The Fine Details
                            </h2>
                            <p className="mt-3 max-w-3xl text-lg text-gray-600">
                                Our patented padded snack sleeve construction protects your favorite treats from getting smooshed during
                                all-day adventures, long shifts at work, and tough travel schedules.
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8">
                            <div>
                                <img
                                    alt="Drawstring top with elastic loop closure and textured interior padding."
                                    src="https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg"
                                    className="aspect-3/2 w-full rounded-lg object-cover"
                                />
                                <p className="mt-8 text-base text-gray-500">
                                    The 20L model has enough space for 370 candy bars, 6 cylinders of chips, 1,220 standard gumballs, or
                                    any combination of on-the-go treats that your heart desires. Yes, we did the math.
                                </p>
                            </div>
                            <div>
                                <img
                                    alt="Front zipper pouch with included key ring."
                                    src="https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-02.jpg"
                                    className="aspect-3/2 w-full rounded-lg object-cover"
                                />
                                <p className="mt-8 text-base text-gray-500">
                                    Up your snack organization game with multiple compartment options. The quick-access stash pouch is
                                    ready for even the most unexpected snack attacks and sharing needs.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Policies section */}
                    <section aria-labelledby="policy-heading" className="mt-16 lg:mt-24">
                        <h2 id="policy-heading" className="sr-only">
                            Our policies
                        </h2>
                        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
                            {policies.map((policy) => (
                                <div key={policy.name}>
                                    <img alt="" src={policy.imageSrc} className="h-24 w-auto" />
                                    <h3 className="mt-6 text-base font-medium text-gray-900">{policy.name}</h3>
                                    <p className="mt-3 text-base text-gray-500">{policy.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <section aria-labelledby="reviews-heading" className="bg-white">
                    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-32">
                        <div className="lg:col-span-4">
                            <h2 id="reviews-heading" className="text-2xl font-bold tracking-tight text-gray-900">
                                Customer Reviews
                            </h2>

                            <div className="mt-3 flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                aria-hidden="true"
                                                className={classNames(
                                                    reviews.average > rating ? 'text-yellow-400' : 'text-gray-300',
                                                    'size-5 shrink-0',
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="sr-only">{reviews.average} out of 5 stars</p>
                                </div>
                                <p className="ml-2 text-sm text-gray-900">Based on {reviews.totalCount} reviews</p>
                            </div>

                            <div className="mt-6">
                                <h3 className="sr-only">Review data</h3>

                                <dl className="space-y-3">
                                    {reviews.counts.map((count) => (
                                        <div key={count.rating} className="flex items-center text-sm">
                                            <dt className="flex flex-1 items-center">
                                                <p className="w-3 font-medium text-gray-900">
                                                    {count.rating}
                                                    <span className="sr-only"> star reviews</span>
                                                </p>
                                                <div aria-hidden="true" className="ml-1 flex flex-1 items-center">
                                                    <StarIcon
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            count.count > 0 ? 'text-yellow-400' : 'text-gray-300',
                                                            'size-5 shrink-0',
                                                        )}
                                                    />

                                                    <div className="relative ml-3 flex-1">
                                                        <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                                                        {count.count > 0 ? (
                                                            <div
                                                                style={{ width: `calc(${count.count} / ${reviews.totalCount} * 100%)` }}
                                                                className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                                            />
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </dt>
                                            <dd className="ml-3 w-10 text-right text-sm text-gray-900 tabular-nums">
                                                {Math.round((count.count / reviews.totalCount) * 100)}%
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="mt-10">
                                <h3 className="text-lg font-medium text-gray-900">Share your thoughts</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    If you’ve used this product, share your thoughts with other customers
                                </p>

                                <a
                                    href="#"
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
                                >
                                    Write a review
                                </a>
                            </div>
                        </div>

                        <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                            <h3 className="sr-only">Recent reviews</h3>

                            <div className="flow-root">
                                <div className="-my-12 divide-y divide-gray-200">
                                    {reviews.featured.map((review) => (
                                        <div key={review.id} className="py-12">
                                            <div className="flex items-center">
                                                <img alt={`${review.author}.`} src={review.avatarSrc} className="size-12 rounded-full" />
                                                <div className="ml-4">
                                                    <h4 className="text-sm font-bold text-gray-900">{review.author}</h4>
                                                    <div className="mt-1 flex items-center">
                                                        {[0, 1, 2, 3, 4].map((rating) => (
                                                            <StarIcon
                                                                key={rating}
                                                                aria-hidden="true"
                                                                className={classNames(
                                                                    review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                                                                    'size-5 shrink-0',
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="sr-only">{review.rating} out of 5 stars</p>
                                                </div>
                                            </div>

                                            <div
                                                dangerouslySetInnerHTML={{ __html: review.content }}
                                                className="mt-4 space-y-6 text-base text-gray-600 italic"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer aria-labelledby="footer-heading" className="bg-white">
                <h2 id="footer-heading" className="sr-only">
                    Footer
                </h2>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="border-t border-gray-200 py-20">
                        <div className="grid grid-cols-1 md:grid-flow-col md:auto-rows-min md:grid-cols-12 md:gap-x-8 md:gap-y-16">
                            {/* Image section */}
                            <div className="col-span-1 md:col-span-2 lg:col-start-1 lg:row-start-1">
                                <img
                                    alt=""
                                    src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                    className="h-8 w-auto"
                                />
                            </div>

                            {/* Sitemap sections */}
                            <div className="col-span-6 mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:col-start-3 md:row-start-1 md:mt-0 lg:col-span-6 lg:col-start-2">
                                <div className="grid grid-cols-1 gap-y-12 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Products</h3>
                                        <ul role="list" className="mt-6 space-y-6">
                                            {footerNavigation.products.map((item) => (
                                                <li key={item.name} className="text-sm">
                                                    <a href={item.href} className="text-gray-500 hover:text-gray-600">
                                                        {item.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Company</h3>
                                        <ul role="list" className="mt-6 space-y-6">
                                            {footerNavigation.company.map((item) => (
                                                <li key={item.name} className="text-sm">
                                                    <a href={item.href} className="text-gray-500 hover:text-gray-600">
                                                        {item.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Customer Service</h3>
                                    <ul role="list" className="mt-6 space-y-6">
                                        {footerNavigation.customerService.map((item) => (
                                            <li key={item.name} className="text-sm">
                                                <a href={item.href} className="text-gray-500 hover:text-gray-600">
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Newsletter section */}
                            <div className="mt-12 md:col-span-8 md:col-start-3 md:row-start-2 md:mt-0 lg:col-span-4 lg:col-start-9 lg:row-start-1">
                                <h3 className="text-sm font-medium text-gray-900">Sign up for our newsletter</h3>
                                <p className="mt-6 text-sm text-gray-500">The latest deals and savings, sent to your inbox weekly.</p>
                                <form className="mt-2 flex sm:max-w-md">
                                    <input
                                        id="email-address"
                                        type="text"
                                        required
                                        autoComplete="email"
                                        aria-label="Email address"
                                        className="block w-full rounded-md bg-white px-4 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    />
                                    <div className="ml-4 shrink-0">
                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                                        >
                                            Sign up
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 py-10 text-center">
                        <p className="text-sm text-gray-500">&copy; 2021 Your Company, Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
