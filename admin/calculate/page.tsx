import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/calculate", async (req, res) => {
  try {
    // Busca todos os usuários, incluindo as relações necessárias
    const users = await prisma.user.findMany({
      include: {
        posts: true,        // Relacionamento com posts
        referrals: true,    // Relacionamento com referrals
      },
    });

    for (const user of users) {
      let totalCredits = 0;

      // Obter dados e tratar possíveis erros de tipo
      const postCount = user.posts?.length || 0;
      const reelCount = parseInt(user.reels || "0", 10); // Trata `reels` como string e converte para número
      const socialInteractionCount = parseInt(user.socialInteractions || "0", 10); // Trata como string e converte
      const referralCount = user.referrals?.length || 0;

      // Garantir que valores são válidos
      const validReels = isNaN(reelCount) ? 0 : reelCount;
      const validInteractions = isNaN(socialInteractionCount)
        ? 0
        : socialInteractionCount;

      // Lógica de cálculo de recompensas
      totalCredits += postCount * 1; // Exemplo: 1 crédito por post
      totalCredits += validReels * 5; // 5 tokens por Reel
      totalCredits += validInteractions * 2; // 2 tokens por interação
      totalCredits += referralCount * 20; // 20 tokens por referenciado

      // Atualizar os créditos do usuário no banco
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: totalCredits },
      });
    }

    res.status(200).json({ message: "Recompensas calculadas e registradas com sucesso." });
  } catch (error) {
    console.error("Erro ao calcular recompensas:", error);
    res.status(500).json({ error: "Erro ao calcular recompensas." });
  }
});

export default router;

