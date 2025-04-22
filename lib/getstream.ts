import { StreamChat } from 'stream-chat';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || '';
const apiSecret = process.env.STREAM_API_SECRET || '';

const client = StreamChat.getInstance(apiKey, apiSecret);

export async function startLiveStream(userId: string) {
  try {
    // Criando um canal do tipo 'livestream'
    const channel = client.channel('livestream', `live-${userId}`, {
      created_by_id: userId,
    });

    // Criando o canal se ainda não existir
    await channel.create();

    // Configurando permissões de usuário para o canal ao vivo
    await channel.addMembers([userId]);

    // Retorna o canal criado para o componente de streaming
    return channel;
  } catch (error) {
    console.error("Erro ao iniciar a transmissão ao vivo no GetStream:", error);
    throw new Error("Erro ao iniciar a transmissão");
  }
}

export async function stopLiveStream(userId: string) {
  try {
    const channel = client.channel('livestream', `live-${userId}`);
    await channel.stopWatching();
  } catch (error) {
    console.error("Erro ao finalizar a transmissão ao vivo no GetStream:", error);
    throw new Error("Erro ao finalizar a transmissão");
  }
}

