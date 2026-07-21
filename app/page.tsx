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
    eyebrow: "Carro-chefe",
    title: "Frango assado",
    description:
      "Frango inteiro, dourado por fora e suculento por dentro. Aos fins de semana e feriados, vale reservar cedo para escolher o melhor horário de retirada.",
    availability: "Sábados, domingos e feriados",
    message:
      "Olá! Vim pelo site e quero reservar um frango assado. Quais opções e horários de retirada estão disponíveis?",
    image: "/images/hero-frango-inteiro-v2.webp",
    imageAlt: "Frango inteiro assado e dourado",
    items: [
      {
        name: "Frango assado",
        detail: "Consulte tamanho, disponibilidade e horário de retirada.",
        price: "Consulte o valor",
        image: "/images/hero-frango-inteiro-v2.webp",
        imageAlt: "Frango inteiro assado e dourado",
      },
    ],
  },
  {
    id: "almoco",
    eyebrow: "Praticidade no dia a dia",
    title: "Almoço",
    description:
      "Comida pronta para a pausa do meio-dia. O cardápio muda, então confirme as opções antes de sair.",
    availability: "Terça a sexta, a partir das 11h30",
    message:
      "Olá! Vim pelo site e quero consultar o cardápio do almoço de hoje e o horário de retirada.",
    image: "/images/marmitex-almoco.webp",
    imageAlt: "Marmitex com almoço completo",
    items: [
      {
        name: "Marmitex média",
        detail: "Consulte o cardápio do dia pelo WhatsApp.",
        price: "R$ 19,50",
        image: "/images/marmitex-almoco.webp",
        imageAlt: "Marmitex média com almoço completo",
      },
      {
        name: "Marmitex grande",
        detail: "Consulte o cardápio do dia pelo WhatsApp.",
        price: "R$ 22,50",
        image: "/images/marmitex-almoco.webp",
        imageAlt: "Marmitex grande com almoço completo",
      },
    ],
  },
  {
    id: "espetinhos",
    eyebrow: "Noite na brasa",
    title: "Espetinhos",
    description:
      "Para matar a fome no fim do dia ou dividir com os amigos. Consulte os sabores que estão na brasa.",
    availability: "Segunda a sábado, à noite",
    message:
      "Olá! Quero consultar os espetinhos disponíveis hoje e fazer um pedido.",
    image: "/images/espetinhos-sem-texto.webp",
    imageAlt: "Espetinhos preparados na brasa",
    items: [
      { name: "Carne", detail: "Espetinho por unidade.", price: "R$ 8,00", image: "/images/espetinhos-sem-texto.webp", imageAlt: "Espetinhos de carne, coração, queijo coalho e pão de alho" },
      { name: "Coração", detail: "Espetinho por unidade.", price: "R$ 8,00", image: "/images/espetinhos-sem-texto.webp", imageAlt: "Espetinhos de carne, coração, queijo coalho e pão de alho" },
      { name: "Queijo coalho", detail: "Por unidade.", price: "R$ 8,00", image: "/images/espetinhos-sem-texto.webp", imageAlt: "Espetinhos de carne, coração, queijo coalho e pão de alho" },
      { name: "Pão de alho", detail: "Por unidade.", price: "R$ 8,00", image: "/images/espetinhos-sem-texto.webp", imageAlt: "Espetinhos de carne, coração, queijo coalho e pão de alho" },
    ],
  },
  {
    id: "acougue",
    eyebrow: "Para preparar em casa",
    title: "Açougue & balcão",
    description:
      "Cortes crus vendidos por kg para você temperar, assar ou preparar em casa. Pergunte o que chegou no balcão e escolha a quantidade.",
    availability: "Durante o horário da loja",
    message:
      "Olá! Vim pelo site e quero saber quais cortes e produtos do açougue estão disponíveis hoje.",
    image: "/images/linguicas-selecionadas-poster.jpg",
    imageAlt: "Produtos selecionados do balcão",
    items: [
      { name: "Sobrecoxa crua", detail: "Vendida por kg no balcão para preparar em casa.", price: "Consulte", image: "/images/linguicas-selecionadas-poster.jpg", imageAlt: "Produtos selecionados do balcão" },
      { name: "Coxa da asa crua", detail: "Vendida por kg no balcão para preparar em casa.", price: "Consulte", image: "/images/linguicas-selecionadas-poster.jpg", imageAlt: "Produtos selecionados do balcão" },
      { name: "Tulipa crua", detail: "Vendida por kg no balcão para preparar em casa.", price: "Consulte", image: "/images/linguicas-selecionadas-poster.jpg", imageAlt: "Produtos selecionados do balcão" },
      { name: "Coração cru", detail: "Consulte peso e disponibilidade no balcão.", price: "Consulte", image: "/images/linguicas-selecionadas-poster.jpg", imageAlt: "Produtos selecionados do balcão" },
      { name: "Linguiças", detail: "Consulte as opções do balcão para assar em casa.", price: "Consulte", image: "/images/linguicas-selecionadas-poster.jpg", imageAlt: "Linguiças selecionadas do balcão" },
    ],
  },
  {
    id: "acompanhamentos",
    eyebrow: "Complete sua refeição",
    title: "Acompanhamentos",
    description:
      "Maionese e polenta para completar o frango assado. As porções são vendidas separadamente.",
    availability: "Maionese e polenta",
    message:
      "Olá! Quero consultar maionese e polenta para completar meu pedido.",
    image: "/images/acompanhamentos.webp",
    imageAlt: "Maionese e acompanhamentos servidos em porções",
    items: [
      { name: "Maionese 400 g", detail: "Porção vendida separadamente.", price: "Consulte", image: "/images/acompanhamentos.webp", imageAlt: "Maionese cremosa servida em porção" },
      { name: "Polenta extra", detail: "Porção extra para completar o pedido.", price: "Consulte", image: "/images/acompanhamentos.webp", imageAlt: "Polenta servida como acompanhamento" },
    ],
  },
  {
    id: "risoto",
    eyebrow: "Acompanhamento especial",
    title: "Risoto",
    description:
      "Risoto tradicional vendido à parte para completar o frango assado ou o almoço do dia.",
    availability: "R$ 23 · porção de 900 g",
    message:
      "Olá! Quero consultar o risoto disponível hoje para completar meu pedido.",
    image: "/images/acompanhamentos.webp",
    imageAlt: "Risoto tradicional servido em porção",
    items: [
      { name: "Risoto tradicional", detail: "Porção de 900 g.", price: "R$ 23,00", image: "/images/acompanhamentos.webp", imageAlt: "Risoto tradicional servido em porção" },
    ],
  },
  {
    id: "mercado",
    eyebrow: "Pão fresco todos os dias",
    title: "Pão & mercado",
    description:
      "O pão sai todos os dias às 16h. Bebidas e itens de conveniência ajudam a fechar a compra sem outra parada.",
    availability: "Pão todos os dias às 16h",
    message:
      "Olá! Quero consultar as bebidas, pães e itens de conveniência disponíveis hoje.",
    image: "/images/pao-fresquinho.webp",
    imageAlt: "Pães frescos e dourados",
    items: [
      { name: "Pão fresquinho", detail: "Produção diária, saindo às 16h.", price: "Consulte", image: "/images/pao-fresquinho.webp", imageAlt: "Pães frescos recém-assados" },
      { name: "Bebidas e conveniência", detail: "Refrigerantes, bebidas e itens para completar sua compra.", price: "Consulte", image: "/images/acompanhamentos.webp", imageAlt: "Itens para completar a refeição" },
    ],
  },
];

const generalMessage =
  "Olá! Vim pelo site do Empório do Frango e quero fazer um pedido. Pode me enviar as opções disponíveis?";

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
      "Rotisserie com frango assado, almoço, espetinhos, açougue e acompanhamentos em Santa Maria.",
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
              Comida boa, <em>do jeito que o dia pede.</em>
            </h1>
            <p className="hero-lead">
              Tem galeto temperado para preparar em casa, frango assado aos fins
              de semana, marmitex durante a semana e espetinhos à noite. Escolha
              o seu pedido e fale com a gente pelo WhatsApp.
            </p>
            <div className="hero-actions">
              <WhatsAppLink
                className="button button-primary"
                message={generalMessage}
                interest="geral"
                placement="hero"
              >
                Pedir pelo WhatsApp
              </WhatsAppLink>
              <a className="text-link" href="#cardapio">
                Ver cardápio <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">
              Vai de frango assado? Reserve antes. Assim você escolhe o horário e não
              corre o risco de chegar quando já acabou.
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
            <div className="hero-stamp" aria-label="Tradição desde 2022">
              <strong>Desde</strong>
              <span>2022</span>
            </div>
            <div className="hero-caption">
              <span>Qualidade em cada preparo</span>
              <strong>Empório do Frango</strong>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Diferenciais">
          <div><strong>Desde 2022</strong><span>servindo Santa Maria</span></div>
          <a href="#seguranca-alimentar"><strong>Autorização sanitária</strong><span>manipulação e beneficiamento</span></a>
          <div><strong>Reserve antes</strong><span>retire no horário combinado</span></div>
          <div><strong>Resolva a refeição</strong><span>comida pronta e conveniência</span></div>
        </section>

        <section className="section intent-section" id="categorias" aria-labelledby="intent-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Escolha por intenção</p>
              <h2 id="intent-title">O que você procura hoje?</h2>
            </div>
            <p>
              Está com pressa, vai reunir a família ou quer levar algo para a
              brasa? Escolha uma categoria e fale direto com a equipe.
            </p>
          </div>

          <div className="intent-grid">
            {menuCategories.map((category, index) => (
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
              <p className="kicker">Cardápio digital</p>
              <h2 id="menu-title">Escolha o seu pedido.</h2>
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
            <p className="kicker">Sem combo, do seu jeito</p>
            <h2 id="complete-title">Monte o pedido do seu jeito.</h2>
            <p>
              Escolha o principal e consulte maionese, polenta, risoto, bebidas e itens
              de conveniência. Tudo separado, para você montar o pedido como
              preferir.
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
          <div className="complete-steps" aria-label="Sugestão para montar o pedido">
            <div><span>01</span><strong>Escolha o principal</strong><small>Frango assado, almoço ou espetinhos</small></div>
            <div><span>02</span><strong>Adicione um acompanhamento</strong><small>Maionese, polenta ou risoto</small></div>
            <div><span>03</span><strong>Finalize como preferir</strong><small>Bebidas e itens de conveniência</small></div>
          </div>
        </section>

        <section className="bread-section" id="pao" aria-labelledby="bread-title">
          <div className="bread-media">
            <img src="/images/pao-fresquinho.webp" alt="Pães fresquinhos recém-assados" width="1448" height="1086" loading="lazy" />
            <div className="bread-clock" aria-label="Pão fresco todos os dias às 16 horas">
              <span>Todo dia</span>
              <strong>16h</strong>
            </div>
          </div>
          <div className="bread-copy">
            <p className="kicker">Pão quentinho tem hora certa</p>
            <h2 id="bread-title">Às 16h, o pão sai quentinho.</h2>
            <p>
              Às 16h, tem pão recém-assado no Empório para levar para casa,
              acompanhar o espetinho ou completar o café da tarde.
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
              src="/images/espetinhos-sem-texto.webp"
              alt="Espetinhos de carne, coração, queijo coalho e pão de alho"
              width="1092"
              height="1440"
              loading="lazy"
            />
          </div>
          <div className="quality-copy">
            <p className="kicker kicker-light">Segurança alimentar levada a sério</p>
            <h2 id="quality-title">Cuidado que aparece antes do produto chegar ao balcão.</h2>
            <p>
              O Empório possui autorização sanitária para temperar, manipular e
              realizar o beneficiamento dos produtos antes da venda. É a única
              casa de frango autorizada a trabalhar dessa maneira.
            </p>
            <div className="sanitary-badge">
              <strong>Autorização para manipulação e beneficiamento</strong>
              <span>O frango pode ser temperado, manipulado e beneficiado no próprio Empório para venda.</span>
            </div>
            <ul>
              <li><span>01</span>Armazenamento controlado</li>
              <li><span>02</span>Preparo em temperatura segura</li>
              <li><span>03</span>Exposição adequada</li>
              <li><span>04</span>Higiene e processos</li>
            </ul>
            <p className="safety-note">
              Produto bem armazenado e preparo cuidadoso. É assim que a comida
              chega à sua mesa.
            </p>
          </div>
        </section>

        <section className="section preorder-section" aria-labelledby="preorder-title">
          <div className="preorder-heading">
            <p className="kicker">Evite fila e falta de produto</p>
            <h2 id="preorder-title">Encomende na quinta ou sexta.</h2>
          </div>
          <ol className="preorder-list">
            <li><span>1</span><div><strong>Reserve antes</strong><p>Na quinta ou sexta, diga quantos frangos assados deseja.</p></div></li>
            <li><span>2</span><div><strong>Combine</strong><p>Informe se é para sábado, domingo ou feriado e escolha o horário de retirada.</p></div></li>
            <li><span>3</span><div><strong>Confirme</strong><p>Horário-limite de encomenda deve ser confirmado pelo WhatsApp.</p></div></li>
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
              <p className="kicker">Do Empório para a sua mesa</p>
              <h2 id="gallery-title">Frango assado, acompanhamentos e mais.</h2>
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
                <img src="/images/marmitex-almoco.webp" alt="Marmitex com almoço completo" width="1600" height="1067" loading="lazy" decoding="async" />
                <figcaption>Almoço</figcaption>
              </figure>
              <figure>
                <img src="/images/acompanhamentos.webp" alt="Maionese, polenta e risoto para completar o pedido" width="1200" height="800" loading="lazy" decoding="async" />
                <figcaption>Acompanhamentos</figcaption>
              </figure>
              <figure>
                <img src="/images/pao-fresquinho.webp" alt="Pães fresquinhos recém-assados" width="1448" height="1086" loading="lazy" decoding="async" />
                <figcaption>Pão 16h</figcaption>
              </figure>
              <figure>
                <img src="/images/espetinhos-sem-texto.webp" alt="Espetinhos de carne, coração, queijo coalho e pão de alho" width="1092" height="1440" loading="lazy" decoding="async" />
                <figcaption>Espetinhos à noite</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="section hours-section" id="horarios" aria-labelledby="hours-title">
          <div className="hours-heading">
            <div>
              <p className="kicker">Planeje sua visita</p>
              <h2 id="hours-title">Confira os horários do Empório.</h2>
            </div>
            <div className="hours-action">
              <p>
                Consulte o WhatsApp antes de sair para confirmar o cardápio e a
                disponibilidade do dia.
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
              <article><span>Frango assado</span><strong>Sábados, domingos e feriados</strong></article>
              <article><span>Almoço</span><strong>Terça a sexta, a partir das 11h30</strong></article>
              <article><span>Espetinhos</span><strong>Segunda a sábado, à noite</strong></article>
              <article><span>Feriados</span><strong>Consulte funcionamento e encomendas</strong></article>
              <article className="bread-hour"><span>Pão fresquinho</span><strong>Todos os dias, às 16h</strong></article>
              <p>Açougue e mercado acompanham o horário geral da loja.</p>
            </div>
          </div>
        </section>

        <section className="section routes-section" aria-labelledby="routes-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Você escolhe como comprar</p>
              <h2 id="routes-title">Escolha, confirme e retire.</h2>
            </div>
            <p>Confirme tudo pelo WhatsApp e escolha a opção mais prática.</p>
          </div>
          <div className="routes-grid">
            <article>
              <span>01</span>
              <h3>Pedido pelo WhatsApp</h3>
              <p>Consulte produtos, cardápio, valores e disponibilidade direto com a equipe.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Retirada combinada</h3>
              <p>Defina o horário e retire seu pedido na Rua Venâncio Aires, 470.</p>
            </article>
            <article>
              <span>03</span>
              <h3>iFood</h3>
              <p>Disponível para pedidos pelo aplicativo, conforme disponibilidade da loja.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Entrega na cidade</h3>
              <p>Área de entrega até Camobi. Consulte disponibilidade e taxa para o seu endereço.</p>
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
              <summary>Como faço uma encomenda?</summary>
              <p>Abra o WhatsApp, informe os produtos, a quantidade, a data e o horário desejado. O pedido fica confirmado após o retorno da equipe.</p>
            </details>
            <details>
              <summary>Posso reservar meu frango assado?</summary>
              <p>Sim. A encomenda antecipada é recomendada na quinta ou sexta para sábado, domingo e feriados. Confirme o horário-limite pelo WhatsApp.</p>
            </details>
            <details>
              <summary>O Empório faz entrega?</summary>
              <p>Há entrega própria em Santa Maria. Consulte no WhatsApp a cobertura, a disponibilidade e a taxa para o seu endereço.</p>
            </details>
            <details>
              <summary>Como consulto o almoço do dia?</summary>
              <p>O cardápio pode ser solicitado pelo WhatsApp. O almoço funciona de terça a sexta, a partir das 11h30.</p>
            </details>
            <details>
              <summary>Os produtos e preços podem mudar?</summary>
              <p>Sim. Alguns itens dependem da produção do dia. Confirme valores e disponibilidade com a equipe antes de concluir o pedido.</p>
            </details>
          </div>
        </section>

        <section className="final-cta" aria-labelledby="final-title">
          <div>
            <p className="kicker kicker-light">Já sabe o que vai pedir?</p>
            <h2 id="final-title">Fale com o Empório e deixe sua refeição encaminhada.</h2>
          </div>
          <WhatsAppLink
            className="button button-primary"
            message={generalMessage}
            interest="geral"
            placement="final_cta"
          >
            Abrir WhatsApp
          </WhatsAppLink>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <img src="/emporio-logo.svg" alt="Empório do Frango Rotisserie" />
          <p>Tudo para sua refeição, com a qualidade que você já conhece.</p>
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
