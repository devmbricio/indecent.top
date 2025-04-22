"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pricingData } from "@/config/subscriptions";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";

export default function ProductPage({ params, searchParams }: { params: { id: string }; searchParams?: { ref?: string } }) {
  const router = useRouter();
  const { id } = params;
  const referrerId = searchParams?.ref;

  // Combine os dados de produtos
  const products = [...pricingData, ...pricingDataWebsites];
  const [product, setProduct] = useState(() => products.find((prod) => encodeURIComponent(prod.title) === id));

  useEffect(() => {
    if (!product) {
      router.push("/404");
      return;
    }

    // Gera a URL de checkout com o ID do produto e do afiliado (se disponível)
    const stripeCheckoutUrl = `/compras?productId=${product.stripeIds.monthly}&ref=${referrerId || ""}`;
    router.push(stripeCheckoutUrl);
  }, [product, router, referrerId]);

  if (!product) {
    return <p>Redirecionando...</p>;
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-gray-600">{product.description}</p>
      <p>Redirecionando para a página de compra...</p>
    </div>
  );
}
/*


"use client"
// app/products/[id]/page.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pricingData} from "@/config/subscriptions";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  // Combine os dados de produtos de ambas as fontes
  const products = [...pricingData, ...pricingDataWebsites];
  const product = products.find((prod) => prod.title === id);

  useEffect(() => {
    if (!product) {
      // Redireciona para uma página de erro caso o produto não seja encontrado
      router.push("/404");
      return;
    }

    // Redireciona o usuário para a página de compra, usando o stripeId do plano mensal como exemplo
    const stripeCheckoutUrl = `/compras?productId=${product.stripeIds.monthly}&ref=${id}`;
    router.push(stripeCheckoutUrl);
  }, [product, router, id]);

  if (!product) {
    return <p>Redirecionando...</p>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Redirecionando para a página de compra...</p>
    </div>
  );
}
*/