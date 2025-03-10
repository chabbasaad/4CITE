import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../../connexion/login/login";
import Register from "../../connexion/register/register";
import { Dialog } from '../../components/kit-ui/dialog';
import { Button } from "../../components/kit-ui/button";

type NavigationItem = {
    name: string;
    href: string;
    current: boolean;
};

const navigation: NavigationItem[] = [
    { name: 'Accueil', href: '/', current: false },
    { name: 'Hotel', href: '/hotel', current: false },
    { name: 'Nous', href: '/nous', current: false },
];

const navigationEmployee: NavigationItem[] = [
    { name: 'Accueil', href: '/', current: false },
    { name: 'Hotel', href: '/hotel', current: false },
    { name: 'Nous', href: '/nous', current: false },
    { name: 'Gestion Reservation', href: '/admin/gestion-booking', current: false },
];

const navigationAdmin: NavigationItem[] = [
    { name: 'Accueil', href: '/', current: false },
    { name: 'Nous', href: '/nous', current: false },
    { name: 'Hotel', href: '/hotel', current: false },
    { name: 'Gestion User', href: '/admin/gestion-users', current: false },
    { name: 'Gestion Hotel', href: '/admin/gestion-hotel', current: false },
    { name: 'Gestion Reservation', href: '/admin/gestion-booking', current: false },
];

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {
    const userData = localStorage.getItem("user_data");
    const user = userData ? JSON.parse(userData) as { role?: string } : null;
    const userRole = user?.role || "";

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenRegister, setIsOpenRegister] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_data");
        window.location.reload();
    };

    // Détermine la navigation en fonction du rôle de l'utilisateur
    const navigationLinks = userRole === "admin" ? navigationAdmin : userRole === "employee" ? navigationEmployee : navigation;

    return (
        <Disclosure>
            <nav className="bg-gray-950 fixed w-full top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        {/* Mobile menu button */}
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                {({ open }) => (
                                    <>
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </>
                                )}
                            </Disclosure.Button>
                        </div>

                        {/* Desktop navigation */}
                        <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    {navigationLinks.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-900 text-white'
                                                    : 'text-gray-300 hover:bg-white hover:text-gray-950',
                                                'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200'
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* User menu / Auth buttons */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {user ? (
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                alt="Profile"
                                                src="/users/user.jpg"
                                                className="h-8 w-8 rounded-full"
                                            />
                                        </MenuButton>
                                    </div>
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        {/* Afficher "Voir Profil" uniquement si l'utilisateur n'est pas admin ou employé */}
                                        {userRole !== "admin" && userRole !== "employee" && (
                                            <MenuItem>
                                                {({ active }) => (
                                                    <Link
                                                        to="/profile"
                                                        className={classNames(
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm text-gray-700'
                                                        )}
                                                    >
                                                        Votre Profil
                                                    </Link>
                                                )}
                                            </MenuItem>
                                        )}
                                        <MenuItem>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={classNames(
                                                        active ? 'bg-gray-100' : '',
                                                        'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                                    )}
                                                >
                                                    Se déconnecter
                                                </button>
                                            )}
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        color="white"
                                        className="hidden sm:block"
                                        onClick={() => setIsOpen(true)}
                                    >
                                        Connexion
                                    </Button>
                                    <Button
                                        color="white"
                                        className="hidden sm:block"
                                        onClick={() => setIsOpenRegister(true)}
                                    >
                                        Inscription
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <Disclosure.Panel className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navigationLinks.map((item) => (
                            <Disclosure.Button
                                key={item.name}
                                as={Link}
                                to={item.href}
                                className={classNames(
                                    item.current
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium'
                                )}
                            >
                                {item.name}
                            </Disclosure.Button>
                        ))}
                        {!user && (
                            <>
                                <Disclosure.Button
                                    as="button"
                                    className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                                    onClick={() => setIsOpen(true)}
                                >
                                    Connexion
                                </Disclosure.Button>
                                <Disclosure.Button
                                    as="button"
                                    className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                                    onClick={() => setIsOpenRegister(true)}
                                >
                                    Inscription
                                </Disclosure.Button>
                            </>
                        )}
                    </div>
                </Disclosure.Panel>
            </nav>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <Login closeModal={() => setIsOpen(false)} />
            </Dialog>
            <Dialog open={isOpenRegister} onClose={() => setIsOpenRegister(false)}>
                <Register closeModal={() => setIsOpenRegister(false)} />
            </Dialog>
        </Disclosure>
    );
}
