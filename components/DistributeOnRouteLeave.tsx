"use client";

import { useEffect } from "react";

interface DistributeOnRouteLeaveProps {
  viewerId: string;
  influencerId?: string;
}

/**
 * Chama `/api/distribute-credits` ao sair da rota (desmontar).
 */
export default function DistributeOnRouteLeave({
  viewerId,
  influencerId,
}: DistributeOnRouteLeaveProps) {
  useEffect(() => {
    console.log("[DistributeOnRouteLeave] MONTAGEM. viewerId =", viewerId, "influencerId =", influencerId);

    const distribute = async () => {
      console.log("[DistributeOnRouteLeave] Chamando /api/distribute-credits no unmount");
      try {
        const res = await fetch("/api/distribute-credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ viewerId, influencerId }),
        });
        console.log("[DistributeOnRouteLeave] /api/distribute-credits => status:", res.status);

        const data = await res.json();
        if (!res.ok) {
          console.error("[DistributeOnRouteLeave] Erro do servidor:", data);
        } else {
          console.log("[DistributeOnRouteLeave] Sucesso:", data);
        }
      } catch (err) {
        console.error("[DistributeOnRouteLeave] Erro fetch distribute-credits:", err);
      }
    };

    return () => {
      console.log("[DistributeOnRouteLeave] DESMONTAGEM => Chamando distribute()");
      distribute();
    };
  }, [viewerId, influencerId]);

  return null;
}
