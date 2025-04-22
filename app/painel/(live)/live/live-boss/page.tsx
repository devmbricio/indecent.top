"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UploadButton from "@/components/ui/UploadButton";
import { FaWhatsapp, FaInstagram, FaTiktok, FaCopy, FaDownload } from "react-icons/fa";
import LiveInviteImage from "@/components/LiveInviteImage";

export default function StartLivePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number>(0);
  const [availableCredits, setAvailableCredits] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [guestInstagram, setGuestInstagram] = useState<string>("");
  const [selectedInfluencer, setSelectedInfluencer] = useState<string | null>(null);
  const [influencers, setInfluencers] = useState<{ id: string; name: string }[]>([]);
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [sponsoredLives, setSponsoredLives] = useState<any[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user) {
      router.push("/compras");
      return;
    }

    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/monitor-credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });
        const data = await response.json();
        setAvailableCredits(data.credits || 0);
      } catch (error) {
        console.error("Erro ao verificar créditos:", error);
      }
    };

    fetchCredits();
    setLoading(false);
  }, [session, status, router]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await fetch("/api/select-influencer");
        const data = await response.json();
        setInfluencers(data);
      } catch (error) {
        console.error("Erro ao buscar influenciadores:", error);
      }
    };
    fetchInfluencers();
  }, []);

  useEffect(() => {
    const fetchLives = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/live/sponsored/sponsored-lives?userId=${session.user.id}`);
        const data = await response.json();
        setSponsoredLives(data);
      } catch (error) {
        console.error("Erro ao buscar lives patrocinadas:", error);
      }
    };

    fetchLives();
  }, [session]);

  const createInvite = async () => {
    if (!session?.user?.id) return;
  
    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
      alert("Por favor, escolha uma data e hora válida no futuro.");
      return;
    }
  
    if (credits <= 0 || credits > availableCredits) {
      alert("Créditos insuficientes.");
      return;
    }
  
    if (!selectedInfluencer && !guestInstagram) {
      alert("Preencha o Instagram do convidado ou selecione um influenciador.");
      return;
    }
  
    try {
      const response = await fetch("/api/live/sponsored/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          credits,
          duration,
          guestInstagram: guestInstagram || null,
          selectedInfluencer: selectedInfluencer || null,
          scheduledAt,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert(`Convite gerado com sucesso! Código: ${data.inviteCode}`);
        setAvailableCredits((prev) => prev - credits);
      } else {
        alert(data.error || "Erro ao criar convite.");
      }
    } catch (error) {
      console.error("Erro ao criar convite:", error);
      alert("Erro ao criar convite.");
    }
  };
  

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="relative flex w-full h-screen p-2">
      {/* Seção de Patrocinar Live */}
      <div className="w-1/3 p-4 bg-black/10 rounded-lg text-white">
        <h2 className="text-lg font-semibold">💰 Patrocinar Live</h2>
        <p>Créditos disponíveis: <strong>{availableCredits}</strong></p>

        <UploadButton onUploadComplete={(urls) => console.log(urls)} onUploadError={(err) => console.error(err)} />

        <label className="block mt-4 text-sm">Selecione o Influenciador:</label>
        <select
          value={selectedInfluencer || ""}
          onChange={(e) => setSelectedInfluencer(e.target.value)}
          className="w-full p-2 mt-2 rounded bg-black/10"
        >
          <option value="">-- Selecione --</option>
          {influencers.map((influencer) => (
            <option key={influencer.id} value={influencer.id}>
              {influencer.name}
            </option>
          ))}
        </select>

        <label className="block mt-4 text-sm">Instagram do convidado:</label>
        <input
          type="text"
          value={guestInstagram}
          onChange={(e) => setGuestInstagram(e.target.value)}
          placeholder="@Instagram do convidado"
          className="w-full p-2 mt-2 rounded bg-black/10"
        />

        <label className="block mt-4">⏱️ Escolha a duração da live (em minutos):</label>
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full p-2 mt-2 rounded bg-black/10">
          <option value={15} className="bg-black/50 opacity-50">15 minutos</option>
          <option value={30} className="bg-black/50 opacity-50">30 minutos</option>
          <option value={60} className="bg-black/50 opacity-50">60 minutos</option>
        </select>

        <label className="block mt-4">📅 Escolha a data e hora da live:</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full p-2 mt-2 rounded bg-black/10"
        />

        <label className="block mt-4">💵 Créditos para patrocínio:</label>
        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          className="w-full p-2 mt-2 rounded bg-black/10"
          min="1"
        />

        <button onClick={createInvite} className="w-full mt-4 bg-blue-400 opacity-50 p-2 rounded">
          💸 Confirmar Patrocínio
        </button>
      </div>

      {/* Seção de Lives Patrocinadas */}
      <div className="w-2/3 h-2 p-0 rounded-lg text-white ml-4">
        <h2 className="text-lg font-semibold">📺 Lives Patrocinadas</h2>
        {sponsoredLives.length === 0 ? (
          <p className="mt-4 text-gray-400">Você ainda não patrocinou nenhuma live.</p>
        ) : (
          sponsoredLives.map((live, index) => (
            <div key={index} className="flex flex-col p-4 bg-black/10 rounded mt-4">
              <p><strong>Instagram:</strong> {live.instagram || "N/A"}</p>
              
                <div className="flex items-center">
                <p>Live Link:</p>
                  <input
                    type="text"
                    value={`https://indecent.top/live/${live.inviteCode || live.code}`}
                    readOnly
                    className="w-full p-2 rounded bg-gray-700 text-gray-300"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(`https://indecent.top/live/${live.inviteCode || live.code}`)}
                    className="ml-2 bg-blue-400 p-2 rounded opacity-50"
                  >
                    <FaCopy />
                  </button>
                </div>
              <div>
              <LiveInviteImage
                guestInstagram={live.instagram}
                username={session?.user.username || "Usuário"}
                scheduledAt={live.scheduledAt}
                credits={live.creditsFrozen} 
              />
              </div>
              <div className="mt-4 flex space-x-2">
                  <a href={`https://wa.me/?text=🔥 Confira essa live incrível no Indecent! Acesse: https://indecent.top/live/${live.inviteCode || live.code}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white p-1 rounded"><FaWhatsapp /></a>
                  <a href={`https://www.instagram.com/?url=https://indecent.top/live/${live.inviteCode || live.code}`} target="_blank" rel="noopener noreferrer" className="bg-pink-500 text-white p-1 rounded"><FaInstagram /></a>
                  <a href={`https://www.tiktok.com/share?url=https://indecent.top/live/${live.inviteCode || live.code}`} target="_blank" rel="noopener noreferrer" className="bg-black text-white p-1 rounded"><FaTiktok /></a>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



/*
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UploadButton from "@/components/ui/UploadButton";
import { FaWhatsapp, FaInstagram, FaTiktok, FaTwitter, FaCopy } from "react-icons/fa";

export default function StartLivePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number>(0);
  const [availableCredits, setAvailableCredits] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [guestInstagram, setGuestInstagram] = useState<string>("");
  const [selectedInfluencer, setSelectedInfluencer] = useState<string | null>(null);
  const [influencers, setInfluencers] = useState<{ id: string; name: string }[]>([]);
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [sponsoredLives, setSponsoredLives] = useState<any[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user) {
      router.push("/compras");
      return;
    }

    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/monitor-credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });
        const data = await response.json();
        setAvailableCredits(data.credits || 0);
      } catch (error) {
        console.error("Erro ao verificar créditos:", error);
      }
    };

    fetchCredits();
    setLoading(false);
  }, [session, status, router]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await fetch("/api/select-influencer");
        const data = await response.json();
        setInfluencers(data);
      } catch (error) {
        console.error("Erro ao buscar influenciadores:", error);
      }
    };
    fetchInfluencers();
  }, []);

  useEffect(() => {
    const fetchSponsoredLives = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/live/sponsored/sponsored-lives?userId=${session.user.id}`);
        const data = await response.json();
        setSponsoredLives(data);
      } catch (error) {
        console.error("Erro ao buscar lives patrocinadas:", error);
      }
    };

    fetchSponsoredLives();
  }, [session]);

  const createInvite = async () => {
    if (!session?.user?.id) return;

    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
      alert("Por favor, escolha uma data e hora válida no futuro.");
      return;
    }

    if (credits <= 0 || credits > availableCredits) {
      alert("Créditos insuficientes.");
      return;
    }

    try {
      const response = await fetch("/api/live/sponsored/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          credits,
          duration,
          guestInstagram,
          selectedInfluencer,
          scheduledAt,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Convite gerado com sucesso! Código: ${data.inviteCode}`);
        //router.push(`/live/live-boss/${data.inviteCode}`);
        setAvailableCredits((prev) => prev - credits); // Atualiza créditos após o convite ser criado
      } else {
        alert(data.error || "Erro ao criar convite.");
      }
    } catch (error) {
      console.error("Erro ao criar convite:", error);
      alert("Erro ao criar convite.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="relative flex w-full h-screen p-2">
   
      <div className="w-1/2 p-4 bg-black/10 rounded-lg text-white">
        <h2 className="text-lg font-semibold">💰 Patrocinar Live</h2>
        <p>Créditos disponíveis: <strong>{availableCredits}</strong></p>

        <UploadButton onUploadComplete={(urls) => console.log(urls)} onUploadError={(err) => console.error(err)} />

        <label className="block mt-4  text-sm">Selecione o Influenciador:</label>
        <select
          value={selectedInfluencer || ""}
          onChange={(e) => setSelectedInfluencer(e.target.value)}
          className="w-full p-2 mt-2 rounded bg-black/10"
        >
          <option value="" className="bg-black/50 opacity-50">-- Selecione --</option>
          {influencers.map((influencer) => (
            <option key={influencer.id} value={influencer.id} className="bg-black/50 opacity-50">
              {influencer.name}
            </option>
          ))}
        </select>

        <label className="block mt-4 text-sm">Instagram do convidado:</label>
        <input
          type="text"
          value={guestInstagram}
          onChange={(e) => setGuestInstagram(e.target.value)}
          placeholder="@Instagram do convidado"
          className="w-full p-2 mt-2 rounded bg-black/10"
        />

        <label className="block mt-4">⏱️ Escolha a duração da live (em minutos):</label>
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full p-2 mt-2 rounded bg-black/10">
          <option value={15} className="bg-black/50 opacity-50">15 minutos</option>
          <option value={30} className="bg-black/50 opacity-50">30 minutos</option>
          <option value={60} className="bg-black/50 opacity-50">60 minutos</option>
        </select>

        <label className="block mt-4">📅 Escolha a data e hora da live:</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full p-2 mt-2 rounded bg-black/10"
        />

        <label className="block mt-4">💵 Créditos para patrocínio:</label>
        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          className="w-full p-2 mt-2 rounded bg-black/10"
          min="1"
        />

        <button onClick={createInvite} className="w-full mt-4 bg-blue-400 opacity-50 p-2 rounded">
          💸 Confirmar Patrocínio
        </button>
      </div>

 
 
        <div className="w-1/2 p-4 bg-black/10 rounded-lg text-white ml-4">
        <h2 className="text-lg font-semibold">📺 Lives Patrocinadas</h2>
        {sponsoredLives.length === 0 ? (
          <p className="mt-4 text-gray-400">Você ainda não patrocinou nenhuma live.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {sponsoredLives.map((live) => (
              <div key={live.id} className="p-4 bg-gray-700 rounded">
                <p><strong>Instagram:</strong> {live.instagram || "N/A"}</p>
                <p><strong>Live Link:</strong></p>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={`https://indecent.top/live/${live.inviteCode || live.code}`}
                    readOnly
                    className="w-full p-2 rounded bg-gray-700 text-gray-300"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(`https://indecent.top/live/${live.inviteCode || live.code}`)}
                    className="ml-2 bg-blue-400 p-2 rounded opacity-50"
                  >
                    <FaCopy />
                  </button>
                </div>
                <div className="mt-4 flex space-x-2">
                  <a href={`https://wa.me/?text=🔥 Confira essa live incrível no Indecent! Acesse: https://indecent.top/live/${live.inviteCode || live.code}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white p-1 rounded"><FaWhatsapp /></a>
                  <a href={`https://www.instagram.com/?url=https://indecent.top/live/${live.inviteCode || live.code}`} target="_blank" rel="noopener noreferrer" className="bg-pink-500 text-white p-1 rounded"><FaInstagram /></a>
                  <a href={`https://www.tiktok.com/share?url=https://indecent.top/live/${live.inviteCode || live.code}`} target="_blank" rel="noopener noreferrer" className="bg-black text-white p-1 rounded"><FaTiktok /></a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
*/
 