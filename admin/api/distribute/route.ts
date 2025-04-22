// admin/api.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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
