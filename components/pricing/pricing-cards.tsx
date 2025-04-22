"use client";

import { useContext, useState } from "react";
import { UserSubscriptionPlan, SubscriptionPlan } from "@/types/types";
import { pricingData } from "@/config/subscriptions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import PaymentWithMetaMask from "@/lib/PaymentWithMetaMask"; // Importando o componente
import Image from "next/image";

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
  amount: number; // Valor do produto para ser passado ao MetaMask
}

export function PricingCards({ userId, subscriptionPlan }: PricingCardsProps) {
  const [isYearly, setIsYearly] = useState<boolean>(subscriptionPlan?.interval === "year");
  const { setShowSignInModal } = useContext(ModalContext);

  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('card'); // Estado para armazenar o método de pagamento

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  const handlePaymentMethodChange = (method: 'crypto' | 'card') => {
    setPaymentMethod(method); // Altera o método de pagamento selecionado
  };

  const PricingCard = ({ offer }: { offer: SubscriptionPlan }) => {
    const discount = 0.10;
    const discountedPrice = (price: number) => (price * (1 - discount)).toFixed(2);

    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden p-0 border shadow-lg bg-gray-600  bg-opacity-45 rounded-md",
          offer.title.toLocaleLowerCase() === "pro" ? "-m-0.5 border-green-500" : ""
        )}
        key={offer.title}
      >
        <div className="min-h-[150px] items-center justify-center space-y-2 md:p-4 p-2">
          <p className="flex  tracking-wider items-center text-center justify-center text-2xl text-[#ddc897]">
            {offer.title}
          </p>

          <div className="flex flex-row">
            <div className="flex items-center">
              <div className="flex flex-col items-center text-center justify-center md:text-xl text-sm font-semibold pr-2">
                {isYearly ? (
                  <>
                    <span className="line-through flex text-center">
                      Cobrança mensal de R$ {offer.prices.monthly.toFixed(2)}
                    </span>
                    <span>R$ {(offer.prices.yearly / 12).toFixed(2)}</span>
                  </>
                ) : (
                  `R$${offer.prices.monthly.toFixed(2)}`
                )}
              </div>
              <div className="mb-1.5 ml-2 md:text-sm text-sm">
                <div>{isYearly ? "anual" : "/mês"}</div>
              </div>
            </div>
          </div>
          {isYearly && (
            <div className="md:text-xl text-sm text-center justify-center">
              Cobrança anual de R$ {offer.prices.yearly.toFixed(2)}
            </div>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-0 md:p-4 p-1">
          <ul className="space-y-0 text-left md:text-sm font-medium pb-6">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-0" key={feature}>
                <Icons.check className="size-6 mr-2 shrink-0 text-green-500" />
                <p>{feature}</p>
              </li>
            ))}

            {offer.influencer.map((feature) => (
              <li className="flex items-start pt-2 pb-2 text-[#ddc897]" key={feature}>
            <Icons.Receipt className="mr-2 size-6 shrink-0 text-[#ddc897]" />
                <p>{feature}</p>
              </li>
            ))}

            {offer.influencers.map((feature) => (
              <li className="flex items-start pt-0 pb-0 " key={feature}>
                <Icons.check className="mr-2 size-6 shrink-0 text-[#ddc897]" />
                <p>{feature}</p>
              </li>
            ))}

            {offer.affiliates.map((feature) => (
              <li className="flex items-start pt-2 pb-2 text-[#ddc897]" key={feature}>
                <Icons.Receipt className="mr-2 size-6 shrink-0 text-[#ddc897]" />
                <p>{feature}</p>
              </li>
            ))}

            {offer.limitations.map((feature) => (
              <li className="flex items-start" key={feature}>
                <Icons.check className="mr-2 size-6 shrink-0 text-[#ddc897]" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>

          {userId && subscriptionPlan ? (
            <>
              <div className="flex justify-center gap-2 pb-5">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => handlePaymentMethodChange('card')}
                >
                  Crédito
                </Button>
                <Button
                  variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                  onClick={() => handlePaymentMethodChange('crypto')}
                >
                     <Image
                    src="/metamask-logo.png" // Caminho para a imagem do MetaMask na pasta public
                    alt="MetaMask Logo"
                    width={20}  // Ajuste o tamanho da imagem conforme necessário
                    height={20}
                    style={{ marginRight: "0px" }} // Adiciona margem à direita da imagem
                  /></Button>
              </div>
              {paymentMethod === 'card' && (
                <BillingFormButton
                  year={isYearly}
                  offer={offer}
                  subscriptionPlan={subscriptionPlan}
                />
              )}
              {paymentMethod === 'crypto' && (
                <PaymentWithMetaMask
                  userId={userId}
                  amount={offer.prices.monthly}  // Passando o valor do produto para o MetaMask
                />
              )}
            </>
          ) : (
            <Button
              variant={offer.title.toLocaleLowerCase() === "pro" ? "default" : "outline"}
              onClick={() => setShowSignInModal(true)}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center justify-center">
        <HeaderSection label="Assinatura" title="" /> 

        <div className="mb-0 mt-2 flex items-center text-center justify-center gap-5">
          <ToggleGroup
            type="single"
            size="sm"
            defaultValue={isYearly ? "yearly" : "monthly"}
            onValueChange={toggleBilling}
            aria-label="toggle-year"
            className="h-9 items-center text-center justify-center text-[#ddc897] overflow-hidden rounded-full border bg-background p-1"
          >
            <ToggleGroupItem
              value="yearly"
              className="rounded-full px-5 md:text-xl text-sm data-[state=on]:!bg-[#ddc897]"
              aria-label="Toggle yearly billing"
            >
              anual (-10%)
            </ToggleGroupItem>
            <ToggleGroupItem
              value="monthly"
              className="rounded-full px-5  md:text-xl text-sm data-[state=on]:!bg-[#ddc897]"
              aria-label="Toggle monthly billing"
            >
              mensal
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex justify-center">
          <div className="grid gap-5 bg-inherit py-5 lg:grid-cols-1">
            {pricingData.map((offer) => (
              <PricingCard offer={offer} key={offer.title} />
            ))}
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}

/*

s
"use client";

import { useContext, useState } from "react";
import { UserSubscriptionPlan, SubscriptionPlan } from "@/types/types";
import { pricingData } from "@/config/subscriptions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { BillingCryptoFormButton } from "../forms/billing-form-crypto-button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function PricingCards({ userId, subscriptionPlan }: PricingCardsProps) {
  const [isYearly, setIsYearly] = useState<boolean>(subscriptionPlan?.interval === "year");
  const { setShowSignInModal } = useContext(ModalContext);

  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('card'); // Estado para armazenar o método de pagamento

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  const handlePaymentMethodChange = (method: 'crypto' | 'card') => {
    setPaymentMethod(method); // Altera o método de pagamento selecionado
  };

  const PricingCard = ({ offer }: { offer: SubscriptionPlan }) => {
    const discount = 0.10;
    const discountedPrice = (price: number) => (price * (1 - discount)).toFixed(2);

    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden p-0 border shadow-lg bg-gray-600  bg-opacity-45 rounded-md",
          offer.title.toLocaleLowerCase() === "pro" ? "-m-0.5 border-green-500" : ""
        )}
        key={offer.title}
      >
        <div className="min-h-[150px] items-center justify-center space-y-2 md:p-4 p-2">
          <p className="flex  tracking-wider items-center text-center justify-center text-2xl text-[#ddc897]">
            {offer.title}
          </p>

          <div className="flex flex-row">
            <div className="flex items-center">
              <div className="flex flex-col items-center text-center justify-center md:text-xl text-sm font-semibold pr-2">
                {isYearly ? (
                  <>
                    <span className="line-through flex text-center">
                      Cobrança mensal de R$ {offer.prices.monthly.toFixed(2)}
                    </span>
                    <span>R$ {(offer.prices.yearly / 12).toFixed(2)}</span>
                  </>
                ) : (
                  `R$${offer.prices.monthly.toFixed(2)}`
                )}
              </div>
              <div className="mb-1.5 ml-2 md:text-sm text-sm">
                <div>{isYearly ? "anual" : "/mês"}</div>
              </div>
            </div>
          </div>
          {isYearly && (
            <div className="md:text-xl text-sm text-center justify-center">
              Cobrança anual de R$ {offer.prices.yearly.toFixed(2)}
            </div>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-0 md:p-4 p-1">
          <ul className="space-y-0 text-left md:text-sm font-medium pb-6">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-0" key={feature}>
                <Icons.check className="size-6 mr-2 shrink-0 text-green-500" />
                <p>{feature}</p>
              </li>
            ))}

            {offer.limitations.map((feature) => (
              <li className="flex items-start" key={feature}>
                <Icons.messageSquare className="mr-2 size-6 shrink-0" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>

          {userId && subscriptionPlan ? (
            <>
              <div className="flex justify-center gap-5">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => handlePaymentMethodChange('card')}
                >
                  Pagar com Cartão
                </Button>
                <Button
                  variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                  onClick={() => handlePaymentMethodChange('crypto')}
                >
                  Pagar com Cripto
                </Button>
              </div>
              {paymentMethod === 'card' && (
                <BillingFormButton
                  year={isYearly}
                  offer={offer}
                  subscriptionPlan={subscriptionPlan}
   
                />
              )}
              {paymentMethod === 'crypto' && (
                <BillingCryptoFormButton
                  year={isYearly}
                  offer={offer}
                  subscriptionPlan={subscriptionPlan}
           
                />
              )}
            </>
          ) : (
            <Button
              variant={offer.title.toLocaleLowerCase() === "pro" ? "default" : "outline"}
              onClick={() => setShowSignInModal(true)}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center justify-center">
        <HeaderSection label="Assinatura" title="" />

        <div className="mb-0 mt-2 flex items-center text-center justify-center gap-5">
          <ToggleGroup
            type="single"
            size="sm"
            defaultValue={isYearly ? "yearly" : "monthly"}
            onValueChange={toggleBilling}
            aria-label="toggle-year"
            className="h-9 items-center text-center justify-center text-[#ddc897] overflow-hidden rounded-full border bg-background p-1"
          >
            <ToggleGroupItem
              value="yearly"
              className="rounded-full px-5 data-[state=on]:!bg-gray-600 md:text-xl text-sm data-[state=on]:!bg-[#ddc897]"
              aria-label="Toggle yearly billing"
            >
              anual (-10%)
            </ToggleGroupItem>
            <ToggleGroupItem
              value="monthly"
              className="rounded-full px-5 data-[state=on]:!bg-gray-600 md:text-xl text-sm data-[state=on]:!bg-[#ddc897]"
              aria-label="Toggle monthly billing"
            >
              mensal
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex justify-center">
          <div className="grid gap-5 bg-inherit py-5 lg:grid-cols-1">
            {pricingData.map((offer) => (
              <PricingCard offer={offer} key={offer.title} />
            ))}
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
*/


/*


"use client"

import { useContext, useState } from "react";
import { UserSubscriptionPlan, SubscriptionPlan } from "@/types/types";
import { pricingData } from "@/config/subscriptions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function PricingCards({ userId, subscriptionPlan }: PricingCardsProps) {
  const [isYearly, setIsYearly] = useState<boolean>(subscriptionPlan?.interval === "year");
  const { setShowSignInModal } = useContext(ModalContext);

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  const PricingCard = ({ offer }: { offer: SubscriptionPlan }) => {
    const discount = 0.10;
    const discountedPrice = (price: number) => (price * (1 - discount)).toFixed(2);

    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden p-0 border shadow-lg bg-gray-600  bg-opacity-45 rounded-md",
          offer.title.toLocaleLowerCase() === "pro" ? "-m-0.5 border-green-500" : ""
        )}
        key={offer.title}
      >
        <div className="min-h-[150px] items-center justify-center space-y-2 md:p-4 p-2">
          <p className="flex  tracking-wider items-center text-center justify-center text-2xl text-[#ddc897]">
            {offer.title}
          </p>

          <div className="flex flex-row">
            <div className="flex items-center">
              <div className="flex flex-col items-center text-center justify-center md:text-xl text-sm font-semibold pr-2">
                {isYearly ? (
                  <>
                    <span className="line-through flex text-center">
                    Cobrança mensal de R$ {offer.prices.monthly.toFixed(2)}
                    </span>
                    <span>R$ {(offer.prices.yearly / 12).toFixed(2)}</span>
                  </>
                ) : (
                  `R$${offer.prices.monthly.toFixed(2)}`
                )}
              </div>
              <div className="mb-1.5 ml-2 md:text-sm text-sm">
                <div>{isYearly ? "anual" : "/mês"}</div>
              </div>
            </div>
          </div>
          {isYearly && (
            <div className="md:text-xl text-sm text-center justify-center">
              Cobrança anual de R$ {offer.prices.yearly.toFixed(2)}
            </div>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-0 md:p-4 p-1">
          <ul className="space-y-0 text-left md:text-sm font-medium pb-6">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-0" key={feature}>
                <Icons.check className="size-6 mr-2 shrink-0 text-green-500" />
                <p>{feature}</p>
              </li>
            ))}
          

          {offer.limitations.map((feature) => (
              <li className="flex items-start" key={feature}>
                <Icons.messageSquare className="mr-2 size-6 shrink-0" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>

          {userId && subscriptionPlan ? (
            <BillingFormButton
              year={isYearly}
              offer={offer}
              subscriptionPlan={subscriptionPlan}
            />
          ) : (
            <Button
              variant={offer.title.toLocaleLowerCase() === "pro" ? "default" : "outline"}
              onClick={() => setShowSignInModal(true)}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center justify-center">
        <HeaderSection label="Assinatura" title="" />

        <div className="mb-0 mt-2 flex items-center text-center justify-center gap-5">
          <ToggleGroup
            type="single"
            size="sm"
            defaultValue={isYearly ? "yearly" : "monthly"}
            onValueChange={toggleBilling}
            aria-label="toggle-year"
            className="h-9 items-center text-center justify-center text-[#ddc897] overflow-hidden rounded-full border bg-background p-1"
          >
            <ToggleGroupItem
              value="yearly"
              className="rounded-full px-5 data-[state=on]:!bg-gray-600 md:text-xl text-sm data-[state=on]:!"
              aria-label="Toggle yearly billing"
            >
              anual (-10%)
            </ToggleGroupItem>
            <ToggleGroupItem
              value="monthly"
              className="rounded-full px-5 data-[state=on]:!bg-gray-600 md:text-xl text-sm data-[state=on]:!"
              aria-label="Toggle monthly billing"
            >
              mensal
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex justify-center">
          <div className="grid gap-5 bg-inherit py-5 lg:grid-cols-1">
            {pricingData.map((offer) => (
              <PricingCard offer={offer} key={offer.title} />
            ))}
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
*/

