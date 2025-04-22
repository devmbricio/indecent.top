"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import type { User } from "next-auth";

type UserAvatarProps = {
  user: User | undefined;
  className?: string;
};

function UserAvatar({ user, className }: UserAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.image || null);

  const uploadImage = async (file: File) => {
    try {
      // Converta a imagem em base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const fileContent = reader.result?.toString().split(",")[1]; // Extrair o conteúdo em base64

        if (!fileContent) {
          console.error("Erro ao converter a imagem para base64");
          return;
        }

        // Enviar o arquivo para a API de upload
        const response = await fetch('/api/upload-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            fileContent,
          }),
        });

        const { fileUrl } = await response.json();

        // Definir a URL da imagem carregada
        setAvatarUrl(fileUrl);
      };
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
    }
  };

  return (
    <Avatar className={`relative h-10 w-10 ${className || ""}`}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={`${user?.name || "User"}'s profile`} />
      ) : (
        <AvatarFallback>
          <span className="text-xl text-[#ddc897]">{user?.name?.[0] || "U"}</span>
        </AvatarFallback>
      )}
      {/* Aqui você pode adicionar a lógica para permitir que o usuário envie uma nova imagem */}
    </Avatar>
  );
}

export default UserAvatar;

/*


import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "next-auth";

type UserAvatarProps = {
  user: User | undefined;
  className?: string;
};

function UserAvatar({ user, className }: UserAvatarProps) {
  // Prioriza o uso da imagem carregada manualmente
  const avatarUrl = user?.image && user.image.includes("cloudinary") ? user.image : "/indecent-top-logo.png";

  return (
    <Avatar className={`relative h-14 w-14 ${className || ""}`}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={`${user?.name || "User"}'s profile`} />
      ) : (
        <AvatarFallback>
          <span className="text-xl text-[#ddc897]">{user?.name?.[0] || "U"}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;
*/

/*
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "next-auth";

type UserAvatarProps = {
  user: User | undefined;
  className?: string;
};

function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={`relative h-10 w-10 ${className || ""}`}>
      {user?.image ? (
        <AvatarImage src={user.image} alt={`${user.name}'s profile`} />
      ) : (
        <AvatarFallback>
          <span className="text-xl text-[#ddc897]">{user?.name?.[0] || "U"}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;
*/


/*
import { Avatar } from "@/components/ui/avatar";
import type { AvatarProps } from "@radix-ui/react-avatar";
import type { User } from "next-auth";
import Image from "next/image";

type Props = Partial<AvatarProps> & {
  user: User | undefined;
};

function UserAvatar({ user, ...avatarProps }: Props) {
  return (
    <Avatar className="relative h-8 w-8" {...avatarProps}>
      <Image
        src={
          user?.image ||
          "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106"
        }
        fill
        alt={`${user?.name}'s profile picture`}
        className="rounded-full object-cover"
      />
    </Avatar>
  );
}

export default UserAvatar;
*/