"use client";

import { useState } from "react";

export default function UpdateAvatar({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo antes de enviar.");
      return;
    }

    setStatus("loading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload da imagem.");
      }

      const { url } = await response.json();

      // Atualiza o avatar no banco de dados
      const updateResponse = await fetch("/api/update-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatarUrl: url }),
      });

      if (!updateResponse.ok) {
        throw new Error("Erro ao salvar o avatar no banco de dados.");
      }

      setStatus("success");
      window.location.reload(); // Atualiza a página para mostrar o novo avatar
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-[#ddc897] py-2 px-4 rounded"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Enviando..." : "Atualizar Avatar"}
      </button>
      {status === "success" && <p className="text-green-500 mt-2">Avatar atualizado com sucesso!</p>}
      {status === "error" && <p className="text-red-500 mt-2">Erro ao atualizar avatar.</p>}
    </div>
  );
}
