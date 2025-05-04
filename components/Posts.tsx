"use client";

import Post from "./Post";
import { PostWithExtras } from "@/lib/definitions";
import { useState, useEffect } from "react";
import InterestModal from "@/components/InterestModal";
import { useSession } from "next-auth/react";
import JackpotMachine from "./JackpotMachine";
import CandyBoard from "./CandyBoard";
import CandyClient from "./CandyClient";
import PowerballMundi from "./PowerBallMundi";

export default function Posts({
  initialPosts,
  subscriptionLevel,
  userId,
}: {
  initialPosts: PostWithExtras[];
  subscriptionLevel: string;
  userId: string;
}) {
  const { data: session, status, update } = useSession();
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUserInterests() {
      try {
        const res = await fetch(`/api/getUserInterests`);
        if (!res.ok) throw new Error("Erro ao buscar interesses");

        const data = await res.json();
        const interests = data.interests || [];

        setUserInterests(interests);

        if (interests.length < 3) {
          console.log("🔹 Usuário tem poucos interesses. Exibindo modal...");
          setShowInterestModal(true);
        } else {
          console.log("✅ Usuário já tem interesses suficientes. Ocultando modal.");
          setShowInterestModal(false);
        }
      } catch (error) {
        console.error("Erro ao buscar interesses do usuário:", error);
      }
    }

    if (session?.user?.email) {
      fetchUserInterests();
    }
  }, [session, userId]);

  const handleInterestsUpdated = async () => {
    console.log("🔄 Atualizando sessão do usuário...");
    await update(); // Atualiza a sessão no NextAuth
    setShowInterestModal(false); // Fecha o modal
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?page=${page + 1}&subscriptionLevel=${subscriptionLevel}&userId=${userId}`
      );
      if (!res.ok) throw new Error("Erro ao carregar mais posts");

      const newPosts = await res.json();
      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao carregar mais posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showInterestModal && (
        <InterestModal onClose={handleInterestsUpdated} updateSession={update} />
      )}

      {!showInterestModal && (
        <>
{posts.length > 0 ? (
  posts.map((post, index) => (
    <div key={post.id} className="w-full">
      <Post post={post} />

       {/* A cada 5 posts, insere o Jackpot */}
       {(index + 1) % 5 === 0 && (
        <div className="my-8">
           <CandyClient>
            <CandyBoard isInlineAd />
          </CandyClient>
        </div>
      )}

      {/* A cada 10 posts, insere o Jackpot */}
      {(index + 1) % 10 === 0 && (
        <div className="my-8">
          <JackpotMachine isInlineAd />
        </div>
      )}

       {/* A cada 5 posts, insere o PowerballMundi */}
       {(index + 1) % 10 === 0 && (
        <div className="my-8">
          <PowerballMundi isInlineAd />
        </div>
      )}
    </div>
  ))
) : (
            <p className="text-center text-gray-500">Nenhum post disponível.</p>
          )}
          <button onClick={loadMore} disabled={loading} className="z-50">
            {loading ? "Carregando..." : "Carregar Mais"}
          </button>
        </> 
      )}
    </div>
  );
}


/* antes do jackpot


"use client";

import Post from "./Post";
import { PostWithExtras } from "@/lib/definitions";
import { useState, useEffect } from "react";
import InterestModal from "@/components/InterestModal";
import { useSession } from "next-auth/react";

export default function Posts({
  initialPosts,
  subscriptionLevel,
  userId,
}: {
  initialPosts: PostWithExtras[];
  subscriptionLevel: string;
  userId: string;
}) {
  const { data: session, status, update } = useSession();
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUserInterests() {
      try {
        const res = await fetch(`/api/getUserInterests`);
        if (!res.ok) throw new Error("Erro ao buscar interesses");

        const data = await res.json();
        const interests = data.interests || [];

        setUserInterests(interests);

        if (interests.length < 3) {
          console.log("🔹 Usuário tem poucos interesses. Exibindo modal...");
          setShowInterestModal(true);
        } else {
          console.log("✅ Usuário já tem interesses suficientes. Ocultando modal.");
          setShowInterestModal(false);
        }
      } catch (error) {
        console.error("Erro ao buscar interesses do usuário:", error);
      }
    }

    if (session?.user?.email) {
      fetchUserInterests();
    }
  }, [session, userId]);

  const handleInterestsUpdated = async () => {
    console.log("🔄 Atualizando sessão do usuário...");
    await update(); // Atualiza a sessão no NextAuth
    setShowInterestModal(false); // Fecha o modal
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?page=${page + 1}&subscriptionLevel=${subscriptionLevel}&userId=${userId}`
      );
      if (!res.ok) throw new Error("Erro ao carregar mais posts");

      const newPosts = await res.json();
      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao carregar mais posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showInterestModal && (
        <InterestModal onClose={handleInterestsUpdated} updateSession={update} />
      )}

      {!showInterestModal && (
        <>
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <p className="text-center text-gray-500">Nenhum post disponível.</p>
          )}
          <button onClick={loadMore} disabled={loading} className="z-50">
            {loading ? "Carregando..." : "Carregar Mais"}
          </button>
        </>
      )}
    </div>
  );
}
*/
