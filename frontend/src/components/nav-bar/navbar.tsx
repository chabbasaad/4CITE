import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { BellIcon } from '@heroicons/react/24/outline';
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

export function NavBar() {
    const user : boolean = false;
    return (
        <div className="bg-background">
            <nav className="bg-gray-950">
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex items-center px-2 lg:px-0">

                            <div className="hidden lg:ml-6 lg:block">
                                <div className="flex space-x-4">
                                    <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white hover:text-gray-950">
                                        Hotel
                                    </a>
                                    <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white hover:text-gray-950">
                                        Nous
                                    </a>
                                    <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white hover:text-gray-950">
                                        Reservation
                                    </a>

                                </div>
                            </div>
                        </div>
                        <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                            <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
                                <input
                                    name="search"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    className="col-start-1 row-start-1 block w-full rounded-md bg-gray-700 py-1.5 pr-3 pl-10 text-base text-white outline-hidden placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400 sm:text-sm/6"
                                />
                                <MagnifyingGlassIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
                                />
                            </div>
                        </div>
                        <div className="hidden lg:ml-4 lg:block">
                            {user ?
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="relative shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="size-6" />
                                </button>

                                <Menu as="div" className="relative ml-4 shrink-0">

                                    <div>
                                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                            <img
                                                alt=""
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                className="size-8 rounded-full"
                                            />
                                        </MenuButton>
                                    </div>
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden">
                                        <MenuItem>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Settings
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Sign out
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>

                            </div>
                                    :
                                    <div>
                                    <Button variant="outline" className='m-1' size="sm" asChild>
                                    <Link to="/login">Login</Link>
                                    </Button>
                                    <Button size="sm" className='m-1' asChild>
                                    <Link to="/signup">Register</Link>
                                    </Button>
                                    </div>
                                }
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
