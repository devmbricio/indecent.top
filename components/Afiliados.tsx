"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "./ui/button";

interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  affiliateLink: string;
}

interface AfiliadosProps {
  products: Product[];
}

export default function Afiliados({ products }: AfiliadosProps) {
  const [links, setLinks] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleGenerateAffiliateLink = async (productId: string) => {
    try {
      const response = await fetch("/api/affiliate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        console.error(data.error || "Erro desconhecido");
        throw new Error(data.error || "Erro ao gerar link de afiliado");
      }
  
      const data = await response.json();
      setLinks((prevLinks) => ({
        ...prevLinks,
        [productId]: data.affiliateLink,
      }));
    } catch (error) {
      console.error("Erro ao gerar link de afiliado:", error);
      alert("Erro ao gerar link de afiliado.");
    }
  };
  

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link copiado para a área de transferência!");
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
          <p className="mb-2">{product.description}</p>
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              width={300}
              height={200}
              className="object-cover mb-2 rounded"
            />
          )}
          <button
            onClick={() => handleGenerateAffiliateLink(product.id)}
            className="text-[#ec9ec5] mt-2"
            disabled={loading[product.id]}
          >
            {loading[product.id] ? "Gerando link..." : "Gerar Link de Afiliado"}
          </button>
          {links[product.id] && (
            <div className="mt-2">
              <input
                type="text"
                value={links[product.id]}
                readOnly
                className="border p-1 w-full rounded mb-1 bg-gray-600"
              />
              <Button
                onClick={() => handleCopyLink(links[product.id])}
                variant={"outline"}
              >
                Copiar Link
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}




/*
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  affiliateLink: string;
}

interface AfiliadosProps {
  products: Product[];
}

export default function Afiliados({ products }: AfiliadosProps) {
  const [affiliateLinks, setAffiliateLinks] = useState<{ [key: string]: string }>({});
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null until session check completes
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      setIsAuthorized(!!session);
      if (!session) router.push("/");
    };

    checkUser();
  }, [router]);

  const handleGenerateLink = async (productId: string) => {
    try {
      const response = await fetch("/api/affiliate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta da API:", errorText);
        alert("Erro ao gerar o link de afiliado");
        return;
      }
  
      const data = await response.json();
      setAffiliateLinks((prevLinks) => ({
        ...prevLinks,
        [productId]: data.affiliateLink,
      }));
    } catch (error) {
      console.error("Erro ao gerar link de afiliado:", error);
      alert("Erro de conexão com o servidor.");
    }
  };
  

  const handleCopyLink = (productId: string) => {
    if (affiliateLinks[productId]) {
      navigator.clipboard.writeText(affiliateLinks[productId]);
      setCopiedLinkId(productId);
      setTimeout(() => setCopiedLinkId(null), 2000);
    }
  };

  if (isAuthorized === null) {
    return <p>Verificando autorização...</p>;
  }

  if (!isAuthorized) {
    return <p>Usuário não autorizado. Redirecionando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Produtos para Afiliados</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="mb-2">{product.description}</p>
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={300}
                height={200}
                className="object-cover mb-2 rounded"
              />
            )}
            <button
              onClick={() => handleGenerateLink(product.id)}
              className="text-blue-500 mt-2"
            >
              Gerar Link de Afiliado
            </button>
            {affiliateLinks[product.id] && (
              <div className="mt-2">
                <input
                  type="text"
                  value={affiliateLinks[product.id]}
                  readOnly
                  className="border p-1 w-full rounded mb-1"
                />
                <button
                  onClick={() => handleCopyLink(product.id)}
                  className="text-blue-500"
                >
                  {copiedLinkId === product.id ? "Copiado!" : "Copiar Link"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
*/





/* funciona com os produtos
// components/Afiliados.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  affiliateLink: string;
}

interface AfiliadosProps {
  products: Product[];
}

export default function Afiliados({ products }: AfiliadosProps) {
  const [affiliateLinks, setAffiliateLinks] = useState<{ [key: string]: string }>({});
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      setIsAuthorized(!!session);
      if (!session) router.push("/");
    };

    checkUser();
  }, [router]);

  const handleGenerateLink = async (productId: string) => {
    try {
      const response = await fetch("/api/affiliate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta da API:", errorText);
        alert("Erro ao gerar o link de afiliado");
        return;
      }
  
      const data = await response.json();
      setAffiliateLinks((prevLinks) => ({
        ...prevLinks,
        [productId]: data.affiliateLink,
      }));
    } catch (error) {
      console.error("Erro ao gerar link de afiliado:", error);
      alert("Erro de conexão com o servidor.");
    }
  };
  

  const handleCopyLink = (productId: string) => {
    navigator.clipboard.writeText(affiliateLinks[productId]);
    setCopiedLinkId(productId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  if (!isAuthorized) {
    return <p>Usuário não autorizado. Redirecionando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Produtos para Afiliados</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="mb-2">{product.description}</p>
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={300}
                height={200}
                className="object-cover mb-2 rounded"
              />
            )}
            <button
              onClick={() => handleGenerateLink(product.id)}
              className="text-blue-500 mt-2"
            >
              Gerar Link de Afiliado
            </button>
            {affiliateLinks[product.id] && (
              <div className="mt-2">
                <input
                  type="text"
                  value={affiliateLinks[product.id]}
                  readOnly
                  className="border p-1 w-full rounded mb-1"
                />
                <button
                  onClick={() => handleCopyLink(product.id)}
                  className="text-blue-500"
                >
                  {copiedLinkId === product.id ? "Copiado!" : "Copiar Link"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
*/


/*
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  affiliateLink: string;
}

export default function Afiliados() {
  const [products, setProducts] = useState<Product[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      if (session) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        setTimeout(() => {
          router.push("/"); // Redireciona se não estiver logado
        }, 2000);
      }
      setIsLoading(false);
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    if (isAuthorized) fetchProducts();
  }, [isAuthorized]);

  const handleGenerateLink = async (productId: string) => {
    try {
      const response = await fetch("/api/affiliate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, userId: "uniqueUserId" }), // Substitua por ID real
      });
  
      if (!response.ok) {
        console.error("Erro na resposta da API:", await response.text());
        return;
      }
  
      const data = await response.json();
      setAffiliateLinks((prevLinks) => ({
        ...prevLinks,
        [productId]: data.affiliateLink,
      }));
    } catch (error) {
      console.error("Erro ao gerar link de afiliado:", error);
    }
  };

  const handleCopyLink = (productId: string) => {
    const linkToCopy = affiliateLinks[productId];
    navigator.clipboard.writeText(linkToCopy);
    setCopiedLinkId(productId);

    // Reseta a indicação de cópia após 2 segundos
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!isAuthorized) {
    return <p>Usuário não autorizado. Redirecionando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Produtos para Afiliados</h1>
      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 gap-2">
        {products.map((product) => (
          <div key={product.id} className="border p-2 rounded shadow">
            <h2 className="text-sm font-semibold mb-2">{product.title}</h2>
            <p className="mb-2">{product.description}</p>
            {product.images.length > 0 && (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={300}
                height={200}
                className="w-full h-auto object-cover mb-2"
              />
            )}
            <button
              onClick={() => handleGenerateLink(product.id)}
              className="text-blue-500 mt-2"
            >
              Gerar Link de Afiliado
            </button>
            {affiliateLinks[product.id] && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Link gerado:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={affiliateLinks[product.id]}
                    readOnly
                    className="border px-2 py-1 text-sm w-full rounded"
                  />
                  <button
                    onClick={() => handleCopyLink(product.id)}
                    className="text-blue-500 text-sm"
                  >
                    {copiedLinkId === product.id ? "Copiado!" : "Copiar Link"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

*/


/*


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  affiliateLink: string;
}

export default function Afiliados() {
  const [products, setProducts] = useState<Product[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      if (session) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        setTimeout(() => {
          router.push("/"); // Redireciona se não estiver logado
        }, 2000);
      }
      setIsLoading(false);
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    if (isAuthorized) fetchProducts();
  }, [isAuthorized]);

  const handleGenerateLink = async (productId: string) => {
    try {
      const response = await fetch("/api/affiliate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
  
      if (!response.ok) {
        console.error("Erro na resposta da API:", await response.text());
        return;
      }
  
      const data = await response.json();
      setAffiliateLinks((prevLinks) => ({
        ...prevLinks,
        [productId]: data.affiliateLink,
      }));
    } catch (error) {
      console.error("Erro ao gerar link de afiliado:", error);
    }
  };

  const handleCopyLink = (productId: string) => {
    const linkToCopy = affiliateLinks[productId];
    navigator.clipboard.writeText(linkToCopy);
    setCopiedLinkId(productId);

    // Reseta a indicação de cópia após 2 segundos
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!isAuthorized) {
    return <p>Usuário não autorizado. Redirecionando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produtos para Afiliados</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="mb-2">{product.description}</p>
            {product.images.length > 0 && (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={300}
                height={200}
                className="w-full h-auto object-cover mb-2"
              />
            )}
            <button
              onClick={() => handleGenerateLink(product.id)}
              className="text-blue-500 mt-2"
            >
              Gerar Link de Afiliado
            </button>
            {affiliateLinks[product.id] && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Link gerado:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={affiliateLinks[product.id]}
                    readOnly
                    className="border px-2 py-1 text-sm w-full rounded"
                  />
                  <button
                    onClick={() => handleCopyLink(product.id)}
                    className="text-blue-500 text-sm"
                  >
                    {copiedLinkId === product.id ? "Copiado!" : "Copiar Link"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
*/


/*
// app/[locale]/(routes)/crm/afiliados/afiliados.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  affiliateLink: string;
}

export default function Afiliados() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      if (session) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        setTimeout(() => {
          router.push("/"); // Redireciona se não estiver logado
        }, 2000);
      }
      setIsLoading(false);
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    if (isAuthorized) fetchProducts();
  }, [isAuthorized]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!isAuthorized) {
    return <p>Usuário não autorizado. Redirecionando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produtos para Afiliados</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="mb-2">{product.description}</p>
            {product.images.length > 0 && (
             <Image
             src={product.images[0]}
             alt={product.title}
             width={300} // Largura desejada
             height={200} // Altura desejada
             className="w-full h-auto object-cover mb-2"
           />
            )}
            <Link
              href={`${product.affiliateLink}?ref=${product.id}`}
              className="text-blue-500"
            >
              Gerar Link de Afiliado
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
*/