"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

// Schema de validação
const SocialsSchema = z.object({
  indecent: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  facebook: z.string().optional(),
  pinterest: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  onlyfans: z.string().optional(),
  privacySocial: z.string().optional(),
});

type SocialsFormProps = {
  initialSocials: Record<string, string>;
  userId: string;
};

export default function SocialsForm({ initialSocials, userId }: SocialsFormProps) {
  const form = useForm({
    resolver: zodResolver(SocialsSchema),
    defaultValues: initialSocials,
  });

  const { isSubmitting, isDirty } = form.formState;

  async function handleSubmit(values: z.infer<typeof SocialsSchema>) {
    try {
      await axios.post("/api/update-socials", { userId, socials: values });
      toast.success("Redes sociais atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar redes sociais:", error);
      toast.error("Erro ao salvar redes sociais.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 font bg-black opacity-75 p-2 rounded-md">
        {Object.keys(initialSocials).map((platform) => (
          <FormItem key={platform}>
            <FormLabel className=" text-muted-foreground">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </FormLabel>
            <FormControl>
              <Input {...form.register(platform)} placeholder={`Digite seu ${platform}`} />
            </FormControl>
            <FormMessage />
          </FormItem>
        ))}
        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}


/*
"use client";

import React, { useState } from "react";
import axios from "axios";

type SocialsFormProps = {
  initialSocials: Record<string, string>;
  userId: string; // ID do usuário
};

const SocialsForm: React.FC<SocialsFormProps> = ({ initialSocials, userId }) => {
  const [socials, setSocials] = useState(initialSocials);
  const [loading, setLoading] = useState(false);

  const handleChange = (platform: string, value: string) => {
    setSocials((prev) => ({ ...prev, [platform]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/update-socials", {
        userId,
        socials,
      });

      if (response.status === 200) {
        alert("Redes sociais atualizadas com sucesso!");
      } else {
        throw new Error("Erro ao salvar redes sociais.");
      }
    } catch (error) {
      console.error("Erro ao salvar redes sociais:", error);
      alert("Erro ao salvar redes sociais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(socials).map((platform) => (
        <div key={platform}>
          <label htmlFor={platform} className="block text-sm font-medium">
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </label>
          <input
            type="text"
            id={platform}
            value={socials[platform] || ""}
            onChange={(e) => handleChange(platform, e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-gray-300 rounded"
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
};

export default SocialsForm;
*/


/*
"use client";

import React, { useState } from "react";
import { upsertUserSocials } from "@/lib/actions"; // Função para salvar redes sociais

type SocialsFormProps = {
  initialSocials: Record<string, string | undefined>;
};

const SocialsForm: React.FC<SocialsFormProps> = ({ initialSocials }) => {
  const [socials, setSocials] = useState(initialSocials);
  const [loading, setLoading] = useState(false);

  const handleChange = (platform: string, value: string) => {
    setSocials((prev) => ({ ...prev, [platform]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Converte `undefined` para `null` antes de enviar
      const socialsWithNulls = Object.fromEntries(
        Object.entries(socials).map(([key, value]) => [key, value ?? null])
      );

      await upsertUserSocials("USER_ID", socialsWithNulls); // Substituir USER_ID pelo ID real do usuário
      alert("Redes sociais atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar redes sociais:", error);
      alert("Erro ao salvar redes sociais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(socials).map((platform) => (
        <div key={platform}>
          <label htmlFor={platform} className="block text-sm font-medium">
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </label>
          <input
            type="text"
            id={platform}
            value={socials[platform] || ""}
            onChange={(e) => handleChange(platform, e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-gray-300 rounded"
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
};

export default SocialsForm;

*/