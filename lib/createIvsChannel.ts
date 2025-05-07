import { 
    IvsClient, 
    CreateChannelCommand, 
    ListStreamKeysCommand, 
    GetStreamKeyCommand 
  } from "@aws-sdk/client-ivs";
  
  const ivs = new IvsClient({ AWS_REGION: "us-east-1" });
  
  export async function createIvsChannel(userId: string) {
    try {
      // 🔥 Criando um novo canal IVS
      const createChannelCommand = new CreateChannelCommand({
        name: `channel-${userId}`,
        type: "STANDARD",
        latencyMode: "LOW",
      });
  
      const channelData = await ivs.send(createChannelCommand);
      if (!channelData.channel || !channelData.channel.arn) {
        console.error("Erro: Canal IVS não foi criado corretamente.");
        return null;
      }
  
      const channelArn = channelData.channel.arn;
  
      // 🔍 Listando StreamKeys associadas ao canal
      const listStreamKeysCommand = new ListStreamKeysCommand({ channelArn });
      const streamKeysData = await ivs.send(listStreamKeysCommand);
      
      if (!streamKeysData.streamKeys || streamKeysData.streamKeys.length === 0) {
        console.error("Nenhuma StreamKey encontrada para o canal.");
        return null;
      }
  
      const streamKeyArn = streamKeysData.streamKeys[0].arn;
  
      // 🔑 Obtendo o valor real da StreamKey
      const getStreamKeyCommand = new GetStreamKeyCommand({ arn: streamKeyArn });
      const streamKeyData = await ivs.send(getStreamKeyCommand);
      const streamKey = streamKeyData.streamKey?.value ?? "";
  
      return {
        channelArn,
        streamKey,
        ingestEndpoint: channelData.channel.ingestEndpoint ?? "",
        playbackUrl: channelData.channel.playbackUrl ?? "",
      };
    } catch (error) {
      console.error("Erro ao criar canal IVS:", error);
      return null;
    }
  }
  