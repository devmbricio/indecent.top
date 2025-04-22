'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';
import { tokenProvider } from '@/actions/stream.actions';
import { env } from '@/env.mjs';

const API_KEY = env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user || !API_KEY) return;

    // Define a função assíncrona para inicializar o cliente
    const initializeClient = async () => {
      try {
        const token = await tokenProvider(session.user.id);

        const client = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: session.user.id,
            name: session.user.name || session.user.id,
            image: session.user.image || '',
          },
          token,
        });

        setVideoClient(client);
      } catch (error) {
        console.error("Error initializing StreamVideoClient:", error);
      }
    };

    initializeClient();

    // Limpeza ao desmontar para evitar possíveis vazamentos de memória
    return () => setVideoClient(null);
  }, [session, status]);

  // Exibir o carregador enquanto o cliente não está pronto
  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;




/*


'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!API_KEY) throw new Error('Stream API key is missing');

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      tokenProvider,
    });

    setVideoClient(client);
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
*/