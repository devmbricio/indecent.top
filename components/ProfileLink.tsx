"use client";

import { cn } from "@/lib/utils";
import { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import UserAvatar from "./UserAvatar";

function ProfileLink({ user }: { user: User }) {
  const pathname = usePathname();
  const href = "/painel/profile"; // Usa username, senão id
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={buttonVariants({
        variant: isActive ? "secondary" : "ghost",
        className: "navLink",
        size: "lg",
      })}
    >
      <UserAvatar
        user={user}
        className={`h-6 w-6 ${isActive && "border-2 border-[#ddc897] "}`}
      />
      <p className={`${cn("hidden lg:block text-[#ddc897] ", { "font-bold ": isActive })}`}>
       
      </p>
    </Link>
  );
}

export default ProfileLink;

/*


"use client";

import { cn } from "@/lib/utils";
import { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import UserAvatar from "./UserAvatar";

function ProfileLink({ user }: { user: User }) {
  const pathname = usePathname();
  const href = `/painel/${user.name || user.id}`; // Usa `username` ou `id`
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={buttonVariants({
        variant: isActive ? "secondary" : "ghost",
        className: "navLink",
        size: "lg",
      })}
    >
      <UserAvatar
        user={user}
        className={`h-6 w-6 ${isActive && "border-2 border-white"}`}
      />
      <p className={`${cn("hidden lg:block", { "font-extrabold": isActive })}`}>
        Meu Perfil
      </p>
    </Link>
  );
}



export default ProfileLink;
*/
/*
"use client";

import { cn } from "@/lib/utils";
import { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import UserAvatar from "./UserAvatar";

function ProfileLink({ user }: { user: User }) {
  const pathname = usePathname();
  const href = `/painel/${user.name}`;
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={buttonVariants({
        variant: isActive ? "secondary" : "ghost",
        className: "navLink",
        size: "lg",
      })}
    >
      <UserAvatar
        user={user}
        className={`h-6 w-6 ${isActive && "border-2 border-white"}`}
      />
      <p className={`${cn("hidden lg:block", { "font-extrabold": isActive })}`}>
        Meu Perfil 
      </p>
    </Link>
  );
}

export default ProfileLink;
*/