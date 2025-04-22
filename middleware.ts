import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const referralId = url.searchParams.get("ref");

  if (referralId) {
    const response = NextResponse.next();
    response.cookies.set("referralId", referralId, { path: "/", httpOnly: true });
    return response;
  }

  return NextResponse.next();
}

// Proteção de rotas usando `withAuth`
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const isLoggedIn = !!token; // Verifica se o usuário está logado
      const isOnDashboard = req.nextUrl.pathname.startsWith("/painel"); // Protege rotas do painel

      if (isOnDashboard) {
        return isLoggedIn; // Permite acesso apenas a usuários logados
      }

      return true; // Permite acesso a outras rotas
    },
  },
});

// Configuração do matcher para aplicar o middleware nas rotas relevantes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.png).*)", // Aplica em rotas gerais (exceto arquivos estáticos)
    "/api/auth/signin",
    "/signup",
    "/login",
    "/painel",
  ],
};



/*mport { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const isLoggedIn = !!token;
      const isOnDashboard = req.nextUrl.pathname.startsWith("/painel");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.png).*)"],
};
*/

