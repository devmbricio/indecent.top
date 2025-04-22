import Logo from "@/components/Logo";
import NavLinks from "./NavLinks";
import MoreDropdown from "./MoreDropdown";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileLink from "./ProfileLink";

async function SideNav() {
  const session = await getServerSession(authOptions);

  // Recupera a role do usuário
  const userRole = session?.user.affiliateRole || "USER"; // Aqui recupera a role do usuário
  const user = session?.user;

  console.log("User Role: ", userRole);  // Adicionado para checar o valor da role
  console.log("Session User: ", user);   // Para ver a sessão completa do usuário

  return (
    <div className="flex flex-col h-full px-3 py-0 md:px-1">
      <div className="ml-3 md:ml-0  h-16 justify-evenly fixed z-50 flex-1 md:h-full bottom-0 md:border-none flex flex-row md:justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-1 p-2">
        <Logo />
        {/* Passando o userRole e o user corretamente */}
        <NavLinks affiliateRole={userRole} user={user} />
        {/* {user && <ProfileLink user={user} />} */}

      
      </div>
    </div>
  );
}

export default SideNav;


/*
.import Logo from "@/components/Logo";
import NavLinks from "./NavLinks";
import MoreDropdown from "./MoreDropdown";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileLink from "./ProfileLink";

async function SideNav() {
  const session = await getServerSession(authOptions);

  // Recupera a role do usuário
  const userRole = session?.user.affiliateRole || "USER"; // Aqui recupera a role do usuário
  const user = session?.user;

  console.log("User Role: ", userRole);  // Adicionado para checar o valor da role
  console.log("Session User: ", user);   // Para ver a sessão completa do usuário

  return (
    <div className="flex flex-col h-full px-3 py-0 md:px-1">
      <div className="border-t -ml-3 md:ml-0 bg-white dark:bg-black/20 opacity-85 h-16 justify-evenly fixed z-50 flex-1 md:relative md:h-full bottom-0 md:border-none flex flex-row md:justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-1 p-2">
        <Logo />
 
        <NavLinks affiliateRole={userRole} />
        {user && <ProfileLink user={user} />}

        <div className="hidden md:flex relative md:mt-auto flex-1 items-end w-full">
          <MoreDropdown />
        </div>
      </div>
    </div>
  );
}

export default SideNav;
*/


/*
import Logo from "@/components/Logo";
import NavLinks from "./NavLinks";
import MoreDropdown from "./MoreDropdown";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileLink from "./ProfileLink";
import Sidebar from "./Sidebar";

//navbar do post e home
async function SideNav() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user.affiliate || "USER"; // Recupera a role do usuário
  const user = session?.user;
  return (
    <div className="flex flex-col h-full px-3 py-0 md:px-1">
      <div className="border-t -ml-3 md:ml-0 bg-white dark:bg-black/20 opacity-85 h-16 justify-evenly fixed z-50 flex-1 md:relative md:h-full bottom-0 md:border-none flex flex-row md:justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-1 p-2">
        <Logo />
        <NavLinks role={userRole} />
        {user && <ProfileLink user={user} />}

        <div className="hidden md:flex relative md:mt-auto flex-1 items-end w-full">
          <MoreDropdown />
        </div>
      </div>
    </div>
  );
}

export default SideNav;
*/