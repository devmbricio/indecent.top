
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingCardsWebsites } from "@/components/pricing/PricingCardsWebsites";
import { pricingData } from "@/config/subscriptions"; // Importando os planos de assinatura
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";
import { UserSubscriptionPlan } from "@/types/types"; // Importando o tipo de UserSubscriptionPlan

export const metadata = constructMetadata({
  title: "indecent.top – aqui tudo pode!",
  description: "indecent.top – aqui tudo pode!",
});

export default async function PricingPage() {
  const user = await getCurrentUser();
  
  let subscriptionPlan: UserSubscriptionPlan | undefined = undefined;

  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  // Obter o plano selecionado com base no título
  const selectedPlan = pricingData.find(plan => plan.title === subscriptionPlan?.title);
  const selectedWebsitesPlan = pricingDataWebsites.find(offer => offer.title === subscriptionPlan?.title);

  // Garantir que os valores sejam sempre números, usando 0 como valor padrão
  const amount = selectedPlan ? selectedPlan.prices.monthly : 0;
  const websitesAmount = selectedWebsitesPlan ? selectedWebsitesPlan.prices.oneTime : 0;

  console.log("Selected plan:", selectedPlan);
  console.log("Amount extracted from pricingData:", amount); // Verifique se o valor de amount está correto
  console.log("Amount extracted from pricingDataWebsites:", websitesAmount); // Verifique o valor de websitesAmount

  return (
    <div className="grid grid-cols-1 md:pr-[10%] lg:grid-cols-2 gap-0 py-2 md:py-0 bg-center bg-cover bg-scroll bg-black/10 overflow-y-auto">
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} amount={amount} />
      <PricingCardsWebsites userId={user?.id} amount={amount} />
    </div>
  );
   
}

/*
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingCardsWebsites } from "@/components/pricing/PricingCardsWebsites";
import { pricingData } from "@/config/subscriptions"; // Importando os planos de assinatura
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";
import { UserSubscriptionPlan } from "@/types/types"; // Importando o tipo de UserSubscriptionPlan

export const metadata = constructMetadata({
  title: "indecent.top – aqui tudo pode!",
  description: "indecent.top – aqui tudo pode!",
});

export default async function PricingPage() {
  const user = await getCurrentUser();
  
  let subscriptionPlan: UserSubscriptionPlan | undefined = undefined;

  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  // Obter o plano selecionado com base no título
  const selectedPlan = pricingData.find(plan => plan.title === subscriptionPlan?.title);
  const selectedWebsitesPlan = pricingDataWebsites.find(offer => offer.title === subscriptionPlan?.title);

  // Garantir que os valores sejam sempre números, usando 0 como valor padrão
  const amount = selectedPlan ? selectedPlan.prices.monthly : 0;
  const websitesAmount = selectedWebsitesPlan ? selectedWebsitesPlan.prices.oneTime : 0;

  console.log("Selected plan:", selectedPlan);
  console.log("Amount extracted from pricingData:", amount); // Verifique se o valor de amount está correto
  console.log("Amount extracted from pricingDataWebsites:", websitesAmount); // Verifique o valor de websitesAmount

  return (
    <div className="grid grid-cols-1 md:pr-[10%] lg:grid-cols-2 gap-0 py-2 md:py-0 bg-center bg-cover bg-scroll md:bg-fixed bg-black/10 ">
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} amount={amount} />
      <PricingCardsWebsites userId={user?.id}amount={amount}  />
    </div>
  );
}
*/


/*import { getCurrentUser } from "@/lib/session";


import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingCardsWebsites } from "@/components/pricing/PricingCardsWebsites";
import PaymentWithMetaMask from "@/lib/PaymentWithMetaMask"; // Importando o componente de pagamento com MetaMask
import { pricingData } from "@/config/subscriptions"; // Importando os planos de assinatura
import { UserSubscriptionPlan } from "@/types/types"; // Importando o tipo de UserSubscriptionPlan

export const metadata = constructMetadata({
  title: "indecent.top – aqui tudo pode!",
  description: "indecent.top – aqui tudo pode!",
});

export default async function PricingPage() {
  const user = await getCurrentUser();
  
  // Garantir que subscriptionPlan tenha o tipo UserSubscriptionPlan ou undefined
  let subscriptionPlan: UserSubscriptionPlan | undefined = undefined;

  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  // Obter o plano selecionado com base no título
  const selectedPlan = pricingData.find(plan => plan.title === subscriptionPlan?.title);

  // Pegando o valor mensal do plano selecionado
  const amount = selectedPlan ? selectedPlan.prices.monthly : 0;

  return (
    <div className="grid grid-cols-1 md:pr-[10%] lg:grid-cols-2 gap-0 py-2 md:py-0 bg-center bg-cover bg-scroll md:bg-fixed bg-black/10 ">
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      <PricingCardsWebsites userId={user?.id} />
 
      {selectedPlan && <PaymentWithMetaMask userId={user?.id} amount={amount} />}
    </div>
  );
}
*/



/*

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingCardsWebsites } from "@/components/pricing/PricingCardsWebsites";


export const metadata = constructMetadata({
  title: "indecent.top – aqui tudo pode!",
  description: "indecent.top – aqui tudo pode!",
});

export default async function PricingPage() {
  const user = await getCurrentUser();
  let subscriptionPlan;

  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  return (
    <div className="grid grid-cols-1 md:pr-[10%] lg:grid-cols-2 gap-0 py-2 md:py-0 bg-center bg-cover bg-scroll md:bg-fixed bg-black/10 ">
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      <PricingCardsWebsites userId={user?.id} />
  
    </div>
  );
}
*/


/* funcional antes dos liks de afiliados
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingCardsWebsites } from "@/components/pricing/PricingCardsWebsites";


export const metadata = constructMetadata({
  title: "Pricing – top",
  description: "Prices top.",
});

export default async function PricingPage() {
  const user = await getCurrentUser();
  let subscriptionPlan;

  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 py-2 md:py-0 bg-center bg-cover bg-scroll md:bg-fixed md:bg-[url('/macaco-network.jpg')] bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900">
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      <PricingCardsWebsites userId={user?.id} />
  
    </div>
  );
}
*/
/*
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { PricingCardsWebsites } from "@/components/pricing/PricingCardsWebsites";
import { PricingCardsDigitalStrategy } from "@/components/pricing/PricingCardsDigitalStrategy";
import { PricingCardsSites } from "@/components/pricing/PricingCardsSites";


export const metadata = constructMetadata({
  title: "Pricing – MaCaCo.NetWork",
  description: "Explore our subscription plans.",
});

export default async function PricingPage() {
  const user = await getCurrentUser();
  let subscriptionPlan;

  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  return (
    <div className="flex w-full flex-row gap-16 py-8 md:py-8 bg-center bg-cover bg-scroll md:bg-fixed md:bg-[url('/macaco-network.jpg')] bg-gradient-to-r from-[rgb(255,117,25)] via-[#ff2975] to-[#8c1eff]">
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      <PricingCardsWebsites userId={user?.id} />
 

    
    </div>
  );
}
*/