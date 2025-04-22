"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();
  }, []);

  return (
    <header className="fixed z-50 top-0 left-0 w-full flex items-center justify-between bg-transparent py-2 px-4 md:px-4 sm:px-6">
      {!isLoggedIn ? (
        <>
          {/* Logo no lado esquerdo */}
          <Link href={"/painel"}>
            <Image
              src="/indecent-top-logo-gold.png"
              width={100}
              height={100}
              quality={100}
              sizes="40px"
              alt="Thumbnail"
              className="object-cover w-full h-full mr-2"
            />
          </Link>

          {/* Botão Entrar no lado direito */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              //href="/api/auth/signin"
              href="/topprofiles"
              className="hover:bg-blue-600 text-[#ddc897] py-1 px-3 text-sm rounded-md"
            >
              Entrar
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Layout para usuários logados */}
          <div className="w-full flex justify-between items-center">
            {/* Logo no lado esquerdo (telas grandes) */}
            <Link
              href={"/painel"}
              className="hidden sm:flex" // Exibe a logo no lado esquerdo em telas médias ou maiores
            >
              <Image
                src="/indecent-top-logo-gold.png"
                width={100}
                height={100}
                quality={100}
                sizes="40px"
                alt="Thumbnail"
                className="object-cover w-full h-full"
              />
            </Link>

            {/* Logo no canto superior direito (telas pequenas) */}
            <div className="absolute top-2 right-4 sm:hidden">
              <Image
                src="/indecent-top-logo-gold.png"
                width={100} // Tamanho menor para telas pequenas
                height={100}
                quality={100}
                sizes="40px"
                alt="Thumbnail"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;

/*
"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();
  }, []);

  return (
    <header className="fixed z-50 top-0 left-0 w-full flex items-center justify-between bg-transparent py-2 px-4 md:px-4 sm:px-6">
      {!isLoggedIn ? (
        <>
 
          <Link href={"/painel"}>
            <Image
              src="/indecent-top-logo-gold.png"
              width={100}
              height={100}
              quality={100}
              sizes="40px"
              alt="Thumbnail"
              className="object-cover w-full h-full mr-2"
            />
          </Link>

         
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/api/auth/signin"
              className="hover:bg-blue-600 text-[#ddc897] py-1 px-3 text-sm rounded-md"
            >
              Entrar
            </Link>
          </div>
        </>
      ) : (
        <>
     
          <div className="w-full flex justify-between items-center">
  
            <Link
              href={"/painel"}
              className="hidden sm:flex" // Exibe a logo no lado esquerdo em telas médias ou maiores
            >
              <Image
                src="/indecent-top-logo-gold.png"
                width={100}
                height={100}
                quality={100}
                sizes="40px"
                alt="Thumbnail"
                className="object-cover w-full h-full"
              />
            </Link>
 
            <div className="absolute top-2 right-4 sm:hidden">
              <Image
                src="/indecent-top-logo-gold.png"
                width={100} // Tamanho menor para telas pequenas
                height={100}
                quality={100}
                sizes="40px"
                alt="Thumbnail"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
*/



/*
"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { calSans } from "@/app/fonts";
import Image from "next/image";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();
  }, []);

  return (
    <header className="fixed z-50 top-0 left-0 w-full flex items-center justify-between bg-transparent py-2 px-4 md:px-4 sm:px-6">
 
      <Link href={"/painel"}>
        <Image
          src="/indecent-top-logo-gold.png"
          width={100}
          height={100}
          quality={100} // Aumenta a qualidade da imagem
          sizes="40px" // Garante que Next.js use essa largura
          alt="Thumbnail"
          className="object-cover w-full h-full mr-2"
        />
      </Link>

 
      <div className="flex items-center gap-3 sm:gap-4">
 
        {!isLoggedIn && (
          <Link
            href="/api/auth/signin"
            className="hover:bg-blue-600 text-[#ddc897] py-1 px-3 text-sm rounded-md"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
*/

/*
import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { calSans } from "@/app/fonts";
import Image from "next/image";

function Header() {
  return (
    <header className="fixed z-50 top-0 left-0 w-full flex items-center justify-between bg-transparent border-b border-zinc-300 dark:border-neutral-700 py-2 px-4 md:px-4 sm:px-6">

      <Link href={"/painel"}>
      <Image
                  src="/indecent-top-logo.png"
                  width={100}
                  height={100}
                  quality={100} // Aumenta a qualidade da imagem
                  sizes="40px" // Garante que Next.js use essa largura
                  alt="Thumbnail"
                  className="object-cover w-full h-full mr-2"
                />
  
      </Link>

 
      <div className="flex items-center gap-3 sm:gap-4">
        


        <Link
          href="/api/auth/signin"
          className=" hover:bg-blue-600 text-[#ddc897] py-1 px-3 text-sm rounded-md"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}

export default Header;
*/

/*
import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { calSans } from "@/app/fonts";

function Header() {
  return (
    <header className="fixed md:hidden bg-white top-0 flex items-center justify-between dark:bg-neutral-950 w-full border-b border-zinc-300 dark:border-neutral-700 py-2 sm:-ml-6">
      <Link href={"/painel"}>
        <p className={`font-semibold md:text-xl pl-3 text-[14px] ${calSans.className}`}>
        indecent.top
        </p>
      </Link>

      <div className="flex items-center md:space-x-2 space-x-7">
        <div className="flex items-center text-neutral-600 dark:text-neutral-500 bg-zinc-100 dark:bg-neutral-800 md:gap-x-2 gap-x-0.5 rounded-md md:px-3.5 px-1.5 md:py-1.5 py-0 .5 ">
          <Search className="md:h-4 md:w-4 h-3 w-3 " />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent placeholder:text-neutral-600 dark:placeholder:text-neutral-600 flex-1 outline-none"
          />
        </div>
        <Button size={"icon"} variant={"ghost"}>

        </Button>
      </div>
    </header>
  );
}

export default Header;
*/