
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Comment from "@/components/Comment";
import CommentForm from "@/components/CommentForm";
import Post from "@/components/Post";
import PostActions from "@/components/PostActions";
import PostOptions from "@/components/PostOptions";
import UserAvatar from "@/components/UserAvatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { fetchPostsById } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import MiniPost from "@/components/MiniPost";
import { ScrollArea } from "@/components/ui/scroll-area";

async function SinglePost({ id }: { id: string }) {
  const session = await getServerSession(authOptions); // Obtém a sessão do servidor
  const post = await fetchPostsById(id); // Busca o post pelo ID

  if (!post) {
    notFound(); // Se o post não for encontrado, exibe uma página 404
  }

  const postUsername = post?.user?.username;
  const userId = session?.user?.id;

  return (
    <>
      <Card className="max-w-xl lg:max-w-2xl pr-0 pl-0 md:flex mx-auto">
        <div className="relative overflow-hidden aspect-[9/16] max-w-md  w-full h-[90vh]">
       
        {post.fileUrls && post.fileUrls.length > 0 ? (
    <>
      {/* Verifica se o arquivo é um vídeo */}
      {post.fileUrls[0].endsWith(".mp4") || post.fileUrls[0].endsWith(".mov") || post.fileUrls[0].endsWith(".ogg") || post.fileUrls[0].endsWith(".webm")? (
        <video
          autoPlay
          loop
          muted
          playsInline
          src={post.fileUrls[0]} // Usa a primeira URL como fonte do vídeo
          className="md:rounded-l-md object-cover w-full h-full"
        />
      ) : (
        <Image
          src={post.fileUrls[0]} // Caso contrário, renderiza como imagem
          alt="Post preview"
          fill
          className="md:rounded-l-md object-cover"
        />
      )}
    </>
  ) : (
    <p>Sem mídia disponível</p>
  )}

        </div>

        <div className="flex max-w-sm flex-col flex-1">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  className="font-semibold text-sm"
                  href={`/painel/${postUsername}`}
                >
                  {postUsername}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center space-x-2">
                  <UserAvatar user={post.user} className="h-14 w-14" />
                  <div>
                    <p className="font-bold">{postUsername}</p>
                    <p className="text-sm font-medium dark:text-neutral-400">
                      {post.user.name}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <PostOptions post={post} userId={userId} />
          </div>

          {post.comments.length === 0 && (
            <div className="flex flex-col items-center gap-1.5 flex-1 justify-center">
              <p className="text-sm lg:text-sm font-extrabold">
              Nenhum comentário ainda.
              </p>
              <p className="text-sm font-medium">Inicie a conversa</p>
            </div>
          )}

          {post.comments.length > 0 && (
            <ScrollArea className="hidden md:inline py-1.5 flex-1">
              <MiniPost post={post} />
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </ScrollArea>
          )}
          <div className="px-2 hidden md:block mt-auto border-y p-2.5">
            <PostActions post={post} userId={userId} />
            <time className="text-[11px] uppercase text-zinc-500 font-medium">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <CommentForm postId={id} className="hidden md:inline-flex" />
        </div>
      </Card>

 
      <div className="md:hidden">
        <Post post={post} />
      </div>
    </>
  );
}

export default SinglePost;


/*
import { authOptions } from "@/lib/auth";
import { getServerSession } from 'next-auth';
import Comment from "@/components/Comment";
import CommentForm from "@/components/CommentForm";
import Post from "@/components/Post";
import PostActions from "@/components/PostActions";
import PostOptions from "@/components/PostOptions";
import UserAvatar from "@/components/UserAvatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
//import { fetchPostById } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "./ui/card";
import MiniPost from "./MiniPost";
import { fetchPostsById } from "@/lib/data";
import { ScrollArea } from "./ui/scroll-area";

async function SinglePost({ id }: { id: string }) {
  const post = await fetchPostsById(id);
  const session = await getServerSession(authOptions);
  const postUsername = post?.user.username;
  const userId = session?.user.id;

  if (!post) {
    notFound();
  }

  return (
    <>
      <Card className="max-w-3xl lg:max-w-4xl hidden md:flex mx-auto">
        <div className="relative overflow-hidden h-[450px] max-w-sm lg:max-w-lg w-full">
        {post.fileUrls && post.fileUrls.length > 0 ? (
  <Image
    src={post.fileUrls[0]}
    alt="Post preview"
    fill
    className="md:rounded-l-md object-cover"
  />
) : (
  <p>Sem imagem disponível</p>
)}

        </div>

        <div className="flex max-w-sm flex-col flex-1">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  className="font-semibold text-sm"
                  href={`/painel/${postUsername}`}
                >
                  {postUsername}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center space-x-2">
                  <UserAvatar user={post.user} className="h-14 w-14" />
                  <div>
                    <p className="font-bold">{postUsername}</p>
                    <p className="text-sm font-medium dark:text-neutral-400">
                      {post.user.name}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <PostOptions post={post} userId={userId} />
          </div>
          {post.comments.length === 0 && (
            <div className="flex flex-col items-center gap-1.5 flex-1 justify-center">
              <p className="text-xl lg:text-2xl font-extrabold">
                No comments yet.
              </p>
              <p className="text-sm font-medium">Start the conversation</p>
            </div>
          )}

          {post.comments.length > 0 && (
            <ScrollArea className="hidden md:inline py-1.5 flex-1">
              <MiniPost post={post} />
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </ScrollArea>
          )}
          <div className="px-2 hidden md:block mt-auto border-y p-2.5">
            <PostActions post={post} userId={userId} />
            <time className="text-[11px] uppercase text-zinc-500 font-medium">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <CommentForm postId={id} className="hidden md:inline-flex" />
        </div>
      </Card>
      <div className="md:hidden">
        <Post post={post} />
      </div>
    </>
  );
}
export default SinglePost;


/*
import { authOptions } from "@/lib/auth";
import { getServerSession } from 'next-auth';
import Comment from "@/components/Comment";
import CommentForm from "@/components/CommentForm";
import Post from "@/components/Post";
import PostActions from "@/components/PostActions";
import PostOptions from "@/components/PostOptions";
import UserAvatar from "@/components/UserAvatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
//import { fetchPostById } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "./ui/card";
import MiniPost from "./MiniPost";
import { fetchPostsById } from "@/lib/data";
import { ScrollArea } from "./ui/scroll-area";

async function SinglePost({ id }: { id: string }) {
  const post = await fetchPostsById(id);
  const session = await getServerSession(authOptions);
  const postUsername = post?.user.username;
  const userId = session?.user.id;

  if (!post) {
    notFound();
  }

  return (
    <>
      <Card className="max-w-3xl lg:max-w-4xl hidden md:flex mx-auto">
        <div className="relative overflow-hidden h-[450px] max-w-sm lg:max-w-lg w-full">
          <Image
            src={post.fileUrl}
            alt="Post preview"
            fill
            className="md:rounded-l-md object-cover"
          />
        </div>

        <div className="flex max-w-sm flex-col flex-1">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  className="font-semibold text-sm"
                  href={`/painel/${postUsername}`}
                >
                  {postUsername}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center space-x-2">
                  <UserAvatar user={post.user} className="h-14 w-14" />
                  <div>
                    <p className="font-bold">{postUsername}</p>
                    <p className="text-sm font-medium dark:text-neutral-400">
                      {post.user.name}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <PostOptions post={post} userId={userId} />
          </div>
          {post.comments.length === 0 && (
            <div className="flex flex-col items-center gap-1.5 flex-1 justify-center">
              <p className="text-xl lg:text-2xl font-extrabold">
                No comments yet.
              </p>
              <p className="text-sm font-medium">Start the conversation</p>
            </div>
          )}

          {post.comments.length > 0 && (
            <ScrollArea className="hidden md:inline py-1.5 flex-1">
              <MiniPost post={post} />
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </ScrollArea>
          )}
          <div className="px-2 hidden md:block mt-auto border-y p-2.5">
            <PostActions post={post} userId={userId} />
            <time className="text-[11px] uppercase text-zinc-500 font-medium">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <CommentForm postId={id} className="hidden md:inline-flex" />
        </div>
      </Card>
      <div className="md:hidden">
        <Post post={post} />
      </div>
    </>
  );
}
export default SinglePost;
*/