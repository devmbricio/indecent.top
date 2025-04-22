import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Rota: /admin/api/calculate
 * Descrição: Calcula as recompensas para cada usuário e retorna os dados.
 */
router.get("/api/calculate", async (req, res) => {
  try {
    // Busca os usuários com dados relacionados
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        referrals: true,
      },
    });

    // Calcula as recompensas para exibição
    const userRewards = users.map((user) => {
      const postRewards = (user.posts?.length || 0) * 1; // 1 token por post
      const storyRewards = (Number(user.reels) || 0) * 1; // 1 token por reel/story
      const affiliateRewards = (user.referrals?.length || 0) * 20; // 20 tokens por afiliado

      const totalCredits = postRewards + storyRewards + affiliateRewards;

      return {
        id: user.id,
        name: user.name || "N/A",
        email: user.email || "N/A",
        walletAddress: user.walletAddress || "N/A",
        postRewards,
        storyRewards,
        affiliateRewards,
        totalCredits,
      };
    });

    res.status(200).json(userRewards);
  } catch (error) {
    console.error("Erro ao calcular recompensas:", error);
    res.status(500).json({ error: "Erro ao calcular recompensas" });
  }
});

/**
 * Rota: /admin/api/distribute
 * Descrição: Calcula e grava as recompensas para cada usuário diretamente no banco de dados.
 */
router.post("/api/distribute", async (req, res) => {
  try {
    // Busca os usuários com dados relacionados
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        referrals: true,
      },
    });

    for (const user of users) {
      // Calcula as recompensas
      const postRewards = (user.posts?.length || 0) * 1; // 1 token por post
      const storyRewards = (Number(user.reels) || 0) * 1; // 1 token por reel/story
      const affiliateRewards = (user.referrals?.length || 0) * 20; // 20 tokens por afiliado

      const totalCredits = postRewards + storyRewards + affiliateRewards;

      // Atualiza o saldo de créditos do usuário no banco de dados
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: totalCredits },
      });
    }

    res.status(200).json({ message: "Recompensas distribuídas com sucesso!" });
  } catch (error) {
    console.error("Erro ao distribuir recompensas:", error);
    res.status(500).json({ error: "Erro ao distribuir recompensas" });
  }
});

export default router;
