import { IvsClient, GetChannelCommand } from "@aws-sdk/client-ivs";

// 🎥 Configuração do Cliente IVS
const ivsClient = new IvsClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 📡 Canal IVS único para todos os influenciadores (REUTILIZADO)
const EXISTING_AWS_IVS_CHANNEL_ARN = "arn:aws:ivs:us-east-1:739275455963:channel/KbVpNXSlqZNv";

export async function getLiveStreamUrl(): Promise<string> {
  try {
    console.log(`[AWS IVS] 🔍 Verificando canal existente: ${EXISTING_AWS_IVS_CHANNEL_ARN}`);

    // 🚀 Buscar informações do canal IVS
    const command = new GetChannelCommand({ arn: EXISTING_AWS_IVS_CHANNEL_ARN });
    const response = await ivsClient.send(command);

    if (!response.channel?.playbackUrl) {
      throw new Error("Live stream não encontrada no AWS IVS.");
    }

    console.log(`[AWS IVS] ✅ Canal IVS ativo! Playback URL: ${response.channel.playbackUrl}`);
    return response.channel.playbackUrl;
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      console.error(`[AWS IVS] ❌ Canal IVS não encontrado!`);
      throw new Error("O canal IVS configurado foi excluído.");
    }
    console.error("[AWS IVS] ❌ Erro ao buscar canal IVS:", error);
    throw new Error("Erro ao buscar URL de transmissão.");
  }
}


