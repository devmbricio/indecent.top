'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botão para telas pequenas */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 block lg:hidden rounded-md p-1 text-gray-300 shadow-md focus:outline-none"
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <section
        className={cn(
          'fixed top-8 right-0 z-40 h-screen',
          'flex w-30 flex-col p-4 lg:relative lg:w-56 lg:translate-x-0',
          {
            'translate-x-0': isOpen,
            'translate-x-full': !isOpen && !window.matchMedia('(min-width: 1024px)').matches,
          },
          'transition-transform duration-300'
        )}
      >
        <div className="flex flex-col gap-4">
          {sidebarLinks.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

            return (
              <Link
                href={item.route}
                key={item.label}
                className={cn(
                  'flex gap-2 items-center p-2 rounded-lg transition-colors',
                  {
                    'text-gray-300': isActive,
                    'hover:bg-gray-100 dark:hover:bg-gray-700': !isActive,
                  }
                )}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={24}
                  height={24}
                />
                <p className="text-sm md:text-base">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tela sobreposta para fechar o menu em telas pequenas */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;



/*


'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="left-[10%] top-0 flex h-screen w-fit flex-col  justify-start pr-0 pt-[5%] dark:text-gray-300 text-gray-600 max-sm:hidden  lg:w-200px]">
      <div className="flex flex-col gap-4">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex gap-1 items-center pr-2 rounded-lg justify-start',
                {
                  'bg-blue-1': isActive,
                }
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
              />
              <p className="md:text-lg pl-2 text-sm max-lg:hidden">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
*/