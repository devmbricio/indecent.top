"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const interestsList = [
  "GAMER", "ARQUITETURA", "MODA", "BELEZA", "CONTEUDO_ADULTO",
  "ESPORTES", "MUSICA", "FILMES_SERIES", "TECNOLOGIA", "SAUDE_FITNESS",
  "EMPREENDEDORISMO", "VIAGENS", "CULINARIA", "CIENCIA", "FOTOGRAFIA",
  "AUTOMOVEIS", "NATUREZA", "ESPIRITUALIDADE", "INVESTIMENTOS",
];

interface InterestModalProps {
  onClose: () => void;
  updateSession: () => void; // Adicionamos essa função
}

export default function InterestModal({ onClose, updateSession }: InterestModalProps) {
  const { data: session, update } = useSession();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/getUserInterests")
        .then((res) => res.json())
        .then((data) => {
          setSelectedInterests(data.interests || []);
        });
    }
  }, [session]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length < 3) {
      alert("Por favor, selecione pelo menos 3 interesses.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/setInterests", {
      method: "POST",
      body: JSON.stringify({ interests: selectedInterests }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      console.log("✅ Interesses salvos com sucesso!");
      await update(); // Atualiza a sessão para refletir os novos interesses
      updateSession(); // Chama a função de update passada pelo componente pai
      onClose();
    } else {
      const errorData = await res.json();
      console.error("🚨 Erro ao salvar interesses:", errorData);
      alert(errorData.error || "Erro ao salvar interesses.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50">
      <div className="bg-black/10 p-4 rounded-md">
        <h2 className="text-xl font-bold mb-1 text-center">Escolha pelo menos 3 interesses</h2>
        <div className="grid grid-cols-2 gap-2">
          {interestsList.map((interest) => (
            <button
              key={interest}
              className={`p-1 border rounded ${
                selectedInterests.includes(interest) ? "bg-blue-500 text-white" : "bg-gray-600"
              }`}
              onClick={() => toggleInterest(interest)}
            >
              {interest.replace("_", " ")}
            </button>
          ))}
        </div>
        <button
          className="mt-4 p-2 bg-green-400 opacity-50 text-white rounded w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar e Continuar"}
        </button>
      </div>
    </div>
  );
}



/*
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const interestsList = [
  "GAMER", "ARQUITETURA", "MODA", "BELEZA", "CONTEUDO_ADULTO",
  "ESPORTES", "MUSICA", "FILMES_SERIES", "TECNOLOGIA", "SAUDE_FITNESS",
  "EMPREENDEDORISMO", "VIAGENS", "CULINARIA", "CIENCIA", "FOTOGRAFIA",
  "AUTOMOVEIS", "NATUREZA", "ESPIRITUALIDADE", "INVESTIMENTOS",
];

interface InterestModalProps {
  onClose: () => void;
}

export default function InterestModal({ onClose }: InterestModalProps) {
  const { data: session, update } = useSession();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🔹 Buscando interesses do usuário ao carregar o modal
    if (session?.user?.email) {
      fetch("/api/getUserInterests")
        .then((res) => res.json())
        .then((data) => {
          setSelectedInterests(data.interests || []);
        });
    }
  }, [session]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length < 3) {
      alert("Por favor, selecione pelo menos 3 interesses.");
      return;
    }

    setLoading(true);

    if (!session?.user?.email) {
      alert("Erro: usuário não autenticado.");
      setLoading(false);
      return;
    }

    console.log("🔹 Enviando interesses para a API:", selectedInterests);

    const res = await fetch("/api/setInterests", {
      method: "POST",
      body: JSON.stringify({ interests: selectedInterests }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      console.log("✅ Interesses salvos com sucesso!");

      // 🔹 Atualiza a sessão para refletir os interesses salvos
      await update();
      onClose();
    } else {
      const errorData = await res.json();
      console.error("🚨 Erro ao salvar interesses:", errorData);
      alert(errorData.error || "Erro ao salvar interesses.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50">
      <div className="bg-black/10  p-4 rounded-md">
        <h2 className="text-xl font-bold mb-1 text-center">Escolha pelo menos 3 interesses</h2>
        <div className="grid grid-cols-2 gap-2">
          {interestsList.map((interest) => (
            <button
              key={interest}
              className={`p-1 border rounded ${
                selectedInterests.includes(interest) ? "bg-blue-500 text-white" : "bg-gray-600"
              }`}
              onClick={() => toggleInterest(interest)}
            >
              {interest.replace("_", " ")}
            </button>
          ))}
        </div>
        <button
          className="mt-4 p-2 bg-green-400 opacity-50 text-white rounded w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar e Continuar"}
        </button>
      </div>
    </div>
  );
}
*/


/*
import { useState } from "react";
import { Session } from "next-auth"; // ✅ Importação correta

const interestsList = [
 "GAMER",
  "ARQUITETURA",
  "MODA",
  "BELEZA",
  "CONTEUDO_ADULTO",
  "ESPORTES",
  "MUSICA",
  "FILMES_SERIES",
  "TECNOLOGIA",
  "SAUDE_FITNESS",
  "EMPREENDEDORISMO",
  "VIAGENS",
  "CULINARIA",
  "CIENCIA",
  "FOTOGRAFIA",
  "AUTOMOVEIS",
  "NATUREZA",
  "ESPIRITUALIDADE",
  "INVESTIMENTOS",
];

interface InterestModalProps {
  onClose: () => void;
  updateSession: () => Promise<Session | null>; // ✅ Agora corretamente tipado
}

export default function InterestModal({ onClose, updateSession }: InterestModalProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length < 3) {
      alert("Por favor, selecione pelo menos 3 interesses.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/setInterests", {
      method: "POST",
      body: JSON.stringify({ interests: selectedInterests }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      await updateSession().then(onClose); // ✅ Fecha o modal após atualizar a sessão
    } else {
      alert("Erro ao salvar interesses.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 z-50">
      <div className="bg-black/20 p-2 rounded-md">
        <h2 className="text-xl font-bold mb-2 text-center justify-center">Áreas de interesse</h2>
        <div className="grid grid-cols-2 gap-1">
          {interestsList.map((interest) => (
            <button
              key={interest}
              className={`p-2 border rounded ${
                selectedInterests.includes(interest) ? "bg-blue-400 opacity-50 text-white" : "bg-gray-600"
              }`}
              onClick={() => toggleInterest(interest)}
            >
              {interest.replace("_", " ")}
            </button>
          ))}
        </div>
        <button
          className="mt-4 p-2 bg-green-400 opacity-50 text-white flex items-center justify-center rounded"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar e Continuar"}
        </button>
      </div>
    </div>
  );
}
*/