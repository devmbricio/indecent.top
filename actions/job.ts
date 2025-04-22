import prisma from "@/lib/prisma"; // Importe seu Prisma Client

export async function updateUserJob(userId: string, job: "USER" | "JOB") {
  if (!userId || !job) {
    throw new Error("Parâmetros inválidos.");
  }

  try {
    // Atualiza o campo "job" do usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { job },
    });

    return updatedUser; // Retorna o usuário atualizado
  } catch (error) {
    console.error("Erro ao atualizar job:", error);
    throw new Error("Erro ao atualizar job.");
  }
}
