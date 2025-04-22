
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "A assinatura do Meu Digital no Instagram e a mesma do Studio?",
    answer:
      "Na verdade as assinaturas do Meu Digital no Instagram e do Studio são separadas, embora na campanha de lançamento da assinatura do Instagram centenas de assinatura Studio foram bonificadas permitindo o acesso ao Studio.",
  },
  {
    id: "item-3",
    question: "_Preciso contratar um domínio para ter um site?_",
    answer:
      "Sim, para você ter o domínio com seu nome ou da sua empresa você precisa contratar nosso plano de hospedagem que já inclui domínio, ou você pode registrar um domínio através de empresas especializadas em registro de domínios. Aqui estão algumas das mais populares: GoDaddy Namecheap HostGator Registro.br e então contratar a hospedagem.",
  },
  {
    id: "item-4",
    question: "_Preciso contratar a hospedagem para ter um site?_",
    answer:
      "_Você precisará de um serviço de hospedagem para armazenar os arquivos do seu site. Conheça nosso plano de hospedagem com domínio incluso_",
  },
  {
    id: "item-5",
    question: "_Como escolher o nome do domínio?_",
    answer:
      "_Relevância: Escolha um nome que seja relevante para o seu negócio ou projeto.Simplicidade: Opte por um nome curto e fácil de lembrar.Verifique a Disponibilidade: Use ferramentas de busca de domínios para verificar se o nome que você quer está disponível._",
  },
  
];

export function PricingFaq() {
  return (
    <section className="w-full flex  md:flex-row bg-center bg-cover bg-scroll md:bg-fixed bg-[url('/indecent-top-logo.png')] md:bg-[url('/indecent-black.png')] ">
      <HeaderSection
        label="_FAQ_"
        title="_Perguntas frequentes_"
        subtitle="_Encontre respostas rápidas para suas dúvidas._"
      />

      <Accordion type="single" collapsible className="my-12 w-full pr-[15%] pl-[15%] bg-opacity-50 shadow-purple-400">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="md:text-3xl shadow-sm shadow-purple-400 text-sm">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}


/*


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "What is the cost of the free plan?",
    answer:
      "Our free plan is completely free, with no monthly or annual charges. It's a great way to get started and explore our basic features.",
  },
  {
    id: "item-2",
    question: "How much does the Basic Monthly plan cost?",
    answer:
      "The Basic Monthly plan is priced at $15 per month. It provides access to our core features and is billed on a monthly basis.",
  },
  {
    id: "item-3",
    question: "What is the price of the Pro Monthly plan?",
    answer:
      "The Pro Monthly plan is available for $25 per month. It offers advanced features and is billed on a monthly basis for added flexibility.",
  },
  {
    id: "item-4",
    question: "Do you offer any annual subscription plans?",
    answer:
      "Yes, we offer annual subscription plans for even more savings. The Basic Annual plan is $144 per year, and the Pro Annual plan is $300 per year.",
  },
  {
    id: "item-5",
    question: "Is there a trial period for the paid plans?",
    answer:
      "We offer a 14-day free trial for both the Pro Monthly and Pro Annual plans. It's a great way to experience all the features before committing to a paid subscription.",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
        label="FAQ"
        title="Frequently Asked Questions"
        subtitle="Explore our comprehensive FAQ to find quick answers to common
          inquiries. If you need further assistance, don't hesitate to
          contact us for personalized help."
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
*/