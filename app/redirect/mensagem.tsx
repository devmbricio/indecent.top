"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function RedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message") || "Créditos insuficientes.";
  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    // Redireciona para /compras após 5 segundos
    const timer = setTimeout(() => {
      router.push("/compras");
    }, 5000);

    // Limpa o timer ao desmontar o componente
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen w-full bg-black/10">
      <div className="p-4 rounded-lg max-w-sm text-center shadow-lg ">
        <h1 className="text-2xl font-semibold text-[#CDB03C] mb-4">Desculpe!</h1>
        <p className="text-gray-400 mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <Link href="/compras" className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded">
            Adquirir Créditos
          </Link>
          <Link href={redirectTo} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded">
            Conteúdos Gratuitos
          </Link>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Redirecionando para a página de créditos em 5 segundos...
        </p>
      </div>
    </main>
  );
}

export default RedirectPage;

/*
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RedirectPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Créditos insuficientes.";
  const redirectTo = searchParams.get("redirectTo") || "/";

  return (
    <main className="flex items-center justify-center min-h-screen w-full bg-black/10">
      <div className="p-4 shadow-md rounded-lg max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-[#CDB03C] mb-4">Desculpe!</h1>
        <p className="text-gray-500 mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <Link href="/compras" className="bg-green-600 hover:bg-gray-500 text-white px-4 py-1 rounded">
            Adquirir Créditos
          </Link>
          <Link href={redirectTo} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded">
            Conteúdos Gratuitos
          </Link>
        </div>
      </div>
    </main>
  );
}
*/