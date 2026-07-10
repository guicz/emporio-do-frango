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
  items: Array<{ name: string; detail: string; price: string }>;
};

const menuCategories: MenuCategory[] = [
  {
    id: "galeto",
    eyebrow: "Carro-chefe",
    title: "Galeto assado",
    description:
      "Assado com cuidado para chegar suculento e dourado à sua mesa. Reserve com antecedência para garantir o seu.",
    availability: "Sábados e domingos",
    message:
      "Olá! Vim pelo site e quero reservar um galeto. Quais opções e horários de retirada estão disponíveis?",
    items: [
      {
        name: "Galeto assado",
        detail: "Consulte tamanho, disponibilidade e horário de retirada.",
        price: "Consulte o valor",
      },
    ],
  },
  {
    id: "almoco",
    eyebrow: "Praticidade no dia a dia",
    title: "Almoço",
    description:
      "Marmitex preparada diariamente para quem quer comer bem sem perder tempo.",
    availability: "Terça a sexta, a partir das 11h30",
    message:
      "Olá! Vim pelo site e quero consultar o cardápio do almoço de hoje e o horário de retirada.",
    items: [
      {
        name: "Marmitex média",
        detail: "Consulte o cardápio do dia pelo WhatsApp.",
        price: "R$ 19,50",
      },
      {
        name: "Marmitex grande",
        detail: "Consulte o cardápio do dia pelo WhatsApp.",
        price: "R$ 22,50",
      },
    ],
  },
  {
    id: "espetinhos",
    eyebrow: "Noite na brasa",
    title: "Espetinhos",
    description:
      "Opções preparadas para o fim do expediente, o encontro com os amigos ou uma refeição rápida.",
    availability: "Segunda a sábado, à noite",
    message:
      "Olá! Quero consultar os espetinhos disponíveis hoje e fazer um pedido.",
    items: [
      { name: "Carne", detail: "Espetinho por unidade.", price: "R$ 8,00" },
      { name: "Coração", detail: "Espetinho por unidade.", price: "R$ 8,00" },
      { name: "Queijo coalho", detail: "Por unidade.", price: "R$ 8,00" },
      { name: "Pão de alho", detail: "Por unidade.", price: "R$ 8,00" },
    ],
  },
  {
    id: "acougue",
    eyebrow: "Para preparar em casa",
    title: "Açougue & balcão",
    description:
      "Cortes e opções selecionadas para você levar qualidade também para as refeições preparadas em casa.",
    availability: "Durante o horário da loja",
    message:
      "Olá! Vim pelo site e quero saber quais cortes e produtos do açougue estão disponíveis hoje.",
    items: [
      { name: "Sobrecoxa", detail: "Consulte peso e disponibilidade.", price: "Consulte" },
      { name: "Coxa da asa", detail: "Consulte peso e disponibilidade.", price: "Consulte" },
      { name: "Tulipa", detail: "Consulte peso e disponibilidade.", price: "Consulte" },
      { name: "Coração", detail: "Consulte peso e disponibilidade.", price: "Consulte" },
      { name: "Linguiças", detail: "Consulte as opções do balcão.", price: "Consulte" },
    ],
  },
  {
    id: "acompanhamentos",
    eyebrow: "Complete sua refeição",
    title: "Acompanhamentos",
    description:
      "Escolha os itens que combinam com o seu pedido. Cada produto é vendido separadamente, conforme disponibilidade.",
    availability: "Consulte a disponibilidade do dia",
    message:
      "Olá! Quero consultar os acompanhamentos disponíveis para completar meu pedido.",
    items: [
      { name: "Maionese", detail: "Consulte porções disponíveis.", price: "Consulte" },
      { name: "Saladas", detail: "Consulte as opções do dia.", price: "Consulte" },
      { name: "Risoto tradicional", detail: "Porção individual.", price: "R$ 23,00" },
    ],
  },
  {
    id: "mercado",
    eyebrow: "Conveniência",
    title: "Mercado",
    description:
      "Bebidas e itens rápidos para resolver a refeição em um só lugar.",
    availability: "Durante o horário da loja",
    message:
      "Olá! Quero consultar as bebidas, pães e itens de conveniência disponíveis hoje.",
    items: [
      { name: "Refrigerantes 2 L", detail: "Consulte marcas e sabores.", price: "Consulte" },
      { name: "Bebidas", detail: "Opções disponíveis na loja.", price: "Consulte" },
      { name: "Pão fresquinho", detail: "Sai por volta das 16h.", price: "Consulte" },
      { name: "Itens de conveniência", detail: "Para completar sua compra.", price: "Consulte" },
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
    description:
      "Rotisserie com galeto assado, almoço, espetinhos, açougue e acompanhamentos em Santa Maria.",
    image: "/images/hero-frango.jpg",
    foundingDate: "2012",
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
              Galeto, almoço e <em>tudo</em> para sua refeição.
            </h1>
            <p className="hero-lead">
              Desde 2012, sabor, variedade e praticidade para quem não abre mão
              de qualidade. Escolha o que procura e confirme seu pedido pelo
              WhatsApp.
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
              Encomende antes para agilizar a retirada e evitar a falta do
              produto desejado.
            </p>
          </div>

          <div className="hero-media">
            <img
              src="/images/hero-frango.jpg"
              alt="Frango assado do Empório do Frango servido sobre tábua"
              width="893"
              height="1190"
              loading="eager"
            />
            <div className="hero-stamp" aria-label="Tradição desde 2012">
              <strong>Desde</strong>
              <span>2012</span>
            </div>
            <div className="hero-caption">
              <span>Qualidade em cada preparo</span>
              <strong>Empório do Frango</strong>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Diferenciais">
          <div><strong>Desde 2012</strong><span>tradição em Santa Maria</span></div>
          <div><strong>Feito diariamente</strong><span>cuidado em cada etapa</span></div>
          <div><strong>Pedido antecipado</strong><span>menos espera na retirada</span></div>
          <div><strong>Em um só lugar</strong><span>refeição e conveniência</span></div>
        </section>

        <section className="section intent-section" aria-labelledby="intent-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Escolha por intenção</p>
              <h2 id="intent-title">O que você procura hoje?</h2>
            </div>
            <p>
              Do almoço corrido ao encontro em família: encontre a opção certa
              e fale direto com a equipe.
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
            <p>
              Valores informados nos materiais de julho de 2026. Confirme
              disponibilidade, cardápio e eventuais atualizações pelo WhatsApp.
            </p>
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
              <h3>{currentCategory.title}</h3>
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
                  <div>
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
            <h2 id="complete-title">Deixe sua refeição completa.</h2>
            <p>
              Escolha o principal e consulte acompanhamentos, bebidas e itens
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
            <div><span>01</span><strong>Escolha o principal</strong><small>Galeto, almoço ou espetinhos</small></div>
            <div><span>02</span><strong>Adicione um acompanhamento</strong><small>Maionese, salada ou risoto</small></div>
            <div><span>03</span><strong>Finalize como preferir</strong><small>Bebidas e itens de conveniência</small></div>
          </div>
        </section>

        <section className="quality-section" aria-labelledby="quality-title">
          <div className="quality-media">
            <img
              src="/images/espetinhos-brasa.jpg"
              alt="Espetinhos sendo preparados sobre brasas no Empório do Frango"
              width="1200"
              height="1600"
              loading="lazy"
            />
            <span>Preparo real. Foto real.</span>
          </div>
          <div className="quality-copy">
            <p className="kicker kicker-light">O cuidado aparece no resultado</p>
            <h2 id="quality-title">Qualidade não é discurso. É rotina.</h2>
            <p>
              Ingredientes selecionados, preparo cuidadoso, organização e
              atenção à higiene fazem parte do trabalho diário do Empório.
            </p>
            <ul>
              <li><span>01</span>Preparado diariamente</li>
              <li><span>02</span>Variedade em um só lugar</li>
              <li><span>03</span>Atendimento próximo</li>
              <li><span>04</span>Confiança desde 2012</li>
            </ul>
          </div>
        </section>

        <section className="section preorder-section" aria-labelledby="preorder-title">
          <div className="preorder-heading">
            <p className="kicker">Evite fila e falta de produto</p>
            <h2 id="preorder-title">Encomendar antes é simples.</h2>
          </div>
          <ol className="preorder-list">
            <li><span>1</span><div><strong>Escolha</strong><p>Diga o que deseja e a quantidade.</p></div></li>
            <li><span>2</span><div><strong>Combine</strong><p>Informe a data e o horário desejado.</p></div></li>
            <li><span>3</span><div><strong>Confirme</strong><p>Aguarde o retorno da equipe pelo WhatsApp.</p></div></li>
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

        <section className="section gallery-section" aria-labelledby="gallery-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Do Empório para a sua mesa</p>
              <h2 id="gallery-title">Sabor que começa no preparo.</h2>
            </div>
            <p>
              Fotos reais dos produtos e da rotina do Empório do Frango.
            </p>
          </div>
          <div className="gallery-grid">
            <figure className="gallery-main">
              <img src="/images/frango-assado.jpg" alt="Pedaços de frango assado preparados no Empório" width="894" height="1190" loading="lazy" />
              <figcaption>Frango assado</figcaption>
            </figure>
            <figure>
              <img src="/images/espetinhos-variedade.jpg" alt="Variedade de espetinhos preparados para assar" width="894" height="1190" loading="lazy" />
              <figcaption>Variedade na brasa</figcaption>
            </figure>
            <figure>
              <img src="/images/preparo-espetinhos.jpg" alt="Espetinhos sendo organizados junto à churrasqueira" width="1200" height="1600" loading="lazy" />
              <figcaption>Preparo cuidadoso</figcaption>
            </figure>
          </div>
        </section>

        <section className="section hours-section" id="horarios" aria-labelledby="hours-title">
          <div className="hours-heading">
            <p className="kicker">Planeje sua visita</p>
            <h2 id="hours-title">Cada operação tem seu momento.</h2>
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

          <div className="hours-content">
            <div className="opening-hours">
              <h3>Horário da loja</h3>
              <dl>
                <div><dt>Segunda</dt><dd>16h — 21h</dd></div>
                <div><dt>Terça a sexta</dt><dd>9h — 12h30<br />16h — 21h</dd></div>
                <div><dt>Sábado</dt><dd>9h — 13h30<br />16h — 20h</dd></div>
                <div><dt>Domingo</dt><dd>8h30 — 13h30</dd></div>
              </dl>
            </div>
            <div className="operation-hours">
              <article><span>Galeto assado</span><strong>Sábado e domingo</strong></article>
              <article><span>Almoço</span><strong>Terça a sexta, a partir das 11h30</strong></article>
              <article><span>Espetinhos</span><strong>Segunda a sábado, à noite</strong></article>
              <article><span>Pão fresquinho</span><strong>Por volta das 16h</strong></article>
              <p>Açougue e mercado acompanham o horário geral da loja.</p>
            </div>
          </div>
        </section>

        <section className="section routes-section" aria-labelledby="routes-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Você escolhe como comprar</p>
              <h2 id="routes-title">Do pedido à sua mesa.</h2>
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
              <h3>Entrega na cidade</h3>
              <p>Consulte cobertura, disponibilidade e taxa para o seu endereço.</p>
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
              <summary>Posso reservar meu galeto?</summary>
              <p>Sim. A encomenda antecipada é recomendada, principalmente para os finais de semana, quando a procura é maior.</p>
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
          <img src="/emporio-seal.svg" alt="Selo Empório do Frango" />
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
