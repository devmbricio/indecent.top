import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Importa authOptions para configurar getServerSession

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}


/*
import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();

  return session?.user;
}
*/