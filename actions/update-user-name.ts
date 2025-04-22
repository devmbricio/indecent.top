export async function updateUserName(
  userId: string,
  data: { name?: string; username?: string }
) {
  const response = await fetch("/api/update-user-name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, ...data }),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar o nome do usuário");
  }

  return response.json();
}
/*


export async function updateUserName(userId: string, data: { name: string; username: string }) {
  const response = await fetch("/api/update-user-name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, ...data }),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar o nome do usuário");
  }

  return response.json();
}
*/
/*



"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const userNameSchema = z.object({
  name: z.string().min(3).max(50).nonempty("O nome não pode estar vazio"),
  username: z.string().min(3).max(50).nonempty("O username não pode estar vazio"),
});

export async function updateUserName(userId: string, data: { name: string; username: string }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const parsedData = userNameSchema.parse(data);

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: parsedData.name,
      username: parsedData.username,
    },
  });

  revalidatePath(`/painel/${parsedData.username}`);
  return { status: "success" };
}
*/