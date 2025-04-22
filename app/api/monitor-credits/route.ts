import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
    }

    // Busca o usuário antes da atualização
    const viewer = await prisma.user.findUnique({ where: { id: userId } });
    if (!viewer) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    if (viewer.credits <= 0) {
      const message = encodeURIComponent(
        "Créditos insuficientes. Adquira créditos ou explore conteúdos gratuitos."
      );
      const redirectTo = encodeURIComponent("/painel/profile/posts");
      return NextResponse.redirect(`/redirect?message=${message}&redirectTo=${redirectTo}`, 302);
    }

    
    {/*// Redireciona para a página de compras se os créditos forem <= 0
    if (viewer.credits <= 0) {
      return NextResponse.redirect("/compras", 302);
    }

    console.log("[monitor-credits] Antes da atualização:", {
      credits: viewer.credits,
      accumulativeCredits: viewer.accumulativeCredits,
    });*/}

    // Atualiza os créditos e acumula os deduzidos
    const updatedViewer = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: 1 },
        accumulativeCredits: { increment: 1 },
      },
    });

    console.log("[monitor-credits] Após a atualização:", {
      credits: updatedViewer.credits,
      accumulativeCredits: updatedViewer.accumulativeCredits,
    });

    // Gera mensagens de aviso conforme o saldo restante
    let message = null;
    if (updatedViewer.credits === 5) message = "Saldo restante: 5 minutos.";
    if (updatedViewer.credits === 3) message = "Saldo restante: 3 minutos.";
    if (updatedViewer.credits === 1) message = "Saldo restante: 1 minuto.";

    return NextResponse.json(
      { credits: updatedViewer.credits, message },
      { status: 200 }
    );
  } catch (error) {
    console.error("[monitor-credits] Erro:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}


/* funcional mas nao redireciona para compras
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
    }

    // Busca o viewer antes da atualização
    const viewer = await prisma.user.findUnique({ where: { id: userId } });
    if (!viewer) {
      return NextResponse.json({ error: "Viewer não encontrado." }, { status: 404 });
    }

    if (viewer.credits <= 0) {
      return NextResponse.json({ redirect: "/compras" }, { status: 302 });
    }

    console.log("[monitor-credits] Antes da atualização:", {
      credits: viewer.credits,
      accumulativeCredits: viewer.accumulativeCredits,
    });

    // Atualiza os créditos e acumula os deduzidos
    const updatedViewer = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: 1 },
        accumulativeCredits: { increment: 1 },
      },
    });

    console.log("[monitor-credits] Após a atualização:", {
      credits: updatedViewer.credits,
      accumulativeCredits: updatedViewer.accumulativeCredits,
    });

    let message = null;
    if (updatedViewer.credits === 5) message = "Saldo restante: 5 minutos.";
    if (updatedViewer.credits === 3) message = "Saldo restante: 3 minutos.";
    if (updatedViewer.credits === 1) message = "Saldo restante: 1 minuto.";

    return NextResponse.json(
      { credits: updatedViewer.credits, message },
      { status: 200 }
    );
  } catch (error) {
    console.error("[monitor-credits] Erro:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
*/


/*


funcional debitando mas nao credita
  // app/api/monitor-credits/route.ts
  import { NextResponse } from "next/server";
  import prisma from "@/lib/prisma";

 
  export async function POST(request: Request) {
    try {
      const { userId } = await request.json();
      if (!userId) {
        return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
      }

      // 1) Buscar o viewer
      const viewer = await prisma.user.findUnique({ where: { id: userId } });
      if (!viewer) {
        return NextResponse.json({ error: "Viewer não encontrado." }, { status: 404 });
      }

      // 2) Se não tiver créditos, redireciona para /compras
      if (viewer.credits <= 0) {
        return NextResponse.json({ redirect: "/compras" }, { status: 302 });
      }

      // 3) Debita 1 do viewer e acumula +1 no campo accumulativeCredits
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            credits: { decrement: 1 },
            accumulativeCredits: { increment: 1 },
          },
        }),
      ]);

      const newViewerCredits = viewer.credits - 1;

      // Mensagens de alerta (opcional)
      let message = null;
      if (newViewerCredits === 5) message = "Saldo restante: 5 minutos.";
      if (newViewerCredits === 3) message = "Saldo restante: 3 minutos.";
      if (newViewerCredits === 1) message = "Saldo restante: 1 minuto.";

      return NextResponse.json(
        { credits: newViewerCredits, message },
        { status: 200 }
      );
    } catch (error) {
      console.error("Erro em /api/monitor-credits:", error);
      return NextResponse.json(
        { error: "Erro interno no servidor." },
        { status: 500 }
      );
    }
  }

*/

/* deduzindo mas nao credita 
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário é obrigatório." },
        { status: 400 }
      );
    }

    // Verifica o usuário e seu saldo
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (user.credits <= 0) {
      return NextResponse.json(
        { redirect: "/compras" },
        { status: 302 } // Redireciona para a página de recarga
      );
    }

    // Deduz um crédito do usuário
    await prisma.user.update({
      where: { id: userId },
      data: { credits: user.credits - 1 },
    });

    // Gera mensagens de aviso conforme o saldo
    let message = null;
    if (user.credits - 1 === 5) message = "Saldo restante: 5 minutos.";
    if (user.credits - 1 === 3) message = "Saldo restante: 3 minutos.";
    if (user.credits - 1 === 1) message = "Saldo restante: 1 minuto.";

    return NextResponse.json(
      { credits: user.credits - 1, message },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no monitoramento:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
*/