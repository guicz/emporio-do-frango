"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
    image?: string;
    imageAlt: string;
    imageCrop?: "left" | "right";
    imageFill?: boolean;
  }>;
};

const menuCategories: MenuCategory[] = [
  {
    id: "acougue",
    eyebrow: "Para preparar em casa",
    title: "AÃ§ougue",
    description:
      "Galeto temperado, cortes de galeto, linguiÃ§as e opÃ§Ãµes selecionadas para churrasco. Consulte o estoque do dia.",
    availability: "Durante o horÃ¡rio da loja",
    message:
      "OlÃ¡! Quero consultar os produtos disponÃ­veis no aÃ§ougue hoje.",
    image: "/images/real-balcao-aves.png",
    imageAlt: "BalcÃ£o refrigerado do EmpÃ³rio com cortes de aves temperados",
    items: [
      {
        name: "Galeto temperado",
        detail: "Cortes crus, jÃ¡ temperados. Consulte as opÃ§Ãµes disponÃ­veis.",
        price: "Consulte",
        image: "/images/coxinhas-assadas-v3.webp",
        imageAlt: "Coxinhas da asa assadas como sugestÃ£o de preparo",
      },
      {
        name: "Sobrecoxinha de galeto",
        detail: "Corte cru vendido por kg.",
        price: "Consulte",
        image: "/images/sobrecoxa-preparo.webp",
        imageAlt: "Sobrecoxas assadas como sugestÃ£o de preparo",
      },
      {
        name: "Coxinha da asa",
        detail: "Corte cru vendido por kg.",
        price: "Consulte",
        image: "/images/coxinhas-assadas-v3.webp",
        imageAlt: "Coxinhas da asa assadas como sugestÃ£o de preparo",
      },
      {
        name: "Tulipa (meio da asa)",
        detail: "Corte cru vendido por kg.",
        price: "Consulte",
        image: "/images/asas-assadas.webp",
        imageAlt: "Tulipas assadas como sugestÃ£o de preparo",
      },
      {
        name: "CoraÃ§Ã£o",
        detail: "Produto temperado vendido por kg.",
        price: "Consulte",
        image: "/images/coracao-temperado-cru-v1.webp",
        imageAlt: "CoraÃ§Ãµes de frango temperados com ervas",
      },
      {
        name: "LinguiÃ§as",
        detail: "OpÃ§Ãµes para assar em casa.",
        price: "Consulte",
        image: "/images/linguicas-selecionadas-poster.jpg",
        imageAlt: "LinguiÃ§as selecionadas disponÃ­veis no balcÃ£o",
      },
      {
        name: "Cortes para churrasco",
        detail: "OpÃ§Ãµes bovinas embaladas a vÃ¡cuo, conforme disponibilidade da semana.",
        price: "Consulte",
        image: "/images/real-balcao-aves.png",
        imageAlt: "BalcÃ£o refrigerado do EmpÃ³rio com carnes e cortes embalados",
        imageFill: true,
      },
    ],
  },
  {
    id: "frango",
    eyebrow: "AlmoÃ§o de fim de semana",
    title: "Frango assado",
    description:
      "Frango inteiro assado com uma porÃ§Ã£o de polenta frita. Reserve com antecedÃªncia e combine a retirada ou a entrega.",
    availability: "SÃ¡bados, domingos e feriados, no almoÃ§o",
    message:
      "OlÃ¡! Vim pelo site e quero reservar um frango assado. Gostaria de combinar a retirada ou a entrega.",
    image: "/images/real-frangos-assados.png",
    imageAlt: "Frangos inteiros assados na produÃ§Ã£o do EmpÃ³rio",
    items: [
      {
        name: "Frango assado com polenta frita",
        detail: "Frango inteiro com uma porÃ§Ã£o de polenta frita.",
        price: "R$ 70,00",
        image: "/images/real-frango-polenta-embalagem.png",
        imageAlt: "Frango inteiro assado com polenta na embalagem para retirada",
      },
    ],
  },
  {
    id: "almoco",
    eyebrow: "De terÃ§a a sexta",
    title: "Marmitex",
    description:
      "O almoÃ§o comeÃ§a Ã s 11h30. Consulte o prato do dia no WhatsApp ou nos stories.",
    availability: "TerÃ§a a sexta, a partir das 11h30",
    message:
      "OlÃ¡! Vim pelo site e quero consultar o cardÃ¡pio do almoÃ§o de hoje e o horÃ¡rio de retirada.",
    image: "/images/marmitex-almoco-v2.jpg",
    imageAlt: "Marmitex com refeiÃ§Ã£o completa",
    items: [
      {
        name: "Marmitex mÃ©dia",
        detail: "Prato do dia.",
        price: "R$ 19,50",
        image: "/images/marmitex-almoco-v2.jpg",
        imageAlt: "Marmitex mÃ©dia com refeiÃ§Ã£o completa",
      },
      {
        name: "Marmitex grande",
        detail: "Prato do dia.",
        price: "R$ 22,50",
        image: "/images/marmitex-almoco-v2.jpg",
        imageAlt: "Marmitex grande com refeiÃ§Ã£o completa",
      },
    ],
  },
  {
    id: "espetinhos",
    eyebrow: "Noite na brasa",
    title: "Espetinhos",
    description:
      "Carne, coraÃ§Ã£o, queijo coalho e pÃ£o de alho preparados na brasa. Consulte as opÃ§Ãµes disponÃ­veis no dia.",
    availability: "Segunda a sÃ¡bado, Ã  noite",
    message:
      "OlÃ¡! Quero consultar os espetinhos disponÃ­veis hoje e fazer um pedido.",
    image: "/images/real-espetinhos-assados.png",
    imageAlt: "Espetinhos assados na brasa do EmpÃ³rio",
    items: [
      {
        name: "Carne",
        detail: "Espetinho por unidade.",
        price: "R$ 8,00",
        image: "/images/espetinho-carne-v1.webp",
        imageAlt: "Espetinho de carne assado na brasa",
      },
      {
        name: "CoraÃ§Ã£o",
        detail: "Espetinho por unidade.",
        price: "R$ 8,00",
        image: "/images/espetinho-coracao-v1.webp",
        imageAlt: "Espetinho de coraÃ§Ã£o assado na brasa",
      },
      {
        name: "Queijo coalho",
        detail: "Por unidade.",
        price: "R$ 8,00",
        image: "/images/espetinho-queijo-coalho-v1.webp",
        imageAlt: "Espetinho de queijo coalho dourado na brasa",
      },
      {
        name: "PÃ£o de alho",
        detail: "Por unidade.",
        price: "R$ 8,00",
        image: "/images/espetinho-pao-de-alho-v1.webp",
        imageAlt: "Espetinho de pÃ£o de alho tostado na brasa",
      },
    ],
  },
  {
    id: "acompanhamentos",
    eyebrow: "Para acompanhar o frango assado",
    title: "Acompanhamentos",
    description:
      "Maionese e polenta extra, vendidas Ã  parte no almoÃ§o de fim de semana e feriados.",
    availability: "SÃ¡bados, domingos e feriados, no almoÃ§o",
    message:
      "OlÃ¡! Quero consultar maionese e polenta para completar meu pedido.",
    image: "/images/maionese-polenta-v7.webp",
    imageAlt: "Maionese caseira e polenta frita bem dourada",
    items: [
      { name: "Maionese 400 g", detail: "", price: "R$ 14,00", image: "/images/real-maionese-400g.png", imageAlt: "Maionese de 400 gramas preparada pelo EmpÃ³rio", imageFill: true },
      { name: "Polenta extra", detail: "7 pedaÃ§os.", price: "R$ 5,00", image: "/images/maionese-polenta-v7.webp", imageAlt: "Polenta grossa frita, crocante e bem dourada", imageCrop: "right" },
    ],
  },
  {
    id: "risoto",
    eyebrow: "AlmoÃ§o de fim de semana",
    title: "Risoto",
    description:
      "PorÃ§Ã£o de 900 g para o almoÃ§o de fim de semana e feriados. ProduÃ§Ã£o limitada.",
    availability: "SÃ¡bados, domingos e feriados, no almoÃ§o",
    message:
      "OlÃ¡! Quero consultar o risoto disponÃ­vel hoje para completar meu pedido.",
    image: "/images/risoto-real-v1.webp",
    imageAlt: "Risoto tradicional de frango com a aparÃªncia real do produto",
    items: [
      { name: "Risoto tradicional", detail: "PorÃ§Ã£o de 900 g.", price: "R$ 23,00", image: "/images/risoto-real-v1.webp", imageAlt: "Risoto tradicional de frango com a aparÃªncia real do produto" },
    ],
  },
  {
    id: "mercado",
    eyebrow: "PÃ£o fresco todos os dias",
    title: "PÃ£o & conveniÃªncia",
    description:
      "PÃ£o cacetinho de segunda a sÃ¡bado, a partir das 16h, e aos domingos pela manhÃ£. TambÃ©m hÃ¡ bebidas e itens de conveniÃªncia.",
    availability: "Segunda a sÃ¡bado, a partir das 16h; domingos pela manhÃ£",
    message:
      "OlÃ¡! Quero consultar as bebidas, pÃ£es e itens de conveniÃªncia disponÃ­veis hoje.",
    image: "/images/pao-fresquinho.webp",
    imageAlt: "PÃ£es frescos e dourados",
    items: [
      { name: "PÃ£o cacetinho", detail: "De segunda a sÃ¡bado, a partir das 16h; domingos pela manhÃ£.", price: "Consulte", image: "/images/pao-fresquinho.webp", imageAlt: "PÃ£es frescos recÃ©m-assados" },
      { name: "Bebidas e conveniÃªncia", detail: "OpÃ§Ãµes disponÃ­veis na loja.", price: "Consulte", image: "/images/real-conveniencia-loja.png", imageAlt: "Prateleiras da conveniÃªncia do EmpÃ³rio com bebidas, alimentos e itens para casa", imageFill: true },
    ],
  },
];

const generalMessage =
  "OlÃ¡! Vim pelo site do EmpÃ³rio do Frango e quero fazer um pedido. Pode me enviar as opÃ§Ãµes disponÃ­veis?";

const heroMessage =
  "OlÃ¡! Vim pelo site do EmpÃ³rio do Frango e quero saber o que estÃ¡ disponÃ­vel hoje.";

const heroSlides = [
  {
    src: "/images/hero-frango-margens.webp",
    alt: "Frango inteiro assado e dourado",
  },
  {
    src: "/images/coxinhas-assadas-v3.webp",
    alt: "Coxinhas da asa assadas como sugestÃ£o de preparo",
  },
  {
    src: "/images/espetinhos-sem-texto.webp",
    alt: "Espetinhos de carne, coraÃ§Ã£o, queijo coalho e pÃ£o de alho prontos",
  },
  {
    src: "/images/mesa-completa-hero-v1.webp",
    alt: "Mesa posta com frango assado, cortes de galeto e acompanhamentos",
  },
  {
    src: "/images/frango-assado-molho.webp",
    alt: "Frango assado servido com acompanhamentos",
  },
];

const intentCategories = ["acougue", "frango", "almoco", "espetinhos", "acompanhamentos", "risoto", "mercado"]
  .map((categoryId) => menuCategories.find((category) => category.id === categoryId))
  .filter((category): category is MenuCategory => Boolean(category));

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
      aria-label={`${typeof children === "string" ? children : "Falar no WhatsApp"} â€” abre em uma nova janela`}
    >
      {children}
      <span aria-hidden="true">â†—</span>
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
    <aside className="consent" aria-label="PreferÃªncias de privacidade">
      <div>
        <strong>Sua privacidade importa.</strong>
        <p>
          Usamos mÃ©tricas para entender o desempenho da pÃ¡gina. VocÃª pode
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
          Aceitar mÃ©tricas
        </button>
      </div>
    </aside>
  );
}

function Theãný¶‰žËkºwµç@€€€€€€€€€€€€€€ñ…ÉÑ¥±”±…ÍÍ9…µ”ô‰µ•¹Ôµ¥Ñ•´ˆ­•äõí¥Ñ•´¹¹…µ•ôø(€€€€€€€€€€€€€€€€€í¥Ñ•´¹¥µ…”€ü€ (€€€€€€€€€€€€€€€€€€€¥Ñ•´¹¥µ…•É½À€ü€ (€€€€€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”õíµ•¹Ôµ¥Ñ•´µ¥µ…”µÉ½Àµ•¹Ôµ¥Ñ•´µ¥µ…”µÉ½À´‘í¥Ñ•´¹¥µ…•É½Áõôø(€€€€€€€€€€€€€€€€€€€€€€€€ñ¥µœÍÉŒõí¥Ñ•´¹¥µ…•ô…±Ðõí¥Ñ•´¹¥µ…•±ÑôÝ¥‘Ñ ôˆÄÔÌØˆ¡•¥¡ÐôˆÄÀÈÐˆ±½…‘¥¹œô‰±…éäˆ€¼ø(€€€€€€€€€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€€€€€¤€è€ (€€€€€€€€€€€€€€€€€€€€€€ñ¥µœ(€€€€€€€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”õí¥Ñ•´¹¥µ…•¥±°€ü€‰µ•¹Ôµ¥Ñ•´µ¥µ…”µ™¥±°ˆ€èÕ¹‘•™¥¹•‘ô(€€€€€€€€€€€€€€€€€€€€€€€ÍÉŒõí¥Ñ•´¹¥µ…•ô(€€€€€€€€€€€€€€€€€€€€€€€…±Ðõí¥Ñ•´¹¥µ…•±Ñô(€€€€€€€€€€€€€€€€€€€€€€€Ý¥‘Ñ ôˆààˆ(€€€€€€€€€€€€€€€€€€€€€€€¡•¥¡Ðôˆààˆ(€€€€€€€€€€€€€€€€€€€€€€€±½…‘¥¹œô‰±…éäˆ(€€€€€€€€€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€€€€€€€€€¤(€€€€€€€€€€€€€€€€€€¤€è€ (€€€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰µ•¹Ôµ¥Ñ•´µÁ±…•¡½±‘•Èˆ…É¥„µ¡¥‘‘•¸ô‰ÑÉÕ”ˆùM½ˆ½¹ÍÕ±Ñ„ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€€€¥ô(€€€€€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µ•¹Ôµ¥Ñ•´µ½Áäˆø(€€€€€€€€€€€€€€€€€€€€ñ Ðùí¥Ñ•´¹¹…µ•ôð½ Ðø(€€€€€€€€€€€€€€€€€€€í¥Ñ•´¹‘•Ñ…¥°€˜˜€ñÀùí¥Ñ•´¹‘•Ñ…¥±ôð½Àùô(€€€€€€€€€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€€€€€€€€€€€ñÍÑÉ½¹œùí¥Ñ•´¹ÁÉ¥•ôð½ÍÑÉ½¹œø4(€€€€€€€€€€€€€€€€ð½…ÉÑ¥±”ø4(€€€€€€€€€€€€€€¤¥ô4(€€€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€ð½Í•Ñ¥½¸ø((€€€€€€€€ñÍ•Ñ¥½¸(€€€€€€€€€±…ÍÍ9…µ”ô‰Í­•Ý•ÈµÍÁ½Ñ±¥¡Ðˆ(€€€€€€€€€¥ô‰•ÍÁ•Ñ¥¹¡½Ìˆ(€€€€€€€€€…É¥„µ±…‰•±±•‘‰äô‰Í­•Ý•ÈµÍÁ½Ñ±¥¡ÐµÑ¥Ñ±”ˆ(€€€€€€€€ø(€€€€€€€€€€ñ‘¥Ø(€€€€€€€€€€€±…ÍÍ9…µ”ô‰Í­•Ý•ÈµÍÁ½Ñ±¥¡Ðµµ•‘¥„ˆ(€€€€€€€€€€€É½±”ô‰¥µœˆ(€€€€€€€€€€€…É¥„µ±…‰•°ô‰ÍÁ•Ñ¥¹¡½Ì‘”…É¹”°½É‡Ÿ¼°ÅÕ•¥©¼½…±¡¼”Ã¼‘”…±¡¼ÁÉ½¹Ñ½Ìˆ(€€€€€€€€€€¼ø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰Í­•Ý•ÈµÍÁ½Ñ±¥¡Ðµ½Áäˆø(€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰­¥­•È­¥­•Èµ±¥¡ÐˆùM•Õ¹‘„„Ï…‰…‘¼°ƒ€¹½¥Ñ”ð½Àø(€€€€€€€€€€€€ñ È¥ô‰Í­•Ý•ÈµÍÁ½Ñ±¥¡ÐµÑ¥Ñ±”ˆù¹½¥Ñ”Á•‘”•ÍÁ•Ñ¥¹¡¼¹„‰É…Í„¸ð½ Èø(€€€€€€€€€€€€ñÀø(€€€€€€€€€€€€€Í½±¡„Í•ÔÍ…‰½È°½¹ÍÕ±Ñ”…Ì½ÃŸÕ•Ì‘¼‘¥„”Á—„Á•±¼]¡…ÑÍÁÀ¸(€€€€€€€€€€€€ð½Àø(€€€€€€€€€€€€ñ]¡…ÑÍÁÁ1¥¹¬(€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰‰ÕÑÑ½¸‰ÕÑÑ½¸µÁÉ¥µ…Éäˆ(€€€€€€€€€€€€€µ•ÍÍ…”ô‰=³„„EÕ•É¼½¹ÍÕ±Ñ…È½Ì•ÍÁ•Ñ¥¹¡½Ì‘¥ÍÁ½»µÙ•¥Ì¡½©””™…é•ÈÕ´Á•‘¥‘¼¸ˆ(€€€€€€€€€€€€€¥¹Ñ•É•ÍÐô‰•ÍÁ•Ñ¥¹¡½Ìˆ(€€€€€€€€€€€€€Á±…•µ•¹Ðô‰Í­•Ý•É}ÍÁ½Ñ±¥¡Ðˆ(€€€€€€€€€€€€ø(€€€€€€€€€€€€€A•‘¥È•ÍÁ•Ñ¥¹¡½Ì(€€€€€€€€€€€€ð½]¡…ÑÍÁÁ1¥¹¬ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€ð½Í•Ñ¥½¸ø((€€€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰‰É•…µÍ•Ñ¥½¸ˆ¥ô‰Á…¼ˆ…É¥„µ±…‰•±±•‘‰äô‰‰É•…µÑ¥Ñ±”ˆø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰‰É•…µµ•‘¥„ˆø(€€€€€€€€€€€€ñ¥µœÍÉŒôˆ½¥µ…•Ì½Á…¼µ™É•ÍÅÕ¥¹¡¼¹Ý•‰Àˆ…±Ðô‰C•Ì™É•ÍÅÕ¥¹¡½ÌÉ•¥´µ…ÍÍ…‘½ÌˆÝ¥‘Ñ ôˆÄÐÐàˆ¡•¥¡ÐôˆÄÀàØˆ±½…‘¥¹œô‰±…éäˆ€¼ø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰‰É•…µ±½¬ˆ…É¥„µ±…‰•°ô‰C¼™É•Í¼„Á…ÉÑ¥È‘…Ì€ÄØ¡½É…Ì‘”Í•Õ¹‘„„Ï…‰…‘¼ˆø(€€€€€€€€€€€€€€ñÍÁ…¸ùÁ…ÉÑ¥È‘…Ìð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñÍÑÉ½¹œøÄÙ ð½ÍÑÉ½¹œø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰‰É•…µ½Áäˆø4(€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰­¥­•ÈˆùC¼…•Ñ¥¹¡¼ð½Àø(€€€€€€€€€€€€ñ È¥ô‰‰É•…µÑ¥Ñ±”ˆùC¼™É•Í¼Ñ½‘½Ì½Ì‘¥…Ì¸ð½ Èø(€€€€€€€€€€€€ñÀø(€€€€€€€€€€€€€”Í•Õ¹‘„„Ï…‰…‘¼°„Á…ÉÑ¥È‘…Ì€ÄÙ ¸½Ì‘½µ¥¹½Ì°Á•±„µ…¹£Œ¸(€€€€€€€€€€€€ð½Àø(€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€€€ñ]¡…ÑÍÁÁ1¥¹¬4(€€€€€€€€€€€±…ÍÍ9…µ”ô‰‰ÕÑÑ½¸‰ÕÑÑ½¸µ‘…É¬ˆ4(€€€€€€€€€€€µ•ÍÍ…”ô‰=³„„Y¥´Á•±¼Í¥Ñ””ÅÕ•É¼É•Í•ÉÙ…ÈÃ¼…•Ñ¥¹¡¼¸EÕ…°ƒ¤¼¡½Ë…É¥¼‘¥ÍÁ½»µÙ•°¹¼‘¥„•Í½±¡¥‘¼üˆ(€€€€€€€€€€€¥¹Ñ•É•ÍÐô‰Á…½}™É•Í¼ˆ4(€€€€€€€€€€€Á±…•µ•¹Ðô‰‰É•…‘}¡¥¡±¥¡Ðˆ4(€€€€€€€€€€ø4(€€€€€€€€€€€I•Í•ÉÙ…ÈÃ¼4(€€€€€€€€€€ð½]¡…ÑÍÁÁ1¥¹¬ø4(€€€€€€€€ð½Í•Ñ¥½¸ø4(4(€€€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰ÅÕ…±¥ÑäµÍ•Ñ¥½¸ˆ¥ô‰Í•ÕÉ…¹„µ…±¥µ•¹Ñ…Èˆ…É¥„µ±…‰•±±•‘‰äô‰ÅÕ…±¥ÑäµÑ¥Ñ±”ˆø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ÅÕ…±¥Ñäµµ•‘¥„ˆø(€€€€€€€€€€€€ñÙ¥‘•¼(€€€€€€€€€€€€€…ÕÑ½A±…ä(€€€€€€€€€€€€€±½½À(€€€€€€€€€€€€€µÕÑ•(€€€€€€€€€€€€€Á±…åÍ%¹±¥¹”(€€€€€€€€€€€€€ÁÉ•±½…ô‰µ•Ñ…‘…Ñ„ˆ(€€€€€€€€€€€€€Á½ÍÑ•Èôˆ½¥µ…•Ì½½É……¼µÑ•µÁ•É…‘¼µµ…ÅÕ¥¹„µÁ½ÍÑ•È¹©Áœˆ(€€€€€€€€€€€€€…É¥„µ±…‰•°ô‰½É‡ŸÕ•Ì‘”™É…¹¼É••‰•¹‘¼Ñ•µÁ•É¼•´µ…ÅÕ¥»…É¥¼ÁÉ½™¥ÍÍ¥½¹…°ˆ(€€€€€€€€€€€€ø(€€€€€€€€€€€€€€ñÍ½ÕÉ”ÍÉŒôˆ½Ù¥‘•½Ì½½É……¼µÑ•µÁ•É…‘¼µµ…ÅÕ¥¹„¹µÀÐˆÑåÁ”ô‰Ù¥‘•¼½µÀÐˆ€¼ø(€€€€€€€€€€€€€M•Ô¹…Ù•…‘½È»¼½™•É•”ÍÕÁ½ÉÑ”ƒ€É•ÁÉ½‘×Ÿ¼‘”Ûµ‘•¼¸(€€€€€€€€€€€€ð½Ù¥‘•¼ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ÅÕ…±¥Ñäµ½Áäˆø(€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰­¥­•È­¥­•Èµ±¥¡ÐˆùAÉ½‘×Ÿ¼…½µÁ…¹¡…‘„Á•±¼M%4ð½Àø(€€€€€€€€€€€€ñ È¥ô‰ÅÕ…±¥ÑäµÑ¥Ñ±”ˆùAÉ½‘×Ÿ¼É•Õ±…É¥é…‘„°‘¼ÁÉ•Á…É¼…¼‰•¹•™¥¥…µ•¹Ñ¼¸ð½ Èø(€€€€€€€€€€€€ñÀø(€€€€€€€€€€€€€<É•¥ÍÑÉ¼µÕ¹¥¥Á…°…‰É…¹”„µ…¹¥ÁÕ±‡Ÿ¼”¼‰•¹•™¥¥…µ•¹Ñ¼‘”(€€€€€€€€€€€€€…É¹•Ì¸<…±•Ñ¼Ñ•µÁ•É…‘¼ƒ¤¼ÁÉ¥¹¥Á…°ÁÉ½‘ÕÑ¼‘„…Í„¸(€€€€€€€€€€€€ð½Àø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰Í…¹¥Ñ…Éäµ‰…‘”ˆø(€€€€€€€€€€€€€€ñÍÑÉ½¹œùÍÑ…‰•±•¥µ•¹Ñ¼É•¥ÍÑÉ…‘¼¹¼L¹$¹4¸ƒŠP»
è€ÀØÄð½ÍÑÉ½¹œø(€€€€€€€€€€€€€€ñÍÁ…¸ù5…¹¥ÁÕ±‡Ÿ¼”‰•¹•™¥¥…µ•¹Ñ¼‘”…É¹•Ì½´…½µÁ…¹¡…µ•¹Ñ¼”™¥Í…±¥é‡Ÿ¼¸ð½ÍÁ…¸ø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€ñÕ°ø(€€€€€€€€€€€€€€ñ±¤øñÍÁ…¸øÀÄð½ÍÁ…¸ùI•ÍÁ½¹Ï…Ù•°Ó¥¹¥„Ù•Ñ•É¥»…É¥„ð½±¤ø(€€€€€€€€€€€€€€ñ±¤øñÍÁ…¸øÀÈð½ÍÁ…¸ùM…±„‘”…ÍÍ•ÁÍ¥„ð½±¤ø(€€€€€€€€€€€€€€ñ±¤øñÍÁ…¸øÀÌð½ÍÁ…¸ùµ‰¥•¹Ñ”±¥µ…Ñ¥é…‘¼ð½±¤ø(€€€€€€€€€€€€€€ñ±¤øñÍÁ…¸øÀÐð½ÍÁ…¸ù5…ÅÕ¥»…É¥¼•ÍÁ•µ™¥¼ð½±¤ø(€€€€€€€€€€€€ð½Õ°ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€ð½Í•Ñ¥½¸ø4(4(€€€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰Í•Ñ¥½¸ÁÉ•½É‘•ÈµÍ•Ñ¥½¸ˆ…É¥„µ±…‰•±±•‘‰äô‰ÁÉ•½É‘•ÈµÑ¥Ñ±”ˆø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ÁÉ•½É‘•Èµ¡•…‘¥¹œˆø(€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰­¥­•ÈˆùA•‘¥‘½Ì‘”™¥´‘”Í•µ…¹„ð½Àø(€€€€€€€€€€€€ñ È¥ô‰ÁÉ•½É‘•ÈµÑ¥Ñ±”ˆùI•Í•ÉÙ”½´…¹Ñ••“©¹¥„¸ð½ Èø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ñ½°±…ÍÍ9…µ”ô‰ÁÉ•½É‘•Èµ±¥ÍÐˆø(€€€€€€€€€€€€ñ±¤øñÍÁ…¸øÄð½ÍÁ…¸øñ‘¥ØøñÍÑÉ½¹œù‡„ÍÕ„É•Í•ÉÙ„ð½ÍÑÉ½¹œøñÀù%¹™½Éµ”¼‘¥„”„ÅÕ…¹Ñ¥‘…‘”¸ð½Àøð½‘¥Øøð½±¤ø(€€€€€€€€€€€€ñ±¤øñÍÁ…¸øÈð½ÍÁ…¸øñ‘¥ØøñÍÑÉ½¹œùÕ…É‘”„½¹™¥Éµ‡Ÿ¼ð½ÍÑÉ½¹œøñÀù•ÅÕ¥Á”Ù•É¥™¥„±½Ñ”°¡½Ë…É¥¼”‘¥ÍÁ½¹¥‰¥±¥‘…‘”¸ð½Àøð½‘¥Øøð½±¤ø(€€€€€€€€€€€€ñ±¤øñÍÁ…¸øÌð½ÍÁ…¸øñ‘¥ØøñÍÑÉ½¹œù½µ‰¥¹”½µ¼É••‰•Èð½ÍÑÉ½¹œøñÀùÍ½±¡„É•Ñ¥É…‘„½Ô•¹ÑÉ•„°½¹™½Éµ”¼•¹‘•É—¼¸ð½Àøð½‘¥Øøð½±¤ø(€€€€€€€€€€ð½½°ø4(€€€€€€€€€€ñ]¡…ÑÍÁÁ1¥¹¬4(€€€€€€€€€€€±…ÍÍ9…µ”ô‰‰ÕÑÑ½¸‰ÕÑÑ½¸µ‘…É¬ˆ4(€€€€€€€€€€€µ•ÍÍ…”ô‰=³„„Y¥´Á•±¼Í¥Ñ””ÅÕ•É¼™…é•ÈÕµ„•¹½µ•¹‘„…¹Ñ•¥Á…‘„¸ˆ4(€€€€€€€€€€€¥¹Ñ•É•ÍÐô‰•¹½µ•¹‘…}…¹Ñ•¥Á…‘„ˆ4(€€€€€€€€€€€Á±…•µ•¹Ðô‰ÁÉ•½É‘•Èˆ4(€€€€€€€€€€ø4(€€€€€€€€€€€…é•ÈÁ•‘¥‘¼(€€€€€€€€€€ð½]¡…ÑÍÁÁ1¥¹¬ø4(€€€€€€€€ð½Í•Ñ¥½¸ø4(4(€€€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰Í•Ñ¥½¸…±±•ÉäµÍ•Ñ¥½¸ˆ¥ô‰…±•É¥„ˆ…É¥„µ±…‰•±±•‘‰äô‰…±±•ÉäµÑ¥Ñ±”ˆø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰Í•Ñ¥½¸µ¡•…‘¥¹œˆø(€€€€€€€€€€€€ñ‘¥Øø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰­¥­•Èˆù„½é¥¹¡„”‘¼‰…±¼ð½Àø(€€€€€€€€€€€€€€ñ È¥ô‰…±±•ÉäµÑ¥Ñ±”ˆù<ÅÕ”Ù½¨•¹½¹ÑÉ„¹¼µÃÍÉ¥¼¸ð½ Èø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰…±±•ÉäµÍ¡½Ý…Í”ˆø4(€€€€€€€€€€€€ñ™¥ÕÉ”±…ÍÍ9…µ”ô‰…±±•ÉäµÙ¥‘•¼ˆø(€€€€€€€€€€€€€€ñ1…éåY¥‘•¼(€€€€€€€€€€€€€€€½¹ÑÉ½±Ì(€€€€€€€€€€€€€€€ÍÉŒôˆ½Ù¥‘•½Ì½™É…¹¼µ…ÍÍ…‘¼µÁÉ½‘Õ…¼µØÄ¹µÀÐˆ(€€€€€€€€€€€€€€€Á½ÍÑ•Èôˆ½¥µ…•Ì½™É…¹¼µ…ÍÍ…‘¼µÁÉ½‘Õ…¼µØÄµÁ½ÍÑ•È¹Ý•‰Àˆ(€€€€€€€€€€€€€€€±…‰•°ô‰É…¹½Ì…ÍÍ…‘½ÌÍ…¥¹‘¼‘„·…ÅÕ¥¹„”Í•¹‘¼ÁÉ•Á…É…‘½ÌÁ…É„É•Ñ¥É…‘„ˆ(€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€€€ñ™¥…ÁÑ¥½¸ùÉ…¹¼…ÍÍ…‘¼è‘„·…ÅÕ¥¹„ƒ€•µ‰…±…•´ð½™¥…ÁÑ¥½¸ø(€€€€€€€€€€€€ð½™¥ÕÉ”ø4(4(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰…±±•ÉäµÉ¥ˆø4(€€€€€€€€€€€€€€ñ™¥ÕÉ”ø(€€€€€€€€€€€€€€€€ñ¥µœÍÉŒôˆ½¥µ…•Ì½É•…°µ™É…¹½Ìµ…ÍÍ…‘½Ì¹Á¹œˆ…±Ðô‰É…¹½Ì¥¹Ñ•¥É½Ì…ÍÍ…‘½Ì¹„ÁÉ½‘×Ÿ¼‘¼µÃÍÉ¥¼ˆÝ¥‘Ñ ôˆÐÀÐˆ¡•¥¡ÐôˆÐàÌˆ±½…‘¥¹œô‰±…éäˆ‘•½‘¥¹œô‰…Íå¹Œˆ€¼ø(€€€€€€€€€€€€€€€€ñ™¥…ÁÑ¥½¸ùÉ…¹¼…ÍÍ…‘¼ð½™¥…ÁÑ¥½¸ø(€€€€€€€€€€€€€€ð½™¥ÕÉ”ø(€€€€€€€€€€€€€€ñ™¥ÕÉ”ø(€€€€€€€€€€€€€€€€ñ¥µœÍÉŒôˆ½¥µ…•Ì½µ…Éµ¥Ñ•àµ…±µ½¼µØÈ¹©Áœˆ…±Ðô‰5…Éµ¥Ñ•à½´É•™•§Ÿ¼½µÁ±•Ñ„ˆÝ¥‘Ñ ôˆÄØÀÀˆ¡•¥¡ÐôˆÄÀØÜˆ±½…‘¥¹œô‰±…éäˆ‘•½‘¥¹œô‰…Íå¹Œˆ€¼ø(€€€€€€€€€€€€€€€€ñ™¥…ÁÑ¥½¸ù5…Éµ¥Ñ•àð½™¥…ÁÑ¥½¸ø(€€€€€€€€€€€€€€ð½™¥ÕÉ”ø(€€€€€€€€€€€€€€ñ™¥ÕÉ”ø(€€€€€€€€€€€€€€€€ñ¥µœÍÉŒôˆ½¥µ…•Ì½É•…°µµ…¥½¹•Í”´ÐÀÁœ¹Á¹œˆ…±Ðô‰5…¥½¹•Í”‘”€ÐÀÀÉ…µ…ÌÁÉ•Á…É…‘„Á•±¼µÃÍÉ¥¼ˆÝ¥‘Ñ ôˆÌÜÀˆ¡•¥¡ÐôˆÔÌÄˆ±½…‘¥¹œô‰±…éäˆ‘•½‘¥¹œô‰…Íå¹Œˆ€¼ø(€€€€€€€€€€€€€€€€ñ™¥…ÁÑ¥½¸ù5…¥½¹•Í”€ÐÀÀœð½™¥…ÁÑ¥½¸ø(€€€€€€€€€€€€€€ð½™¥ÕÉ”ø(€€€€€€€€€€€€€€ñ™¥ÕÉ”ø(€€€€€€€€€€€€€€€€ñ¥µœÍÉŒôˆ½¥µ…•Ì½É•…°µ½¹Ù•¹¥•¹¥„µ±½©„¹Á¹œˆ…±Ðô‰AÉ…Ñ•±•¥É…Ì‘„½¹Ù•¹§©¹¥„‘¼µÃÍÉ¥¼ˆÝ¥‘Ñ ôˆÐÀÄˆ¡•¥¡ÐôˆÔäÔˆ±½…‘¥¹œô‰±…éäˆ‘•½‘¥¹œô‰…Íå¹Œˆ€¼ø(€€€€€€€€€€€€€€€€ñ™¥…ÁÑ¥½¸ù½¹Ù•¹§©¹¥„ð½™¥…ÁÑ¥½¸ø(€€€€€€€€€€€€€€ð½™¥ÕÉ”ø(€€€€€€€€€€€€€€ñ™¥ÕÉ”ø(€€€€€€€€€€€€€€€€ñ¥µœÍÉŒôˆ½¥µ…•Ì½É¥Í½Ñ¼µÉ•…°µØÄ¹Ý•‰Àˆ…±Ðô‰I¥Í½Ñ¼ÑÉ…‘¥¥½¹…°‘”™É…¹¼½´„…Á…Ë©¹¥„É•…°‘¼ÁÉ½‘ÕÑ¼ˆÝ¥‘Ñ ôˆÄÌÈÀˆ¡•¥¡ÐôˆäÜÌˆ±½…‘¥¹œô‰±…éäˆ‘•½‘¥¹œô‰…Íå¹Œˆ€¼ø(€€€€€€€€€€€€€€€€ñ™¥…ÁÑ¥½¸ùI¥Í½Ñ¼€äÀÀœð½™¥…ÁÑ¥½¸ø(€€€€€€€€€€€€€€ð½™¥ÕÉ”ø(€€€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€ð½Í•Ñ¥½¸ø4(4(€€€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰Í•Ñ¥½¸¡½ÕÉÌµÍ•Ñ¥½¸ˆ¥ô‰¡½É…É¥½Ìˆ…É¥„µ±…‰•±±•‘‰äô‰¡½ÕÉÌµÑ¥Ñ±”ˆø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰¡½ÕÉÌµ¡•…‘¥¹œˆø(€€€€€€€€€€€€ñ‘¥Øø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰­¥­•Èˆù¹Ñ•Ì‘”Í…¥È‘”…Í„ð½Àø(€€€€€€€€€€€€€€ñ È¥ô‰¡½ÕÉÌµÑ¥Ñ±”ˆù!½Ë…É¥¼‘„±½©„”‘¥…Ì‘”ÁÉ½‘×Ÿ¼¸ð½ Èø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰¡½ÕÉÌµ…Ñ¥½¸ˆø(€€€€€€€€€€€€€€ñ]¡…ÑÍÁÁ1¥¹¬(€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰‰ÕÑÑ½¸‰ÕÑÑ½¸µÁÉ¥µ…Éäˆ(€€€€€€€€€€€€€€€µ•ÍÍ…”ô‰=³„„EÕ•É¼½¹™¥Éµ…È½Ì¡½Ë…É¥½Ì”„‘¥ÍÁ½¹¥‰¥±¥‘…‘”‘½ÌÁÉ½‘ÕÑ½Ì‘”¡½©”¸ˆ(€€€€€€€€€€€€€€€¥¹Ñ•É•ÍÐô‰¡½É…É¥½Ìˆ(€€€€€€€€€€€€€€€Á±…•µ•¹Ðô‰¡½ÕÉÌˆ(€€€€€€€€€€€€€€ø(€€€€€€€€€€€€€€€½¹™¥Éµ…È‘¥ÍÁ½¹¥‰¥±¥‘…‘”(€€€€€€€€€€€€€€ð½]¡…ÑÍÁÁ1¥¹¬ø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ð½‘¥Øø(4(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰¡½ÕÉÌµ½¹Ñ•¹Ðˆø4(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰½Á•¹¥¹œµ¡½ÕÉÌˆø(€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰½Á•¹¥¹œµ¡½ÕÉÌµ¡•…‘•Èˆø(€€€€€€€€€€€€€€€€ñ Ìù!½Ë…É¥½Ì‘”…Ñ•¹‘¥µ•¹Ñ¼ð½ Ìø(€€€€€€€€€€€€€€€€ñÍÁ…¸ùIÕ„Y•»‰¹¥¼¥É•Ì°€ÐÜÀð½ÍÁ…¸ø(€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€ñ‘°ø(€€€€€€€€€€€€€€€€ñ‘¥Øøñ‘ÐùM•Õ¹‘„ð½‘Ðøñ‘øÄÙ ƒŠP€ÈÅ ð½‘øð½‘¥Øø4(€€€€€€€€€€€€€€€€ñ‘¥Øøñ‘ÐùQ•Ë„„Í•áÑ„ð½‘Ðøñ‘øå ƒŠP€ÄÉ ÌÀñ‰È€¼øÄÙ ƒŠP€ÈÅ ð½‘øð½‘¥Øø(€€€€€€€€€€€€€€€€ñ‘¥Øøñ‘ÐùO…‰…‘¼ð½‘Ðøñ‘øå ƒŠP€ÄÍ ÌÀñ‰È€¼øÄÙ ƒŠP€ÈÁ ð½‘øð½‘¥Øø(€€€€€€€€€€€€€€€€ñ‘¥Øøñ‘Ðù½µ¥¹½Ì”™•É¥…‘½Ìð½‘Ðøñ‘øá ÌÀƒŠP€ÄÍ ÌÀð½‘øð½‘¥Øø(€€€€€€€€€€€€€€ð½‘°ø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€ð½Í•Ñ¥½¸ø(4(€€€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰Í•Ñ¥½¸É½ÕÑ•ÌµÍ•Ñ¥½¸ˆ…É¥„µ±…‰•±±•‘‰äô‰É½ÕÑ•ÌµÑ¥Ñ±”ˆø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰Í•Ñ¥½¸µ¡•…‘¥¹œˆø(€€€€€€€€€€€€ñ‘¥Øø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰­¥­•ÈˆùA•‘¥‘¼°É•Ñ¥É…‘„”•¹ÑÉ•„ð½Àø(€€€€€€€€€€€€€€ñ È¥ô‰É½ÕÑ•ÌµÑ¥Ñ±”ˆùA—„…¹Ñ•Ì‘”Í…¥È¸ð½ Èø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€ñÀù½¹™¥Éµ”¼Á•‘¥‘¼”½µ‰¥¹”„É•Ñ¥É…‘„½Ô„•¹ÑÉ•„Á•±¼]¡…ÑÍÁÀ¸ð½Àø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰É½ÕÑ•ÌµÉ¥ˆø(€€€€€€€€€€€€ñ…ÉÑ¥±”ø(€€€€€€€€€€€€€€ñÍÁ…¸øÀÄð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñ ÌùA•‘¥‘¼Á•±¼]¡…ÑÍÁÀð½ Ìø(€€€€€€€€€€€€€€ñÀù¹½µ•¹‘…Ì°…É“…Á¥¼‘¼‘¥„”‘¥ÍÁ½¹¥‰¥±¥‘…‘”¸ð½Àø(€€€€€€€€€€€€ð½…ÉÑ¥±”ø(€€€€€€€€€€€€ñ…ÉÑ¥±”ø(€€€€€€€€€€€€€€ñÍÁ…¸øÀÈð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñ ÌùI•Ñ¥É…‘„½µ‰¥¹…‘„ð½ Ìø(€€€€€€€€€€€€€€ñÀù½µ‰¥¹””…Õ…É‘”„½¹™¥Éµ‡Ÿ¼‘¼¡½Ë…É¥¼‘”É•Ñ¥É…‘„¸ð½Àø(€€€€€€€€€€€€ð½…ÉÑ¥±”ø(€€€€€€€€€€€€ñ…ÉÑ¥±”ø(€€€€€€€€€€€€€€ñÍÁ…¸øÀÌð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñ Ìù¥½½ð½ Ìø(€€€€€€€€€€€€€€ñÀù¥ÍÁ½»µÙ•°ÁÉ¥¹¥Á…±µ•¹Ñ”¹½Ì™¥¹Ì‘”Í•µ…¹„¸ð½Àø(€€€€€€€€€€€€ð½…ÉÑ¥±”ø(€€€€€€€€€€€€ñ…ÉÑ¥±”±…ÍÍ9…µ”ô‰É½ÕÑ”µ…Éµ‘•±¥Ù•Éäˆø(€€€€€€€€€€€€€€ñ1…éåY¥‘•¼(€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰É½ÕÑ”µ…ÉµÙ¥‘•¼ˆ(€€€€€€€€€€€€€€€ÍÉŒôˆ½Ù¥‘•½Ì½•¹ÑÉ•„µ•µÁ½É¥¼µØÄ¹µÀÐˆ(€€€€€€€€€€€€€€€Á½ÍÑ•Èôˆ½¥µ…•Ì½•¹ÑÉ•„µ•µÁ½É¥¼µØÄµÁ½ÍÑ•È¹Ý•‰Àˆ(€€€€€€€€€€€€€€€±…‰•°ô‰¹ÑÉ•„‘¼µÃÍÉ¥¼Í…¥¹‘¼‘”µ½Ñ¼ˆ(€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€€€ñÍÁ…¸øÀÐð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñ Ìù¹ÑÉ•„ð½ Ìø(€€€€€€€€€€€€€€ñÀù¹ÑÉ•„Á½ÈÑ•±•µ½Ñ¼¸½‰•ÉÑÕÉ„”Ñ…á„Ù…É¥…´½¹™½Éµ”¼•¹‘•É—¼¸ð½Àø(€€€€€€€€€€€€ð½…ÉÑ¥±”ø(€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€ð½Í•Ñ¥½¸ø4(4(€€€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰±½…Ñ¥½¸µÍ•Ñ¥½¸ˆ¥ô‰±½…±¥é……¼ˆ…É¥„µ±…‰•±±•‘‰äô‰±½…Ñ¥½¸µÑ¥Ñ±”ˆø4(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰±½…Ñ¥½¸µ½Áäˆø4(€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰­¥­•È­¥­•Èµ±¥¡Ðˆù9¼•¹ÑÉ¼‘”M…¹Ñ„5…É¥„ð½Àø4(€€€€€€€€€€€€ñ È¥ô‰±½…Ñ¥½¸µÑ¥Ñ±”ˆùA…ÍÍ”¹¼µÃÍÉ¥¼¸ð½ Èø4(€€€€€€€€€€€€ñ…‘‘É•ÍÌø4(€€€€€€€€€€€€€IÕ„Y•»‰¹¥¼¥É•Ì°€ÐÜÀñ‰È€¼ø4(€€€€€€€€€€€€€•¹ÑÉ¼ƒ
ÜM…¹Ñ„5…É¥„½ILñ‰È€¼ø4(€€€€€€€€€€€€€@€äÜÀÄÀ´ÀÀÔ4(€€€€€€€€€€€€ð½…‘‘É•ÍÌø4(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰±½…Ñ¥½¸µ…Ñ¥½¹Ìˆø4(€€€€€€€€€€€€€€ñ„4(€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰‰ÕÑÑ½¸‰ÕÑÑ½¸µÁÉ¥µ…Éäˆ4(€€€€€€€€€€€€€€€¡É•˜ô‰¡ÑÑÁÌè¼½ÝÝÜ¹½½±”¹½´½µ…ÁÌ½Í•…É ¼ý…Á¤ôÄ™ÅÕ•ÉäõIÕ„”ÈÁY•¸•Ì•É¹¥¼”ÈÁ¥É•Ì”É”ÈÀÐÜÀ”É”ÈÁM…¹Ñ„”ÈÁ5…É¥„”É”ÈÁILˆ4(€€€€€€€€€€€€€€€Ñ…É•Ðô‰}‰±…¹¬ˆ4(€€€€€€€€€€€€€€€É•°ô‰¹½É•™•ÉÉ•Èˆ4(€€€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÍ•¹‘Ù•¹Ð ‰‘¥É•Ñ¥½¹Í}±¥¬ˆ°ìÁ±…•µ•¹Ðè€‰±½…Ñ¥½¸ˆô¥ô4(€€€€€€€€€€€€€€ø4(€€€€€€€€€€€€€€€½µ¼¡•…È€ñÍÁ…¸…É¥„µ¡¥‘‘•¸ô‰ÑÉÕ”ˆûŠ\ð½ÍÁ…¸ø4(€€€€€€€€€€€€€€ð½„ø4(€€€€€€€€€€€€€€ñ„4(€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰Á¡½¹”µ±¥¹¬ˆ4(€€€€€€€€€€€€€€€¡É•˜ô‰Ñ•°è¬ÔÔÔÔÌÌÄÄÜÄÐÈˆ4(€€€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÍ•¹‘Ù•¹Ð ‰Á¡½¹•}±¥¬ˆ°ìÁ±…•µ•¹Ðè€‰±½…Ñ¥½¸ˆô¥ô4(€€€€€€€€€€€€€€ø4(€€€€€€€€€€€€€€€€ ÔÔ¤€ÌÌÄÄ´ÜÄÐÈ4(€€€€€€€€€€€€€€ð½„ø4(€€€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰Í½¥…°µ±¥¹­Ìˆ…É¥„µ±…‰•°ô‰I•‘•ÌÍ½¥…¥Ìˆø4(€€€€€€€€€€€€€€ñ„¡É•˜ô‰¡ÑÑÁÌè¼½ÝÝÜ¹¥¹ÍÑ…É…´¹½´½•µÁ½É¥½‘½™É…¹½Í´¼ˆÑ…É•Ðô‰}‰±…¹¬ˆÉ•°ô‰¹½É•™•ÉÉ•Èˆ½¹±¥¬õì ¤€ôøÍ•¹‘Ù•¹Ð ‰Í½¥…±}±¥¬ˆ°ì¹•ÑÝ½É¬è€‰¥¹ÍÑ…É…´ˆô¥ôù%¹ÍÑ…É…´ƒŠ\ð½„ø4(€€€€€€€€€€€€€€ñ„¡É•˜ô‰¡ÑÑÁÌè¼½ÝÝÜ¹™…•‰½½¬¹½´½•µÁ½É¥½‘½™É…¹½Í´¼ˆÑ…É•Ðô‰}‰±…¹¬ˆÉ•°ô‰¹½É•™•ÉÉ•Èˆ½¹±¥¬õì ¤€ôøÍ•¹‘Ù•¹Ð ‰Í½¥…±}±¥¬ˆ°ì¹•ÑÝ½É¬è€‰™…•‰½½¬ˆô¥ôù…•‰½½¬ƒŠ\ð½„ø4(€€€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µ…ÀµÝÉ…Àˆø4(€€€€€€€€€€€€ñ¥™É…µ”4(€€€€€€€€€€€€€Ñ¥Ñ±”ô‰1½…±¥é‡Ÿ¼‘¼µÃÍÉ¥¼‘¼É…¹¼¹¼½½±”5…ÁÌˆ4(€€€€€€€€€€€€€ÍÉŒô‰¡ÑÑÁÌè¼½ÝÝÜ¹½½±”¹½´½µ…ÁÌýÄõIÕ„”ÈÁY•¸•Ì•É¹¥¼”ÈÁ¥É•Ì”É”ÈÀÐÜÀ”É”ÈÁM…¹Ñ„”ÈÁ5…É¥„”É”ÈÁIL™½ÕÑÁÕÐõ•µ‰•ˆ4(€€€€€€€€€€€€€±½…‘¥¹œô‰±…éäˆ4(€€€€€€€€€€€€€É•™•ÉÉ•ÉA½±¥äô‰¹¼µÉ•™•ÉÉ•ÈµÝ¡•¸µ‘½Ý¹É…‘”ˆ4(€€€€€€€€€€€€¼ø4(€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€ð½Í•Ñ¥½¸ø4(4(€€€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰™¥¹…°µÑ„ˆ…É¥„µ±…‰•±±•‘‰äô‰™¥¹…°µÑ¥Ñ±”ˆø(€€€€€€€€€€ñ‘¥Øø(€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰­¥­•È­¥­•Èµ±¥¡ÐˆùA•‘¥‘¼Á•±¼]¡…ÑÍÁÀð½Àø(€€€€€€€€€€€€ñ È¥ô‰™¥¹…°µÑ¥Ñ±”ˆù¥„¼ÅÕ”ÁÉ½ÕÉ„¸•ÅÕ¥Á”½¹™¥Éµ„¸ð½ Èø(€€€€€€€€€€ð½‘¥Øø4(€€€€€€€€€€ñ]¡…ÑÍÁÁ1¥¹¬4(€€€€€€€€€€€±…ÍÍ9…µ”ô‰‰ÕÑÑ½¸‰ÕÑÑ½¸µÁÉ¥µ…Éäˆ4(€€€€€€€€€€€µ•ÍÍ…”õí•¹•É…±5•ÍÍ…•ô4(€€€€€€€€€€€¥¹Ñ•É•ÍÐô‰•É…°ˆ4(€€€€€€€€€€€Á±…•µ•¹Ðô‰™¥¹…±}Ñ„ˆ4(€€€€€€€€€€ø4(€€€€€€€€€€€…±…È½´„•ÅÕ¥Á”(€€€€€€€€€€ð½]¡…ÑÍÁÁ1¥¹¬ø4(€€€€€€€€ð½Í•Ñ¥½¸ø4(€€€€€€ð½µ…¥¸ø4(4(€€€€€€ñ™½½Ñ•Èø4(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™½½Ñ•Èµ‰É…¹ˆø(€€€€€€€€€€ñ¥µœÍÉŒôˆ½•µÁ½É¥¼µ±½¼¹ÍÙœˆ…±Ðô‰µÃÍÉ¥¼‘¼É…¹¼I½Ñ¥ÍÍ•É¥”ˆ€¼ø(€€€€€€€€€€ñÀùI½Ñ¥ÍÍ•É¥”¹¼•¹ÑÉ¼‘”M…¹Ñ„5…É¥„°‘•Í‘”€ÈÀÈÈ¸ð½Àø(€€€€€€€€ð½‘¥Øø4(€€€€€€€€ñ‘¥Øø4(€€€€€€€€€€ñÍÑÉ½¹œùµÃÍÉ¥¼‘¼É…¹¼ð½ÍÑÉ½¹œø4(€€€€€€€€€€ñÀùIÕ„Y•»‰¹¥¼¥É•Ì°€ÐÜÀƒ
Ü•¹ÑÉ¼ñ‰È€¼ùM…¹Ñ„5…É¥„½ILð½Àø4(€€€€€€€€ð½‘¥Øø4(€€€€€€€€ñ‘¥Øø4(€€€€€€€€€€ñÍÑÉ½¹œù½¹Ñ…Ñ¼ð½ÍÑÉ½¹œø4(€€€€€€€€€€ñÀøñ„¡É•˜ô‰Ñ•°è¬ÔÔÔÔÌÌÄÄÜÄÐÈˆø ÔÔ¤€ÌÌÄÄ´ÜÄÐÈð½„øñ‰È€¼øñ„¡É•˜ô‰¡ÑÑÁÌè¼½ÝÝÜ¹¥¹ÍÑ…É…´¹½´½•µÁ½É¥½‘½™É…¹½Í´¼ˆÑ…É•Ðô‰}‰±…¹¬ˆÉ•°ô‰¹½É•™•ÉÉ•Èˆù•µÁ½É¥½‘½™É…¹½Í´ð½„øð½Àø4(€€€€€€€€ð½‘¥Øø4(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™½½Ñ•Èµ±•…°ˆø4(€€€€€€€€€€ñÀù9A(€ÐÔ¸ààÌ¸ÈÔà¼ÀÀÀÄ´ÄÄð½Àø4(€€€€€€€€€€ñÀû
¤€ÈÀÈØµÃÍÉ¥¼‘¼É…¹¼¸ð½Àø4(€€€€€€€€ð½‘¥Øø4(€€€€€€ð½™½½Ñ•Èø4(4(€€€€€€ñ]¡…ÑÍÁÁ1¥¹¬4(€€€€€€€±…ÍÍ9…µ”ô‰µ½‰¥±”µÝ¡…ÑÍ…ÁÀˆ4(€€€€€€€µ•ÍÍ…”õí•¹•É…±5•ÍÍ…•ô4(€€€€€€€¥¹Ñ•É•ÍÐô‰•É…°ˆ4(€€€€€€€Á±…•µ•¹Ðô‰µ½‰¥±•}™¥á•ˆ4(€€€€€€ø(€€€€€€€A•‘¥È…½É„(€€€€€€ð½]¡…ÑÍÁÁ1¥¹¬ø(€€€€€€ñQÉ…­¥¹½¹Í•¹Ð€¼ø4(€€€€ð¼ø4(€€¤ì4)ô4(