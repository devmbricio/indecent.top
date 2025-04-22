"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MonitorCreditsProps {
  userId: string;
  credits: number; // Valor inicial
  influencerId: string;
}

export default function MonitorCredits({ userId, credits, influencerId }: MonitorCreditsProps) {
  const [currentCredits, setCurrentCredits] = useState<number>(credits);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const debitAndMonitorCredits = async () => {
      console.log("[MonitorCredits] Chamando /api/monitor-credits...");
      try {
        setLoading(true);

        const res = await fetch("/api/monitor-credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (res.status === 302) {
          router.push("/redirect");
          return;
        }

        const data = await res.json();
        if (!res.ok || typeof data.credits !== "number") {
          throw new Error(data.error || "Erro ao debitar créditos.");
        }
        // redireciona para redirect ok
        console.log("[MonitorCredits] Resposta recebida:", data);
        setCurrentCredits(data.credits);
        setMessage(data.message || null);
      } catch (error) {
        console.error("[MonitorCredits] Erro ao debitar créditos:", error);
        router.push("/redirect");
      } finally {
        setLoading(false);
      }
    };

    debitAndMonitorCredits();

    const interval = setInterval(() => {
      debitAndMonitorCredits();
    }, 60_000);

    return () => clearInterval(interval);
  }, [userId, router]);

  if (loading) {
    return <p>Carregando créditos...</p>;
  }

  if (currentCredits <= 0) {
    return (
      <p>
        Você não tem créditos suficientes. <a href="/redirect">Compre créditos</a>.
      </p>
    );
  }

  return (
    <div className="credit-info">
      <p>Créditos restantes: {currentCredits}</p>
      {message && <p>{message}</p>}
    </div>
  );
}




/* deduzindo mas nao credita 
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MonitorCreditsProps {
  userId: string; // Somente o `userId` é passado como prop
  credits: number; // Adicionando a propriedade credits
}

function MonitorCredits({ userId }: MonitorCreditsProps) {
  const [credits, setCredits] = useState<number | null>(null); // Créditos dinâmicos
  const [message, setMessage] = useState<string | null>(null); // Mensagem opcional
  const [loading, setLoading] = useState<boolean>(true); // Status de carregamento
  const router = useRouter();

  useEffect(() => {
    const debitAndMonitorCredits = async () => {
      try {
        setLoading(true); // Inicia o carregamento

        // Requisição para debitar os créditos
        const res = await fetch("/api/monitor-credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (res.status === 302) {
          // Redireciona para a página de compras caso necessário
          router.push("/compras");
          return;
        }

        const data = await res.json();

        if (!res.ok || typeof data.credits !== "number") {
          throw new Error(data.message || "Erro ao debitar créditos.");
        }

        // Atualiza os créditos e mensagem com dados da resposta
        setCredits(data.credits);
        setMessage(data.message || null);
      } catch (error) {
        console.error("Erro ao debitar créditos:", error);
        router.push("/compras");
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    debitAndMonitorCredits(); // Executa ao carregar o componente

    const interval = setInterval(() => {
      debitAndMonitorCredits();
    }, 60000); // Atualiza a cada 60 segundos

    return () => clearInterval(interval); // Limpa intervalo ao desmontar o componente
  }, [userId, router]);

  if (loading) {
    return <p>Carregando créditos...</p>;
  }

  if (credits === null || credits <= 0) {
    return (
      <p>
        Você não tem créditos suficientes. <a href="/compras">Compre créditos</a> para continuar
        explorando nosso conteúdo.
      </p>
    );
  }

  return (
    <div className="credit-info">
      <p>Créditos restantes: {credits}</p>
      {message && <p>{message}</p>}
    </div>
  );
}

export default MonitorCredits;
*/



/*
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MonitorCreditsProps {
  userId: string; // Definindo explicitamente o tipo do userId
  credits: number; // Adicionando a propriedade credits
}

function MonitorCredits({ userId }: MonitorCreditsProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Carregamento inicial
  const router = useRouter();

  useEffect(() => {
    const debitAndMonitorCredits = async () => {
      try {
        setLoading(true);

        // Debita os créditos do usuário imediatamente
        const res = await fetch("/api/monitor-credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        // Se a requisição for redirecionar ou não
        if (res.status === 302) {
          router.push("/compras");
          return;
        }

        const data = await res.json();

        if (!res.ok || !data.credits) {
          throw new Error("Erro ao debitar créditos.");
        }

        // Atualiza os créditos e a mensagem
        setCredits(data.credits);
        setMessage(data.message || null);
      } catch (error) {
        console.error("Erro ao debitar créditos:", error);
        // Fará a navegação até compras se houver erro.
        router.push("/compras");
      } finally {
        setLoading(false);
      }
    };

    debitAndMonitorCredits();

    // Atualiza os créditos a cada 1 minuto
    const interval = setInterval(() => {
      debitAndMonitorCredits();
    }, 60000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [userId, router]);

  // Se ainda estiver carregando, mostra mensagem
  if (loading) {
    return <p>Carregando créditos...</p>;
  }

  // Se os créditos forem zero, rendere o conteúdo gratuito
  if (credits === 0 || credits === null) {
    return <p>Você não tem créditos suficientes. Veja o conteúdo gratuito ou compre créditos e divista-se ainda mais.</p>;
  }

  return (
    <div className="credit-info">
      {credits !== null && <p>Créditos restantes: {credits}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default MonitorCredits;
*/





/* funcional debita correto
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MonitorCreditsProps {
  userId: string; // Definindo explicitamente o tipo do userId
  credits: number; // Adicionando a propriedade credits
}

function MonitorCredits({ userId }: MonitorCreditsProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Carregamento inicial
  const router = useRouter();

  useEffect(() => {
    const debitAndMonitorCredits = async () => {
      try {
        setLoading(true);

        // Debita os créditos do usuário imediatamente
        const res = await fetch("/api/monitor-credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        // Se o saldo for zero, redireciona
        if (res.status === 302) {
          router.push("/compras");
          return;
        }

        const data = await res.json();

        if (!res.ok || !data.credits) {
          throw new Error("Erro ao debitar créditos.");
        }

        // Atualiza o saldo e mensagem
        setCredits(data.credits);
        setMessage(data.message || null);
      } catch (error) {
        console.error("Erro ao debitar créditos:", error);
        router.push("/compras");
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    debitAndMonitorCredits();

    // Atualiza os créditos a cada 1 minuto
    const interval = setInterval(() => {
      debitAndMonitorCredits();
    }, 60000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [userId, router]);

  if (loading) {
    return <p>Carregando créditos...</p>;
  }

  return (
    <div className="credit-info">
      {credits !== null && <p>Créditos restantes: {credits}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default MonitorCredits;*/


/* funcional mas debita apos 1 min, deve debitar antes de 1 min 
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MonitorCreditsProps {
  userId: string; // Definindo explicitamente o tipo do userId
}

function MonitorCredits({ userId }: MonitorCreditsProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/monitor-credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (res.status === 302) {
          router.push("/compras"); // Redireciona se o saldo for 0
        }

        const data = await res.json();
        setCredits(data.credits);
        setMessage(data.message || null);
      } catch (error) {
        console.error("Erro ao monitorar créditos:", error);
      }
    }, 60000); // Atualiza a cada 1 minuto

    return () => clearInterval(interval);
  }, [userId, router]);

  return (
    <div className="credit-info">
      {credits !== null && <p>Créditos restantes: {credits}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default MonitorCredits;
*/