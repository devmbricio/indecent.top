import { PlansRow, SubscriptionPlan, DigitalStrategyPlan } from "@/types/types"
import { env } from "@/env.mjs"

export const pricingData: SubscriptionPlan[] = [
 {
    title: 'Assinatura Free',
    description: 'Tenha acesso ao básico de todas as contas e conteúdos gravadosl',
    benefits: [
      "Anuncie grátis.",
      "Acesse todos os anúncios do plano free.",
      "Acesse todas as fotos do plano free.",
      "Acesse todos os vídeos do plano free.",
      "Acesse todas as live do plano free.",
      "Acesse todos os chats do plano free.",
      "Acesse todas as chamadas webcam e celular do plano free.",   
    ],
    influencer: [
      "Tem mais de 100k seguidores nas redes sociais (todas as redes)?",
     ],
    influencers: [
      "Solicite VIP direto pelo ícone profile no seu site ou app?",
      "Quer ser um influencer criador de conteúdo?",
      "Criador de conteúdo até 96% de lucro",      
    ],
    affiliates: [
      "Quer ser um #afiliado ou #influencer IndecentTop?",
    ],
    limitations: [
      
      "Afiliado até 70% de comissão",
      "Convide 10 usuários para o #indecent.top",
      "Sua atividade nas redes sociais contribui para seus ganhos.",
      "50 posts no #indecent.top",
      "50 remix ou stories no #instagram , #facebook, #tiktok , #twitter **",
      "500 curtidas no #instagram , #facebook, #tiktok , #twitter **",
      "+1000 seguidores no #instagram , #facebook, #tiktok , #twitter **",
      "Solicite sua afiliação pelo ícone profile no seu site ou app",
      "** ou rede de maior engajamento",

    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
    images: [],
  },
  {
    title: 'Assinatura Basic',
    description: 'Tenha acesso a todas as contas e conteúdos gravadosl',
    benefits: [
      "Anuncie grátis.",
      "Acesse todos os anúncios do plano basic.",
      "Acesse todas as fotos do plano basic.",
      "Acesse todos os vídeos do plano basic.",
      "Acesse todas as live do plano basic.",
      "Acesse todos os chats do plano basic.",
      "Acesse todas as chamadas webcam e celular do plano basic.",  
   
    ],
    limitations: [
     
    ],
    influencer: [

     ],
    influencers: [
  
    ],
      affiliates: [
    
    ],
    prices: {
      monthly: 99.90, 
      yearly: 1098.90,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID,
    },
    images: [],
  },
  {
    title: 'Assinatura Premium',
    description: 'Tenha acesso a todas as contas, conteúdos gravados e ao vivol',
    benefits: [
      "Anuncie grátis.",
      "Acesse todos os anúncios do plano premium.",
      "Acesse todas as fotos do plano premium.",
      "Acesse todos os vídeos do plano premium.",
      "Acesse todas as live do plano premium.",
      "Acesse todos os chats do plano premium.",
      "Acesse todas as chamadas webcam e celular do plano premium.",  
   
    ],
    limitations: [
     
    ],
    influencer: [

     ],
    influencers: [
     
    ],
    affiliates: [
    
    ],
    prices: {
      monthly: 149.90, 
      yearly: 1648.90,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID,
      yearly: env. NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID,
    },
    images: [],
  },

];



export const plansColumns = [
  "Assinatura Free",
  "Assinatusa Basic",
  "Assinatusa Premium",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Accesso ao Google Analytics",
    hospedagem: null,
    básico: true,
    pró: true,
    business: "Customizado",
    tooltip: "Todos os planos incluem análises básicas para monitorar o desempenho.",
  },
  {
    feature: "Marca personalizada",
    hospedagem: null,
    básico: false,
    pró: true,
    business: "Customizado",
    tooltip: "A personalização da marca está disponível a partir do plano Pro.",
  },
  {
    feature: "Prioridade no suporte",
    hospedagem: "Email 24/7 Suporte",
    básico: "Email",
    pró: "Email",
    business: " Email 24/7 Suporte",

  },
  {
    feature: "Relatórios avançados",
    hospedagem: null,
    básico: null,
    pró: null,
    business: true,
  
    tooltip:
      "Os relatórios avançados estão disponíveis nos planos Pró e Business",
  },
  {
    feature: "Gerente Dedicado",
    hospedagem: null,
    básico: null,
    pró: null,
    business: true,
    tooltip: "O plano empresarial inclui um gerente de conta dedicado.",
  },
  {
    feature: "Acesso API",
    hospedagem: null,
    básico: null,
    pró: null,
    business: true,
    tooltip: "Ocesso a API de outros serviços compatíveis.",
  },
  {
    feature: "Webinars mensais",
    hospedagem: null,
    básico: null,
    pró: null,
    business: true,
    tooltip: "Plano Business  inclui acesso a webinars mensais.",
  },
  {
    feature: "Integrações Cutomizadas",
    hospedagem: null,
    básico: null,
    pró: false,
    business: true,
    tooltip:
      "Integrações personalizadas estão disponíveis no plano Business.",
  },
  {
    feature: "Funções e permissões",
    hospedagem: null,
    básico: null,
    pró: "Basico",
    business: "Avançado",
    tooltip:
      "User roles and permissions management improves with higher plans.",
  },
  {
    feature: "Assistência de integração",
    hospedagem: null,
    básico: null,
    pró: null,
    business: true,
    enterprise: "Full Service",
    tooltip: "Higher plans include more comprehensive onboarding assistance.",
  },
  // Add more rows as needed
];