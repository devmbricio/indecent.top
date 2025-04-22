import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkCreditsAndSubscription } from "@/actions/getInfluencerPosts";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: influencerId } = await req.json();
    const viewerId = session.user.id;

    const { subscriptionLevel, credits, error, status } = await checkCreditsAndSubscription(viewerId);

    if (error || (!credits && subscriptionLevel === "free")) {
      return NextResponse.json({ redirect: "/redirect" }, { status: 403 });
    }

    return NextResponse.json({
      viewerId,
      influencerId,
      subscriptionLevel: subscriptionLevel ?? "free",
      credits: credits ?? 0,
    });
  } catch (err) {
    console.error("[API] Erro ao obter dados da reunião:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
