"use client";

import { useState, useEffect } from "react";
import axios from "axios";

function AffiliateCredits({ userId }: { userId: string }) {
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await axios.get(`/api/affiliate?userId=${userId}`);
        // Verifica e define apenas a propriedade `credits`
        setCredits(response.data.credits);
        setError(null); // Limpa qualquer erro
      } catch (error: any) {
        console.error("Erro ao buscar créditos:", error);
        setCredits(null);
        setError("Erro ao carregar créditos.");
      }
    }

    fetchCredits();
  }, [userId]);

  // Renderiza o estado corretamente
  return (
    <div>
      {credits !== null ? (
        <div className="bg-black rounded opacity-75">
        <p className="text-green-500 font-bold text-2xl  p-1 border rounded placeholder-gray-400">$ {credits}</p>
        </div>
      ) : (
        <p className="text-red-500">{error || "Erro ao carregar créditos."}</p>
      )}
    </div>
  );
}

export default AffiliateCredits;

