"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
}

const billingUrl = absoluteUrl("/compras");

export async function generateUserStripeSales(priceId: string): Promise<responseAction> {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user.email || !user.id) {
      throw new Error("Unauthorized: Missing user session.");
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId: user.id },
    });

    return { status: "success", stripeUrl: stripeSession.url as string };
  } catch (error: any) {
    console.error("Erro ao gerar sessão do Stripe:", error.message);
    return { status: "error" };
  }
  
}
