"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

// Define o tipo do post
type Post = {
  id: string;
  caption: string | null;
  name: string | null;
  category: string;
  user: {
    name: string | null;
    username: string | null;
  };
};

export default function SearchPosts() {
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
          className="w-full p-2 border rounded bg-[#2e2d2d]/10 "
        />
        <button
          onClick={handleSearch}
          disabled={!query || loading}
          className="p-2 bg-gray-600 text-gray-300 hover:bg-[#2e2d2d] rounded"
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
              <h3 className="text-lg font-bold">{post.name}</h3>
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
