"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MeetingTypeList from "@/components/MeetingTypeList";

interface ScheduledLive {
  id: string;
  scheduledAt: string;
  status: string;
  invitedBy?: {
    name?: string;
    instagram?: string;
  };
  guestInstagram?: string;
  guestInfluencer?: {
    name?: string;
    instagram?: string;
  };
}

const LiveHome = () => {
  const { data: session } = useSession();
  const [scheduledLives, setScheduledLives] = useState<ScheduledLive[]>([]);
  const now = new Date();
  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(now);

  useEffect(() => {
    if (session?.user?.id) {
      fetchLives();
    }
  }, [session]);

  const fetchLives = async () => {
    try {
      const response = await fetch("/api/live/scheduled");
      const data = await response.json();
      console.log("Lives agendadas recebidas:", data);

      if (Array.isArray(data)) {
        setScheduledLives(data);
      } else {
        console.warn("Nenhuma live encontrada.");
        setScheduledLives([]);
      }
    } catch (error) {
      console.error("Erro ao buscar lives:", error);
    }
  };

  return (
    <section className="flex size-full flex-col gap-5 dark:text-gray-300 text-gray-600">
      <div className="h-[223px] w-full rounded-[20px] bg-black/10 text-white p-8">
        <div className="flex h-full flex-col justify-between">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            Agenda de lives
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-[#ddc897] lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px] border border-gray-600 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {scheduledLives.length > 0 ? (
            scheduledLives.map((live) => (
              <div key={live.id} className="bg-gray-700 text-white p-2 rounded-lg shadow-lg">
                <h3 className="font-bold text-md">Live Agendada</h3>
                <p className="text-sm">
                  Data: {new Date(live.scheduledAt).toLocaleString("pt-BR")}
                </p>
                <p className="text-sm">Status: {live.status}</p>
                <p className="text-sm">Anfitrião: {live.invitedBy?.name || "N/A"}</p>
                <p className="text-sm">Instagram: {live.invitedBy?.instagram || "N/A"}</p>
                <p className="text-sm">
                  Instagram Convidado: {live.guestInfluencer?.instagram || live.guestInstagram || "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Nenhuma live agendada.</p>
          )}
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default LiveHome;



/*
"use client";

import MeetingTypeList from "@/components/MeetingTypeList";

const LiveHome = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(now);

  return (
    <section className="flex size-full flex-col gap-5 dark:text-gray-300 text-gray-600">
      <div className="h-[303px] w-full rounded-[20px]">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            Próxima live às: 12h30
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default LiveHome;
*/