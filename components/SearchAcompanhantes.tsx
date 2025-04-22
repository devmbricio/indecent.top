"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

// Define o tipo do post
type Post = {
  id: string;
  caption: string | null;
  category: string;
  user: {
    name: string | null;
    username: string | null;
  };
};

export default function SearchAcompanhantes() {
  const [city, setCity] = useState(""); // Input da cidade
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!city) return; // Certifica-se de que o campo não está vazio
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`/api/acompanhantes/posts?city=${encodeURIComponent(city)}`);
      setResults(data.posts);
    } catch (err) {
      console.error("Erro na API:", err);
      setError("Erro ao buscar anúncios. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Digite a cidade..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border rounded bg-gray-300"
        />
        <button
          onClick={handleSearch}
          disabled={!city || loading}
          className="p-2 bg-[#e8d3e8ff] text-gray-300 hover:bg-[#2e2d2d] rounded"
        >
          Buscar
        </button>
      </div>

      {loading && <p>Buscando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4 space-y-4">
        {results.length > 0 ? (
          results.map((post) => (
            <div key={post.id} className="p-4 border rounded mb-4">
              <Link href={`/painel/p/${post.id}`}>
                <h3 className="text-lg font-bold text-blue-500 hover:underline">{post.caption}</h3>
              </Link>
              <p className="text-sm text-gray-500">
                Criado por:{" "}
                <Link href={`/painel/p/${post.id}`}>
                  <p className="font-semibold text-blue-500 hover:underline">
                    {post.user?.name || "Anônimo"}{" "}
                    <span className="italic">({post.user?.username || "Sem username"})</span>
                  </p>
                </Link>
              </p>
            </div>
          ))
        ) : (
          <p>Nenhum anúncio encontrado para a cidade informada.</p>
        )}
      </div>
    </div>
  );
}


/*
"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

// Define o tipo do post
type Post = {
  id: string;
  caption: string | null;
  category: string;
  user: {
    name: string | null;
    username: string | null;
  };
};

export default function SearchAcompanhantes() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`/api/search/posts?query=${query}`);
      setResults(data.posts);
    } catch (err) {
      console.error("Erro na API:", err);
      setError("Erro ao buscar posts. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Busque por arquivos indecent..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded bg-gray-300"
        />
        <button
          onClick={handleSearch}
          disabled={!query || loading}
          className="p-2 bg-[#e8d3e8ff] text-gray-300 hover:bg-[#2e2d2d] rounded"
        >
          Buscar
        </button>
      </div>

      {loading && <p>Buscando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4 space-y-4">
        {results.map((post) => (
          <div key={post.id} className="p-4 border rounded mb-4">
            <Link href={`/painel/p/${post.id}`}>
              <p className="text-blue-500 hover:underline">
                <h3 className="text-lg font-bold">{post.caption}</h3>
              </p>
            </Link>
            <p className="text-sm text-gray-500">
              Criado por:{" "}
              <span className="font-semibold">
                {post.user?.name || "Anônimo"}
              </span>{" "}
              (
              <span className="italic">{post.user?.username || "Sem username"}</span>)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
*/