"use client";

import { useState } from "react";
import { getUploadUrl } from "@/lib/upload";

export default function UploadVideo() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo primeiro!");
      return;
    }

    setUploading(true);

    try {
      const uploadUrl = await getUploadUrl(file.name, file.type);
      if (!uploadUrl) {
        alert("Erro ao obter URL de upload");
        setUploading(false);
        return;
      }

      console.log("🚀 Enviando arquivo para S3...", uploadUrl);

      // 🔥 Enviando o arquivo para o S3
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error("Erro ao enviar arquivo para o S3");
      }

      alert("✅ Upload concluído!");
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload do arquivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Upload de Vídeo</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        {uploading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
}
