"use client";

import { useState, useTransition } from "react";
import { updateUserName} from "@/actions/update-user-name";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { userNameSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";
import { z } from "zod";

type FormData = z.infer<typeof userNameSchema>;

interface UserNameFormProps {
  user: Pick<User, "id" | "name" | "username">;
}

export function UserNameForm({ user }: UserNameFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserNameWithId = updateUserName.bind(null, user.id);

  const checkUpdate = (value: string) => {
    setUpdated(user.name !== value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.name || "",
    },
  });
  

  const onSubmit = handleSubmit((data) => {
  startTransition(async () => {
    try {
      const { status } = await updateUserName(user.id, data); // Passa o ID e os dados do formulário

      if (status !== "success") {
        toast.error("Algo deu errado. Por favor, tente novamente.");
      } else {
        await update();
        setUpdated(false);
        toast.success("Seu nome foi atualizado.");
      }
    } catch (error) {
      toast.error("Erro ao atualizar o nome.");
    }
  });
});


  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>Seu nome</CardTitle>
          <CardDescription className="text-[15px]">
            Digite seu nome completo ou um nome de exibição que você se sinta confortável.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Nome
            </Label>
            <Input
              id="name"
              className="w-full sm:w-[400px]"
              size={32}
              {...register("name")}
              onChange={(e) => checkUpdate(e.target.value)}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-accent py-2">
          <p className="text-sm font-medium text-muted-foreground">
            Máximo 32 caracteres
          </p>
          <Button
            type="submit"
            variant={updated ? "default" : "secondary"} // Substituído "disable" por "secondary"
            disabled={isPending || !updated}
          >
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            <span>Salvar alterações</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
/*

"use client";

import { useState, useTransition } from "react";
import { updateUserName} from "@/actions/update-user-name";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { userNameSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";
import { z } from "zod";

type FormData = z.infer<typeof userNameSchema>;

interface UserNameFormProps {
  user: Pick<User, "id" | "name">;
}

export function UserNameForm({ user }: UserNameFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserNameWithId = updateUserName.bind(null, user.id);

  const checkUpdate = (value: string) => {
    setUpdated(user.name !== value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });
  

  const onSubmit = handleSubmit((data) => {
  startTransition(async () => {
    try {
      const { status } = await updateUserName(user.id, data); // Passa o ID e os dados do formulário

      if (status !== "success") {
        toast.error("Algo deu errado. Por favor, tente novamente.");
      } else {
        await update();
        setUpdated(false);
        toast.success("Seu nome foi atualizado.");
      }
    } catch (error) {
      toast.error("Erro ao atualizar o nome.");
    }
  });
});


  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>Seu nome</CardTitle>
          <CardDescription className="text-[15px]">
            Digite seu nome completo ou um nome de exibição que você se sinta confortável.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Nome
            </Label>
            <Input
              id="name"
              className="w-full sm:w-[400px]"
              size={32}
              {...register("name")}
              onChange={(e) => checkUpdate(e.target.value)}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-accent py-2">
          <p className="text-sm font-medium text-muted-foreground">
            Máximo 32 caracteres
          </p>
          <Button
            type="submit"
            variant={updated ? "default" : "secondary"} // Substituído "disable" por "secondary"
            disabled={isPending || !updated}
          >
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            <span>Salvar alterações</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
*/