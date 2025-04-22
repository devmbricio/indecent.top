import Head from "next/head";
import { authOptions } from "@/lib/auth"; 
import { getServerSession } from "next-auth";
import { fetchPostsByAffiliate } from "@/lib/data";
import { redirect } from "next/navigation";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler";
import Link from "next/link";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/painel");
  }

  const affiliatesPosts = await fetchPostsByAffiliate("free");

  return (
    <>
 
        <title>Seu Mundo, Seu Conteúdo.</title>
        <meta
          name="description"
          content="Explore os melhores conteúdos no Indecent.top. Posts gratuitos de alta qualidade para você acessar agora mesmo."
        />
        <meta name="keywords" content="conteúdos, vídeos, fotos, indecent, posts gratuitos, afiliados" />
        <meta property="og:title" content="Posts Públicos - Indecent.top" />
        <meta
          property="og:description"
          content="Explore os melhores conteúdos no Indecent.top. Posts gratuitos de alta qualidade para você acessar agora mesmo."
        />
        <meta property="og:image" content="/path/to/default-image.jpg" />
        <meta property="og:url" content="https://indecent.top" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Seu Conteúdo, na Decência - Indecent.top" />
        <meta
          name="twitter:description"
          content="Explore os melhores conteúdos no Indecent.top. Posts gratuitos de alta qualidade para você acessar agora mesmo"
        />
        <meta name="twitter:image" content="/path/to/default-image.jpg" />
        <link rel="canonical" href="https://indecent.top" />
      

      <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom overflow-hidden">
        <Suspense fallback={<PostsSkeleton />}>
          <div className="text-gray-600 rounded-lg p-2 max-w-6xl w-full shadow-lg">
            <h1 className="text-xl md:text-2xl font-bold text-center mb-6">Seu Mundo, Seu Conteúdo.</h1>
            {affiliatesPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {affiliatesPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg shadow-md overflow-hidden flex flex-col"
                  >
                    <Link href="/topprofiles">
                      <div className="relative w-full aspect-[9/16] cursor-pointer">
                        {post.fileUrls[0].match(/\.(mp4|mov|webm|avi|ogg)$/i) ? (
                          <video
                            src={post.fileUrls[0]}
                            autoPlay
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageWithErrorHandler
                            src={post.fileUrls[0]}
                            alt={post.caption || "Imagem do Post"}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="sm:rounded-md object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                    </Link>
                    <div className="p-4 flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">
                        {post.caption || "Sem legenda"}
                      </h2>
                      <Link
                        href="/login"
                        className="text-[#EC9EC5] font-medium text-sm mt-4"
                      >
                        Leia mais
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">Nenhum post disponível.</p>
            )}
          </div>
        </Suspense>
        <Footer />
      </div>
    </>
  );
}


/* funcional antes do SEO
import { authOptions } from "@/lib/auth"; 
import { getServerSession } from "next-auth";
import { fetchPostsByAffiliate } from "@/lib/data";
import { redirect } from "next/navigation";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler";
import Link from "next/link";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";
import Footer from "@/components/Footer";


export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Se o usuário está logado, redireciona para o painel
  if (session) {
    redirect("/painel");
  }

  // Busca os posts gratuitos de afiliados (disponíveis para todos)
  const affiliatesPosts = await fetchPostsByAffiliate("free");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom overflow-hidden">
      <Suspense fallback={<PostsSkeleton />}>
        <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Posts</h1>
          {affiliatesPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {affiliatesPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg shadow-md overflow-hidden flex flex-col"
                >
                  <Link href="/login">
                    <div className="relative w-full aspect-[9/16] cursor-pointer">
                      {post.fileUrls[0].match(/\.(mp4|mov|webm|avi|ogg)$/i) ? (
                        <video
                          src={post.fileUrls[0]}
                          //muted
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageWithErrorHandler
                          src={post.fileUrls[0]}
                          alt={post.caption || "Imagem do Post"}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="sm:rounded-md object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">
                      {post.caption || "Sem legenda"}
                    </h2>
                    <Link
                      href="/login"
                      className="text-blue-500 font-medium text-sm mt-4"
                    >
                      Leia mais
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">Nenhum post disponível.</p>
          )}
        </div>
      </Suspense>
      <Footer />
    </div>
  );
}
*/

/*
import { authOptions } from "@/lib/auth"; 
import { getServerSession } from "next-auth";
import { fetchPostsByAffiliate } from "@/lib/data";
import { redirect } from "next/navigation";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler";
import Link from "next/link";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Se o usuário está logado, redireciona para o painel
  if (session) {
    redirect("/painel");
  }

  // Busca os posts gratuitos de afiliados (disponíveis para todos)
  const affiliatesPosts = await fetchPostsByAffiliate("free");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom">
      <Suspense fallback={<PostsSkeleton />}>
        <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Posts</h1>
          {affiliatesPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {affiliatesPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg shadow-md overflow-hidden flex flex-col"
                >
                  <Link href="/login">
                    <div className="relative w-full aspect-[9/16] cursor-pointer">
                      <ImageWithErrorHandler
                        src={post.fileUrls[0]}
                        alt={post.caption || "Imagem do Post"}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="sm:rounded-md object-cover"
                        unoptimized
                      />
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">
                      {post.caption || "Sem legenda"}
                    </h2>
                    <Link
                      href="/login"
                      className="text-blue-500 font-medium text-sm mt-4"
                    >
                      Leia mais
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">Nenhum post disponível.</p>
          )}
        </div>
     
      </Suspense>
      <Footer />
      
    </div>
  );
}
*/

/* ok renderizando posts dos afiliados
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { fetchPostsByAffiliate } from "@/lib/data";
import { redirect } from "next/navigation";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler";
import Link from "next/link";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Se o usuário está logado, redireciona para o painel
  if (session) {
    redirect("/painel");
  }

  // Busca os posts gratuitos de afiliados (disponíveis para todos)
  const affiliatesPosts = await fetchPostsByAffiliate("free");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom">
           <Suspense fallback={<PostsSkeleton />}>
      <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Posts</h1>
        {affiliatesPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {affiliatesPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <Link href="/login">
                  <div className="relative w-full h-60 cursor-pointer">
                    <ImageWithErrorHandler
                      src={post.fileUrls[0]}
                      alt={post.caption || "Imagem do Post"}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="sm:rounded-md object-cover"
                      unoptimized
                    />
                  </div>
                </Link>

                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">
                    {post.caption || "Sem legenda"}
                  </h2>
                  <Link
                    href="/login"
                    className="text-blue-500 font-medium text-sm mt-4"
                  >
                    Leia mais
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">Nenhum post disponível.</p>
        )}
      </div>
      </Suspense>
    </div>
  );
}
*/




/* ok passando os posts free
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { fetchPostsByCategory } from "@/lib/data";
import { redirect } from "next/navigation";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Se o usuário já está logado, redireciona para o dashboard
  if (session) {
    redirect("/painel");
  }

  // Busca os posts da categoria "free"
  const freePosts = await fetchPostsByCategory("free", 20);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom">
      <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Posts</h1>
        {freePosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freePosts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <Link href="/login">
                  <div className="relative w-full h-60 cursor-pointer">
                    <ImageWithErrorHandler
                      src={post.fileUrls[0]}
                      alt="Imagem do Post"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="sm:rounded-md object-cover"
                      unoptimized
                    />
                  </div>
                </Link>

                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">
                    {post.caption || "Sem legenda"}
                  </h2>
                  <Link
                    href="/login"
                    className="text-blue-500 font-medium text-sm mt-4"
                  >
                    Leia mais
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">Nenhum post disponível.</p>
        )}
      </div>
    </div>
  );
}
*/

/*
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { fetchPostsByCategory } from "@/lib/data";
import { redirect } from "next/navigation";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler"; // Importando o componente de imagem com fallback
import Link from "next/link";

export default async function HomePage() {
  // Verifica se há uma sessão ativa
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/painel"); // Redireciona para o dashboard se estiver logado
  }

  // Busca os posts da categoria "free"
  const freePosts = await fetchPostsByCategory("free", 20);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom">
      <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Posts</h1>
        {freePosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freePosts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <Link href="/api/auth/signin">
                  <div className="relative w-full h-60 cursor-pointer">
                    <ImageWithErrorHandler
                      src={post.fileUrls[0]}
                      alt="Imagem do Post"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="sm:rounded-md object-cover"
                      unoptimized
                    />
                  </div>
                </Link>

                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">
                    {post.caption || "Sem legenda"}
                  </h2>
         
                  <Link
                    href="/api/auth/signin"
                    className="text-blue-500 font-medium text-sm mt-4"
                  >
                    Leia mais
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">Nenhum post disponível.</p>
        )}
      </div>
    </div>
  );
}
*/

/*
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { fetchPostsByCategory } from "@/lib/data";
import { redirect } from "next/navigation";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler"; // Importando o componente de imagem com fallback
import Link from "next/link";

export default async function HomePage() {
  // Verifica se há uma sessão ativa
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/painel"); // Redireciona para o dashboard se estiver logado
  }

  // Busca os posts da categoria "free"
  const freePosts = await fetchPostsByCategory("free", 20);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom">
      <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Posts</h1>
        {freePosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freePosts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <Link href="/api/auth/signin">
                  <div className="relative w-full h-60 cursor-pointer">
                    <ImageWithErrorHandler
                      src={post.fileUrls[0]}
                      alt="Imagem do Post"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="sm:rounded-md object-cover"
                      unoptimized
                    />
                  </div>
                </Link>

                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">
                    {post.caption || "Sem legenda"}
                  </h2>
         
                  <Link
                    href="/api/auth/signin"
                    className="text-blue-500 font-medium text-sm mt-4"
                  >
                    Leia mais
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">Nenhum post disponível.</p>
        )}
      </div>
    </div>
  );
}
*/


/*
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { fetchPostsByCategory } from "@/lib/data";
import { redirect } from "next/navigation";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler"; // Importando o novo componente
import Link from "next/link";

// This is a Server Component in App Directory
export default async function HomePage() {
  // Fetch posts from the server
  const freePosts = await fetchPostsByCategory("free", 20);

  // Check if session exists (example logic for redirect)
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/painel");  // Redirect if user is logged in
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom">
      <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Posts</h1>
        {freePosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freePosts.map((post) => (
              <div key={post.id} className="rounded-lg shadow-md overflow-hidden flex flex-col">
                {post.fileUrls && post.fileUrls.length > 0 ? (
                  <div className="relative w-full h-60">
                    <ImageWithErrorHandler
                      src={post.fileUrls[0]}
                      alt="Imagem do Post"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="sm:rounded-md object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <p>Sem imagem disponível</p>
                )}

                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">
                    {post.caption || "Sem legenda"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {post.caption?.slice(0, 100) || "Sem conteúdo disponível"}...
                  </p>
                  <Link href="/api/auth/signin" className="text-blue-500 font-medium text-sm">
                    Leia mais
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">Nenhum post disponível.</p>
        )}
      </div>
    </div>
  );
}
*/




/*
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { fetchPostsByCategory } from "@/lib/data";
import Link from "next/link";
import { redirect } from "next/navigation";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler"; // Importando o novo componente

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/painel");
  }

  const freePosts = await fetchPostsByCategory("free", 20);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom">
      <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Posts</h1>
        {freePosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freePosts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                {post.fileUrls && post.fileUrls.length > 0 && (
                  <div className="relative w-full h-48">
     
                    <ImageWithErrorHandler
                      src={post.fileUrls[0]} // Passando a URL da imagem
                      alt="Imagem do Post"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="sm:rounded-md object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">
                    {post.caption || "Sem legenda"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {post.caption?.slice(0, 100) || "Sem conteúdo disponível"}...
                  </p>
                  <Link
                    href="/api/auth/signin"
                    className="text-blue-500 font-medium text-sm"
                  >
                    Leia mais
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">Nenhum post disponível.</p>
        )}
      </div>
    </div>
  );
}
*/



/*
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchPostsByCategory } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/painel");
  }

  const freePosts = await fetchPostsByCategory("free", 20);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom">

 
      <div className=" text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">

        </h1>
        {freePosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freePosts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg shadow-md overflow-hidden flex flex-col"
              >
              {post.fileUrls && post.fileUrls.length > 0 && (
  <div className="relative w-full h-48">
   <Image
  src={post.fileUrls[0]}
  alt="Imagem do Post"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="sm:rounded-md object-cover"
  onError={(e) => {
    console.error("Erro ao carregar a imagem:", e.currentTarget.src);
    e.currentTarget.src = "/indecent-top-logo.png"; // Substituir por uma imagem padrão
  }}
/>

  </div>
)}

                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">
                    {post.caption || "Sem legenda"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {post.caption?.slice(0, 100) || "Sem conteúdo disponível"}...
                  </p>
                  <Link
                    href="/api/auth/signin"
                    className="text-blue-500 font-medium text-sm"
                  >
                    Leia mais
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center"></p>
        )}
      </div>
    </div>
  );
}

*/

/*
import { redirect } from "next/navigation";

async function Page() {
  redirect("/painel");
}

export default Page;
*/