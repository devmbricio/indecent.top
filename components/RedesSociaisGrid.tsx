
"use client"
import React from "react";
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook, FaPinterest, FaTwitter, FaYoutube, FaTelegram, FaLock } from "react-icons/fa";
import Image from "next/image";

type RedesSociaisGridProps = {
  socials: {
    indecent?: string;
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    pinterest?: string;
    twitter?: string;
    youtube?: string;
    onlyfans?: string;
    privacySocial?: string;
  };
  username: string;
};

const platformIcons: Record<string, JSX.Element> = {
  whatsapp: <FaWhatsapp className="text-4xl text-green-500" />,
  instagram: <FaInstagram className="text-4xl text-pink-500" />,
  tiktok: <FaTiktok className="text-4xl text-black" />,
  facebook: <FaFacebook className="text-4xl text-blue-700" />,
  pinterest: <FaPinterest className="text-4xl text-red-600" />,
  twitter: <FaTwitter className="text-4xl text-blue-500" />,
  youtube: <FaYoutube className="text-4xl text-red-600" />,
  telegram: <FaTelegram className="text-4xl text-blue-500" />,
  onlyfans: (
    <Image
      src="/onlyfans.png"
      alt="OnlyFans Logo"
      width={50}
      height={50}
      className="inline-block"
    />
  ),
  indecent: (
    <Image
      src="/indecent-top-logo-rosa-transparent-1080.png"
      alt="Indecent.top Logo"
      width={36}
      height={36}
      className="inline-block"
    />
  ),
  privacySocial: <FaLock className="text-4xl text-gray-600" />,
};

const RedesSociaisGrid: React.FC<RedesSociaisGridProps> = ({ socials, username }) => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
      {Object.entries(socials).map(([platform, value]) =>
        value ? (
          <a
            key={platform}
            href={
              platform === "whatsapp"
                ? `https://wa.me/${value.replace(/\D/g, "")}`
                : platform === "indecent.top"
                ? `https://www.indecent.top/${username}`
                : value.startsWith("http")
                ? value
                : `https://${value}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-[#f19ddc] p-2 rounded-lg hover:bg-gray-200" 
          >
            {platformIcons[platform]}
          </a>
        ) : null
      )}
    </div>
  );
};

export default RedesSociaisGrid;
