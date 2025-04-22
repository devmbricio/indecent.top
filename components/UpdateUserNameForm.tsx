"use client";

import { useState } from "react";

export default function UpdateUserNameForm({
  userId,
  initialName,
  initialUsername,
}: {
  userId: string;
  initialName: string;
  initialUsername: string;
}) {
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/update-user-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, name, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "USERNAME_EXISTS") {
          throw new Error("O nome de usuário já existe. Por favor, tente outro.");
        } else {
          throw new Error(errorData.message || "Erro ao atualizar dados.");
        }
      }

      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-muted-foreground bg-black  opacity-75 p-2 rounded-md ">
      <div>
        <label htmlFor="name" className="block">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-1 border rounded text-gray-300 placeholder-gray-400"
        />
      </div>
      <div>
        <label htmlFor="username" className="block font-sm">
          Nome de usuário
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-1 border text-gray-300 placeholder-gray-400 rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gray-600 border text-gray-300 hover:bg-gray-300 px-4 py-0.5 rounded"
      >
        {status === "loading" ? "Atualizando..." : "Salvar"}
      </button>
      {status === "error" && errorMessage && (
        <p className="text-red-500">{errorMessage}</p>
      )}
      {status === "success" && (
        <p className="text-green-500">Atualizado com sucesso!</p>
      )}
    </form>
  );
}


/* funcional mas nao amigavel
"use client";

import { useState } from "react";

export default function UpdateUserNameForm({ userId, initialName, initialUsername }: { userId: string; initialName: string; initialUsername: string }) {
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/update-user-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, name, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar dados.");
      }

      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-muted-foreground bg-gray-700 p-2 rounded-md ">
      <div>
        <label htmlFor="name" className="block font-sm">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-1 border rounded text-gray-300 placeholder-gray-600"
        />
      </div>
      <div>
        <label htmlFor="username" className="block font-sm">
          Nome de usuário
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-1 border  text-gray-300 placeholder-gray-400 rounded-md"
        />
      </div>
      <button type="submit" disabled={status === "loading"} className="bg-gray-600 border text-gray-300 hover:bg-gray-300  px-4 py-0.5 rounded">
        {status === "loading" ? "Atualizando..." : "Salvar"}
      </button>
      {status === "error" && errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {status === "success" && <p className="text-green-500">Atualizado com sucesso!</p>}
    </form>
  );
}
*/