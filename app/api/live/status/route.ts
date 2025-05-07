import { NextRequest, NextResponse } from "next/server";
import { IvsClient, GetStreamCommand } from "@aws-sdk/client-ivs";

const ivsClient = new IvsClient({ AWS_REGION: process.env.AWS_AWS_REGION! });

export async function POST(req: NextRequest) {
  try {
    const { channelArn } = await req.json();
    if (!channelArn) {
      return NextResponse.json({ error: "ARN do canal é obrigatório." }, { status: 400 });
    }

    console.log(`🔎 Verificando status da live para o canal: ${channelArn}...`);

    const response = await ivsClient.send(new GetStreamCommand({ channelArn }));

    if (response.stream) {
      console.log("✅ Live está ativa!", response.stream);
      return NextResponse.json({ isLive: true, stream: response.stream });
    } else {
      console.log("⏹ Nenhuma live ativa no momento.");
      return NextResponse.json({ isLive: false });
    }
  } catch (error) {
    console.error("❌ Erro ao verificar status da live:", error);
    return NextResponse.json({ error: "Erro ao verificar status da live." }, { status: 500 });
  }
}
