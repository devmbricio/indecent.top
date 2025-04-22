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
import { CreateAdsPost } from "@/lib/schemas";
import { createAdsPost } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import UploadButton from "@/components/ui/UploadButton";
import { Textarea } from "@/components/ui/textarea";

function CreateAdsPage() {
  const [location, setLocation] = useState({ city: "", country: "" });
  const mount = useMount();
  const pathname = usePathname();
  const isCreateAdsPage = pathname === "/painel/ads";
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof CreateAdsPost>>({
    resolver: zodResolver(CreateAdsPost),
    defaultValues: {
      nome: "",
      age: "",
      peso: "",
      altura: "",
      dote: "",
      valor: "",
      whatsapp: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      privacy: "",
      onlyfans: "",
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
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
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

  const handleSubmit = async (values: z.infer<typeof CreateAdsPost>) => {
    console.log("Form Values", values);
    const res = await createAdsPost({ ...values, ...location });
    
    console.log("Response", res);
    if (res.errors) {
      return toast.error(<Error res={res} />);
    }
  
    toast.success(res.message);
    router.push("/painel");
  };
  

  if (!mount) return null;

  return (
    <div className="overflow-hidden">
      <Dialog open={isCreateAdsPage} onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>Criar Post de Anúncio</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-0">
              {/* Campos do Formulário */}
              {/* Exemplos de campos: */}
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
              

              {/* Pré-visualização de imagens */}
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

             
              
              {/* Localização */}
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
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do Anúncio" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Idade" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="peso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Peso (em kg)" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="altura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Altura (em metros)" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dote</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Valor do dote" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor $</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Preço (em reais ou dólares)" />
                    </FormControl>
                  </FormItem>
                )}
              />

          
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do WhatsApp" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do Instagram" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do Facebook" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do TikTok" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Privacy</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link da Política de Privacidade" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="onlyfans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OnlyFans</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do OnlyFans" />
                    </FormControl>
                  </FormItem>
                )}
              />

 
            
              <Button type="submit" variant="outline" disabled={form.formState.isSubmitting}>
                Criar Anúncio
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

export default CreateAdsPage;

/* funcional mas sem imagens 
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
import { CreateAdsPost } from "@/lib/schemas";
import { createAdsPost } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import UploadButton from "@/components/ui/UploadButton";
import { Textarea } from "@/components/ui/textarea";

function CreateAdsPage() {
  const [location, setLocation] = useState({ city: "", country: "" });
  const mount = useMount();
  const pathname = usePathname();
  const isCreateAdsPage = pathname === "/painel/ads";
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof CreateAdsPost>>({
    resolver: zodResolver(CreateAdsPost),
    defaultValues: {
      nome: "",
      age: undefined,
      peso: undefined,
      dote: undefined,
      valor: undefined,
      whatsapp: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      privacy: "",
      onlyfans: "",
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
    if (!mount) return; // Ensure the component is mounted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
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
  

  const handleSubmit = async (values: z.infer<typeof CreateAdsPost>) => {
    const res = await createAdsPost({ ...values, ...location });

    if (res.errors) {
      return toast.error(<Error res={res} />);
    }

    toast.success(res.message);
    router.push("/painel");
  };

  if (!mount) return null;

  return (
    <div className="overflow-hidden">
      <Dialog open={isCreateAdsPage} onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>Criar Post de Anúncio</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-0">
          
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do Anúncio" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Idade" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="peso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Peso (em kg)" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dote</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Valor do dote" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor $</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Preço (em reais ou dólares)" />
                    </FormControl>
                  </FormItem>
                )}
              />

          
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do WhatsApp" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do Instagram" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do Facebook" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do TikTok" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Privacidade</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link da Política de Privacidade" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="onlyfans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OnlyFans</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link do OnlyFans" />
                    </FormControl>
                  </FormItem>
                )}
              />

 
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

              <Button type="submit" variant="outline" disabled={form.formState.isSubmitting}>
                Criar Anúncio
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateAdsPage;
*/