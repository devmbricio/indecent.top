"use client";

import { useState } from "react";
import { updateUserName } from "@/actions/update-user-name";

export default function UpdateUserName({ userId }: { userId: string }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await updateUserName(userId, { name, username });
      if (response.status === "success") {
        setSuccess("Nome atualizado com sucesso!");
      } else {
        setError("Erro ao atualizar o nome.");
      }
    } catch (err) {
      setError("Erro ao atualizar o nome.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-bold">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Novo nome"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="username" className="block text-sm font-bold">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Novo username"
        />
      </div>

      <button type="submit" className="mt-4 p-2 bg-blue-500 text-[#ddc897] rounded">
        Atualizar
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </form>
  );
}
