import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../../connexion/login/login";
import Register from "../../connexion/register/register";
import { Dialog } from '../../components/kit-ui/dialog';
import { Button } from "../../components/kit-ui/button";

// Définition des types de navigation
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

const navigationAdmin: NavigationItem[] = [
    { name: 'Accueil', href: '/', current: false },
    { name: 'Nous', href: '/nous', current: false },
    { name: 'Gestion User', href: 'admin/gestion-users', current: false },
    { name: 'Gestion Hotel', href: 'admin/gestion-hotel', current: false },
    { name: 'Gestion Reservation', href: 'admin/gestion-booking', current: false },
];

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {
    const userData = localStorage.getItem("user_data");
    const user = userData ? JSON.parse(userData) as { role?: string } : null;
    const userRole = user?.role || "user";

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenRegister, setIsOpenRegister] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_data");
        window.location.reload();
    };

    const navigationLinks = userRole === "admin" ? navigationAdmin : navigation;

    return (
        <Disclosure as="nav" className="bg-gray-950">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigationLinks.map((item) => (
                                    <Link
                                        to={item.href}
                                        key={item.name}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                            item.current
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-white hover:text-gray-950',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    {user ? (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Ouvrir le menu utilisateur</span>
                                        <img
                                            alt="Photo de profil"
                                            src="/users/user.jpg"
                                            className="size-8 rounded-full"
                                        />
                                    </MenuButton>
                                </div>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                    <MenuItem>
                                        <Link
                                            to={'/profile'}
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                        >
                                            Votre Profil
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                        >
                                            Se déconnecter
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    ) : (
                        <div>
                            <Button color='white' className="mr-1" type="button" onClick={() => setIsOpen(true)}>
                                Connexion
                            </Button>
                            <Button color='white' className="mr-1" type="button" onClick={() => setIsOpenRegister(true)}>
                                Inscription
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <Login closeModal={() => setIsOpen(false)} />
            </Dialog>
            <Dialog open={isOpenRegister} onClose={() => setIsOpenRegister(false)}>
                <Register closeModal={() => setIsOpenRegister(false)} />
            </Dialog>
        </Disclosure>
    );
}
