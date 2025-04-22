"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const referralId = searchParams.get("ref");

  useEffect(() => {
    if (referralId) {
      // Salva o referralId no cookie para uso posterior
      document.cookie = `referralId=${referralId}; path=/; max-age=86400;`;
    }
  }, [referralId]);

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/painel" });
  };

  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <button
        className="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded"
        onClick={handleGoogleLogin}
      >
        Entrar com Google
      </button>
    </div>
  );
}


/*
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (response?.error) {
      if (response.error === "User not found") {
        // Redireciona para o cadastro se o usuário não estiver registrado
        router.push("/api/auth/signin");
      } else {
        setError("Erro ao fazer login. Verifique suas credenciais.");
      }
    } else {
      // Redireciona para o dashboard após login bem-sucedido
      router.push("/painel");
    }
  };

  const handleGoogleLogin = async () => {
    const response = await signIn("google", {
      redirect: false,
    });

    if (response?.error) {
      if (response.error === "User not found") {
        // Redireciona para o cadastro se o usuário não estiver registrado
        router.push("/api/auth/signin ");
      } else {
        setError("Erro ao fazer login com Google.");
      }
    } else {
      // Redireciona para o dashboard após login bem-sucedido
      router.push("/painel");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
               <div
          className="relative w-[20vw] h-[20vh] bg-no-repeat bg-center bg-contain p-20"
          style={{
            backgroundImage: "url('/indecent-top-logo.png')",
          }}
        />
      <form onSubmit={handleLogin} className="p-0 rounded-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center xl:pt-[10%] lg:pt-[5%] md:pt-[10%] pt-[12%] text-gray-600">Entrar</h1>

        <Button
          className="mt-4 w-full mb-4"
          variant="outline"
          onClick={handleGoogleLogin}
        >
          Entrar com Google
        </Button>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1"></label>
          <input
            type="email"
            name="email"
            placeholder="email"
            className="w-full px-4 py-2 border rounded-md bg-[#e8d3e8ff] placeholder-white opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1"></label>
          <input
            type="password"
            name="password"
            placeholder="senha"
            className="w-full px-4 py-2 border rounded-md bg-[#e8d3e8ff] placeholder-white opacity-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          className="w-full"
        >
          Entrar
        </Button>

   

        <p className="text-sm text-center text-gray-500 mt-4">
          Não tem uma conta?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  );
}
*/
