import { NextRequest, NextResponse } from "next/server";
import { IvsClient, GetChannelCommand } from "@aws-sdk/client-ivs";

const ivsClient = new IvsClient({ AWS_REGION: "us-east-1" });

export async function GET(req: NextRequest) {
  try {
    const channelArn = req.nextUrl.searchParams.get("channelArn");
    if (!channelArn) {
      return NextResponse.json({ error: "ARN do canal é obrigatório." }, { status: 400 });
    }

    console.log(`🔎 Buscando canal IVS: ${channelArn}`);
    const command = new GetChannelCommand({ arn: channelArn });
    const response = await ivsClient.send(command);

    if (!response.channel?.playbackUrl) {
      return NextResponse.json({ error: "URL de reprodução não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ playbackUrl: response.channel.playbackUrl });
  } catch (error) {
    console.error("❌ Erro ao buscar URL de reprodução:", error);
    return NextResponse.json({ error: "Erro ao buscar URL de reprodução." }, { status: 500 });
  }
}
