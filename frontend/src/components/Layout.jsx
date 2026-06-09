import { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CambiarPasswordModal from './CambiarPasswordModal';

const navigation = (rol) => {
  const common = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Mis Tareas', href: '/mis-tareas' },
    { name: 'Reservas', href: '/reservas' }  
  ];
  if (rol === 'admin') {
    return [...common, { name: 'Crear Tarea', href: '/crear-tarea' }];
  }
  return common;
};

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navItems = navigation(user?.rol);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-indigo-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <span className="text-white font-bold text-xl">MUCE Seguimiento</span>
                  </div>
                  {/* Desktop navigation */}
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:border-white"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* User menu (visible en escritorio y tablets) */}
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex items-center rounded-full bg-indigo-800 text-sm focus:outline-none focus:ring-2 focus:ring-white px-3 py-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-sm font-medium">{user?.nombre}</span>
                          <span className="text-indigo-200 text-xs bg-indigo-700 px-2 py-0.5 rounded-full">
                            {user?.rol === 'admin' ? 'Admin' : 'Operador'}
                          </span>
                          <div className="h-8 w-8 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center">
                            {user?.nombre?.charAt(0) || 'U'}
                          </div>
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setShowPasswordModal(true)}
                              className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              Cambiar contraseña
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              Cerrar sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Abrir menú principal</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu panel */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-white hover:border-white hover:bg-indigo-500"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-indigo-700 pt-4 pb-3">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center">
                        {user?.nombre?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{user?.nombre}</div>
                      <div className="text-sm font-medium text-indigo-200">
                        {user?.rol === 'admin' ? 'Administrador' : 'Operador'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 rounded-md"
                    >
                      Cambiar contraseña
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 rounded-md"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <CambiarPasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}