"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { ClientSafeProvider } from "next-auth/react";

export default function SignInPage() {
  const [googleProvider, setGoogleProvider] = useState<ClientSafeProvider | null>(null);
  const [baseUrl, setBaseUrl] = useState<string>("");

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      if (res && res.google) {
        setGoogleProvider(res.google); // 🔹 Exibe apenas o Google
      }
    };

    // Define a baseUrl com base no hostname
    const isLocalhost =
      typeof window !== "undefined" && window.location.hostname === "localhost";
    setBaseUrl(isLocalhost ? "http://localhost:3000" : "https://indecent.top");

    fetchProviders();
  }, []);

  const handleSignIn = () => {
    if (googleProvider) {
      console.log("Initiating sign-in with Google");
      signIn(googleProvider.id, { callbackUrl: `${baseUrl}/painel` });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div
        className="absolute w-[30vw] h-[30vh] bg-no-repeat bg-center bg-contain pt-[20%]"
        style={{
          backgroundImage: "url('/indecent-top-logo-gold.png')",
        }}
      />
      <div className="rounded-lg xl:pt-[25%] lg:pt-[30%] md:pt-[35%] pt-[45%]">
        {googleProvider && (
          <button
            onClick={handleSignIn}
            className="bg-gray-500 hover:bg-gray-400 text-gray-300 font-bold py-2 px-4 rounded mb-2"
          >
            Entrar com {googleProvider.name}
          </button>
        )}
      </div>
    </div>
  );
}
/*


"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

export default function SignInPage() {
  const [providers, setProviders] = useState<
    Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
  >(null);

  const [baseUrl, setBaseUrl] = useState<string>("");

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    // Define a baseUrl com base no hostname
    const isLocalhost =
      typeof window !== "undefined" && window.location.hostname === "localhost";
    setBaseUrl(isLocalhost ? "http://localhost:3000" : "https://indecent.top");

    fetchProviders();
  }, []);

  const handleSignIn = (providerId: string) => {
    console.log("Initiating sign-in with provider:", providerId);

    signIn(providerId, {
      callbackUrl: `${baseUrl}/painel`,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div
        className="absolute w-[20vw] h-[20vh] bg-no-repeat bg-center bg-contain"
        style={{
          backgroundImage: "url('/indecent-top-logo.png')",
        }}
      />
      <div className="rounded-lg xl:pt-[15%] lg:pt-[30%] md:pt-[15%] pt-[40%]">
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleSignIn(provider.id)}
              className="bg-gray-500 hover:bg-gray-400 text-gray-300 font-bold py-2 px-4 rounded mb-2"
            >
              Entrar com {provider.name}
            </button>
          ))}
      </div>
    </div>
  );
}
*/

/* funcional 


"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";  // Usando useSearchParams em vez de useRouter
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

export default function SignInPage() {
  const [providers, setProviders] = useState<
    Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
  >(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res); // Agora o TypeScript reconhece que `res` é compatível
    };
    fetchProviders();
  }, []);

  // Captura o parâmetro `ref` da URL usando useSearchParams
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');  // Capturando o valor de 'ref'

  const isLocalhost = window.location.hostname === "localhost";
  const baseUrl = isLocalhost ? "http://localhost:3000" : "https://indecent.top";

  const handleSignIn = (providerId: string) => {
    console.log("Initiating sign-in with provider:", providerId);

    // Passando o parâmetro ref como parte do redirecionamento
    signIn(providerId, {
      callbackUrl: `${baseUrl}/painel?ref=${ref}`,  // Passando o parâmetro `ref` para a URL de redirecionamento
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div
        className="absolute w-[20vw] h-[20vh] bg-no-repeat bg-center bg-contain"
        style={{
          backgroundImage: "url('/indecent-top-logo.png')",
        }}
      />
      <div className="rounded-lg xl:pt-[15%] lg:pt-[30%] md:pt-[15%] pt-[40%]">
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleSignIn(provider.id)} // Utilizando a função com log
              className="bg-gray-500 hover:bg-gray-400 text-gray-300 font-bold py-2 px-4 rounded mb-2"
            >
              Entrar com {provider.name}
            </button>
          ))}
      </div>
    </div>
  );
}
  
*/



/* ultima versao funcional 21,01,25


"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

export default function SignInPage() {
  const [providers, setProviders] = useState<
    Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
  >(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res); // Agora o TypeScript reconhece que `res` é compatível
    };
    fetchProviders();
  }, []);

  const isLocalhost = window.location.hostname === "localhost";
  const baseUrl = isLocalhost ? "http://localhost:3000" : "https://indecent.top";

  const handleSignIn = (providerId: string) => {
    console.log("Initiating sign-in with provider:", providerId); // Log para verificar qual provedor está sendo usado

    signIn(providerId, {
      callbackUrl: `${baseUrl}/painel`,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div
        className="absolute w-[20vw] h-[20vh] bg-no-repeat bg-center bg-contain"
        style={{
          backgroundImage: "url('/indecent-top-logo.png')",
        }}
      />
      <div className="rounded-lg xl:pt-[15%] lg:pt-[30%] md:pt-[15%] pt-[40%]">
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleSignIn(provider.id)} // Utilizando a função com log
              className="bg-gray-500 hover:bg-gray-400 text-gray-300 font-bold py-2 px-4 rounded mb-2"
            >
              Entrar com {provider.name}
            </button>
          ))}
      </div>
    </div>
  );
}
*/