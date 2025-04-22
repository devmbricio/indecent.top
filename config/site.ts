import { SidebarNavItem, SiteConfig } from "@/types/types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "indecent.top",
  description:
    "A top das redes sociais para adultos. Fotos, vídeos, status, e live. Aqui tudo do pode! Conecte-se com quem você quiser! Seja um #indecentinfluencer.",
  url: site_url,
  ogImage: `${site_url}/opengraph-image.webp`,
  links: {
    twitter: "https://twitter.com/indecenttop",
    github: "https://github.com/indecent.top",
  },
  mailSupport: "indecent.top@gmail.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Customization", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Introduction", href: "#" },
      { title: "Installation", href: "#" },
      { title: "Components", href: "#" },
      { title: "Code Blocks", href: "#" },
    ],
  },
];
