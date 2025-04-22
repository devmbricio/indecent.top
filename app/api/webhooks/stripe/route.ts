import { headers } from "next/headers";
import Stripe from "stripe";
import { env } from "@/env.mjs";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Erro no webhook do Stripe:", errorMessage);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    if (event.type === "checkout.session.completed") {
      const subscription = session.subscription
        ? await stripe.subscriptions.retrieve(session.subscription as string)
        : null;

      const userId = session.metadata?.userId;
      const creditsToAdd = parseInt(session.metadata?.creditsToAdd || "0", 10);

      // Tratamento para compra avulsa (créditos)
      if (userId && creditsToAdd) {
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: creditsToAdd } },
        });
        console.log(`Adicionados ${creditsToAdd} créditos para o usuário ${userId}.`);
      }

      // Tratamento para assinaturas
      if (subscription) {
        await prisma.user.update({
          where: { id: session.metadata?.userId },
          data: {
            stripeSubscriptionId: subscription.id || null,
            stripeCustomerId: subscription.customer as string || null,
            stripePriceId: subscription.items.data[0]?.price.id || null,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        console.log(`Assinatura atualizada para o usuário ${userId}.`);
      }

      // Registra a venda com o código de afiliado, se presente
      if (session.metadata?.ref) {
        await prisma.sale.create({
          data: {
            productId: session.metadata.productId,
            affiliateCode: session.metadata.ref,
            customerEmail: session.customer_email || "",
            amount: session.amount_total || 0,
          },
        });
        console.log(`Venda registrada com o código de afiliado: ${session.metadata.ref}`);
      }
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        console.log(`Assinatura renovada para o usuário ${user.id}.`);
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar evento do Stripe:", error);
    return new Response("Erro interno no servidor.", { status: 500 });
  }
}

/* funcional antes de creditas os minutos
import { headers } from "next/headers";
import Stripe from "stripe";
import { env } from "@/env.mjs";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Event: Checkout session completed
  if (event.type === "checkout.session.completed") {
    const subscription = session.subscription
      ? await stripe.subscriptions.retrieve(session.subscription as string)
      : null;

    // Atualiza o usuário com os dados da assinatura e informações do afiliado
    await prisma.user.update({
      where: {
        id: session.metadata?.userId,
      },
      data: {
        stripeSubscriptionId: subscription?.id || null,
        stripeCustomerId: subscription?.customer as string || null,
        stripePriceId: subscription?.items?.data[0]?.price.id || null,
        stripeCurrentPeriodEnd: subscription
          ? new Date(subscription.current_period_end * 1000)
          : null,
      },
    });

    // Registra a venda com o código de afiliado, se presente
    if (session.metadata?.ref) {
      await prisma.sale.create({
        data: {
          productId: session.metadata.productId,
          affiliateCode: session.metadata.ref, // Código do afiliado
          customerEmail: session.customer_email || "",
          amount: session.amount_total || 0,
        },
      });
    }
  }

  // Event: Invoice payment succeeded
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (user) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    }
  }

  return new Response(null, { status: 200 });
}
*/

/*
import { headers } from "next/headers";
import Stripe from "stripe";

import { env } from "@/env.mjs";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.user.update({
      where: {
        id: session.metadata?.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (user) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    }
  }

  return new Response(null, { status: 200 });
}
*/

/*

import { headers } from "next/headers"
import Stripe from "stripe"

import { env } from "@/env.mjs"
import prisma from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await prisma.user.update({
      where: {
        id: session?.metadata?.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the price id and set the new period end.
    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  return new Response(null, { status: 200 })
}
*/