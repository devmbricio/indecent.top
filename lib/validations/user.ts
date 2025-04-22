import { UserRole } from "@prisma/client";
import * as z from "zod";

export const userNameSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(32),
  username: z.string().min(3, "O username deve ter pelo menos 3 caracteres").max(32),
});

export const userRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

/*

import * as z from "zod"

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
})
*/