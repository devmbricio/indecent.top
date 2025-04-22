import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função para calcular recompensas para criadores e afiliados
export async function calculateAndCreditRewards() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,       // Inclui os posts associados
        referrals: true,   // Inclui os referrals associados
      },
    });

    for (const user of users) {
      let totalCredits = 0;
    
      // Verifica quantidade de posts
      const postCount = user.posts?.length || 0;
    
      // Cálculo para criadores de conteúdo
      totalCredits += postCount * 10; // Exemplo: 10 tokens por post
      const reels = parseInt(user.reels || "0", 10); // Converte reels para número
      if (!isNaN(reels) && reels > 0) {
        totalCredits += reels * 5; // Exemplo: 5 tokens por Reel
      }
    
      // Verifica quantidade de referrals
      const referralCount = user.referrals?.length || 0;
    
      // Cálculo para afiliados
      const socialInteractions = parseInt(user.socialInteractions || "0", 10); // Converte socialInteractions para número
      if (!isNaN(socialInteractions) && socialInteractions > 0) {
        totalCredits += socialInteractions * 2; // Exemplo: 2 tokens por interação
      }
      totalCredits += referralCount * 20; // Exemplo: 20 tokens por referenciado
    
      // Atualização do crédito virtual
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: totalCredits },
      });
    }
    
    

    console.log("Recompensas registradas no banco com sucesso!");
  } catch (error) {
    console.error("Erro ao calcular recompensas:", error);
  }
}

