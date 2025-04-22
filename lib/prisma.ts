/*
import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

export let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

export default prisma;

*/


import { PrismaClient } from "@prisma/client";

declare global {
  // Esta declaração é necessária para que o TypeScript reconheça o prisma no escopo global
  var prisma: PrismaClient | undefined;
}

// Use a instância global em desenvolvimento, ou crie uma nova em produção
const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
