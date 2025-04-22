import prisma from "@/lib/prisma";
import { InfluencerRole, AffiliateRole } from "@prisma/client";

export async function checkUserRole(userId: string): Promise<{ role: InfluencerRole | null; affiliateRole: AffiliateRole | null }> {
  try {
    console.log("🔍 Buscando usuário no banco de dados para userId:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { influencer: true, affiliate: true }, // Pegando ambos os papéis
    });

    console.log("📄 Dados do usuário retornados do banco:", user);

    if (!user) {
      console.warn("⚠️ Usuário não encontrado no banco:", userId);
      return { role: null, affiliateRole: null };
    }

    const role: InfluencerRole = user.influencer;
    const affiliateRole: AffiliateRole = user.affiliate;

    console.log("🎭 Papel do usuário retornado pelo banco:", role);
    console.log("🔗 Papel de afiliado retornado:", affiliateRole);

    return { role, affiliateRole };
  } catch (error) {
    console.error("❌ Erro ao buscar papel do usuário no banco:", error);
    return { role: null, affiliateRole: null };
  }
}


/*
import prisma from "@/lib/prisma";
import { InfluencerRole } from "@prisma/client";

 
export async function checkUserRole(userId: string): Promise<{ role: InfluencerRole | null }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { influencer: true },
    });

    if (!user) {
      console.warn("[checkUserRole] Usuário não encontrado:", userId);
      return { role: null };
    }

    if (user.influencer !== InfluencerRole.INFLUENCER) {
      console.warn("[checkUserRole] Usuário não é um Influencer:", userId);
      console.log("Desculpe, você ainda não alcançou o status de Influencer. Verifique os requisitos em /link/compras. Caso já tenha alcançado, solicite o upgrade do seu status pelo Instagram @indecent.top ou @top.indecent. Você será redirecionado para /painel em 8 segundos.");
      setTimeout(() => {
        window.location.href = "/painel";
      }, 8000);
      return { role: null };
    }

    return { role: user.influencer };
  } catch (error) {
    console.error("[checkUserRole] Erro ao buscar papel do usuário:", error);
    return { role: null };
  }
}

*/