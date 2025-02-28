import {
    Disclosure,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
} from '@headlessui/react'
import {Dialog} from "../kit-ui/dialog.tsx";
import {useState} from "react";
import { Button } from '../kit-ui/button.tsx';
import Login from "../../connexion/login/Login.tsx";
import Register from "../../connexion/register/Register.tsx";
const navigation = [
    { name: 'Home', href: '#', current: true },
    { name: 'Hotel', href: '#', current: false },
    { name: 'Reservation', href: '#', current: false },
]


function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {
    const user : boolean = false;
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenRegister, setIsOpenRegister] = useState(false)

    return (
        <Disclosure as="nav" className="bg-gray-950">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    {user ?
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        alt=""
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        className="size-8 rounded-full"
                                    />
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                    >
                                        Your Profile
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                    >
                                        Settings
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                    >
                                        Sign out
                                    </a>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                        :
                        <div>
                            <Button color='white' className="mr-1" type="button" onClick={() => setIsOpen(true)}>
                                Login
                            </Button>
                            <Button color='white' className="mr-1" type="button" onClick={() => setIsOpenRegister(true)}>
                                Register
                            </Button>
                        </div>
                    }
                </div>
            </div>

            <Dialog open={isOpen} onClose={setIsOpen}>
               <Login/>
            </Dialog>
            <Dialog open={isOpenRegister} onClose={setIsOpenRegister}>
                <Register/>
            </Dialog>
        </Disclosure>
    )
}
