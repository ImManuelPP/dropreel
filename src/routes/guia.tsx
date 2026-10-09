import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import guiaCss from "@/components/guia/guia.css?url";

// Oferta de bienvenida: 24 h desde la primera visita de cada persona. No se reinicia al volver.
const OFFER_MS = 24 * 60 * 60 * 1000;
const OFFER_KEY = "guia_offer_start";
const PRICE_OFFER = "19,99 €";
const PRICE_NORMAL = "39,99 €";
// Enlaces de pago: uno con el precio de oferta (con el cupón) y otro con el precio normal
const CHECKOUT_OFFER = "https://droppreel.gumroad.com/l/ygwyz/LANZAMIENTO";
const CHECKOUT_NORMAL = "https://droppreel.gumroad.com/l/ygwyz";

export const Route = createFileRoute("/guia")({
  head: () => ({
    meta: [
      { title: "Guía IA Viral + Pack de Prompts — Droppreel" },
      {
        name: "description",
        content:
          "Pon tu cara en cualquier vídeo sin saber nada de IA: guía paso a paso con prompts listos para copiar, asistencia y comunidad de WhatsApp.",
      },
      { property: "og:title", content: "Guía IA Viral + Pack de Prompts — Droppreel" },
      {
        property: "og:description",
        content: "Pon tu cara en cualquier vídeo. Sin saber nada de IA.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/videos/guia-demo-poster.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: guiaCss }],
  }),
  component: GuiaPage,
});

const pad = (n: number) => String(n).padStart(2, "0");

// First visit is remembered in this browser so the clock keeps running instead of restarting
function readOfferEnd() {
  let start = Date.now();
  try {
    const saved = Number(localStorage.getItem(OFFER_KEY));
    if (saved > 0 && saved <= Date.now()) start = saved;
    else localStorage.setItem(OFFER_KEY, String(start));
  } catch {
    // Storage blocked: the offer still runs for this visit
  }
  return start + OFFER_MS;
}

function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = readOfferEnd();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

const pains = [
  ["No entiendes nada de IA", "Prompts, referencias, modos… Ves tutoriales y acabas más perdido."],
  ["La cara sale \"parecida\", pero no eres tú", "Cambian los rasgos, la nariz, los ojos. Nadie te reconoce."],
  ["Gastas créditos y tiempo en pruebas", "Generas una y otra vez y sigue saliendo mal."],
  ["Te salen gafas, caras mezcladas o parpadeos", "Y no sabes por qué ni cómo arreglarlo."],
  ["No sabes qué vídeo hacer para que se vea", "Publicas y no pasa de 200 visualizaciones."],
];

const steps = [
  ["Haz tus fotos", "Te digo exactamente qué 8 fotos hacer con el móvil."],
  ["Copia el prompt", "Cambias 2 cosas entre corchetes y lo pegas."],
  ["Publica", "Con las ideas y cuentas de referencia para que se haga viral."],
];

const inside = [
  ["Las fotos que hacen que salgas idéntico", "Los 8 ángulos y las 7 reglas que casi nadie conoce."],
  ["El prompt maestro", "Copia exacta de tus rasgos, sin gafas ni nada que tape la cara."],
  ["7 prompts para cada caso", "Con un amigo, de espaldas, de noche, cambiar ropa, producto u otro mundo."],
  ["Solución a los 9 fallos más comunes", "Qué hacer cuando la cara cambia, parpadea o se mezcla."],
  ["15 ideas de vídeos virales", "Épicos, de humor, de lujo y de antes y después."],
  ["12 cuentas de Instagram de referencia", "Para sacar ideas que ya han funcionado."],
];

const bonuses = [
  [
    "Asistencia por WhatsApp",
    "¿Te atascas con un vídeo? Escríbenos y te ayudamos a sacarlo. Respuesta en menos de 24 h.",
  ],
  ["Comunidad privada de WhatsApp", "Prompts nuevos, trucos y novedades de IA compartidos cada semana."],
];

const faqs = [
  ["¿Necesito saber de IA o de edición?", "No. Está pensada para empezar de cero: qué fotos hacer, qué prompt copiar y qué cambiar."],
  ["¿Qué necesito para empezar?", "Tu móvil para las fotos, un clip de vídeo de 4 a 30 segundos y una cuenta en la herramienta de IA que explica la guía."],
  ["¿Cómo la recibo?", "Al pagar te llega el PDF al momento a tu email, junto con el enlace para entrar en la comunidad de WhatsApp."],
  ["¿Cómo funciona la asistencia?", "Si te atascas con un vídeo, nos escribes por WhatsApp con tus fotos, el clip y el prompt, y te decimos qué cambiar. Respondemos en menos de 24 horas."],
  ["¿Qué se comparte en la comunidad?", "Prompts nuevos, trucos que van funcionando, ideas de vídeos y novedades de herramientas de IA. Puedes preguntar y ver lo que hacen los demás."],
  ["¿Puedo usar la cara de otras personas?", "Sí, siempre que te den permiso. La guía explica cómo hacerlo con dos personas en el mismo vídeo."],
];

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="var(--lime-ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GuiaPage() {
  const left = useCountdown();
  // Until the clock is known on the client, show the offer (matches the server render)
  const onOffer = left === null || left > 0;
  const price = onOffer ? PRICE_OFFER : PRICE_NORMAL;
  const checkout = onOffer ? CHECKOUT_OFFER : CHECKOUT_NORMAL;
  const t = Math.floor((left ?? 24 * 3600 * 1000 - 1000) / 1000);
  const old = onOffer ? <s className="p-old">{PRICE_NORMAL}</s> : null;

  const offerRef = useRef<HTMLDivElement>(null);
  const [offerVisible, setOfferVisible] = useState(false);
  useEffect(() => {
    document.documentElement.lang = "es";
    const el = offerRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOfferVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="guia" style={{ minHeight: "100vh" }}>
      {onOffer && (
        <div className="top">
          <div className="promo-in">
            <div className="promo-txt">
              <span className="live" />
              <span>
                Tu oferta {old} <b>{PRICE_OFFER}</b> · termina en
              </span>
            </div>
            <div className="cd" role="timer">
              <div className="u"><b>{pad(Math.floor(t / 3600))}</b><i>horas</i></div>
              <span className="sep">:</span>
              <div className="u"><b>{pad(Math.floor((t % 3600) / 60))}</b><i>min</i></div>
              <span className="sep">:</span>
              <div className="u"><b>{pad(t % 60)}</b><i>seg</i></div>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: "relative" }}>
        <div className="glow" />
        <main className="wrap">
          <header className="hero">
            <span className="pill"><span className="dot" />Guía + prompts · PDF</span>
            <h1>
              Pon tu cara en cualquier vídeo. <em>Sin saber nada de IA.</em>
            </h1>
            <p className="sub">
              El método exacto con el que hago mis vídeos virales, paso a paso y con los prompts listos para
              copiar y pegar.
            </p>
            <div className="shot">
              <video
                src="/videos/guia-demo.mp4"
                poster="/videos/guia-demo-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="Ejemplo hecho con el método: cambio de cara en un vídeo grabado con el móvil a la entrada de una discoteca"
              />
              <div className="label"><span>Hecho con el método de la guía</span><b>IA</b></div>
            </div>
            <a className="btn checkout" href={checkout}>
              Quiero la guía <small>· {old} <span className="p-now">{price}</span></small>
            </a>
            <p className="micro">PDF + asistencia + comunidad de WhatsApp</p>
          </header>

          <section>
            <span className="pill">¿Te suena?</span>
            <h2>Lo has intentado, pero <em>no te sale</em></h2>
            <ul className="pains">
              {pains.map(([title, body]) => (
                <li key={title}>
                  <span className="x">✕</span>
                  <p><b>{title}</b><span>{body}</span></p>
                </li>
              ))}
            </ul>
            <p className="turn">
              El problema no eres tú. <b>Es que nadie te ha dado el método.</b> El 80 % del resultado depende de
              cómo haces las fotos y el prompt, y eso es justo lo que te enseño.
            </p>
          </section>

          <section>
            <span className="pill">Así de fácil</span>
            <h2>3 pasos y tienes tu vídeo</h2>
            <div className="steps">
              {steps.map(([title, body]) => (
                <div key={title}>
                  <p style={{ margin: 0 }}><b>{title}</b><span>{body}</span></p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <span className="pill">Qué incluye</span>
            <h2>Todo lo que necesitas, <em>nada de relleno</em></h2>
            <img
              className="pack"
              src="/images/guia-pack.webp"
              alt="Lo que recibes: Pack de Prompts, Guía IA Viral y Comunidad de WhatsApp"
              width={1080}
              height={768}
              loading="lazy"
            />
            <div className="inside">
              {inside.map(([title, body]) => (
                <div key={title}>
                  <span className="ok">✓</span>
                  <p style={{ margin: 0 }}><b>{title}</b><span>{body}</span></p>
                </div>
              ))}
              {bonuses.map(([title, body]) => (
                <div key={title} className="bonus">
                  <span className="ok">+</span>
                  <p style={{ margin: 0 }}><b><span className="btag">BONUS</span>{title}</b><span>{body}</span></p>
                </div>
              ))}
            </div>

            <div className="prompt" aria-hidden="true">
              <div className="prompt-bar"><span>prompt-maestro.txt</span><span>1 de 8</span></div>
              <pre>
                {"REFERENCE IMAGES 1 to "}<span className="ph">[N]</span>{" = PERSON A.\n\nFACE VISIBILITY RULE:\nNO glasses, NO sunglasses, NO hats, NO caps, NO hoods, NO masks...\n\nEXACT FACE MATCH RULE:\nPERSON A's face must be an exact, one-to-one match to the reference images. Copy the exact facial dimensions..."}
              </pre>
              <span className="lock">Completo dentro de la guía</span>
            </div>
          </section>

          <section id="comprar" className="offer-wrap">
            <div className="offer" ref={offerRef}>
              <span className="pill"><span className="dot" />{onOffer ? "Oferta de bienvenida · 24 h" : "Acceso inmediato"}</span>
              <img
                className="pack pack-offer"
                src="/images/guia-pack.webp"
                alt=""
                width={1080}
                height={768}
                loading="lazy"
              />
              <p className="name" style={{ margin: "6px 0 0" }}>Guía IA Viral + Pack de Prompts</p>
              <div className="price">{old}<b className="p-now">{price}</b></div>
              <p className="micro" style={{ margin: 0 }}>
                {onOffer
                  ? `Pago único · precio normal ${PRICE_NORMAL}, válido 24 h desde tu primera visita`
                  : "Pago único · sin suscripción"}
              </p>
              <ul>
                <li>Guía en PDF de 11 pasos</li>
                <li>8 prompts listos para copiar</li>
                <li>Tabla de solución de problemas</li>
                <li>15 ideas virales + 12 cuentas de referencia</li>
                <li><b>Bonus:</b>&nbsp;asistencia por WhatsApp (respuesta en menos de 24 h)</li>
                <li><b>Bonus:</b>&nbsp;acceso a la comunidad privada de WhatsApp</li>
              </ul>
              <a
                className="btn checkout"
                href={checkout}
              >
                Comprar ahora
              </a>
              <div className="trust">
                <span><Check />Pago seguro</span>
                <span><Check />Descarga inmediata</span>
                <span><Check />En español</span>
              </div>
            </div>
          </section>

          <section>
            <span className="pill">Dudas</span>
            <h2>Preguntas rápidas</h2>
            <div style={{ marginTop: 16 }}>
              {faqs.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer>
        <div className="wrap">
          © 2026 <Link to="/">Droppreel</Link>
        </div>
      </footer>

      <div className={`bar${offerVisible ? " hide" : ""}`}>
        <div className="wrap">
          <div className="info">
            <b>{old} <span className="p-now">{price}</span></b>
            <span>PDF + comunidad WhatsApp</span>
          </div>
          <a className="btn checkout" href={checkout}>Quiero la guía</a>
        </div>
      </div>
    </div>
  );
}
