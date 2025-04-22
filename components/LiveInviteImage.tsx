"use client";

import { useEffect, useRef, useState } from "react";

interface LiveInviteProps {
  guestInstagram: string;
  username: string;
  scheduledAt: string;
  credits: number;
}

export default function LiveInviteImage({
  guestInstagram,
  username,
  scheduledAt,
  credits,
}: LiveInviteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Carregar a imagem de fundo
    const background = new Image();
    background.src = "/convite.png";
    background.onload = () => {
      // Definir tamanho máximo fixo para a imagem dentro da div
      const maxWidth = 300; // 🔹 Define a largura máxima da imagem
      const scaleFactor = maxWidth / background.width;
      const newHeight = background.height * scaleFactor;

      // Ajustar o tamanho do canvas para caber na div
      canvas.width = maxWidth;
      canvas.height = newHeight;

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Estilização do texto
      ctx.font = "bold 16px Arial"; // 🔹 Reduzi o tamanho da fonte para melhor encaixe
      ctx.textAlign = "center";

      // Texto dinâmico
      const text1 = `Olá, ${guestInstagram}`;
      const text2 = `Bem-vindo ao Indecent.top!`;
      const text3 = `@${username} convida você para`;
      const text4 = `Live em: ${new Date(scheduledAt).toLocaleString()}`;
      const text5 = `Valor inicial da live $${credits} `;
      const text6 = "Entre com seu id convite";
      const text7 = "https://www.indecent.top";

      // Definir posição relativa para os textos

      // Aplicar cor personalizada para text1
      ctx.fillStyle = "#ec9ec5";
      ctx.fillText(text1, canvas.width / 2, canvas.height * 0.45);

      // Cor padrão para outros textos
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text2, canvas.width / 2, canvas.height * 0.5);

      // Aplicar cor personalizada para text3
      ctx.fillStyle = "#ddc897";
      ctx.fillText(text3, canvas.width / 2, canvas.height * 0.55);

      // Voltar para cor padrão
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text4, canvas.width / 2, canvas.height * 0.6);
      ctx.fillText(text5, canvas.width / 2, canvas.height * 0.65);
      ctx.fillText(text6, canvas.width / 2, canvas.height * 0.7);
      ctx.fillText(text7, canvas.width / 2, canvas.height * 0.75);

      setImageUrl(canvas.toDataURL("image/png"));
    };
  }, [guestInstagram, username, scheduledAt, credits]);

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "convite_live.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-start justify-start w-full max-w-sm mx-auto p-0.5 bg-black/10 rounded-lg">
      {/* Canvas Responsivo */}
      <canvas ref={canvasRef} className="w-full max-w-[4000px] h-auto rounded-lg shadow-lg" />

      {imageUrl && (
        <button
          onClick={downloadImage}
          className="mt-1 px-4 py-1 bg-blue-400 opacity-50 text-white rounded-lg shadow-lg hover:bg-blue-600"
        >
          📥 Baixar Imagem
        </button>
      )}
    </div>
  );
}


/*
"use client";

import { useEffect, useRef, useState } from "react";

interface LiveInviteProps {
  guestInstagram: string;
  username: string;
  scheduledAt: string;
  credits: number;
}

export default function LiveInviteImage({
  guestInstagram,
  username,
  scheduledAt,
  credits,
}: LiveInviteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Carregar a imagem de fundo
    const background = new Image();
    background.src = "/convite.png";
    background.onload = () => {
      // Definir tamanho máximo fixo para a imagem dentro da div
      const maxWidth = 300; // 🔹 Define a largura máxima da imagem
      const scaleFactor = maxWidth / background.width;
      const newHeight = background.height * scaleFactor;

      // Ajustar o tamanho do canvas para caber na div
      canvas.width = maxWidth;
      canvas.height = newHeight;

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Estilização do texto
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Arial"; // 🔹 Reduzi o tamanho da fonte para melhor encaixe
      ctx.textAlign = "center";

      // Texto dinâmico
      const text1 = `Olá, ${guestInstagram}`;
      const text2 = `Bem-vindo ao Indecent.top!`;
      const text3 = `@${username} está convidando você`;
      const text4 = `Live em: ${new Date(scheduledAt).toLocaleString()}`;
      const text5 = `Você receberá $${credits} em créditos!`;
      const text6 = "Acesse o link para saber mais!";

      // Definir posição relativa para os textos
      ctx.fillText(text1, canvas.width / 2, canvas.height * 0.45);
      ctx.fillText(text2, canvas.width / 2, canvas.height * 0.5);
      ctx.fillText(text3, canvas.width / 2, canvas.height * 0.55);
      ctx.fillText(text4, canvas.width / 2, canvas.height * 0.6);
      ctx.fillText(text5, canvas.width / 2, canvas.height * 0.65);
      ctx.fillText(text6, canvas.width / 2, canvas.height * 0.7);

      setImageUrl(canvas.toDataURL("image/png"));
    };
  }, [guestInstagram, username, scheduledAt, credits]);

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "convite_live.png";
    link.click();
  };

  return (
    <div className="flex flex-col  w-full max-w-sm mx-auto p-1 bg-black/10 rounded-lg">
 b
      <canvas ref={canvasRef} className="w-full items-start justify-start max-w-[800px] h-auto rounded-lg shadow-lg" />

      {imageUrl && (
        <button
          onClick={downloadImage}
          className="mt-1 px-2 py-1 bg-blue-400 opacity-50 text-white rounded-lg shadow-lg hover:bg-blue-600"
        >
          📥 Baixar Imagem
        </button>
      )}
    </div>
  );
}
*/