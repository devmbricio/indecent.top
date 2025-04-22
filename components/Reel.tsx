import { useEffect, useState } from "react";
import Image from "next/image";

const IMAGE_COUNT = 13;

function getImage(index: number) {
  return `/${index + 1}.png`;
}

export default function Reel({
  finalIndex,
  spinning,
  delay,
}: {
  finalIndex: number;
  spinning: boolean;
  delay: number; // ms entre cada rolo
}) {
  const [visibleIndex, setVisibleIndex] = useState<number>(finalIndex);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (!spinning) return;

    setRolling(true);
    let frame = 0;

    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % IMAGE_COUNT);
      frame++;
    }, 50);

    const stopTimeout = setTimeout(() => {
      clearInterval(interval);
      setVisibleIndex(finalIndex);
      setRolling(false);
    }, 1200 + delay);

    return () => {
      clearInterval(interval);
      clearTimeout(stopTimeout);
    };
  }, [spinning, finalIndex, delay]);

  return (
    <div className="w-20 h-20 border-4 border-[#a3291a] rounded-xl bg-black flex items-center justify-center overflow-hidden">
      <Image
        src={getImage(visibleIndex)}
        alt={`img-${visibleIndex + 1}`}
        width={64}
        height={64}
        className="w-full h-full object-contain"
      />
    </div>
  );
}


/*
// components/Reels.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface CreditsProps {
  initialCredits: number;
}

export default function Reels({ initialCredits }: CreditsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState(initialCredits);

  useEffect(() => {
    if (credits <= 0) {
      router.push("/compras");
    }
  }, [credits, router]);

  const startWatching = () => {
    const interval = setInterval(() => {
      setCredits((prev) => {
        const newCredits = prev - 1;
        if (newCredits <= 0) {
          clearInterval(interval);
          router.push("/compras");
        }
        return newCredits;
      });
    }, 60000); // Diminui 1 crédito a cada minuto
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">Reels - Transmissão ao Vivo</h1>
      {credits > 0 ? (
        <div>
          <button onClick={startWatching} className="btn btn-primary">
            Iniciar Visualização ({credits} minutos restantes)
          </button>
          <video id="video" className="w-full h-auto mt-5" autoPlay muted />
        </div>
      ) : (
        <p>Você não tem créditos suficientes. Compre mais créditos na loja.</p>
      )}
    </div>
  );
}
*/