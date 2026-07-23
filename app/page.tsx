"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP_NUMBER = "555533117142";

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue?: unknown[];
    loaded?: boolean;
    version?: string;
  };
};

type MenuCategory = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  availability: string;
  message: string;
  image: string;
  imageAlt: string;
  items: Array<{
    name: string;
    detail: string;
    price: string;
    image: string;
    imageAlt: string;
  }>;
};

const menuCategories: MenuCategory[] = [
  {
    id: "galeto",
    eyebrow: "Para levar e preparar em casa",
    title: "Galeto temperado",
    description:
      "O galeto sai do Empório cru, já temperado e pronto para ir ao forno ou à churrasqueira. Fica disponível durante o horário da loja e também pode ser encomendado em quantidade.",
    availability: "Durante o horário da loja",
    message:
      "Olá! Quero saber o valor e a disponibilidade do galeto temperado. Preciso de [quantidade] unidades.",
    image: "/images/linguicas-selecionadas-poster.jpg",
    imageAlt: "Produtos embalados do Empório",
    items: [
      {
        name: "Galeto cru temperado",
        detail: "Pronto para assar em casa. Informe a quantidade desejada.",
        price: "Consulte o valor",
        image: "/images/linguicas-selecionadas-poster.jpg",
        imageAlt: "Produtos embalados do Empório",
      },
    ],
  },
  {
    id: "frango",
    eyebrow: "Almoço de fim de semana",
    title: "Frango assado",
    description:
      "O frango inteiro sai assado e acompanha polenta. Faça a reserva e combine o horário de retirada; a confirmação depende da disponibilidade do lote.",
    availability: "Sábados, domingos e feriados, no almoço",
    message:
      "Olá! Vim pelo site e quero reservar um frango assado. Quais opções e horários de retirada estão disponíveis?",
    image: "/images/hero-frango-inteiro-v2.webp",
    imageAlt: "Frango inteiro assado e dourado",
    items: [
      {
        name: "Frango assado com polenta",
        detail: "Frango inteiro assado. Combine o horário de retirada.",
        price: "R$ 70,00",
        image: "/images/hero-frango-inteiro-v2.webp",
        imageAlt: "Frango inteiro assado e dourado",
      },
    ],
  },
  {
    id: "almoco",
    eyebrow: "De terça a sexta",
    title: "Marmitex",
    description:
      "O almoço começa às 11h30. O cardápio do dia vai para os stories e para o status do WhatsApp, onde você confirma o prato antes de buscar.",
    availability: "Terça a sexta, a partir das 11h30",
    message:
      "Olá! Vim pelo site e quero consultar o cardápio do almoço de hoje e o horário de retirada.",
    image: "/images/marmitex-almoco-v2.jpg",
    imageAlt: "Marmitex com refeição completa",
    items: [
      {
        name: "Marmitex média",
        detail: "O prato muda conforme o cardápio do dia.",
        price: "R$ 19,50",
        image: "/images/marmitex-almoco-v2.jpg",
        imageAlt: "Marmitex média com refeição completa",
      },
      {
        name: "Marmitex grande",
        detail: "O prato muda conforme o cardápio do dia.",
        price: "R$ 22,50",
        image: "/images/marmitex-almoco-v2.jpg",
        imageAlt: "Marmitex grande com refeição completa",
      },
    ],
  },
  {
    id: "acougue",
    eyebrow: "Cortes para preparar em casa",
    title: "Cortes & balcão",
    description:
      "Sobrecoxa, coxinha da asa, tulipa, coração e linguiças são vendidos crus. As fotos mostram sugestões de preparo para cada corte.",
    availability: "Durante o horário da loja",
    message:
      "Olá! Vim pelo site e quero saber quais cortes e produtos do balcão estão disponíveis hoje.",
    image: "/images/linguicas-selecionadas-poster.jpg",
    imageAlt: "Produtos selecionados do balcão",
    items: [
      {
        name: "Sobrecoxa",
        detail: "Corte cru vendido por kg.",
        price: "Consulte",
        image: "/images/sobrecoxa-preparo.webp",
        imageAlt: "Sobrecoxas assadas como sugestão de preparo",
      },
      {
        name: "Coxinha da asa",
        detail: "Corte cru vendido por kg.",
        price: "Consulte",
        image: "/images/coxinhas-assadas.webp",
        imageAlt: "Coxinhas da asa assadas como sugestão de preparo",
      },
      {
        name: "Tulipa",
        detail: "Corte cru vendido por kg.",
        price: "Consulte",
        image: "/images/asas-assadas.webp",
        imageAlt: "Tulipas assadas como sugestão de preparo",
      },
      {
        name: "Coração",
        detail: "Produto cru vendido no balcão.",
        price: "Consulte",
        image: "/images/coracao-preparo.webp",
        imageAlt: "Corações grelhados como sugestão de preparo",
      },
      {
        name: "Linguiças",
        detail: "Opções para assar em casa.",
        price: "Consulte",
        image: "/images/linguicas-selecionadas-poster.jpg",
        imageAlt: "Linguiças selecionadas disponíveis no balcão",
      },
    ],
  },
  {
    id: "acompanhamentos",
    eyebrow: "Para acompanhar o frango assado",
    title: "Acompanhamentos",
    description:
      "Maionese e polenta extra são preparadas para o almoço de sábado, domingo e feriado. As porções são vendidas separadamente.",
    availability: "Sábados, domingos e feriados, no almoço",
    message:
      "Olá! Quero consultar maionese e polenta para completar meu pedido.",
    image: "/images/maionese-polenta-v6.jpg",
    imageAlt: "Maionese caseira e polenta dourada",
    items: [
      { name: "Maionese 400 g", detail: "Porção vendida separadamente.", price: "R$ 14,00", image: "/images/maionese-polenta-v6.jpg", imageAlt: "Maionese caseira servida em porção" },
      { name: "Polenta extra", detail: "Porção com 7 pedaços.", price: "R$ 5,00", image: "/images/maionese-polenta-v6.jpg", imageAlt: "Polenta grossa e dourada servida como acompanhamento" },
    ],
  },
  {
    id: "risoto",
    eyebrow: "Almoço de fim de semana",
    title: "Risoto",
    description:
      "O risoto tradicional é preparado para o almoço de sábado, domingo e feriado. A porção de 900 g é vendida separadamente e tem produção limitada.",
    availability: "Sábados, domingos e feriados, no almoço",
    message:
      "Olá! Quero consultar o risoto disponível hoje para completar meu pedido.",
    image: "/images/risoto-v2.jpg",
    imageAlt: "Risoto tradicional servido em porção",
    items: [
      { name: "Risoto tradicional", detail: "Porção de 900 g.", price: "R$ 23,00", image: "/images/risoto-v2.jpg", imageAlt: "Risoto tradicional servido em porção" },
    ],
  },
  {
    id: "mercado",
    eyebrow: "Pão saindo do forno às 16h",
    title: "Pão & conveniência",
    description:
      "O pão cacetinho sai às 16h nos dias de produção. No balcão também há bebidas e itens de conveniência para completar a compra.",
    availability: "Pão às 16h; confirme os dias",
    message:
      "Olá! Quero consultar as bebidas, pães e itens de conveniência disponíveis hoje.",
    image: "/images/pao-fresquinho.webp",
    imageAlt: "Pães frescos e dourados",
    items: [
      { name: "Pão cacetinho", detail: "Sai às 16h nos dias de produção.", price: "Consulte", image: "/images/pao-fresquinho.webp", imageAlt: "Pães frescos recém-assados" },
      { name: "Bebidas e conveniência", detail: "Refrigerantes, bebidas e itens para completar sua compra.", price: "Consulte", image: "/images/acompanhamentos.webp", imageAlt: "Itens para completar a refeição" },
    ],
  },
];

const generalMessage =
  "Olá! Vim pelo site do Empório do Frango e quero fazer um pedido. Pode me enviar as opções disponíveis?";

const heroMessage =
  "Olá! Vim pelo site do Empório do Frango e quero saber o que está disponível hoje.";

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function sendEvent(name: string, parameters: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const trackingWindow = window as TrackingWindow;
  const attribution = sessionStorage.getItem("emporio_attribution");
  let payload: Record<string, string | number> = parameters;
  if (attribution) {
    try {
      payload = { ...parameters, ...JSON.parse(attribution) };
    } catch {
      sessionStorage.removeItem("emporio_attribution");
    }
  }

  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.dataLayer.push({ event: name, ...payload });
  trackingWindow.gtag?.("event", name, payload);

  if (name === "whatsapp_click") {
    trackingWindow.fbq?.("track", "Contact", payload);
  } else {
    trackingWindow.fbq?.("trackCustom", name, payload);
  }
}

function WhatsAppLink({
  message,
  interest,
  placement,
  className,
  children,
}: {
  message: string;
  interest: string;
  placement: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className={className}
      href={whatsappUrl(message)}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        sendEvent("whatsapp_click", {
          placement,
          interest,
          message_variant: interest,
        });
        if (interest === "encomenda_antecipada") {
          sendEvent("advance_order_click", { placement });
        }
      }}
      aria-label={`${typeof children === "string" ? children : "Falar no WhatsApp"} — abre em uma nova janela`}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function TrackingConsent() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const hasTracking = Boolean(gaId || metaPixelId);
  const [consent, setConsent] = useState<"unknown" | "accepted" | "declined">(
    "unknown",
  );

  useEffect(() => {
    if (!hasTracking) return;
    const stored = localStorage.getItem("emporio_analytics_consent");
    if (stored !== "accepted" && stored !== "declined") return;
    const frame = window.requestAnimationFrame(() => setConsent(stored));
    return () => window.cancelAnimationFrame(frame);
  }, [hasTracking]);

  useEffect(() => {
    if (!hasTracking || consent !== "accepted") return;
    const trackingWindow = window as TrackingWindow;

    if (gaId && !document.querySelector(`[data-ga4="${gaId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.ga4 = gaId;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);
      trackingWindow.dataLayer = trackingWindow.dataLayer || [];
      trackingWindow.gtag = (...args: unknown[]) =>
        trackingWindow.dataLayer?.push(args);
      trackingWindow.gtag("js", new Date());
      trackingWindow.gtag("config", gaId, { anonymize_ip: true });
    }

    if (metaPixelId && !document.querySelector(`[data-meta-pixel="${metaPixelId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.metaPixel = metaPixelId;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);

      const fbq = ((...args: unknown[]) => {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue?.push(args);
      }) as TrackingWindow["fbq"];
      if (fbq) {
        fbq.queue = [];
        fbq.loaded = true;
        fbq.version = "2.0";
        trackingWindow.fbq = fbq;
        trackingWindow.fbq("init", metaPixelId);
        trackingWindow.fbq("track", "PageView");
      }
    }
  }, [consent, gaId, hasTracking, metaPixelId]);

  if (!hasTracking || consent !== "unknown") return null;

  const updateConsent = (value: "accepted" | "declined") => {
    localStorage.setItem("emporio_analytics_consent", value);
    setConsent(value);
  };

  return (
    <aside className="consent" aria-label="Preferências de privacidade">
      <div>
        <strong>Sua privacidade importa.</strong>
        <p>
          Usamos métricas para entender o desempenho da página. Você pode
          aceitar ou continuar apenas com o essencial.
        </p>
      </div>
      <div className="consent-actions">
        <button type="button" onClick={() => updateConsent("declined")}>
          Somente essenciais
        </button>
        <button
          type="button"
          className="consent-accept"
          onClick={() => updateConsent("accepted")}
        >
          Aceitar métricas
        </button>
      </div>
    </aside>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("galeto");
  const currentCategory = useMemo(
    () => menuCategories.find((category) => category.id === activeCategory)!,
    [activeCategory],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const attribution = Object.fromEntries(
      keys
        .map((key) => [key, params.get(key)])
        .filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    if (Object.keys(attribution).length) {
      sessionStorage.setItem("emporio_attribution", JSON.stringify(attribution));
    }
  }, []);

  useEffect(() => {
    const reached = new Set<number>();
    const thresholds = [25, 50, 75, 90];
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((window.scrollY / scrollable) * 100);
      thresholds.forEach((threshold) => {
        if (percent >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          sendEvent("scroll_depth", { percent_scrolled: threshold });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const selectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    sendEvent("category_select", { category_name: categoryId });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Empório do Frango",
    url: "https://emporiodofrango.com.br/",
    description:
      "Rotisserie com galeto cru temperado, frango assado de fim de semana e almoço em Santa Maria.",
    image: "https://emporiodofrango.com.br/images/hero-frango-inteiro-v2.webp",
    foundingDate: "2022",
    taxID: "45.883.258/0001-11",
    telephone: "+55 55 3311-7142",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Venâncio Aires, 470",
      addressLocality: "Santa Maria",
      addressRegion: "RS",
      postalCode: "97010-005",
      addressCountry: "BR",
    },
    areaServed: "Santa Maria, RS",
    sameAs: [
      "https://www.instagram.com/emporiodofrangosm/",
      "https://www.facebook.com/emporiodofrangosm/",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Monday",
        opens: "16:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "https://schema.org/Tuesday",
          "https://schema.org/Wednesday",
          "https://schema.org/Thursday",
          "https://schema.org/Friday",
        ],
        opens: "09:00",
        closes: "12:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "https://schema.org/Tuesday",
          "https://schema.org/Wednesday",
          "https://schema.org/Thursday",
          "https://schema.org/Friday",
        ],
        opens: "16:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Saturday",
        opens: "09:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Saturday",
        opens: "16:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Sunday",
        opens: "08:30",
        closes: "13:30",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Empório do Frango — início">
          <img src="/emporio-logo.svg" alt="Empório do Frango Rotisserie" />
        </a>
        <nav aria-label="Navegação principal">
          <a href="#cardapio">Cardápio</a>
          <a href="#galeria">Galeria</a>
          <a href="#pao">Pão 16h</a>
          <a href="#horarios">Horários</a>
          <a href="#localizacao">Localização</a>
        </nav>
        <WhatsAppLink
          className="button button-small"
          message={generalMessage}
          interest="geral"
          placement="header"
        >
          Fazer pedido
        </WhatsAppLink>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="kicker">Rotisserie no Centro de Santa Maria</p>
            <h1>
              Sua refeição começa <em>no Empório.</em>
            </h1>
            <p className="hero-lead">
              Aqui você encontra opções para levar e preparar em
              casa, além de refeições prontas para retirar nos dias de produção.
              Fale com a equipe e veja o que está disponível hoje.
            </p>
            <div className="hero-actions">
              <WhatsAppLink
                className="button button-primary"
                message={heroMessage}
                interest="geral"
                placement="hero"
              >
                Falar com o Empório
              </WhatsAppLink>
              <a className="text-link" href="#cardapio">
                Ver cardápio <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">
              Para encomendas, informe o dia e a quantidade desejada.
            </p>
          </div>

          <div className="hero-media">
            <img
              src="/images/hero-frango-margens.webp"
              alt="Frango inteiro assado e dourado"
              width="1440"
              height="960"
              loading="eager"
              fetchPriority="high"
            />
            <div className="hero-stamp" aria-label="Empório em atividade desde 2022">
              <strong>Desde</strong>
              <span>2022</span>
            </div>
            <div className="hero-caption">
              <span>Desde 2022</span>
              <strong>Centro de Santa Maria</strong>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Diferenciais">
          <div><strong>Desde 2022</strong><span>no Centro de Santa Maria</span></div>
          <a href="#seguranca-alimentar"><strong>Inspeção municipal</strong><span>produção registrada no SIM</span></a>
          <div><strong>Galeto temperado</strong><span>durante o horário da loja</span></div>
          <div><strong>Frango assado</strong><span>fim de semana e feriados</span></div>
        </section>

        <section className="section intent-section" id="categorias" aria-labelledby="intent-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Do balcão ao almoço</p>
              <h2 id="intent-title">O que tem no Empório.</h2>
            </div>
            <p>
              A produção muda ao longo da semana. Consulte os dias, horários e
              valores antes de fazer o pedido.
            </p>
          </div>

          <div className="intent-grid">
            {menuCategories.filter((category) => category.id !== "acougue").map((category, index) => (
              <a
                className={`intent-card intent-card-${index + 1}`}
                href="#cardapio"
                key={category.id}
                onClick={() => selectCategory(category.id)}
              >
                <span
                  className="intent-card-media"
                  style={{ backgroundImage: `url(${category.image})` }}
                  aria-hidden="true"
                />
                <span className="intent-index">0{index + 1}</span>
                <div>
                  <strong>{category.title}</strong>
                  <small>{category.availability}</small>
                </div>
                <span className="intent-arrow" aria-hidden="true">↘</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section menu-section" id="cardapio" aria-labelledby="menu-title">
          <div className="section-heading section-heading-dark">
            <div>
              <p className="kicker">Cardápio</p>
              <h2 id="menu-title">Produtos, dias e valores.</h2>
            </div>
          </div>

          <div className="menu-tabs" role="tablist" aria-label="Categorias do cardápio">
            {menuCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                aria-controls="menu-panel"
                className={activeCategory === category.id ? "active" : ""}
                onClick={() => selectCategory(category.id)}
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="menu-panel" id="menu-panel" role="tabpanel">
            <div className="menu-intro">
              <p className="menu-eyebrow">{currentCategory.eyebrow}</p>
              <h3 className={currentCategory.title.length > 13 ? "menu-title-long" : ""}>
                {currentCategory.title}
              </h3>
              <p>{currentCategory.description}</p>
              <span className="availability">{currentCategory.availability}</span>
              <WhatsAppLink
                className="button button-primary"
                message={currentCategory.message}
                interest={currentCategory.id}
                placement="menu_panel"
              >
                Consultar no WhatsApp
              </WhatsAppLink>
            </div>

            <div className="menu-items">
              {currentCategory.items.map((item) => (
                <article className="menu-item" key={item.name}>
                  <img src={item.image} alt={item.imageAlt} width="88" height="88" loading="lazy" />
                  <div className="menu-item-copy">
                    <h4>{item.name}</h4>
                    <p>{item.detail}</p>
                  </div>
                  <strong>{item.price}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section complete-section" aria-labelledby="complete-title">
          <div className="complete-copy">
            <p className="kicker">Almoço de fim de semana</p>
            <h2 id="complete-title">Frango assado com polenta.</h2>
            <p>
              Maionese, polenta extra e risoto são vendidos separadamente aos
              sábados, domingos e feriados.
            </p>
            <WhatsAppLink
              className="button button-dark"
              message={menuCategories[4].message}
              interest="acompanhamentos"
              placement="complete_order"
            >
              Ver acompanhamentos
            </WhatsAppLink>
          </div>
          <div className="complete-steps" aria-label="Valores do almoço de fim de semana">
            <div><span>01</span><strong>Frango assado com polenta</strong><small>R$ 70,00</small></div>
            <div><span>02</span><strong>Maionese 400 g</strong><small>R$ 14,00</small></div>
            <div><span>03</span><strong>Risoto e polenta extra</strong><small>R$ 23,00 e R$ 5,00</small></div>
          </div>
        </section>

        <section className="bread-section" id="pao" aria-labelledby="bread-title">
          <div className="bread-media">
            <img src="/images/pao-fresquinho.webp" alt="Pães fresquinhos recém-assados" width="1448" height="1086" loading="lazy" />
            <div className="bread-clock" aria-label="Pão fresco às 16 horas nos dias de produção">
              <span>Sai às</span>
              <strong>16h</strong>
            </div>
          </div>
          <div className="bread-copy">
            <p className="kicker">Pão cacetinho</p>
            <h2 id="bread-title">Às 16h, o pão sai do forno.</h2>
            <p>
              Nos dias de produção, o pão fica pronto às 16h. Se quiser deixar
              reservado, confirme o dia com a equipe antes de sair.
            </p>
          </div>
          <WhatsAppLink
            className="button button-dark"
            message="Olá! Vim pelo site e quero reservar pão fresquinho para retirar às 16h."
            interest="pao_fresco"
            placement="bread_highlight"
          >
            Reservar pão
          </WhatsAppLink>
        </section>

        <section className="quality-section" id="seguranca-alimentar" aria-labelledby="quality-title">
          <div className="quality-media">
            <img
              src="/images/linguicas-selecionadas-poster.jpg"
              alt="Produtos embalados do Empório"
              width="1200"
              height="1600"
              loading="lazy"
            />
          </div>
          <div className="quality-copy">
            <p className="kicker kicker-light">Produção acompanhada pelo SIM</p>
            <h2 id="quality-title">Sete meses de adequação para trabalhar com carnes temperadas.</h2>
            <p>
              O Empório está entre os primeiros estabelecimentos de Santa Maria
              regularizados pelo Serviço de Inspeção Municipal para produzir e
              vender carnes temperadas. O processo envolveu adequações na
              estrutura, vistorias e controles de produção.
            </p>
            <div className="sanitary-badge">
              <strong>Registro no Serviço de Inspeção Municipal</strong>
              <span>Produção e venda de carnes temperadas com acompanhamento e fiscalização.</span>
            </div>
            <ul>
              <li><span>01</span>Responsável técnica veterinária</li>
              <li><span>02</span>Sala de assepsia</li>
              <li><span>03</span>Ambiente climatizado</li>
              <li><span>04</span>Maquinário específico</li>
            </ul>
            <p className="safety-note">
              Essa estrutura permite que o galeto saia do Empório já temperado,
              pronto para você preparar em casa.
            </p>
          </div>
        </section>

        <section className="section preorder-section" aria-labelledby="preorder-title">
          <div className="preorder-heading">
            <p className="kicker">Frango assado no fim de semana</p>
            <h2 id="preorder-title">Antecipe a reserva e combine a retirada.</h2>
          </div>
          <ol className="preorder-list">
            <li><span>1</span><div><strong>Chame na quinta ou sexta</strong><p>Informe o dia e quantos frangos assados deseja.</p></div></li>
            <li><span>2</span><div><strong>Aguarde a confirmação</strong><p>A equipe verifica o lote e os horários disponíveis.</p></div></li>
            <li><span>3</span><div><strong>Retire no horário combinado</strong><p>A reserva fica garantida depois da confirmação da equipe.</p></div></li>
          </ol>
          <WhatsAppLink
            className="button button-dark"
            message="Olá! Vim pelo site e quero fazer uma encomenda antecipada."
            interest="encomenda_antecipada"
            placement="preorder"
          >
            Fazer encomenda antecipada
          </WhatsAppLink>
        </section>

        <section className="section gallery-section" id="galeria" aria-labelledby="gallery-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Da cozinha e do balcão</p>
              <h2 id="gallery-title">O que você encontra no Empório.</h2>
            </div>
          </div>
          <div className="gallery-showcase">
            <figure className="gallery-video">
              <video
                autoPlay
                controls
                loop
                muted
                playsInline
                preload="metadata"
                poster="/images/linguicas-selecionadas-poster.jpg"
                aria-label="Vídeo mostrando opções de linguiças selecionadas"
              >
                <source src="/videos/linguicas-selecionadas.mp4" type="video/mp4" />
                Seu navegador não oferece suporte à reprodução de vídeo.
              </video>
              <figcaption>Linguiças selecionadas</figcaption>
            </figure>

            <div className="gallery-grid">
              <figure>
                <img src="/images/hero-frango-inteiro-v2.webp" alt="Frango inteiro assado e dourado em superfície limpa" width="1200" height="800" loading="lazy" decoding="async" />
                <figcaption>Frango assado</figcaption>
              </figure>
              <figure>
                <img src="/images/marmitex-almoco-v2.jpg" alt="Marmitex com refeição completa" width="1600" height="1067" loading="lazy" decoding="async" />
                <figcaption>Marmitex</figcaption>
              </figure>
              <figure>
                <img src="/images/maionese-polenta-v6.jpg" alt="Maionese caseira e polenta grossa" width="1536" height="1024" loading="lazy" decoding="async" />
                <figcaption>Maionese e polenta</figcaption>
              </figure>
              <figure>
                <img src="/images/pao-fresquinho.webp" alt="Pães fresquinhos recém-assados" width="1448" height="1086" loading="lazy" decoding="async" />
                <figcaption>Pão 16h</figcaption>
              </figure>
              <figure>
                <img src="/images/risoto-v2.jpg" alt="Risoto tradicional servido em porção" width="1536" height="1024" loading="lazy" decoding="async" />
                <figcaption>Risoto 900 g</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="section hours-section" id="horarios" aria-labelledby="hours-title">
          <div className="hours-heading">
            <div>
              <p className="kicker">Antes de sair de casa</p>
              <h2 id="hours-title">Confira o horário da loja e o que está saindo.</h2>
            </div>
            <div className="hours-action">
              <p>
                A loja tem um horário geral, mas o frango assado, o almoço e o
                pão seguem dias próprios de produção.
              </p>
              <WhatsAppLink
                className="button button-primary"
                message="Olá! Quero confirmar os horários e a disponibilidade dos produtos de hoje."
                interest="horarios"
                placement="hours"
              >
                Confirmar disponibilidade
              </WhatsAppLink>
            </div>
          </div>

          <div className="hours-content">
            <div className="opening-hours">
              <div className="opening-hours-header">
                <h3>Horários de atendimento</h3>
                <span>Rua Venâncio Aires, 470</span>
              </div>
              <dl>
                <div><dt>Segunda</dt><dd>16h — 21h</dd></div>
                <div><dt>Terça a sexta</dt><dd>9h — 12h30<br />16h — 21h</dd></div>
                <div><dt>Sábado</dt><dd>9h — 13h30<br />16h — 20h</dd></div>
                <div><dt>Domingo</dt><dd>8h30 — 13h30</dd></div>
              </dl>
            </div>
            <div className="operation-hours">
              <article><span>Galeto temperado</span><strong>Durante o horário da loja</strong></article>
              <article><span>Frango assado</span><strong>Sábados, domingos e feriados</strong></article>
              <article><span>Almoço</span><strong>Terça a sexta, a partir das 11h30</strong></article>
              <article><span>Feriados</span><strong>Frango e acompanhamentos no almoço; confirme o atendimento</strong></article>
              <article className="bread-hour"><span>Pão cacetinho</span><strong>Às 16h, nos dias de produção</strong></article>
              <p>Os produtos do balcão e da conveniência acompanham o horário geral da loja.</p>
            </div>
          </div>
        </section>

        <section className="section routes-section" aria-labelledby="routes-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Pedido, retirada e entrega</p>
              <h2 id="routes-title">Fale com a equipe antes de sair.</h2>
            </div>
            <p>Pelo WhatsApp, você confirma o produto, o valor e o horário de retirada.</p>
          </div>
          <div className="routes-grid">
            <article>
              <span>01</span>
              <h3>Pedido pelo WhatsApp</h3>
              <p>É o canal central para encomendas, cardápio do dia e confirmação de disponibilidade.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Retirada combinada</h3>
              <p>Defina o horário e retire seu pedido na Rua Venâncio Aires, 470.</p>
            </article>
            <article>
              <span>03</span>
              <h3>iFood</h3>
              <p>Funciona principalmente nos fins de semana e, hoje, está concentrado no frango.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Entrega</h3>
              <p>A cobertura e a taxa dependem do endereço. Confirme antes de fechar o pedido.</p>
            </article>
          </div>
        </section>

        <section className="location-section" id="localizacao" aria-labelledby="location-title">
          <div className="location-copy">
            <p className="kicker kicker-light">No Centro de Santa Maria</p>
            <h2 id="location-title">Passe no Empório.</h2>
            <address>
              Rua Venâncio Aires, 470<br />
              Centro · Santa Maria/RS<br />
              CEP 97010-005
            </address>
            <div className="location-actions">
              <a
                className="button button-primary"
                href="https://www.google.com/maps/search/?api=1&query=Rua%20Ven%C3%A2ncio%20Aires%2C%20470%2C%20Santa%20Maria%2C%20RS"
                target="_blank"
                rel="noreferrer"
                onClick={() => sendEvent("directions_click", { placement: "location" })}
              >
                Como chegar <span aria-hidden="true">↗</span>
              </a>
              <a
                className="phone-link"
                href="tel:+555533117142"
                onClick={() => sendEvent("phone_click", { placement: "location" })}
              >
                (55) 3311-7142
              </a>
            </div>
            <div className="social-links" aria-label="Redes sociais">
              <a href="https://www.instagram.com/emporiodofrangosm/" target="_blank" rel="noreferrer" onClick={() => sendEvent("social_click", { network: "instagram" })}>Instagram ↗</a>
              <a href="https://www.facebook.com/emporiodofrangosm/" target="_blank" rel="noreferrer" onClick={() => sendEvent("social_click", { network: "facebook" })}>Facebook ↗</a>
            </div>
          </div>
          <div className="map-wrap">
            <iframe
              title="Localização do Empório do Frango no Google Maps"
              src="https://www.google.com/maps?q=Rua%20Ven%C3%A2ncio%20Aires%2C%20470%2C%20Santa%20Maria%2C%20RS&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <section className="section faq-section" aria-labelledby="faq-title">
          <div className="faq-heading">
            <p className="kicker">Antes de pedir</p>
            <h2 id="faq-title">Dúvidas frequentes.</h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>Qual é a diferença entre o galeto temperado e o frango assado?</summary>
              <p>O galeto é vendido cru, já temperado, para você preparar em casa. O frango inteiro é vendido assado aos sábados, domingos e feriados, no almoço.</p>
            </details>
            <details>
              <summary>Como faço uma encomenda?</summary>
              <p>Abra o WhatsApp, informe os produtos, a quantidade, a data e o horário desejado. O pedido fica confirmado após o retorno da equipe.</p>
            </details>
            <details>
              <summary>Posso reservar meu frango assado?</summary>
              <p>Sim. Chame na quinta ou sexta, informe o dia e a quantidade. A equipe confirma a disponibilidade do lote e o horário de retirada.</p>
            </details>
            <details>
              <summary>O Empório faz entrega?</summary>
              <p>O Empório organiza entregas conforme a operação do dia. A cobertura e a taxa são informadas de acordo com o endereço.</p>
            </details>
            <details>
              <summary>Como consulto o almoço do dia?</summary>
              <p>O cardápio pode ser solicitado pelo WhatsApp. O almoço funciona de terça a sexta, a partir das 11h30.</p>
            </details>
            <details>
              <summary>Quando encontro maionese, polenta e risoto?</summary>
              <p>Os acompanhamentos são preparados para o almoço de sábado, domingo e feriado. A produção é limitada.</p>
            </details>
          </div>
        </section>

        <section className="final-cta" aria-labelledby="final-title">
          <div>
            <p className="kicker kicker-light">Pedido pelo WhatsApp</p>
            <h2 id="final-title">Diga o que procura. A equipe confirma o que está disponível.</h2>
          </div>
          <WhatsAppLink
            className="button button-primary"
            message={generalMessage}
            interest="geral"
            placement="final_cta"
          >
            Falar com a equipe
          </WhatsAppLink>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <img src="/emporio-logo.svg" alt="Empório do Frango Rotisserie" />
          <p>Rotisserie no Centro de Santa Maria, desde 2022.</p>
        </div>
        <div>
          <strong>Empório do Frango</strong>
          <p>Rua Venâncio Aires, 470 · Centro<br />Santa Maria/RS</p>
        </div>
        <div>
          <strong>Contato</strong>
          <p><a href="tel:+555533117142">(55) 3311-7142</a><br /><a href="https://www.instagram.com/emporiodofrangosm/" target="_blank" rel="noreferrer">@emporiodofrangosm</a></p>
        </div>
        <div className="footer-legal">
          <p>CNPJ 45.883.258/0001-11</p>
          <p>© 2026 Empório do Frango.</p>
        </div>
      </footer>

      <WhatsAppLink
        className="mobile-whatsapp"
        message={generalMessage}
        interest="geral"
        placement="mobile_fixed"
      >
        Pedir pelo WhatsApp
      </WhatsAppLink>
      <TrackingConsent />
    </>
  );
}
