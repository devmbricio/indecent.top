"use client";

import { useState, useEffect } from "react";
import SocialsForm from "@/components/SocialsForm";
import axios from "axios";

const SocialsPage = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [initialSocials, setInitialSocials] = useState<Record<string, string>>({});

  const fetchSocials = async () => {
    try {
      const res = await axios.get("/api/get-socials");
      setInitialSocials(res.data.socials || {});
    } catch (err) {
      console.error("Erro ao buscar redes sociais:", err);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const handleSave = async (socials: Record<string, string>) => {
    setStatus("loading");
    try {
      const res = await axios.post("/api/update-socials", { socials });

      if (res.status === 200) {
        setStatus("success");
        alert("Redes sociais salvas com sucesso!");
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert("Erro ao salvar redes sociais.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-lg font-bold mb-4">Atualizar Redes Sociais</h1>
      {Object.keys(initialSocials).length > 0 ? (
        <SocialsForm initialSocials={initialSocials} onSubmit={handleSave} />
      ) : (
        <p>Carregando dados...</p>
      )}
      {status === "loading" && <p>Salvando...</p>}
      {status === "success" && <p className="text-green-500">Dados salvos com sucesso!</p>}
      {status === "error" && <p className="text-red-500">Erro ao salvar os dados.</p>}
    </div>
  );
};

export default SocialsPage;
