"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchAcceptedLives, acceptLiveInvite } from "@/lib/liveApi";

export default function AcceptInvitePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingLives, setIsLoadingLives] = useState(true); // Novo estado de carregamento
  const [acceptedLives, setAcceptedLives] = useState<
    { id: string; scheduledAt: string; instagram?: string }[]
  >([]);

  const loadAcceptedLives = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsLoadingLives(true); // Mostra o indicador de carregamento
    try {
      const lives = await fetchAcceptedLives(session.user.id);
      setAcceptedLives(lives);
    } catch (error) {
      console.error("Erro ao buscar lives aceitas:", error);
    } finally {
      setIsLoadingLives(false); // Oculta o indicador de carregamento
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      loadAcceptedLives();
    }
  }, [status, router, loadAcceptedLives]);

  const handleAcceptInvite = async () => {
    if (!inviteCode) {
      alert("Por favor, insira o código do convite.");
      return;
    }

    const instagramInput = prompt("Insira seu @Instagram para aceitar o convite:");
    if (!instagramInput) {
      alert("O @Instagram é obrigatório para aceitar o convite.");
      return;
    }

    setLoading(true);

    const userId = session?.user?.id as string;
    const success = await acceptLiveInvite(inviteCode, userId, instagramInput);

    setLoading(false);

    if (success) {
      alert("Convite aceito com sucesso!");
      loadAcceptedLives();
      setInviteCode("");
    } else {
      alert("Erro ao aceitar o convite.");
    }
  };

  const canStartLive = (scheduledAt: string) => {
    const now = new Date();
    const liveStartTime = new Date(scheduledAt);
    const timeDifference = liveStartTime.getTime() - now.getTime();
    return timeDifference <= 5 * 60 * 1000 && timeDifference > -60 * 60 * 1000;
  };

  if (status === "loading") return <p>Carregando...</p>;

  return (
    <div className="flex flex-col items-center justify-center  bg-black/10 p-2">
      <h2 className="text-2xl font-semibold mb-4 text-gray-600">Aceitar Convite para Live</h2>
      <div className="w-1/3 max-w-2xl">
        <input
          type="text"
          placeholder="Insira o código do convite"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 opacity-50"
        />
        <button
          onClick={handleAcceptInvite}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Processando..." : "Aceitar Convite"}
        </button>
      </div>

      <div className="mt-8 w-full max-w-3xl">
        <h3 className="text-xl font-semibold mb-4">Lives Agendadas</h3>
        {isLoadingLives ? (
          <p className="text-gray-600">Carregando lives aceitas...</p>
        ) : acceptedLives.length === 0 ? (
          <p className="text-gray-600">Você ainda não aceitou nenhuma live.</p>
        ) : (
          <div className="space-y-4">
            {acceptedLives.map((live) => (  
              <div key={live.id} className="p-4 border border-gray-600 rounded shadow">
                <p>
                  <strong>Data e Hora:</strong>{" "}
                  {new Date(live.scheduledAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                </p>
                <p>
                  <strong>Instagram:</strong> {live.instagram || "N/A"}
                </p>
                {canStartLive(live.scheduledAt) ? (
                  <button
                    onClick={() => router.push(`/live/${live.id}`)}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Iniciar Transmissão
                  </button>
                ) : (
                  <p className="mt-2 text-gray-500">
                    O botão de transmissão estará disponível 5 minutos antes do horário agendado.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
