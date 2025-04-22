"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function AdminAddProduct() {
  // Conteúdo da página para usuários autorizados
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Estado para categorias múltiplas
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  const categories = [
    { label: "Gamer", value: "gamer" },
    { label: "Monitores", value: "monitores" },
    { label: "Computadores", value: "computadores" },
    { label: "Notebooks", value: "notebooks" },
    { label: "Hardware", value: "hardware" },
    { label: "Periféricos", value: "perifericos" },
    { label: "Cadeiras e Mesas", value: "cadeirasemesas" },
    { label: "Games", value: "games" },    
    { label: "Casa Inteligente", value: "casainteligente" },
    { label: "Eletrônicos", value: "eletronicos" },
    { label: "Casa e Lazer", value: "casaelazer" },
    { label: "E-books", value: "ebooks" },
  ];

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await getSession();
      if (session?.user?.isAdmin) {
        setIsAuthorized(true); // Usuário é admin, permite acesso
      } else {
        setIsAuthorized(false); // Usuário não autorizado
        setTimeout(() => {
          router.push("/"); // Redireciona após breve atraso
        }, 2000);
      }
      setIsLoading(false); // Finaliza o estado de carregamento
    };

    checkAdmin();
  }, [router]);

  if (isLoading) {
    return <p>Carregando...</p>; // Exibe enquanto verifica a sessão
  }

  if (!isAuthorized) {
    return <p>Usuário não autorizado. Redirecionando...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      title,
      description,
      images: images.split(','), // Divide as URLs das imagens
      affiliateLink,
      categories: selectedCategories, // Envia as categorias como uma lista de strings
    };

    const res = await fetch('/api/add-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      alert('Produto adicionado com sucesso!');
      setTitle('');
      setDescription('');
      setImages('');
      setAffiliateLink('');
      setSelectedCategories([]); // Limpar categorias após adicionar o produto
    } else {
      alert('Erro ao adicionar o produto.');
    }
  };


  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(categoryValue)
        ? prevCategories.filter((cat) => cat !== categoryValue)
        : [...prevCategories, categoryValue]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Adicionar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Título</label>
          <input
            className="border p-2 w-full bg-gray-600"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Descrição</label>
          <textarea
            className="border p-2 w-full bg-gray-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Imagens (separadas por vírgulas)</label>
          <input
            className="border p-2 w-full bg-gray-600"
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Link de Afiliado</label>
          <input
            className="border p-2 w-full bg-gray-600"
            type="text"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Categorias</label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={category.value}
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => handleCategoryChange(category.value)}
                />
                <label>{category.label}</label>
              </div>
            ))}
          </div>
        </div>
        <button className="bg-gray-600 hover:bg-orange-400 text-[#ddc897] py-2 px-4 rounded">
          Adicionar Produto
        </button>
      </form>
    </div>
  );
}


/* funcional 26-1024


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function AdminAddProduct() {
  // Conteúdo da página para usuários autorizados
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [category, setCategory] = useState(''); // Novo estado para categoria
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await getSession();
      if (session?.user?.is_admin) {
        setIsAuthorized(true); // Usuário é admin, permite acesso
      } else {
        setIsAuthorized(false); // Usuário não autorizado
        setTimeout(() => {
          router.push("/"); // Redireciona após breve atraso
        }, 2000);
      }
      setIsLoading(false); // Finaliza o estado de carregamento
    };

    checkAdmin();
  }, [router]);

  if (isLoading) {
    return <p>Carregando...</p>; // Exibe enquanto verifica a sessão
  }

  if (!isAuthorized) {
    return <p>Usuário não autorizado. Redirecionando...</p>;
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      title,
      description,
      images: images.split(','), // Divide as URLs das imagens
      affiliateLink,
      category, // Enviar a categoria
    };

    const res = await fetch('/api/add-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      alert('Produto adicionado com sucesso!');
      setTitle('');
      setDescription('');
      setImages('');
      setAffiliateLink('');
      setCategory(''); // Limpar categoria após adicionar o produto
    } else {
      alert('Erro ao adicionar o produto.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Adicionar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Título</label>
          <input
            className="border p-2 w-full bg-gray-400"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Descrição</label>
          <textarea
            className="border p-2 w-full bg-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Imagens (separadas por vírgulas)</label>
          <input
            className="border p-2 w-full bg-gray-400"
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Link de Afiliado</label>
          <input
            className="border p-2 w-full bg-gray-400"
            type="text"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Categoria</label>
          <select
            className="border p-2 w-full bg-gray-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            <option value="cozinhas">Cozinhas</option>
            <option value="banheiros">Banheiros e Lavabos</option>
            <option value="dormitorios">Dormitórios</option>
            <option value="estarjantar">Estar e Jantar</option>
            <option value="escritorios">Escritórios</option>
            <option value="iluminacao">Iluminação</option>
          </select>
        </div>
        <button className="bg-gray-400 hover:bg-orange-400 text-[#ddc897] py-2 px-4 rounded">
          Adicionar Produto
        </button>
      </form>
    </div>
  );
}
*/

/*


"use client";

import { useState } from 'react';

export default function AdminAddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [category, setCategory] = useState(''); // Novo estado para categoria

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      title,
      description,
      images: images.split(','), // Divide as URLs das imagens
      affiliateLink,
      category, // Enviar a categoria
    };

    const res = await fetch('/api/add-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      alert('Produto adicionado com sucesso!');
      setTitle('');
      setDescription('');
      setImages('');
      setAffiliateLink('');
      setCategory(''); // Limpar categoria após adicionar o produto
    } else {
      alert('Erro ao adicionar o produto.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Adicionar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Título</label>
          <input
            className="border p-2 w-full bg-gray-400"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Descrição</label>
          <textarea
            className="border p-2 w-full bg-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Imagens (separadas por vírgulas)</label>
          <input
            className="border p-2 w-full bg-gray-400"
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Link de Afiliado</label>
          <input
            className="border p-2 w-full bg-gray-400"
            type="text"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Categoria</label>
          <select
            className="border p-2 w-full bg-gray-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            <option value="cozinhas">Cozinhas</option>
            <option value="banheiros">Banheiros e Lavabos</option>
            <option value="dormitorios">Dormitórios</option>
            <option value="estar-jantar">Estar e Jantar</option>
          </select>
        </div>
        <button className="bg-gray-400 hover:bg-orange-400 text-[#ddc897] py-2 px-4 rounded">
          Adicionar Produto
        </button>
      </form>
    </div>
  );
}
*/

/*
"use client";

import { useState } from 'react';

export default function AdminAddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      title,
      description,
      images: images.split(','), // Divide as URLs das imagens
      affiliateLink,
    };

    const res = await fetch('/api/add-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      alert('Produto adicionado com sucesso!');
      setTitle('');
      setDescription('');
      setImages('');
      setAffiliateLink('');
    } else {
      alert('Erro ao adicionar o produto.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Adicionar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Título</label>
          <input
            className="border p-2 w-full bg-gray-400"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Descrição</label>
          <textarea
            className="border p-2 w-full bg-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Imagens (separadas por vírgulas)</label>
          <input
            className="border p-2 w-full bg-gray-400"
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Link de Afiliado</label>
          <input
            className="border p-2 w-full bg-gray-400"
            type="text"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
          />
        </div>
        <button className="bg-gray-400 hover:bg-orange-400 text-[#ddc897] py-2 px-4 rounded">Adicionar Produto</button>
      </form>
    </div>
  );
}
*/