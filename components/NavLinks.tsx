"use client";

import {
  Home,
  Search,
  Cctv,
  PlusSquare,
  Crown,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import ProfileLink from "./ProfileLink"; // Certifique-se de importar o componente ProfileLink corretamente
import MoreDropdown from "./MoreDropdown";

type AffiliateRole = "AFFILIATE" | "INFLUENCER" | "USER";

const links = [
  { name: "Home", href: "/painel", icon: Home },
  {
    name: "Search",
    href: "/painel/search",
    icon: Search,
    hideOnMobile: true,
  },
  { name: "Live", href: "/painel/live", icon: Cctv },
  {
    name: "Create",
    href: "/painel/create",
    icon: PlusSquare,
  },
  {
    name: "Assinar",
    href: "/compras",
    icon: Crown,
  },
  {
    name: "Afiliado",
    href: "/painel/afiliados",
    icon: Receipt,
    requiresAffiliateRole: "AFFILIATE", // Define o papel necessário
  },
];

function NavLinks({ affiliateRole, user }: { affiliateRole: AffiliateRole, user: any }) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 right-0 flex flex-col items-center gap-5 p-0 bg-dark-1 z-50">
      {/* Links de navegação */}
      {links.map((link) => {
        if (link.requiresAffiliateRole && link.requiresAffiliateRole !== affiliateRole) {
          return null; // Oculta o link se o papel não corresponder
        }

        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              className: cn("navLink", { "hidden md:flex": link.hideOnMobile }),
              size: "lg",
            })}
          >
            <LinkIcon className="w-6 text-[#ddc897]" />
            {/* O nome dos links está oculto em todas as telas */}
            <p className="hidden">
              {link.name}
            </p>
          </Link>
        );
      })}

      {/* Exibindo o ProfileLink caso o usuário esteja presente */}
      {user && <ProfileLink user={user} />}

      {/* MoreDropdown abaixo dos ícones */}
      <div className="hidden md:flex relative md:mt-auto flex-1 items-end w-full">
        <MoreDropdown />
      </div>
    </div>
  );
}

export default NavLinks;






/*
"use client";

import {
  Home,
  Search,
  Cctv,
  PlusSquare,
  Crown,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type AffiliateRole = "AFFILIATE" | "INFLUENCER" | "USER";

const links = [
  { name: "Home", href: "/painel", icon: Home },
  {
    name: "Search",
    href: "/painel/search",
    icon: Search,
    hideOnMobile: true,
  },
  { name: "Live", href: "/painel/live", icon: Cctv },
  {
    name: "Create",
    href: "/painel/create",
    icon: PlusSquare,
  },
  {
    name: "Assinar",
    href: "/compras",
    icon: Crown,
  },
  {
    name: "Afiliado",
    href: "/painel/afiliados",
    icon: Receipt,
    requiresAffiliateRole: "AFFILIATE", // Define o papel necessário
  },
];

function NavLinks({ affiliateRole }: { affiliateRole: AffiliateRole }) {
  const pathname = usePathname();

  console.log("NavLinks - affiliateRole: ", affiliateRole); // Adicionando para checar o valor da prop

  return (
    <>
      {links.map((link) => {
        if (link.requiresAffiliateRole && link.requiresAffiliateRole !== affiliateRole) {
          return null; // Oculta o link se o papel não corresponder
        }

        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              className: cn("navLink", { "hidden md:flex": link.hideOnMobile }),
              size: "lg",
            })}
          >
            <LinkIcon className="w-6 text-[#ddc897]" />
            <p
              className={`${cn("hidden text-[#ddc897] lg:block", {
                "font-bold": isActive,
              })}`}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}

export default NavLinks;
*/





/*


"use client";

import {
  Home,
  Search,
  Cctv,
  PlusSquare,
  Crown,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type AffiliateRole = "AFFILIATE" | "USER";

const links = [
  { name: "Home", href: "/painel", icon: Home },
  {
    name: "Search",
    href: "/painel/search",
    icon: Search,
    hideOnMobile: true,
  },
  { name: "Live", href: "/painel/live", icon: Cctv },
  {
    name: "Create",
    href: "/painel/create",
    icon: PlusSquare,
  },
  {
    name: "Assinar",
    href: "/compras",
    icon: Crown,
  },
  {
    name: "Afiliado",
    href: "/painel/afiliados",
    icon: Receipt,
    requiresRole: "AFFILIATE", // Define o papel necessário
  },
];

function NavLinks({ role }: { role: AffiliateRole }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        if (link.requiresRole && link.requiresRole !== role) {
          return null; // Oculta o link se o papel não corresponder
        }

        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              className: cn("navLink", { "hidden md:flex": link.hideOnMobile }),
              size: "lg",
            })}
          >
            <LinkIcon className="w-6 text-[#ddc897]" />
            <p
              className={`${cn("hidden text-[#ddc897] lg:block", {
                "font-bold": isActive,
              })}`}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}

export default NavLinks;
*/


/*
"use client";

import {
  Clapperboard,
  Compass,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search, Cctv ,
  Crown,
  Receipt
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/painel", icon: Home },
  {
    name: "Search",
    href: "/painel/search",
    icon: Search,
    hideOnMobile: true,
  },
  //{ name: "Explore", href: "/painel/explore", icon: Compass },
  { name: 'Live', href: '/painel/live', icon: Cctv },
  // { name: "Reels",     href: "/painel/reels",     icon: Clapperboard,   },
  // {     name: "Messages",     href: "/painel/messages",     icon: MessageCircle,   },
  // {     name: "Notifications",     href: "/painel/notifications",     icon: Heart,     hideOnMobile: true,   },
  {
    name: "Create",
    href: "/painel/create",
    icon: PlusSquare,
  },
  {
    name: "Assinar",
    href: "/compras",
    icon: Crown,
  },
  {
    name: "Afiliado",
    href: "/painel/afiliados",
    icon: Receipt,
  },
];
function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname == link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              className: cn("navLink", { "hidden md:flex": link.hideOnMobile }),
              size: "lg",
            })}
          >
            <LinkIcon className="w-6 text-[#ddc897] " />
            <p
              className={`${cn("hidden text-[#ddc897]  lg:block", {
                "font-bold": isActive,
              })}`}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}

export default NavLinks;
*/