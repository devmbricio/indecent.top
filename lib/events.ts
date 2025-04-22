import prisma from './prisma';
import Stripe from 'stripe';
import { env } from '@/env.mjs';

interface User {
  id: string;
  email: string | null; // Permite string | null
  name: string | null;   // Permite string | null
}

const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2024-11-20.acacia",
});

const events = {
  createUser: async ({ user }: { user: User }) => {
    if (!user.email || !user.name) {
      console.error("User email or name is null; skipping Stripe customer creation.");
      return;
    }

    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });

      console.log(`Stripe customer created with ID: ${customer.id}`);
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
    }
  },
};

export default events;


/*
import { PrismaClient } from '@prisma/client';
import prisma from './prisma';
import Stripe from 'stripe';
import { env } from '@/env.mjs';

interface User {
  id: string;
  email: string;
  name: string;
}

const prismadb = new PrismaClient();
const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2024-09-30.acacia",
});

const events = {
  createUser: async ({ user }: { user: User }) => {
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });

      console.log(`Stripe customer created with ID: ${customer.id}`);
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
    }
  },
};

export default events;
*/
