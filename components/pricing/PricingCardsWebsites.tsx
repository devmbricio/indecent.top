"use client";

import { useContext, useState } from "react";
import { UserWebsitesPlan, WebsitesPlan } from "@/types/types";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import PaymentWithMetaMask from "@/lib/PaymentWithMetaMask"; // Importando o componente de pagamento com MetaMask
import { BillingFormButtonWebsites } from "../forms/billing-form-button-websites";
import Image from "next/image";

interface PricingCardsWebsitesProps {
  userId?: string;
  websitesPlan?: UserWebsitesPlan;
  amount: number; // Valor do produto para ser passado ao MetaMask
}

export function PricingCardsWebsites({ userId, amount }: PricingCardsWebsitesProps) {
  const { setShowSignInModal } = useContext(ModalContext);

  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('card'); // Estado para armazenar o método de pagamento

  const handlePaymentMethodChange = (method: 'crypto' | 'card') => {
    setPaymentMethod(method); // Altera o método de pagamento selecionado
  };

  // Log para verificar o valor de pricingDataWebsites
  console.log("pricingDataWebsites:", pricingDataWebsites);

  const PricingCardWebsites = ({ offer }: { offer: WebsitesPlan }) => {
    const price = offer.prices.monthly ?? 0;  // Garante que o valor de `monthly` seja definido
    const amount = price;  // Usando o preço mensal

    // Log para verificar o valor de amount
    console.log("Valor do preço de pagamento (monthly):", amount);

    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden p-4 border shadow-lg bg-gray-600 bg-opacity-45 rounded-md",
          offer.title.toLowerCase() === "pro" ? "border-purple-400" : ""
        )}
        key={offer.title}
      >
        <div className="min-h-[120px] flex flex-col items-center justify-center space-y-2 p-4">
          <p className=" tracking-wider text-2xl text-[#ddc897]">
            {offer.title}
          </p>
          <div className="text-center text-xl text-[#ddc897]">
            {/* Exibindo o preço mensal corretamente */}
            <p>R$ {price.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4 p-4">
          <ul className="space-y-2 text-left text-lg font-medium">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-2" key={feature}>
                <Icons.check className="size-6 text-[#ddc897]" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>

          {userId ? (
            <>
              <div className="flex justify-center gap-2 pb-1">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => handlePaymentMethodChange('card')}
                >
                  Cartão
                </Button>
                <Button
                  variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                  onClick={() => handlePaymentMethodChange('crypto')}
                >
                  <Image
                    src="/metamask-logo.png" // Caminho para a imagem do MetaMask na pasta public
                    alt="MetaMask Logo"
                    width={25}  // Ajuste o tamanho da imagem conforme necessário
                    height={25}
                    style={{ marginRight: "0px" }} // Adiciona margem à direita da imagem
                  />
                  
                </Button>
              </div>
              {paymentMethod === 'card' && (
                <BillingFormButtonWebsites offer={offer} />
              )}
              {paymentMethod === 'crypto' && amount > 0 && (
                <PaymentWithMetaMask
                  userId={userId}
                  amount={amount}  // Passando o valor correto para o MetaMask
                />
              )}
            </>
          ) : (
            <Button
              variant={offer.title.toLowerCase() === "pro" ? "default" : "outline"}
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
      <section className="flex flex-col items-center justify-center pt-8">
        <HeaderSection label="Planos de Acesso" title="Escolha o Melhor para Você" />

        <div className="grid gap-5 py-6 lg:grid-cols-3">
          {pricingDataWebsites.map((offer) => (
            <PricingCardWebsites offer={offer} key={offer.title} />
          ))}
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
/*


"use client";

import { useContext, useState } from "react";
import { UserWebsitesPlan, WebsitesPlan } from "@/types/types";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import PaymentWithMetaMask from "@/lib/PaymentWithMetaMask"; // Importando o componente de pagamento com MetaMask
import { BillingFormButtonWebsites } from "../forms/billing-form-button-websites";
import Image from "next/image";

interface PricingCardsWebsitesProps {
  userId?: string;
  websitesPlan?: UserWebsitesPlan;
  amount: number; // Valor do produto para ser passado ao MetaMask
}

export function PricingCardsWebsites({ userId, amount }: PricingCardsWebsitesProps) {
  const { setShowSignInModal } = useContext(ModalContext);

  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('card'); // Estado para armazenar o método de pagamento

  const handlePaymentMethodChange = (method: 'crypto' | 'card') => {
    setPaymentMethod(method); // Altera o método de pagamento selecionado
  };

  // Log para verificar o valor de pricingDataWebsites
  console.log("pricingDataWebsites:", pricingDataWebsites);

  const PricingCardWebsites = ({ offer }: { offer: WebsitesPlan }) => {
    // Garantir que o valor do preço seja exibido corretamente
    const price = offer.prices.monthly ?? 0;  // Garante que o valor de `monthly` seja definido
    const amount = price;  // Usando o preço mensal

    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden p-4 border shadow-lg bg-gray-600 bg-opacity-45 rounded-md",
          offer.title.toLowerCase() === "pro" ? "border-purple-400" : ""
        )}
        key={offer.title}
      >
        <div className="min-h-[120px] flex flex-col items-center justify-center space-y-2 p-4">
          <p className="uppercase tracking-wider text-2xl text-[#ddc897]">
            {offer.title}
          </p>
          <div className="text-center text-xl text-[#ddc897]">
 
            <p>R$ {price.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4 p-4">
          <ul className="space-y-2 text-left text-lg font-medium">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-2" key={feature}>
                <Icons.check className="size-6 text-[#ddc897]" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>

          {userId ? (
            <>
              <div className="flex justify-center gap-2 pb-1">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => handlePaymentMethodChange('card')}
                >
                  Cartão
                </Button>
                <Button
                  variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                  onClick={() => handlePaymentMethodChange('crypto')}
                >
                  <Image
                    src="/metamask-logo.png" // Caminho para a imagem do MetaMask na pasta public
                    alt="MetaMask Logo"
                    width={25}  // Ajuste o tamanho da imagem conforme necessário
                    height={25}
                    style={{ marginRight: "0px" }} // Adiciona margem à direita da imagem
                  />
                  Cripto
                </Button>
              </div>
              {paymentMethod === 'card' && (
                <BillingFormButtonWebsites offer={offer} />
              )}
              {paymentMethod === 'crypto' && amount > 0 && (
                <PaymentWithMetaMask
                  userId={userId}
                  amount={amount}  // Passando o valor correto para o MetaMask
                />
              )}
            </>
          ) : (
            <Button
              variant={offer.title.toLowerCase() === "pro" ? "default" : "outline"}
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
      <section className="flex flex-col items-center justify-center pt-8">
        <HeaderSection label="Planos de Acesso" title="Escolha o Melhor para Você" />

        <div className="grid gap-5 py-6 lg:grid-cols-3">
          {pricingDataWebsites.map((offer) => (
            <PricingCardWebsites offer={offer} key={offer.title} />
          ))}
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
*/



/*


"use client";

import { useContext, useState } from "react";
import { UserWebsitesPlan, WebsitesPlan } from "@/types/types";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import PaymentWithMetaMask from "@/lib/PaymentWithMetaMask"; // Importando o componente de pagamento com MetaMask,
import { BillingFormButtonWebsites } from "../forms/billing-form-button-websites";
import Image from "next/image";

interface PricingCardsWebsitesProps {
  userId?: string;
  websitesPlan?: UserWebsitesPlan;
}

export function PricingCardsWebsites({ userId }: PricingCardsWebsitesProps) {
  const { setShowSignInModal } = useContext(ModalContext);

  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('card'); // Estado para armazenar o método de pagamento

  const handlePaymentMethodChange = (method: 'crypto' | 'card') => {
    setPaymentMethod(method); // Altera o método de pagamento selecionado
  };

  const PricingCard = ({ offer }: { offer: WebsitesPlan }) => {
    const discount = 0.10; // 10% de desconto
    const discountedPrice = (price: number | undefined) =>
      price ? (price * (1 - discount)).toFixed(2) : undefined;

    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden p-4 border shadow-lg bg-gray-600 bg-opacity-45 rounded-md",
          offer.title.toLowerCase() === "pro" ? "border-purple-400" : ""
        )}
        key={offer.title}
      >
        <div className="min-h-[120px] flex flex-col items-center justify-center space-y-2 p-4">
          <p className="uppercase tracking-wider text-2xl text-[#ddc897]">
            {offer.title}
          </p>
          <div className="text-center text-xl text-[#ddc897]">
            {offer.prices.monthly ? (
              <>
                <p>R$ {offer.prices.monthly.toFixed(2)}</p>
                {offer.prices.yearly ? (
                  <p>
           
                  </p>
                ) : (
                  <p>Preço anual indisponível</p>
                )}
              </>
            ) : (
              <span className="text-center">Preço mensal indisponível</span>
            )}
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4 p-4">
          <ul className="space-y-2 text-left text-lg font-medium">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-2" key={feature}>
                <Icons.check className="size-6 text-[#ddc897]" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>

          {userId ? (
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
                  <Image
                    src="/metamask-logo.png" // Caminho para a imagem do MetaMask na pasta public
                    alt="MetaMask Logo"
                    width={20}  // Ajuste o tamanho da imagem conforme necessário
                    height={20}
                    style={{ marginRight: "10px" }} // Adiciona margem à direita da imagem
                  />
                  Pagar com Cripto
                </Button>
              </div>
              {paymentMethod === 'card' && (
                <BillingFormButtonWebsites offer={offer} />
              )}
{paymentMethod === 'crypto' && typeof offer.prices.monthly === 'number' && offer.prices.monthly > 0 && (
  <PaymentWithMetaMask
    userId={userId}
    amount={offer.prices.monthly}  // Garante que o valor é um número positivo
  />
)}


            </>
          ) : (
            <Button
              variant={offer.title.toLowerCase() === "pro" ? "default" : "outline"}
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
      <section className="flex flex-col items-center justify-center pt-8">
        <HeaderSection label="Planos de Acesso" title="Escolha o Melhor para Você" />

        <div className="grid gap-5 py-6 lg:grid-cols-3">
          {pricingDataWebsites.map((offer) => (
            <PricingCard offer={offer} key={offer.title} />
          ))}
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
*/

/* funcional antes do pgto crypto

"use client";

import { useContext } from "react";
import { UserWebsitesPlan, WebsitesPlan } from "@/types/types";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { BillingFormButtonWebsites } from "@/components/forms/billing-form-button-websites";

interface PricingCardsWebsitesProps {
  userId?: string;
  websitesPlan?: UserWebsitesPlan;
}

export function PricingCardsWebsites({ userId }: PricingCardsWebsitesProps) {
  const { setShowSignInModal } = useContext(ModalContext);

  const PricingCard = ({ offer }: { offer: WebsitesPlan }) => {
    const discount = 0.10; // 10% de desconto
    const discountedPrice = (price: number | undefined) =>
      price ? (price * (1 - discount)).toFixed(2) : undefined;

    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden p-4 border shadow-lg bg-gray-600 bg-opacity-45 rounded-md",
          offer.title.toLowerCase() === "pro" ? "border-purple-400" : ""
        )}
        key={offer.title}
      >
        <div className="min-h-[120px] flex flex-col items-center justify-center space-y-2 p-4">
          <p className="uppercase tracking-wider text-2xl text-[#ddc897]">
            {offer.title}
          </p>
          <div className="text-center text-xl text-[#ddc897]">
 
            {offer.prices.monthly ? (
              <>
                <p>R$ {offer.prices.monthly.toFixed(2)}</p>
                {offer.prices.yearly ? (
                  <p>
                   
                  </p>
                ) : (
                  <p>Preço anual indisponível</p>
                )}
              </>
            ) : (
              <span className="text-center">Preço mensal indisponível</span>
            )}
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4 p-4">
          <ul className="space-y-2 text-left text-lg font-medium">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-2" key={feature}>
                <Icons.check className="size-6 text-[#ddc897]" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>

          {userId ? (
            <BillingFormButtonWebsites offer={offer} />
          ) : (
            <Button
              variant={
                offer.title.toLowerCase() === "pro" ? "default" : "outline"
              }
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
      <section className="flex flex-col items-center justify-center pt-8">
        <HeaderSection label="Planos de Acesso" title="Escolha o Melhor para Você" />

        <div className="grid gap-5 py-6 lg:grid-cols-3">
          {pricingDataWebsites.map((offer) => (
            <PricingCard offer={offer} key={offer.title} />
          ))}
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
/


/* funcional mas nao mostra preços
"use client"; 

import { useContext } from "react";
import { UserWebsitesPlan, WebsitesPlan } from "@/types/types";
import { pricingDataWebsites } from "@/config/subscriptionsWebsites";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { BillingFormButtonWebsites } from "@/components/forms/billing-form-button-websites";

interface PricingCardsWebsitesProps {
  userId?: string;
  websitesPlan?: UserWebsitesPlan;
}

export function PricingCardsWebsites({ userId }: PricingCardsWebsitesProps) {
  const { setShowSignInModal } = useContext(ModalContext);

  const PricingCard = ({ offer }: { offer: WebsitesPlan }) => {
    const discount = 0.10;
    const discountedPrice = (price: number) => (price * (1 - discount)).toFixed(2);

    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden p-2 border shadow-lg bg-gray-600  bg-opacity-45",
          offer.title.toLocaleLowerCase() === "pro" ? "-m-0.5 border-purple-400" : ""
        )}
        key={offer.title}
      >
        <div className="min-h-[120px] items-center justify-center space-y-0 md:p-2 p-2">
          <p className="flex uppercase tracking-wider items-center text-center justify-center text-2xl text-[#ddc897]">
            {offer.title}
          </p>

          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="flex flex-col items-center text-center justify-center md:text-xl text-xl pr-2">
                {offer.prices.oneTime ? (
                  <span className="text-center">
                    R$ {offer.prices.oneTime.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-center">Preço indisponível</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-0 p-2">
          <ul className="space-y-0 text-left md:text-lg font-medium">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-0" key={feature}>
                <Icons.check className="size-6 shrink-0 text-[#ddc897]" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>

          {userId ? (
            <BillingFormButtonWebsites offer={offer} />
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
      <section className="flex flex-col items-center text-center justify-center pt-2">
        <HeaderSection label="Ao vivo" title="" />

        <div className="flex justify-center">
          <div className="grid gap-5 bg-inherit py-2 lg:grid-cols-3">
            {pricingDataWebsites.map((offer) => (
              <PricingCard offer={offer} key={offer.title} />
            ))}
          </div>
        </div>

        <p className="mt-3 md:text-xl p-2 text-center">
          <a
            className="font-medium text-primary hover:text-[#ff48f3]"
            href="mailto:macaconetwork@macaco.network"
          >

          </a>
        </p>
      </section>
    </MaxWidthWrapper>
  );
}

*/