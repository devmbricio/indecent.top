// components/Navbar.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import MobileNav from './MobileNav';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex-between fixed z-50 w-full px-6 py-4 lg:px-0">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/indecent-top-logo.png"
          width={42}
          height={42}
          alt="indecent.top – aqui tudo pode! logo"
          className="max-sm:size-10"
        />
        <p className="md:text-[26px] text-[20px]  font-extrabold text-[#ddc897] max-sm:hidden">
        indecent.top
        </p>
      </Link>
      <div className="flex-between gap-5">
        {session ? (
          <>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-[#ddc897] font-medium hover:underline"
            >
              Sair
            </button>
          </>
        ) : (
          <Link href="/sign-in" className="text-[#ddc897] font-medium hover:underline">
            Entrar
          </Link>
        )}
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;

/*


import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="yoom logo"
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold text-[#ddc897] max-sm:hidden">
          YOOM
        </p>
      </Link>
      <div className="flex-between gap-5">
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
*/