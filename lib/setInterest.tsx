import { useState } from "react";
import { useRouter } from "next/router";

const interests = [
  { label: "Gamer", value: "GAMER" },
  { label: "Arquitetura e Decoração", value: "ARQUITETURA" },
  { label: "Moda", value: "MODA" },
  { label: "Beleza", value: "BELEZA" },
  { label: "Conteúdo Adulto", value: "CONTEUDO_ADULTO" },
  { label: "Esportes", value: "ESPORTES" },
  { label: "Música", value: "MUSICA" },
  { label: "Filmes e Séries", value: "FILMES_SERIES" },
  { label: "Tecnologia", value: "TECNOLOGIA" },
  { label: "Saúde e Fitness", value: "SAUDE_FITNESS" },
  { label: "Empreendedorismo", value: "EMPREENDEDORISMO" },
  { label: "Viagens", value: "VIAGENS" },
  { label: "Culinária", value: "CULINARIA" },
  { label: "Ciência", value: "CIENCIA" },
  { label: "Fotografia", value: "FOTOGRAFIA" },
  { label: "Automóveis", value: "AUTOMOVEIS" },
  { label: "Natureza e Meio Ambiente", value: "NATUREZA" },
  { label: "Espiritualidade", value: "ESPIRITUALIDADE" },
  { label: "Investimentos e Finanças", value: "INVESTIMENTOS" },
];

export default function InterestSelection() {
  const [selectedInterest, setSelectedInterest] = useState("");
  const router = useRouter();
  const { email } = router.query;

  const handleSubmit = async () => {
    if (!selectedInterest) {
      alert("Por favor, selecione um interesse.");
      return;
    }

    const res = await fetch("/api/setInterest", {
      method: "POST",
      body: JSON.stringify({ email, interest: selectedInterest }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/painel"); // Redirecionar para o painel após salvar interesse
    } else {
      alert("Erro ao salvar interesse.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Selecione seu interesse</h2>
      <select
        className="p-2 border rounded"
        value={selectedInterest}
        onChange={(e) => setSelectedInterest(e.target.value)}
      >
        <option value="">Selecione...</option>
        {interests.map((interest) => (
          <option key={interest.value} value={interest.value}>
            {interest.label}
          </option>
        ))}
      </select>
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Salvar e Continuar
      </button>
    </div>
  );
}
