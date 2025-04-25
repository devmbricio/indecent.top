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
import dynamic from "next/dynamic";
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), { ssr: false });
import Script from "next/script"; 

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

        <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-X14YM769KT"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X14YM769KT');
          `,
        }}
      />
      

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
                 <VideoPlayer src={post.fileUrls[0]} />

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


/*
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
*/