import { useState } from "react";

export default function ContentViewer({
  contentId,
  userCredits,
  pricePerContent,
}: {
  contentId: string;
  userCredits: number;
  pricePerContent: number;
}) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(userCredits);

  const handleAccessContent = async () => {
    if (userCredits < pricePerContent) {
      alert("Você não tem créditos suficientes para acessar este conteúdo!");
      return;
    }

    // Deduzir os créditos do usuário
    setLoading(true);

    try {
      const res = await fetch(`/api/deductCredits`, {
        method: "POST",
        body: JSON.stringify({ contentId, price: pricePerContent }),
      });

      if (!res.ok) {
        throw new Error("Falha ao deduzir os créditos.");
      }

      const { updatedCredits } = await res.json();

      setCreditsLeft(updatedCredits);
      setHasAccess(true);
    } catch (error) {
      alert("Houve um erro ao tentar acessar o conteúdo.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {hasAccess ? (
        <div>
          {/* Conteúdo exibido ao usuário */}
          <h1>Conteúdo Visualizado</h1>
          {/* Carregar e exibir o conteúdo */}
        </div>
      ) : (
        <button onClick={handleAccessContent} disabled={loading}>
          {loading ? "Carregando..." : "Acessar Conteúdo"}
        </button>
      )}
      <div>
        Créditos disponíveis: {creditsLeft}
      </div>
    </div>
  );
}
