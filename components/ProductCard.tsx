import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    title: string;
    description: string;
    images: string[]; // Array de imagens do produto
    affiliateLink: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const swipeStartX = useRef<number | null>(null);

  // Iniciar e parar o slide ao passar o mouse
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, product.images.length]);

  // Função para tratar swipe (arrastar) em dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    swipeStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeStartX.current) return;

    const swipeDistance = e.touches[0].clientX - swipeStartX.current;

    if (swipeDistance > 50) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
      swipeStartX.current = null;
    } else if (swipeDistance < -50) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      swipeStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    swipeStartX.current = null;
  };

  return (
    <div
      className="h-full w-full flex flex-col justify-center items-center bg-white overflow-hidden p-1"
      onMouseEnter={() => setIsHovered(true)} // Inicia o slide ao passar o mouse
      onMouseLeave={() => setIsHovered(false)} // Para o slide ao sair do mouse
      onTouchStart={handleTouchStart} // Para dispositivos móveis
      onTouchMove={handleTouchMove} // Para dispositivos móveis
      onTouchEnd={handleTouchEnd} // Para dispositivos móveis
    >
          
      {/* Imagem principal com navegação e logo/título */}
      <div className="relative w-full h-64 sm:h-80 flex justify-center items-center gap-2 pt-4">
{/* Logo e título alinhados ao centro, sobre a imagem */}
<div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 opacity-20">
    <Image src="/android-chrome-192x192.png" alt="Logo" width={50} height={50} />
    <p className="md:text-sm text-[10px] text-gray-400 mt-1">indecent.top</p>
  </div>
          

        <Link href={product.affiliateLink} passHref>
          <Image
            src={product.images[currentImageIndex]} // Exibe a imagem atual do slider
            alt={product.title}
            layout="fill"
            objectFit="contain"
            className="max-w-full max-h-full cursor-pointer"
          />
        </Link>

        {/* Botões de navegação para desktop 
        <button
          onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length)}
          className="absolute left-0 bottom-0 text-orange-400 p-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          &#9664;
        </button>
        <button
          onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)}
          className="absolute right-0 bottom-0 text-orange-400 p-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          &#9654;
        </button>*/}
      </div>

      {/* Miniaturas das imagens */}
      <div className="mt-4 flex space-x-1 overflow-hidden max-w-full justify-center">
        {product.images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)} // Define a imagem selecionada
            className={`relative w-12 h-12 md:w-16 md:h-16 cursor-pointer border-2 ${currentImageIndex === index ? 'border-orange-400' : 'border-gray-300'}`}
          >
            <Image
              src={image}
              alt={`Miniatura ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        ))}
      </div>

      {/* Descrição e link de compra */}
      <div className="text-center mt-2">
        <h2 className="md:text-md text-sm text-orange-400">{product.title}</h2>
        <p className="md:text-md text-sm text-gray-700 mt-2">{product.description}</p>
        <Link href={product.affiliateLink} passHref>
          <button className="mt-2 bg-gray-600 opacity-40 text-[#ddc897] md:text-md text-sm font-semibold py-2 px-6 rounded-md hover:bg-gray-800 transition-all">
            Comprar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

/*
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    title: string;
    description: string;
    images: string[]; // Array de imagens do produto
    affiliateLink: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const swipeStartX = useRef<number | null>(null);

  // Iniciar e parar o slide ao passar o mouse
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, product.images.length]);

  // Função para tratar swipe (arrastar) em dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    swipeStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeStartX.current) return;

    const swipeDistance = e.touches[0].clientX - swipeStartX.current;

    if (swipeDistance > 50) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
      swipeStartX.current = null;
    } else if (swipeDistance < -50) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      swipeStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    swipeStartX.current = null;
  };

  return (
    <div
      className="h-full w-full flex flex-col justify-center items-center bg-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)} // Inicia o slide ao passar o mouse
      onMouseLeave={() => setIsHovered(false)} // Para o slide ao sair do mouse
      onTouchStart={handleTouchStart} // Para dispositivos móveis
      onTouchMove={handleTouchMove} // Para dispositivos móveis
      onTouchEnd={handleTouchEnd} // Para dispositivos móveis
    >
 
      <div className="relative w-full h-64 sm:h-80 flex justify-center items-center gap-2 pt-4">
        <Link href={product.affiliateLink} passHref>
        <Image
              src={product.images[currentImageIndex]} // Exibe a imagem atual do slider
              alt={product.title}
              layout="fill"
              objectFit="contain"
              className="max-w-full max-h-full cursor-pointer"
            />
        </Link>

 
        <button
          onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length)}
          className="absolute left-0 bottom-0 text-orange-400 p-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          &#9664;
        </button>
        <button
          onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)}
          className="absolute right-0 bottom-0 text-orange-400 p-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          &#9654;
        </button>
      </div>

 
      <div className="mt-4 flex space-x-1 overflow-hidden max-w-full justify-center">
        {product.images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)} // Define a imagem selecionada
            className={`relative w-12 h-12 md:w-16 md:h-16 cursor-pointer border-2 ${currentImageIndex === index ? 'border-orange-400' : 'border-gray-300'}`}
          >
            <Image
                src={image}
                alt={`Miniatura ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
          </div>
        ))}
      </div>

 
      <div className="text-center mt-2">
        <h2 className="text-md text-orange-400">{product.title}</h2>
        <p className="text-sm text-gray-700 mt-2">{product.description}</p>
        <Link href={product.affiliateLink} passHref>
          <button className="mt-2 bg-black opacity-40 text-[#ddc897] text-lg font-semibold py-2 px-6 rounded-md hover:bg-gray-800 transition-all">
            Comprar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
  */
  
