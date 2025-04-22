import PostView from "@/components/PostView";
import { fetchPostsById } from "@/lib/data";
import Head from "next/head";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

async function PostModal({ params: { id } }: Props) {
  const post = await fetchPostsById(id);
  if (!post) {
    notFound();
  }

  // Verificar e definir fallback para URL da imagem
  const imageUrl = Array.isArray(post.fileUrls) && post.fileUrls.length > 0 
    ? post.fileUrls[0] 
    : "/indecent-top-logo-transparent-9-16.png";

  return (
    <>
      <Head>
        <title>{post.title} - Veja mais no Indecent</title>
        <meta name="description" content={post.description || "Confira este incrível post agora mesmo!"} />
        <meta name="keywords" content={post.tags?.join(", ") || "posts, conteúdo exclusivo, indecent"} />
        <link rel="canonical" href={`https://indecent.top/paine/p/${post.id}`} />
        <meta property="og:title" content={post.title || "Meu post indecent.top!"} />
        <meta property="og:description" content={post.description || "Conteúdo exclusivo no Indecent!"} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={`https://indecent.top/paine/p/${post.id}`} />
        <meta property="og:site_name" content="Indecent.top" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title || "Meu post indecent.top!"} />
        <meta name="twitter:description" content={post.description || ""} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <main>
        <PostView id={post.id} post={post} />
      </main>
    </>
  );
}

export default PostModal;


/*
import PostView from "@/components/PostView";
import { fetchPostsById } from "@/lib/data";
import Head from "next/head";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};
async function PostModal({ params: { id } }: Props) {
  const post = await fetchPostsById(id);
  if (!post) {
    notFound();
  }
  
  return (
    <>
      <Head>
        <title>{post.title} - Veja mais no Indecent</title>
        <meta name="description" content={post.description || "Confira este incrível post agora mesmo!"} />
        <meta name="keywords" content={post.tags?.join(', ') || "posts, conteúdo incrível"} />
        <meta property="og:title" content={post.title || "Meu post indecent.top!"} />
        <meta property="og:description" content={post.description || "Conteúdo exclusivo no Indecent!"} />
        <meta property="og:image" content={post.fileUrls[0] || "/default-image.png"} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title || "Meu post indecent.top!"} />
        <meta name="twitter:description" content={post.description || ""} />
      </Head>
      <main>
        <PostView id={post.id} post={post} />
      </main>
    </>
  );


}
export default PostModal; 
*/

/*
import PostView from "@/components/PostView";
import { fetchPostsById } from "@/lib/data";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};
async function PostModal({ params: { id } }: Props) {
  const post = await fetchPostsById(id);
  if (!post) {
    notFound();
  }
  return <PostView id={id} post={post} />;
}
export default PostModal; 
*/