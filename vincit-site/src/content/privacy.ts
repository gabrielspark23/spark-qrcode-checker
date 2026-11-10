/**
 * Política de Privacidade — conteúdo bilíngue.
 * Descreve apenas o que o site faz de fato (auditoria do código em 10/11/2026):
 * - formulário de contato (campos abaixo) repassado ao sistema de clientes da Vincit; o site não guarda os dados;
 * - nenhum cookie próprio, nenhum pixel de publicidade; métricas, se ativadas, agregadas e sem cookies;
 * - hospedagem na Vercel (registros técnicos); vídeo do YouTube carregado só no clique (youtube-nocookie);
 * - links para Instagram, LinkedIn e para o portal de clientes (Vincit OS), que têm políticas próprias.
 * Texto sujeito à revisão de compliance antes da publicação definitiva.
 */
export type PolicyBlock = string | { list: string[] } | { lead: string; list: string[] };
export type PolicySection = { id: string; title: string; summary: string; blocks: PolicyBlock[] };
export type PolicyContent = {
  eyebrow: string;
  title: string;
  intro: string;
  updatedLabel: string;
  updated: string;
  glanceTitle: string;
  glance: { title: string; body: string }[];
  tocLabel: string;
  sections: PolicySection[];
  contactCta: string;
};

export const privacyEn: PolicyContent = {
  eyebrow: "Privacy",
  title: "Privacy Policy",
  intro:
    "Trust is the foundation of the work we do. This policy explains, in plain language, what information this website collects, why, who it is shared with and the choices you have.",
  updatedLabel: "Last updated",
  updated: "November 10, 2026",
  glanceTitle: "At a glance",
  glance: [
    { title: "Only what you send", body: "We collect the information you choose to share through our contact form, plus basic technical data needed to run the site." },
    { title: "Never sold", body: "We do not sell your personal information or share it for advertising." },
    { title: "No tracking cookies", body: "This website does not set its own cookies and does not use advertising pixels." },
    { title: "Your choice", body: "You can ask to access, correct or delete your information at any time." },
  ],
  tocLabel: "Contents",
  sections: [
    {
      id: "scope",
      title: "Who we are and what this policy covers",
      summary: "This policy applies to this website and to the information you share through it.",
      blocks: [
        "Vincit Capital (“Vincit”, “we”, “us”) provides financial planning and related services to individuals, families and business owners with ties to Brazil and the United States. We are based in San Diego, California.",
        "This policy covers the information collected through this website, including the contact form. It does not cover the client portal (Vincit OS) or the services we provide to clients, which are governed by the agreements and privacy notices you receive when you become a client.",
      ],
    },
    {
      id: "collect",
      title: "Information we collect",
      summary: "What you give us through the form, and limited technical data.",
      blocks: [
        {
          lead: "Information you provide through the contact form:",
          list: [
            "Full name and email address",
            "Phone number (optional)",
            "Country and state of residence",
            "The topic you would like to discuss and, optionally, a range of investable assets",
            "Your preferred language and any message you write",
            "Your consent to be contacted and, if you choose, your consent to receive messages on WhatsApp, with the date and version of the consent text",
          ],
        },
        {
          lead: "Information sent automatically with the form:",
          list: [
            "The page from which you sent the form and the website that referred you, if any",
            "Campaign parameters in the page address (for example, “utm_source”), when present",
          ],
        },
        {
          lead: "Technical information:",
          list: [
            "When you visit any page, our hosting provider processes standard technical data, such as your IP address, browser type, device information and the date and time of the request, to deliver the website and keep it secure.",
          ],
        },
        "Please do not include account numbers, tax identification numbers or other sensitive financial details in the contact form. We will ask for what is needed, through secure channels, if you become a client.",
      ],
    },
    {
      id: "use",
      title: "How we use your information",
      summary: "To answer you, to improve the site and to meet our obligations.",
      blocks: [
        {
          lead: "We use the information described above to:",
          list: [
            "Respond to your request and schedule a conversation, in the language you prefer",
            "Understand which topics and services interest our visitors",
            "Operate, protect and improve this website, including preventing spam and abuse",
            "Keep records of your consent to be contacted",
            "Comply with legal, regulatory and recordkeeping obligations",
          ],
        },
        "We do not use your information for automated decisions that produce legal or similarly significant effects about you.",
      ],
    },
    {
      id: "legal-bases",
      title: "Legal bases (for people in Brazil)",
      summary: "Under the LGPD, we rely on consent, pre-contractual steps, legitimate interest and legal obligations.",
      blocks: [
        {
          lead: "When the Brazilian General Data Protection Law (LGPD) applies, we process your information based on:",
          list: [
            "Your consent, which you give when you submit the form and which you may withdraw at any time",
            "Steps taken at your request before entering into a contract with you",
            "Our legitimate interests in operating and securing this website and responding to inquiries, balanced against your rights",
            "Compliance with legal or regulatory obligations",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "How we share information",
      summary: "Only with providers who help us, and when the law requires it. Never sold.",
      blocks: [
        {
          lead: "We share personal information only in these situations:",
          list: [
            "Service providers that host this website and run our client relationship and communication systems, under obligations to protect the information and use it only to provide their services to us",
            "Professional advisers, such as attorneys and auditors, when needed",
            "Authorities, regulators or other parties when required by law, or to protect the rights, safety and property of Vincit, our clients or others",
            "A successor entity in the event of a merger, acquisition or reorganization, subject to this policy",
          ],
        },
        "We do not sell personal information, and we do not share it for cross-context behavioral advertising.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies, analytics and embedded content",
      summary: "No cookies of our own, no ad pixels. Video loads only when you press play.",
      blocks: [
        "This website does not set its own cookies and does not use advertising or social media tracking pixels.",
        "If we measure how the website is used, we do so with aggregate, cookie-free statistics that do not identify you.",
        "Our manifesto video is hosted on YouTube. It loads only when you press play, using YouTube’s privacy-enhanced mode. Once it plays, YouTube’s own privacy policy applies.",
        "Links to Instagram, LinkedIn and other websites take you to services with their own privacy practices. We encourage you to review them.",
      ],
    },
    {
      id: "transfers",
      title: "International transfers",
      summary: "Information may be processed in the United States and in Brazil.",
      blocks: [
        "Because we serve clients in Brazil and the United States, and our service providers may operate in other countries, your information may be processed outside the country where you live. When this happens, we take steps designed to ensure it remains protected in line with this policy and applicable law.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep information",
      summary: "Only as long as needed, or as the law requires.",
      blocks: [
        "We keep contact form information for as long as needed to respond to you and follow up on your request. If you become a client, your information becomes part of your client records and is kept for the periods required by applicable laws and regulations. Otherwise, we delete or anonymize it when it is no longer needed, unless we must keep it longer by law.",
      ],
    },
    {
      id: "security",
      title: "Security",
      summary: "Encryption in transit and access limited to those who need it.",
      blocks: [
        "Information sent through this website is encrypted in transit. This website does not store contact form submissions; they are forwarded to our client system, where access is limited to people who need it to do their work.",
        "No method of transmission or storage is completely secure, but we work to protect your information with administrative, technical and physical safeguards appropriate to its sensitivity.",
      ],
    },
    {
      id: "rights",
      title: "Your rights and choices",
      summary: "Access, correct, delete, withdraw consent — depending on where you live.",
      blocks: [
        {
          lead: "Depending on where you live, you may have the right to:",
          list: [
            "Know what personal information we hold about you and receive a copy",
            "Correct information that is inaccurate or incomplete",
            "Ask us to delete your information, subject to legal exceptions",
            "Withdraw your consent to be contacted, including on WhatsApp, at any time",
            "Object to or ask us to limit certain uses of your information",
          ],
        },
        {
          lead: "California residents.",
          list: [
            "Under California law, you may request to know, delete and correct personal information, and you will not be treated differently for exercising these rights. We do not sell or share personal information as those terms are defined under California law, so there is nothing to opt out of.",
          ],
        },
        {
          lead: "People in Brazil.",
          list: [
            "Under the LGPD, you may confirm whether we process your data; access, correct, anonymize, block or delete it; request portability; obtain information about sharing; and revoke consent. You may also file a complaint with the Brazilian Data Protection Authority (ANPD).",
          ],
        },
        "To make a request, contact us through the contact page. We may need to verify your identity before responding, and you may use an authorized agent where the law allows.",
      ],
    },
    {
      id: "children",
      title: "Children",
      summary: "This website is not intended for people under 18.",
      blocks: [
        "This website is intended for adults. We do not knowingly collect personal information from anyone under 18. If you believe a minor has sent us information, please contact us and we will delete it.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      summary: "We will post updates here with a new date.",
      blocks: [
        "We may update this policy from time to time. When we do, we will change the “Last updated” date at the top of this page. If the changes are significant, we will take reasonable steps to let you know.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      summary: "Questions or requests about your information.",
      blocks: [
        "If you have questions about this policy or want to exercise your rights, please reach us through our contact page. Vincit Capital, San Diego, California.",
      ],
    },
  ],
  contactCta: "Contact us about privacy",
};

export const privacyPt: PolicyContent = {
  eyebrow: "Privacidade",
  title: "Política de Privacidade",
  intro:
    "Confiança é a base do nosso trabalho. Esta política explica, em linguagem simples, quais informações este site coleta, por quê, com quem são compartilhadas e quais são as suas escolhas.",
  updatedLabel: "Última atualização",
  updated: "10 de novembro de 2026",
  glanceTitle: "Em resumo",
  glance: [
    { title: "Só o que você envia", body: "Coletamos as informações que você escolhe compartilhar pelo formulário de contato, além de dados técnicos básicos para o site funcionar." },
    { title: "Nunca vendidos", body: "Não vendemos suas informações pessoais nem as compartilhamos para publicidade." },
    { title: "Sem cookies de rastreamento", body: "Este site não grava cookies próprios e não usa pixels de publicidade." },
    { title: "A escolha é sua", body: "Você pode pedir acesso, correção ou exclusão das suas informações a qualquer momento." },
  ],
  tocLabel: "Índice",
  sections: [
    {
      id: "scope",
      title: "Quem somos e o que esta política cobre",
      summary: "Esta política vale para este site e para as informações que você compartilha por ele.",
      blocks: [
        "A Vincit Capital (“Vincit”, “nós”) oferece planejamento financeiro e serviços relacionados a pessoas, famílias e empresários com vínculos entre o Brasil e os Estados Unidos. Estamos em San Diego, Califórnia.",
        "Esta política cobre as informações coletadas por este site, incluindo o formulário de contato. Ela não cobre o portal de clientes (Vincit OS) nem os serviços prestados a clientes, que seguem os contratos e os avisos de privacidade entregues quando você se torna cliente.",
      ],
    },
    {
      id: "collect",
      title: "Informações que coletamos",
      summary: "O que você nos envia pelo formulário e dados técnicos limitados.",
      blocks: [
        {
          lead: "Informações que você fornece pelo formulário de contato:",
          list: [
            "Nome completo e e-mail",
            "Telefone (opcional)",
            "País e estado de residência",
            "O assunto que deseja conversar e, opcionalmente, uma faixa de patrimônio investível",
            "Idioma de preferência e a mensagem que você escrever",
            "Seu consentimento para ser contatado e, se você escolher, para receber mensagens pelo WhatsApp, com a data e a versão do texto de consentimento",
          ],
        },
        {
          lead: "Informações enviadas automaticamente com o formulário:",
          list: [
            "A página de onde você enviou o formulário e o site que o trouxe até aqui, se houver",
            "Parâmetros de campanha no endereço da página (por exemplo, “utm_source”), quando existirem",
          ],
        },
        {
          lead: "Informações técnicas:",
          list: [
            "Ao visitar qualquer página, nosso provedor de hospedagem processa dados técnicos padrão, como endereço IP, tipo de navegador, informações do dispositivo e data e hora do acesso, para entregar o site e mantê-lo seguro.",
          ],
        },
        "Não inclua números de conta, CPF, SSN ou outros dados financeiros sensíveis no formulário. Se você se tornar cliente, pediremos o necessário por canais seguros.",
      ],
    },
    {
      id: "use",
      title: "Como usamos as informações",
      summary: "Para responder você, melhorar o site e cumprir nossas obrigações.",
      blocks: [
        {
          lead: "Usamos as informações acima para:",
          list: [
            "Responder ao seu pedido e agendar uma conversa, no idioma de sua preferência",
            "Entender quais assuntos e serviços interessam aos visitantes",
            "Operar, proteger e melhorar este site, incluindo a prevenção de spam e abuso",
            "Manter o registro do seu consentimento para contato",
            "Cumprir obrigações legais, regulatórias e de guarda de registros",
          ],
        },
        "Não usamos suas informações em decisões automatizadas que produzam efeitos jurídicos ou igualmente relevantes sobre você.",
      ],
    },
    {
      id: "legal-bases",
      title: "Bases legais (para quem está no Brasil)",
      summary: "Pela LGPD, usamos consentimento, procedimentos preliminares, legítimo interesse e obrigação legal.",
      blocks: [
        {
          lead: "Quando a Lei Geral de Proteção de Dados (LGPD) se aplica, tratamos suas informações com base em:",
          list: [
            "Seu consentimento, dado ao enviar o formulário e que pode ser revogado a qualquer momento",
            "Procedimentos preliminares a um contrato, feitos a seu pedido",
            "Nosso legítimo interesse em operar e proteger este site e responder contatos, sempre equilibrado com os seus direitos",
            "O cumprimento de obrigações legais ou regulatórias",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "Com quem compartilhamos",
      summary: "Só com quem nos ajuda a prestar o serviço e quando a lei exige. Nunca vendemos.",
      blocks: [
        {
          lead: "Compartilhamos informações pessoais apenas nestas situações:",
          list: [
            "Prestadores de serviço que hospedam este site e operam nossos sistemas de relacionamento e comunicação com clientes, obrigados a proteger as informações e a usá-las só para nos prestar o serviço",
            "Assessores profissionais, como advogados e auditores, quando necessário",
            "Autoridades, reguladores ou terceiros quando a lei exigir, ou para proteger direitos, segurança e bens da Vincit, de clientes ou de outras pessoas",
            "Uma sucessora em caso de fusão, aquisição ou reorganização, respeitando esta política",
          ],
        },
        "Não vendemos informações pessoais nem as compartilhamos para publicidade comportamental.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies, métricas e conteúdo incorporado",
      summary: "Sem cookies próprios, sem pixels de publicidade. O vídeo só carrega no play.",
      blocks: [
        "Este site não grava cookies próprios e não usa pixels de rastreamento de publicidade ou de redes sociais.",
        "Se medirmos o uso do site, faremos isso com estatísticas agregadas e sem cookies, que não identificam você.",
        "O vídeo do nosso manifesto está no YouTube. Ele só carrega quando você aperta o play, no modo de privacidade aprimorada do YouTube. A partir daí, vale a política de privacidade do próprio YouTube.",
        "Os links para Instagram, LinkedIn e outros sites levam a serviços com práticas de privacidade próprias. Recomendamos consultá-las.",
      ],
    },
    {
      id: "transfers",
      title: "Transferências internacionais",
      summary: "As informações podem ser tratadas nos Estados Unidos e no Brasil.",
      blocks: [
        "Como atendemos clientes no Brasil e nos Estados Unidos, e nossos prestadores podem operar em outros países, suas informações podem ser tratadas fora do país onde você mora. Nesses casos, adotamos medidas para que continuem protegidas de acordo com esta política e com a lei aplicável.",
      ],
    },
    {
      id: "retention",
      title: "Por quanto tempo guardamos",
      summary: "Só pelo tempo necessário, ou pelo que a lei exigir.",
      blocks: [
        "Guardamos as informações do formulário pelo tempo necessário para responder e acompanhar o seu pedido. Se você se tornar cliente, elas passam a fazer parte do seu cadastro e são mantidas pelos prazos exigidos pelas leis e normas aplicáveis. Caso contrário, nós as excluímos ou anonimizamos quando não forem mais necessárias, salvo obrigação legal de guarda.",
      ],
    },
    {
      id: "security",
      title: "Segurança",
      summary: "Criptografia em trânsito e acesso restrito a quem precisa.",
      blocks: [
        "As informações enviadas por este site são criptografadas em trânsito. O site não armazena os envios do formulário; eles seguem para o nosso sistema de clientes, onde o acesso é restrito às pessoas que precisam deles para trabalhar.",
        "Nenhum meio de transmissão ou armazenamento é totalmente seguro, mas protegemos suas informações com medidas administrativas, técnicas e físicas adequadas à sua sensibilidade.",
      ],
    },
    {
      id: "rights",
      title: "Seus direitos e escolhas",
      summary: "Acessar, corrigir, excluir, revogar o consentimento — conforme onde você mora.",
      blocks: [
        {
          lead: "Conforme o lugar onde você mora, você pode ter o direito de:",
          list: [
            "Saber quais informações pessoais temos sobre você e receber uma cópia",
            "Corrigir informações inexatas ou incompletas",
            "Pedir a exclusão das suas informações, respeitadas as exceções legais",
            "Revogar o consentimento para contato, inclusive pelo WhatsApp, a qualquer momento",
            "Se opor a certos usos das suas informações ou pedir que sejam limitados",
          ],
        },
        {
          lead: "Residentes da Califórnia.",
          list: [
            "Pela lei da Califórnia, você pode pedir para saber, excluir e corrigir informações pessoais, sem tratamento diferente por exercer esses direitos. Não vendemos nem compartilhamos informações pessoais nos termos definidos por essa lei, então não há do que optar por sair.",
          ],
        },
        {
          lead: "Pessoas no Brasil.",
          list: [
            "Pela LGPD, você pode confirmar se tratamos seus dados; acessá-los, corrigi-los, anonimizá-los, bloqueá-los ou eliminá-los; pedir a portabilidade; saber com quem foram compartilhados; e revogar o consentimento. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).",
          ],
        },
        "Para fazer um pedido, fale conosco pela página de contato. Talvez precisemos confirmar a sua identidade antes de responder, e você pode usar um representante autorizado quando a lei permitir.",
      ],
    },
    {
      id: "children",
      title: "Menores de idade",
      summary: "Este site não se destina a menores de 18 anos.",
      blocks: [
        "Este site é destinado a adultos. Não coletamos intencionalmente informações de menores de 18 anos. Se você acredita que um menor nos enviou informações, fale conosco e nós as excluiremos.",
      ],
    },
    {
      id: "changes",
      title: "Mudanças nesta política",
      summary: "Publicaremos as atualizações aqui, com nova data.",
      blocks: [
        "Podemos atualizar esta política periodicamente. Quando isso acontecer, mudaremos a data de “Última atualização” no topo desta página. Se as mudanças forem relevantes, tomaremos medidas razoáveis para avisar você.",
      ],
    },
    {
      id: "contact",
      title: "Fale conosco",
      summary: "Dúvidas ou pedidos sobre as suas informações.",
      blocks: [
        "Se tiver dúvidas sobre esta política ou quiser exercer seus direitos, fale conosco pela página de contato. Vincit Capital, San Diego, Califórnia.",
      ],
    },
  ],
  contactCta: "Fale conosco sobre privacidade",
};
