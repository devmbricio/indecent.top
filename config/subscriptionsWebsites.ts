import { PlansRow, WebsitesPlan } from "@/types/types"
import { env } from "@/env.mjs"

export const pricingDataWebsites: WebsitesPlan[] = [
  {
    title: '600min',
    description: 'Acesso de 600min',
    benefits: [
      
    ],
    limitations: [
      
    ],
    prices: {
      monthly: 30.00,
      yearly: 30.00,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_30MIN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_30MIN_ID,
    },
    images: [],
  },
  {
    title: '2000min',
    description: 'Acesso de 2000min',
    benefits: [

    ],
    limitations: [
      
    ],
    prices: {
      monthly: 100.00,
      yearly: 100.00,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_100MIN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_100MIN_ID,
    },
    images: [],
  },
  {
    title: '6000min',
    description: 'Acesso de 6000min',
    benefits: [


    ],
    limitations: [
      
    ],
    prices: {
      monthly: 300.00,
      yearly: 300.00,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_300MIN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_300MIN_ID,
    },
    images: [],
  },
  {
    title: '1000min',
    description: 'Acesso de 1000min',
    benefits: [


    ],
    limitations: [
      
    ],
    prices: {
      monthly: 500.00,
      yearly: 500.00,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_500MIN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_500MIN_ID,
    },
    images: [],
  },
  {
    title: '20000min',
    description: 'Acesso de 20000min',
    benefits: [
   

    ],
    limitations: [
      
    ],
    prices: {
      monthly: 1000.00,
      yearly: 1000.00,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_1000MIN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_1000MIN_ID,
    },
    images: [],
  },
];

export const plansColumns = [

  "básico",
  "pró",
  "business",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Accesso ao Google Analytics",
 
    básico: true,
    pró: true,
    business: "Custom",
    tooltip: "Todos os planos incluem análises básicas para monitorar o desempenho.",
  },
  {
    feature: "Marca personalizada",

    básico: false,
    pró: true,
    business: "Ilimitado",
    tooltip: "A personalização da marca está disponível a partir do plano Pro.",
  },
  {
    feature: "Prioridade no suporte",
 
    básico: "Email",
    pró: "Email",
    business: "Email 24/7 Suporte",

  },
  {
    feature: "Relatórios avançados",

    básico: null,
    pró: null,
    business: true,
  
    tooltip:
      "Os relatórios avançados estão disponíveis nos planos Pró e Business",
  },
  {
    feature: "Gerente Dedicado",

    básico: null,
    pró: null,
    business: true,
    tooltip: "O plano empresarial inclui um gerente de conta dedicado.",
  },
  {
    feature: "Acesso API",

    básico: null,
    pró: null,
    business: true,
    tooltip: "Ocesso a API de outros serviços compatíveis.",
  },
  {
    feature: "Monthly Webinars",
    starter: false,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "Pro and higher plans include access to monthly webinars.",
  },
  {
    feature: "Custom Integrations",
    starter: false,
    pro: false,
    business: "Available",
    enterprise: "Available",
    tooltip:
      "Custom integrations are available in Business and Enterprise plans.",
  },
  {
    feature: "Roles and Permissions",
    starter: null,
    pro: "Basic",
    business: "Advanced",
    enterprise: "Advanced",
    tooltip:
      "User roles and permissions management improves with higher plans.",
  },
  {
    feature: "Onboarding Assistance",
    starter: false,
    pro: "Self-service",
    business: "Assisted",
    enterprise: "Full Service",
    tooltip: "Higher plans include more comprehensive onboarding assistance.",
  },
  // Add more rows as needed
];


/*import { PlansRow, MinutsSales } from "@/types/types";
import { env } from "@/env.mjs";

export const pricingDataWebsites: MinutsSales[] = [
  {
    title: '+30min',
    description: '30min ao vivo na indecent cam',
    benefits: [
      "Encontro ao vivo de 30min",
    ],
    limitations: [
      "Válido para todas as transmissões"
    ],
    prices: {
      oneTime: 30.00, // preço para compra única
      monthly: 0,      // Definido como 0 ou null, pois não há plano mensal
      yearly: 0,       // Definido como 0 ou null, pois não há plano anual
    },
    stripeIds: {
      oneTime: env.NEXT_PUBLIC_STRIPE_30MIN_ID as string, // `priceId` para venda avulsa (garanta que isso seja uma string)
      monthly: null,  // Não existe plano mensal
      yearly: null,   // Não existe plano anual
    },
    images: [],
  },
  {
    title: '+60min',
    description: '60min ao vivo na indecent cam',
    benefits: [
      "Encontro ao vivo de 60min",
    ],
    limitations: [
      "Válido para todas as transmissões"
    ],
    prices: {
      oneTime: 60.00, // preço para compra única
      monthly: 0,      // Definido como 0 ou null, pois não há plano mensal
      yearly: 0,       // Definido como 0 ou null, pois não há plano anual
    },
    stripeIds: {
      oneTime: env.NEXT_PUBLIC_STRIPE_60MIN_ID as string, // `priceId` para venda avulsa (garanta que isso seja uma string)
      monthly: null,  // Não existe plano mensal
      yearly: null,   // Não existe plano anual
    },
    images: [],
  },
];



export const plansColumns = [

  "básico",
  "pró",
  "business",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Accesso ao Google Analytics",
 
    básico: true,
    pró: true,
    business: "Custom",
    tooltip: "Todos os planos incluem análises básicas para monitorar o desempenho.",
  },
  {
    feature: "Marca personalizada",

    básico: false,
    pró: true,
    business: "Ilimitado",
    tooltip: "A personalização da marca está disponível a partir do plano Pro.",
  },
  {
    feature: "Prioridade no suporte",
 
    básico: "Email",
    pró: "Email",
    business: "Email 24/7 Suporte",

  },
  {
    feature: "Relatórios avançados",

    básico: null,
    pró: null,
    business: true,
  
    tooltip:
      "Os relatórios avançados estão disponíveis nos planos Pró e Business",
  },
  {
    feature: "Gerente Dedicado",

    básico: null,
    pró: null,
    business: true,
    tooltip: "O plano empresarial inclui um gerente de conta dedicado.",
  },
  {
    feature: "Acesso API",

    básico: null,
    pró: null,
    business: true,
    tooltip: "Ocesso a API de outros serviços compatíveis.",
  },
  {
    feature: "Monthly Webinars",
    starter: false,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "Pro and higher plans include access to monthly webinars.",
  },
  {
    feature: "Custom Integrations",
    starter: false,
    pro: false,
    business: "Available",
    enterprise: "Available",
    tooltip:
      "Custom integrations are available in Business and Enterprise plans.",
  },
  {
    feature: "Roles and Permissions",
    starter: null,
    pro: "Basic",
    business: "Advanced",
    enterprise: "Advanced",
    tooltip:
      "User roles and permissions management improves with higher plans.",
  },
  {
    feature: "Onboarding Assistance",
    starter: false,
    pro: "Self-service",
    business: "Assisted",
    enterprise: "Full Service",
    tooltip: "Higher plans include more comprehensive onboarding assistance.",
  },
  // Add more rows as needed
];
*/