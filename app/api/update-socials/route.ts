import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, socials } = await request.json();

    if (!userId || !socials) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updatedSocials = await prisma.socials.upsert({
      where: { userId },
      update: socials,
      create: { ...socials, userId },
    });

    return NextResponse.json({ message: "Socials updated successfully", updatedSocials });
  } catch (error) {
    console.error("Server error updating socials:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}




/*
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Handler para POST
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { socials } = body;

    if (!socials || typeof socials !== "object") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { socials },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
*/