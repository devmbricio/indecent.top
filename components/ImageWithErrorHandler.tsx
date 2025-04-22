// components/ImageWithErrorHandler.tsx
"use client"; // Garantindo que este componente seja tratado no cliente

import Image from "next/image";
import { useState } from "react";

interface ImageWithErrorHandlerProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  unoptimized?: boolean;
}

const ImageWithErrorHandler: React.FC<ImageWithErrorHandlerProps> = ({
  src,
  alt,
  fill,
  sizes,
  className,
  unoptimized,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);

  const handleImageError = () => {
    console.error("Erro ao carregar a imagem:", src);
    setImageSrc("/indecent.top_logo_9-16.png"); // Imagem padrão
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      unoptimized={unoptimized}
      onError={handleImageError} // Manipulador de erro
    />
  );
};

export default ImageWithErrorHandler;
