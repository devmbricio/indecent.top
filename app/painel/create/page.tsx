"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Error from "@/components/Error";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useMount from "@/hooks/useMount";
import { CreatePost } from "@/lib/schemas";
import { createPost } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import UploadButton from "@/components/ui/UploadButton";
import { Textarea } from "@/components/ui/textarea";

function CreatePage() {
  const [location, setLocation] = useState({ city: "", country: "" });
  const mount = useMount();
  const pathname = usePathname();
  const isCreatePage = pathname === "/painel/create";
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof CreatePost>>({
    resolver: zodResolver(CreatePost),
    defaultValues: {
      caption: "",
      fileUrls: [],
      category: "free",
      userId: userId || "",
      city: "",
      country: "",
    },
  });

  const fileUrls = form.watch("fileUrls") || [];

  useEffect(() => {
    if (!mount) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then(({ address }) => {
              setLocation({
                city: address.city || address.town || address.village || "Desconhecida",
                country: address.country || "Desconhecido",
              });
            })
            .catch(() => setLocation({ city: "Erro", country: "Erro" }));
        }
      );
    }
  }, [mount]);

  const handleSubmit = async (values: z.infer<typeof CreatePost>) => {
    const res = await createPost({ ...values, ...location });

    if (res.errors) {
      return toast.error(<Error res={res} />);
    }

    toast.success(res.message);
    router.push("/painel");
  };

  if (!mount) return null;

  return (
    <div className="overflow-hidden">
      <Dialog open={isCreatePage} onOpenChange={(open) => !open && router.back()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar post</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Form fields */}
              <FormField
                control={form.control}
                name="fileUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="picture">Imagens</FormLabel>
                    <FormControl>
                      <UploadButton
                        onUploadComplete={(urls) => {
                          form.setValue("fileUrls", [...fileUrls, ...urls]);
                          toast.success("Upload completo");
                        }}
                        onUploadError={(error) => {
                          console.error(error);
                          toast.error("Falha no upload");
                        }}
                      />
                    </FormControl>
                    <FormDescription>Carregue até 10 imagens.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview Images */}
              {fileUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {fileUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative w-full">
                      <AspectRatio ratio={16 / 9} className="h-auto">
                        <PostImage src={url} alt={`Imagem ${index + 1}`} />
                      </AspectRatio>
                    </div>
                  ))}
                </div>
              )}

              {/* Location */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} value={location.city} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input {...field} value={location.country} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Additional Fields */}
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="caption">Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Escreva uma descrição..." rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="category">Categoria</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border rounded bg-gray-600"
                      >
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Escolha o nível de acesso para este post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" variant="outline" disabled={form.formState.isSubmitting}>
                Criar post
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PostImage({ src, alt }: { src: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="sm:rounded-md object-cover"
      onError={() => {
        console.error("Erro ao carregar a imagem:", imageSrc);
        setImageSrc("/indecent-top-logo-rosa-transparent.png"); // Caminho para uma imagem padrão.
      }}
    />
  );
}

export default CreatePage;



/* funcional antes da localização
"use client";

import { useSession } from "next-auth/react";
import Error from "@/components/Error";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useMount from "@/hooks/useMount";
import { CreatePost } from "@/lib/schemas";
import { createPost } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import UploadButton from "@/components/ui/UploadButton";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

function CreatePage() {
  const pathname = usePathname();
  const isCreatePage = pathname === "/painel/create";
  const router = useRouter();
  const mount = useMount();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof CreatePost>>({
    resolver: zodResolver(CreatePost),
    defaultValues: {
      caption: "",
      fileUrls: [],
      category: "free",
      userId: userId || "",
    },
  });

  const fileUrls = form.watch("fileUrls") ?? []; // Garante que seja um array

  if (!mount) return null;

  return (
    <div className="overflow-hidden">
      <Dialog open={isCreatePage} onOpenChange={(open) => !open && router.back()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar post</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                const res = await createPost(values);

                if (res.errors) {
                  return toast.error(<Error res={res} />);
                }

                toast.success(res.message);
                router.push("/painel");
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="fileUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="picture">Imagens</FormLabel>
                    <FormControl>
                      <UploadButton
                        onUploadComplete={(urls) => {
                          form.setValue("fileUrls", [...fileUrls, ...urls]);
                          toast.success("Upload completo");
                        }}
                        onUploadError={(error) => {
                          console.error(error);
                          toast.error("Falha no upload");
                        }}
                      />
                    </FormControl>
                    <FormDescription>Carregue até 10 imagens.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fileUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {fileUrls.map((url, index) => (
  <div key={`${url}-${index}`} className="relative w-full">
    <AspectRatio ratio={16 / 9} className="h-auto">
      <PostImage src={url} alt={`Imagem ${index + 1}`} />
    </AspectRatio>
  </div>
))}

  
                </div>
              )}

<FormField
  control={form.control}
  name="caption"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="caption">Descrição</FormLabel>
      <FormControl>
        <Textarea
          id="caption"
          placeholder="Escreva uma descrição..."
          rows={4}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


<FormField
  control={form.control}
  name="tags"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="tags">Tags</FormLabel>
      <FormControl>
        <Input
          type="text"
          id="tags"
          className="bg-gray-300 "
          placeholder="Adicione tags separadas por vírgulas"
          onChange={(e) => {
            const tags = e.target.value.split(",").map((tag) => tag.trim());
            field.onChange(tags); // Atualiza o estado do formulário com as tags
          }}
        />
      </FormControl>
      <FormDescription>
        Insira tags relacionadas ao post, separadas por vírgulas.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>


              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="category">Categoria</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        id="category"
                        className="w-full p-2 border rounded bg-gray-300"
                      >
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Escolha o nível de acesso para este post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" variant={"outline"} disabled={form.formState.isSubmitting}>
                Criar post 
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PostImage({ src, alt }: { src: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="sm:rounded-md object-cover"
      onError={() => {
        console.error("Erro ao carregar a imagem:", imageSrc);
        setImageSrc("/indecent.top_logo_9-16.png"); // Substitua por uma imagem padrão.
      }}
    />
  );
}

export default CreatePage;
*/