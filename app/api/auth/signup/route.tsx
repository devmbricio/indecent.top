import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const { email, password, name, referrerId } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
    }

    const username = name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "") + Math.floor(Math.random() * 10000);

    const hashedPassword = bcrypt.hashSync(password, 10);
    const referralId = uuid();

    let referredById: string | null = null;
    if (referrerId) {
      const referrerUser = await prisma.user.findUnique({ where: { referralId: referrerId } });
      if (referrerUser) {
        referredById = referrerUser.id;
      }
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // 🔹 Sempre armazenamos um password válido
        name,
        username,
        referralId,
        referredById,
        stripeSubscriptionId: null,
        affiliate: "USER",
        influencer: "USER",
        isAdmin: false,
        job: "USER",
      },
    });

    return NextResponse.json({ message: "Usuário criado com sucesso", user: newUser });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: "Erro interno ao criar usuário" }, { status: 500 });
  }
}
/*


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const { email, password, name, referrerId } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
    }

    // Criação de username baseado no nome
    const username = name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "") + Math.floor(Math.random() * 10000);

    // Gera a senha hash
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralId = uuid(); // Gera um código único para referralId

    // Verifica se o referrerId pertence a um afiliado
    let referredById: string | null = null;
    if (referrerId) {
      const referrerUser = await prisma.user.findUnique({
        where: { referralId: referrerId },
      });

      if (referrerUser) {
        referredById = referrerUser.id;
      }
    }

    // Criar novo usuário com todos os campos necessários
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        referralId,
        referredById,
        stripeSubscriptionId: null,
        affiliate: "USER", // Enum para afiliados
        influencer: "USER", // Enum para influenciadores
        isAdmin: false,
        job: "USER",
      },
    });

    return NextResponse.json({ message: "Usuário criado com sucesso", user: newUser });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: "Erro interno ao criar usuário" }, { status: 500 });
  }
}
*/


/*
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password, name, ref } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Registrar o cliente como referido, se houver um código de referência
    if (ref) {
      const affiliate = await prisma.user.findUnique({ where: { referralId: ref } });

      // Verificar se o usuário referenciado é um afiliado
      if (affiliate && affiliate.affiliate) {
        await prisma.affiliateClient.create({
          data: {
            affiliateId: affiliate.id,
            clientId: newUser.id,
          },
        });
      }
    }

    return NextResponse.json({ message: "Usuário criado com sucesso", user: newUser });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: "Erro interno ao criar usuário" }, { status: 500 });
  }
}
*/

/*
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password, name, ref } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Registrar o cliente como referido, se houver um código de referência
    if (ref) {
      const affiliate = await prisma.user.findUnique({ where: { referralId: ref } });

      if (affiliate && affiliate.affiliate === "AFFILIATE") {
        await prisma.affiliateClient.create({
          data: {
            affiliateId: affiliate.id,
            clientId: newUser.id,
          },
        });
      }
    }

    return NextResponse.json({ message: "Usuário criado com sucesso", user: newUser });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: "Erro interno ao criar usuário" }, { status: 500 });
  }
}
*/

/*
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe." }, { status: 400 });
    }

    // Hashear a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o novo usuário
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json({ message: "Usuário criado com sucesso.", user: newUser });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: "Erro interno ao criar usuário." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Método não permitido." }, { status: 405 });
}
*/