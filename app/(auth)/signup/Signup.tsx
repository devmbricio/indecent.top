"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const referrerId = searchParams?.get("ref") || null;
  const router = useRouter();

  // 🔹 Estados do formulário de cadastro
  const [signupData, setSignupData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 🔹 Estados do formulário de login
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // 🔹 Manipulação dos campos de entrada
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Cadastro de usuário
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (signupData.password !== signupData.confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          referrerId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro no cadastro.");
      }

      // 🔹 Após criar a conta, faz login automaticamente
      const signInResponse = await signIn("credentials", {
        redirect: false, // Impede redirecionamento automático
        email: signupData.email,
        password: signupData.password,
      });

      if (signInResponse?.error) {
        throw new Error("Erro ao autenticar após o cadastro.");
      }

      router.push("/painel");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login de usuário existente
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoginLoading(true);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: loginData.email,
        password: loginData.password,
      });

      if (response?.error) {
        throw new Error("Credenciais inválidas.");
      }

      router.push("/painel");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative w-40 h-40 bg-no-repeat bg-center bg-contain mb-6" style={{ backgroundImage: "url('/indecent-top-logo.png')" }} />
      
      {/* 🔹 Formulário de Cadastro */}
      <form onSubmit={handleSignup} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center">Criar conta</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input type="text" name="name" placeholder="Nome" value={signupData.name} onChange={handleSignupChange} required className="w-full px-4 py-2 border rounded-md" />
        <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} required className="w-full px-4 py-2 border rounded-md" />
        <input type="password" name="password" placeholder="Senha" value={signupData.password} onChange={handleSignupChange} required className="w-full px-4 py-2 border rounded-md" />
        <input type="password" name="confirmPassword" placeholder="Confirme a senha" value={signupData.confirmPassword} onChange={handleSignupChange} required className="w-full px-4 py-2 border rounded-md" />

        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</Button>
      </form>

      {/* 🔹 Formulário de Login */}
      <form onSubmit={handleLogin} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center">Entrar</h1>

        <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required className="w-full px-4 py-2 border rounded-md" />
        <input type="password" name="password" placeholder="Senha" value={loginData.password} onChange={handleLoginChange} required className="w-full px-4 py-2 border rounded-md" />

        <Button type="submit" className="w-full" disabled={loginLoading}>{loginLoading ? "Entrando..." : "Entrar"}</Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Ainda não tem conta? <a href="/signup" className="text-blue-500 hover:underline">Cadastre-se</a>
        </p>
      </form>
    </div>
  );
}


/* cria o usuario no db mas nao persiste o login
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const referrerId = searchParams?.get("ref") || null;
  const router = useRouter();

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          referrerId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro no cadastro.");
      }

      router.push("/painel");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative w-40 h-40 bg-no-repeat bg-center bg-contain mb-6" style={{ backgroundImage: "url('/indecent-top-logo.png')" }} />
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center">Criar conta</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirme a senha"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem uma conta? <a href="/login" className="text-blue-500 hover:underline">Entre aqui</a>
        </p>
      </form>
    </div>
  );
}
*/