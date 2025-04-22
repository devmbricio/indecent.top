import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { checkCreditsAndSubscription } from '@/actions/getInfluencerPosts';

export const useVerifyAccess = (influencerId: string) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!session || !session.user) {
        router.push('/login');
        return;
      }

      const viewerId = session.user.id;

      // Se o usuário é o criador, acesso garantido
      if (viewerId === influencerId) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      try {
        // Verificar assinatura e créditos
        const { subscriptionLevel, credits } = await checkCreditsAndSubscription(viewerId);

        // Se tem assinatura ou créditos suficientes, acesso garantido
        if ((credits ?? 0) > 0 || subscriptionLevel !== 'free') {
          setHasAccess(true);
        } else {
          router.push('/compras');
        }
      } catch (error) {
        console.error('[useVerifyAccess] Erro na verificação:', error);
        router.push('/compras');
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [session, influencerId, router]);

  return { loading, hasAccess, session, status };
};
