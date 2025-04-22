import { NextRequest, NextResponse } from "next/server"; // Use NextRequest e NextResponse para App Directory
import { getServerSession } from "next-auth"; // A função 'getServerSession' vai ser adaptada
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateFileUrl } from "@/lib/s3-utils";  // Função de gerar URL pública

// Função POST para criação de post
export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
  }

  const { caption, fileUrls, category } = await req.json();

  if (!fileUrls || fileUrls.length === 0) {
    return NextResponse.json({ message: "Imagens são obrigatórias." }, { status: 400 });
  }

  try {
    // Gerar URLs públicas para as imagens
    const validUrls = fileUrls.map((fileName: string) => generateFileUrl(fileName));

    // Criar o post no banco de dados
    const post = await prisma.post.create({
      data: {
        caption,
        fileUrls: validUrls,  // Salvar as URLs públicas no banco de dados
        category,
        tags: ["conteudo-adulto", 
  "hentai", 
  "amador", 
  "plataforma-de-afiliados",  
  "criadores-de-conteúdo", 
  "live-ao-vivo", "acompanhantes", 
  "OnlyFans brasileiro", 
  "www.onlyfans.com",   
  "onlyfans",   
  "www.privacy.com",  
  "privacy",  
  "xvideos", 
  "www.xvideos.com", 
  "socaseiras", 
  "www.socadseiras.com.br",  
  "lésbica",
  "milf",
  "cosplay",
  "femdom",
  "dominição",
  "inversão-de-papéis",
  "lcasal bi",
  "lésbica",
  "sexo",
  "putaria",
  "swing",
  "intimidades-caseiras",
  "troca de casais"], // Adicione tags ao post
        user: {
          connect: { id: session.user.id }, // Conectar ao usuário
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json({ message: "Erro ao criar post." }, { status: 500 });
  }
}

// Função GET para scroll infinito
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = 10;
  const subscriptionLevel = url.searchParams.get("subscriptionLevel") as "free" | "basic" | "premium";
  const userId = url.searchParams.get("userId");

  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { category: { in: allowedCategories } }, // Filtra por categorias permitidas
          { userId: userId || "" }, // Inclui os posts do próprio usuário
        ],
      },
      orderBy: { createdAt: "desc" }, // Ordena pela data de criação em ordem decrescente
      skip: (page - 1) * pageSize, // Pula os posts já exibidos
      take: pageSize, // Define o número de posts por página
      include: {
        comments: { include: { user: true } }, // Inclui informações dos comentários
        likes: { include: { user: true } }, // Inclui informações das curtidas
        savedBy: true, // Inclui informações de quem salvou o post
        user: true, // Inclui informações do autor do post
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return NextResponse.json(
      { message: "Erro ao buscar posts." },
      { status: 500 }
    );
  }
}


/* funcional antes do scroll infinito
import { NextRequest, NextResponse } from "next/server"; // Use NextRequest e NextResponse para App Directory
import { getServerSession } from "next-auth"; // A função 'getServerSession' vai ser adaptada
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateFileUrl } from "@/lib/s3-utils";  // Função de gerar URL pública

// Função POST para criação de post
export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
  }

  const { caption, fileUrls, category } = await req.json();

  if (!fileUrls || fileUrls.length === 0) {
    return NextResponse.json({ message: "Imagens são obrigatórias." }, { status: 400 });
  }

  try {
    // Gerar URLs públicas para as imagens
    const validUrls = fileUrls.map((fileName: string) => generateFileUrl(fileName));

    // Criar o post no banco de dados
    const post = await prisma.post.create({
      data: {
        caption,
        fileUrls: validUrls,  // Salvar as URLs públicas no banco de dados
        category,
        user: {
          connect: { id: session.user.id }, // Conectar ao usuário
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json({ message: "Erro ao criar post." }, { status: 500 });
  }
}
*/