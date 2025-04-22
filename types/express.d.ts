import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // ID do usuário autenticado
        email?: string; // Opcional: outras propriedades relevantes
        subscriptionLevel?: "free" | "basic" | "premium"; // Caso necessário
      };
    }
  }
}
