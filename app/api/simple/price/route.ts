// simple/price API
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=brl"
    );

    const ethToBrl = response.data.ethereum.brl;
    return NextResponse.json({ ethToBrl }, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter taxa de conversão ETH para BRL:", error);
    return NextResponse.json({ error: "Não foi possível obter o valor do ETH." }, { status: 500 });
  }
}