"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type TopProfile = {
  id: string;
  name: string;
  image: string | null;
  referralId: string;
  rank: number;
  score: number;
  affiliate: "AFFILIATE" | "USER";
  influencer: "INFLUENCER" | "USER";
};

function TopProfilesPage() {
  const [topProfiles, setTopProfiles] = useState<TopProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProfiles = async () => {
      try {
        const response = await fetch("/api/topProfiles");
        if (!response.ok) throw new Error("Erro ao buscar os top perfis");

        const profiles: TopProfile[] = await response.json();
        setTopProfiles(profiles);
      } catch (error) {
        console.error("Erro ao carregar top perfis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProfiles();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="pt-8 text-2xl font-semibold text-center mb-6">
        🔥 InDecent Top Perfis
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Carregando perfis...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {topProfiles.length > 0 ? (
            topProfiles.map((profile) => (
              <Link key={profile.id} href={`/api/auth/signin?ref=${profile.referralId}`}>
                <div className="flex flex-col items-center bg-black/10 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <div className="relative w-36 h-36">
                    <Image
                      src={profile.image || "/indecent-top-logo-rosa-transparent.png"}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      alt={profile.name}
                      className="rounded-full border-4 border-yellow-400"
                    />
                  </div>
                  <h2 className="pt-4 pb-2 text-lg font-semibold text-center">{profile.name}</h2>
                  <p className="text-gray-500 text-sm">🔥 Ranking #{profile.rank}</p>
                  <p className="text-gray-600 text-xs">⭐ Score: {profile.score}</p>
                  <p className="text-xs text-blue-500">
                    {profile.affiliate === "AFFILIATE" ? "🔹 Afiliado" : "🔹 Influenciador"}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">Nenhum perfil encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TopProfilesPage;




/*
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type TopProfile = {
  id: string;
  name: string;
  image: string | null;
  referralId: string;
};

function TopProfilesPage() {
  const [topProfiles, setTopProfiles] = useState<TopProfile[]>([]);

  useEffect(() => {
    const fetchTopProfiles = async () => {
      try {
        const response = await fetch("/api/topProfiles");
        if (!response.ok) throw new Error("Erro ao buscar os top perfis");

        const profiles: TopProfile[] = await response.json();
        setTopProfiles(profiles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopProfiles();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="pt-8 text-2xl font-semibold text-center mb-6">
        Top 10 - Escolha um perfil para apoiar
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {topProfiles.map((profile) => (
          <Link key={profile.id} href={`/api/auth/signin?ref=${profile.referralId}`}>
            <p className="flex flex-col items-center bg-black/10 rounded-lg shadow-md p-0 pt-6 hover:shadow-lg transition-shadow">
              <div className="relative w-40 h-40">
                <Image
                  src={profile.image || "/indecent-top-logo-rosa-transparent.png"}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  alt={profile.name}
                  className="rounded-full"
                />
              </div>
              <h2 className="pt-6 pb-6 text-lg font-semibold mb-2">
                {profile.name}
              </h2>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopProfilesPage;
*/


/* atualizad



"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Tipo para os perfis
type TopProfile = {
  id: string;
  name: string;
  image: string | null;
  referralId: string;
};

function TopProfilesPage() {
  const [topProfiles, setTopProfiles] = useState<TopProfile[]>([]);

  useEffect(() => {
    const fetchTopProfiles = async () => {
      try {
        const response = await fetch("/api/topProfiles");
        if (!response.ok) throw new Error("Erro ao buscar os top perfis");

        const profiles: TopProfile[] = await response.json();
        setTopProfiles(profiles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopProfiles();
  }, []);

  // Verificar se está em ambiente de desenvolvimento ou produção
  const isLocalhost = window.location.hostname === "localhost";
  const baseUrl = isLocalhost ? "http://localhost:3000" : "https://indecent.top";

  return (
    <div className="container mx-auto py-8">
      <h1 className="pt-8 text-2xl font-semibold text-center mb-6">Top 10 - Escolha um perfil para apoiar</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {topProfiles.map((profile) => (
          <Link key={profile.id} href={`${baseUrl}/login?ref=${profile.referralId}`}>
            <p className="flex flex-col items-center bg-black/10 rounded-lg shadow-md p-0 pt-6 hover:shadow-lg transition-shadow">
              <div className="relative w-40 h-40">
                <Image
                  src={profile.image || "/indecent-top-logo-rosa-transparent.png"}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  alt={profile.name}
                  className="rounded-full"
                />
              </div>
              <h2 className="pt-6 pb-6 text-lg font-semibold mb-2">{profile.name}</h2>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopProfilesPage;
*/

/*
"use client"


import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Tipo para os perfis
type TopProfile = {
  id: string;
  name: string;
  image: string | null;
  referralId: string;
};

function TopProfilesPage() {
  const [topProfiles, setTopProfiles] = useState<TopProfile[]>([]);

  useEffect(() => {
    const fetchTopProfiles = async () => {
      try {
        const response = await fetch("/api/topProfiles");
        if (!response.ok) throw new Error("Erro ao buscar os top perfis");

        const profiles: TopProfile[] = await response.json();
        setTopProfiles(profiles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopProfiles();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="pt-8 text-2xl font-semibold text-center mb-6">Top 10 - Escolha um perfil para apoiar</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {topProfiles.map((profile) => (
          <Link key={profile.id} href={`https://indecent.top/login?ref=${profile.referralId}`}>
            <p className="flex flex-col items-center bg-black/10 rounded-lg shadow-md p-0 pt-6 hover:shadow-lg transition-shadow">
              <div className="relative w-40 h-40">
                <Image
                  src={profile.image || "/indecent-top-logo-rosa-transparent.png"}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  alt={profile.name}
                  className="rounded-full"
                />
              </div>
              <h2 className="pt-6 pb-6 text-lg font-semibold mb-2">{profile.name}</h2>
             </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopProfilesPage;
*/

/*
"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Tipo para os perfis
type TopProfile = {
  id: string;
  name: string;
  image: string | null;
  referralId: string;
};

function TopProfilesPage() {
  const [topProfiles, setTopProfiles] = useState<TopProfile[]>([]);

  useEffect(() => {
    const fetchTopProfiles = async () => {
      try {
        const response = await fetch("/api/topProfiles");
        if (!response.ok) throw new Error("Erro ao buscar os top perfis");

        const profiles: TopProfile[] = await response.json();
        setTopProfiles(profiles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopProfiles();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold text-center mb-6">Top Perfis</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {topProfiles.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <Image
              src={profile.image || "/indecent-top-logo-rosa-transparent.png"}
              width={150}
              height={250}
              alt={profile.name}
              className="rounded-full mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{profile.name}</h2>
            <Link
              href={`https://indecent.top/signup?ref=${profile.referralId}`}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Visitar Perfil
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopProfilesPage;
*/