"use client";

import Afiliados from "@/components/Afiliados";
import { Button } from "@/components/ui/button";
import { pricingData } from "@/config/subscriptions";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";
import { useEffect, useState } from "react";

export default function AfiliadosPage() {
  const products = [
    ...pricingData,
    ...pricingDataWebsites,
  ];

  const [referralUrl, setReferralUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferralUrl = async () => {
      try {
        const response = await fetch("/api/referral", { method: "POST" });
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Erro ao buscar URL de referral.");
          return;
        }

        const data = await response.json();
        setReferralUrl(data.referralUrl);
      } catch (err) {
        setError("Erro ao buscar URL de referral.");
      }
    };

    fetchReferralUrl();
  }, []);

  const formattedProducts = products.map((product) => ({
    id: product.title,
    title: product.title,
    description: product.description,
    images: product.images || ["/indecent-black.png"],
    affiliateLink: `https://indecent.macaco.network/products/${product.title}?ref=${product.stripeIds?.monthly}`,
  }));

  return (
    <div className="container mx-auto pt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Painel do Afiliado</h1>
      {error && <p className="text-red-500">{error}</p>}

      {referralUrl ? (
        <div className="flex flex-col items-center mb-6">
          <p className="text-whiite">Seu link de indicação:</p>
          <input
            type="text"
            readOnly
            value={referralUrl}
            className="w-full max-w-md px-4 py-2 border rounded-md mt-2 bg-gray-600"
          />
          <Button
            className="mt-4 bg-blue-500 text-gray-300 py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => navigator.clipboard.writeText(referralUrl)}
            variant={"outline"}
          >
            Copiar Link
          </Button>
        </div>
      ) : (
        <p className="text-gray-700">Carregando link de referral...</p>
      )}

      <Afiliados products={formattedProducts} />
    </div>
  );
}


/*gerando o referral
"use client";

import { useEffect, useState } from "react";

export default function AfiliadosPage() {
  const [referralUrl, setReferralUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferralUrl = async () => {
      try {
        const response = await fetch("/api/referral", { method: "POST" });
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Erro ao buscar URL de referral.");
          return;
        }

        const data = await response.json();
        setReferralUrl(data.referralUrl);
      } catch (err) {
        setError("Erro ao buscar URL de referral.");
      }
    };

    fetchReferralUrl();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Painel de Afiliados</h1>

      {error && <p className="text-red-500">{error}</p>}

      {referralUrl ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-700">Seu link de referral:</p>
          <input
            type="text"
            readOnly
            value={referralUrl}
            className="w-full max-w-md px-4 py-2 border rounded-md mt-2"
          />
          <button
            className="mt-4 bg-blue-500 text-gray-300 py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => navigator.clipboard.writeText(referralUrl)}
          >
            Copiar Link
          </button>
        </div>
      ) : (
        <p className="text-gray-700">Carregando link de referral...</p>
      )}
    </div>
  );
}
*/

/*
// app/painel/afiliados/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Afiliados from "@/components/Afiliados";
import { pricingData } from "@/config/subscriptions";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";

export default async function AfiliadosPage() {
  // Obtém a sessão do usuário no servidor
  const session = await getServerSession(authOptions);

  // Verifica se o usuário está autenticado e tem o papel de AFFILIATE no campo `affiliate`
  if (!session || session.user.affiliate !== "AFFILIATE") {
    // Redireciona para a página inicial se o usuário não for afiliado
    redirect("/");
    return null;
  }

  // Combine produtos das diferentes fontes de dados
  const products = [
    ...pricingData,
    ...pricingDataWebsites,
  ];

  // Formatar produtos para incluir uma imagem padrão e o link de afiliado
  const formattedProducts = products.map((product) => ({
    id: product.title,
    title: product.title,
    description: product.description,
    images: product.images || ["/indecent-black.png"], 
    affiliateLink: `https://indecent.top/products/${product.title}?ref=${product.stripeIds.monthly}`, 
  }));

  return (
    <div>
      <Afiliados products={formattedProducts} />
    </div>
  );
}
*/
/*
// app/painel/afiliados/page.tsx
import Afiliados from "@/components/Afiliados";
import { pricingData } from "@/config/subscriptions";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";


export default function AfiliadosPage() {
  // Combine produtos das diferentes fontes de dados
  const products = [
    ...pricingData,
    ...pricingDataWebsites,
  ];

  // Formatar produtos para incluir uma imagem padrão e o link de afiliado
  const formattedProducts = products.map((product) => ({
    id: product.title,
    title: product.title,
    description: product.description,
    images: product.images || ["/indecent-black.png"], // Caminho para uma imagem padrão
    affiliateLink: `https://indecent.macaco.network/products/${product.title}?ref=${product.stripeIds.monthly}`, // Usando stripeId do plano mensal como exemplo
  }));

  return (
    <div>
      <Afiliados products={formattedProducts} />
    </div>
  );
}
*/
/*
// app/painel/afiliados/page.tsx
import Afiliados from "@/components/Afiliados";
import { pricingData } from "@/config/subscriptions";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";


export default function AfiliadosPage() {
  // Combine produtos das diferentes fontes de dados
  const products = [
    ...pricingData,
    ...pricingDataWebsites,

  ];

  // Formatando produtos para incluir uma imagem padrão se necessário
  const formattedProducts = products.map((product) => ({
    id: product.title,
    title: product.title,
    description: product.description,
    images: product.images || ["/indecent-black.png"], // Caminho para uma imagem padrão
    affiliateLink: "",
  }));

  return (
    <div>
      <Afiliados products={formattedProducts} />
    </div>
  );
}

*/