// pages/404.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.replace("/painel"); // Utilize router.replace para evitar histórico de navegação
    }, 5000); // Redireciona após 5 segundos

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Pagina não encontrada - Redirecionando</title>
        <meta name="description" content="Page not found. Redirecting to homepage." />
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-600 font-custom">
        <div
          className="absolute w-[20vw] h-[20vh] bg-no-repeat bg-center bg-contain"
          style={{
            backgroundImage: "url('/indecent-top-logo.png')",
          }}
        />
        <div className="text-center pt-[25%]">
          <h1 className="text-6xl font-bold text-[#e8d3e8ff] ">404</h1>
          <p className="text-2xl text-[#e8d3e8ff]  mt-4">Página não encontrada</p>
          <p className="text-gray-400 mt-2">Estamos redirecionando para uma melhor experiência.</p>
        </div>
      </div>
    </>
  );
};

export default NotFound;




