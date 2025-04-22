"use client";

import { useEffect } from "react";

export default function SetReferral() {
  useEffect(() => {
    const updateReferralId = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const referralId = urlParams.get("ref");

      if (referralId) {
        try {
          const response = await fetch("/api/set-referral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referralId }),
          });

          if (!response.ok) {
            console.error("Erro ao atualizar o referralId:", await response.json());
          }
        } catch (error) {
          console.error("Erro na requisição:", error);
        }
      }
    };

    updateReferralId();
  }, []);

  return null; // Este componente não exibe nada na interface do usuário
}
