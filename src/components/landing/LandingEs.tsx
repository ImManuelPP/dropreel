import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock3,
  Flame,
  Gift,
  Play,
  Repeat,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { sampleVideos } from "@/lib/videos";
import { useScrollReveal } from "@/components/landing/Reveal";

export const WHATSAPP_URL =
  "https://wa.me/34603053272?text=%C2%A1Hola%21%20Me%20gustar%C3%ADa%20pedir%20un%20presupuesto%20para%20un%20v%C3%ADdeo.";

const rd = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}

/** Marcador visible para contenido pendiente de rellenar. */
function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-dashed border-primary/40 bg-surface/40 p-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-primary/80 ${className}`}
    >
      {label}
    </div>
  );
}

function Cta({ label = "Pide tu presupuesto", size = "lg" as const }) {
  return (
    <Button size={size} asChild className="w-full sm:w-auto">
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
        {label}
        <ArrowRight className="h-4 w-4" />
      </a>
    </Button>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id={id}
      className={`scroll-mt-24 border-t border-border/60 py-16 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

function VideoCard({
  src,
  poster,
  onClick,
  label,
}: {
  src: string;
  poster: string;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
    >
      <video
        src={src}
        poster={poster}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-background/60 text-primary backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          <Play className="h-5 w-5 fill-current" />
        </span>
      </span>
    </button>
  );
}

/* 1 — Banner de alerta */
export function AlertBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-primary/30 bg-primary/10 backdrop-blur-md">
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium text-primary sm:text-sm">
        <AlertTriangle className="hidden h-4 w-4 shrink-0 sm:block" />
        Si llevas meses pagando pauta con el mismo anuncio, no tienes un problema de
        presupuesto: tienes un problema de creatividades.
      </p>
    </div>
  );
}

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-[38px] z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl sm:top-[42px]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Play className="h-4 w-4 fill-current" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Droppreel</span>
        </a>
        <Button size="sm" asChild>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Pide tu presupuesto
          </a>
        </Button>
      </div>
    </header>
  );
}

/* 2 — Hero */
export function HeroEs() {
  const [open, setOpen] = useState(false);
  const clip = sampleVideos[2]!;
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Eyebrow>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Producción de anuncios con IA
        </Eyebrow>
        <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          <span className="text-gradient">
            Anuncios en vídeo que frenan el scroll, hechos con IA — pensados para aumentar tus
            ventas.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
          Estudiamos qué anuncios ya funcionan en tu nicho y producimos tus vídeos con IA:
          avatares que hablan, VSLs narrados en off y animación 3D. Tú pones el producto,
          nosotros ponemos las creatividades.
        </p>
        <div className="mx-auto mt-10 max-w-xs">
          <VideoCard
            src={clip.src}
            poster={clip.poster}
            label="Ver vídeo de presentación"
            onClick={() => setOpen(true)}
          />
        </div>
        <div className="mt-9 flex justify-center">
          <Cta />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-auto max-w-[92vw] gap-0 border-border bg-background p-2 sm:max-w-[92vw] sm:p-3">
          <DialogTitle className="sr-only">Vídeo de presentación</DialogTitle>
          <video
            src={clip.src}
            poster={clip.poster}
            controls
            autoPlay
            playsInline
            className="h-auto max-h-[82vh] w-auto max-w-[86vw] rounded-xl"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* 3 — Confianza corta */
export function Trust() {
  return (
    <Section>
      <div data-reveal className="reveal mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          El sistema que ya usamos con marcas reales
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground">
          Mismo método en cada proyecto: research del nicho, guion a medida y producción
          íntegra con IA. Sin actores, sin rodajes, sin esperas de semanas.
        </p>
      </div>
    </Section>
  );
}

/* 4 — Problema */
export function ProblemEs() {
  const items = [
    {
      icon: Flame,
      title: "Gastas en pauta sin saber qué falló",
      body: "El anuncio deja de rendir y nadie te dice si fue el gancho, el ritmo o la oferta.",
    },
    {
      icon: Repeat,
      title: "El mismo formato se agota",
      body: "Tu público ve el mismo vídeo una y otra vez, el CTR cae y el CPA sube.",
    },
    {
      icon: Clock3,
      title: "Producir varios formatos a mano es lento",
      body: "Entre editor, actor y revisiones pasan semanas para tener un solo ángulo nuevo.",
    },
  ];
  return (
    <Section>
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>El problema</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          No es que tus anuncios sean malos. Es que se queman.
        </h2>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <article
            key={item.title}
            data-reveal
            style={rd(i * 100)}
            className="reveal group rounded-2xl border border-border bg-card-gradient p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-elevated text-primary">
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* 5 — Carrusel de formatos (desliza horizontal, etiqueta encima del vídeo) */
export function Formats() {
  const formats = [
    {
      tagLabel: "AVATAR DE IA",
      title: "Avatar de IA que habla",
      body: "Un personaje hablando a cámara: gancho directo, testimonio o explicación de producto.",
      video: sampleVideos[0]!,
      tag: "[EJEMPLO FORMATO 1]",
    },
    {
      tagLabel: "VSL NARRADO",
      title: "VSL narrado en off",
      body: "Voz en off sobre imágenes reales de tu producto y b-roll, con estructura de VSL.",
      video: sampleVideos[1]!,
      tag: "[EJEMPLO FORMATO 2]",
    },
    {
      tagLabel: "ANIMACIÓN 3D",
      title: "Animación 3D con sincronía labial",
      body: "Personaje animado en 3D que habla o canta, ideal para marcas con carácter propio.",
      video: sampleVideos[2]!,
      tag: "[EJEMPLO FORMATO 3]",
    },
  ];
  const [active, setActive] = useState<number | null>(null);
  return (
    <Section id="formatos">
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>Formatos</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          No es un formato. Son 3.
        </h2>
      </div>
      <div className="-mx-5 mt-12 overflow-x-auto px-5 pb-2">
        <div className="flex snap-x snap-mandatory gap-6">
          {formats.map((f, i) => (
            <div
              key={f.title}
              data-reveal
              style={rd(i * 90)}
              className="reveal w-64 shrink-0 snap-start sm:w-72"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {f.tagLabel}
              </span>
              <div className="mt-3">
                <VideoCard
                  src={f.video.src}
                  poster={f.video.poster}
                  label={f.title}
                  onClick={() => setActive(i)}
                />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary/70">
                {f.tag}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="w-auto max-w-[92vw] gap-0 border-border bg-background p-2 sm:max-w-[92vw] sm:p-3">
          <DialogTitle className="sr-only">
            {active !== null ? formats[active]!.title : "Vídeo"}
          </DialogTitle>
          {active !== null ? (
            <video
              key={formats[active]!.video.src}
              src={formats[active]!.video.src}
              poster={formats[active]!.video.poster}
              controls
              autoPlay
              playsInline
              className="h-auto max-h-[82vh] w-auto max-w-[86vw] rounded-xl"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Section>
  );
}

/* 6 — Ejemplos reales */
export function RealExamples() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <Section id="ejemplos">
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>Ejemplos</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Así de real se ve lo que vas a crear.
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Ningún actor, ninguna cámara — 100% generado con IA.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleVideos.map((v, i) => (
          <div key={v.src} data-reveal style={rd((i % 3) * 90)} className="reveal">
            <VideoCard
              src={v.src}
              poster={v.poster}
              label={`Ejemplo real ${i + 1}`}
              onClick={() => setActive(i)}
            />
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary/70">
              {`[EJEMPLO REAL ${i + 1}]`}
            </p>
          </div>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="w-auto max-w-[92vw] gap-0 border-border bg-background p-2 sm:max-w-[92vw] sm:p-3">
          <DialogTitle className="sr-only">Ejemplo real</DialogTitle>
          {active !== null && sampleVideos[active] ? (
            <video
              key={sampleVideos[active]!.src}
              src={sampleVideos[active]!.src}
              poster={sampleVideos[active]!.poster}
              controls
              autoPlay
              playsInline
              className="h-auto max-h-[82vh] w-auto max-w-[86vw] rounded-xl"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Section>
  );
}

/* 7 y 9 — Bloques de clonación (dos columnas) */
function CloneBlock({
  eyebrow,
  title,
  body,
  before,
  after,
  beforeLabel,
  afterLabel,
}: {
  eyebrow: string;
  title: string;
  body: string;
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  return (
    <Section>
      <div data-reveal className="reveal max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{body}</p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div data-reveal className="reveal rounded-2xl border border-border/60 bg-surface/40 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {beforeLabel}
          </p>
          <Placeholder label={before} className="mt-4 aspect-[4/3]" />
        </div>
        <div
          data-reveal
          style={rd(120)}
          className="reveal rounded-2xl border border-primary/30 bg-card-gradient p-6 shadow-glow"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {afterLabel}
          </p>
          <Placeholder label={after} className="mt-4 aspect-[4/3]" />
        </div>
      </div>
    </Section>
  );
}

export function CloneWinner() {
  return (
    <CloneBlock
      eyebrow="Clonación de estructura"
      title="El mismo anuncio ganador. Ahora con tu marca."
      body="Buscamos anuncios que ya llevan meses corriendo en tu nicho, extraemos su estructura (gancho, ritmo, orden de argumentos) y la reconstruimos con tu producto. Nunca copiamos su vídeo ni su guion."
      before="[EJEMPLO ANTES]"
      after="[EJEMPLO DESPUÉS]"
      beforeLabel="Anuncio que ya funciona"
      afterLabel="Tu versión"
    />
  );
}

export function CloneAdapted() {
  return (
    <CloneBlock
      eyebrow="Adaptación"
      title="No copies el diseño. Clona lo que ya convierte."
      body="Un mismo esqueleto de VSL puede servir a productos muy distintos. Adaptamos el ángulo, el tono y el formato a tu público sin perder lo que hace que ese anuncio venda."
      before="[EJEMPLO ADAPTADO ANTES]"
      after="[EJEMPLO ADAPTADO DESPUÉS]"
      beforeLabel="Estructura de origen"
      afterLabel="Adaptada a tu marca"
    />
  );
}

/* 8 — Galería de imágenes con IA */
export function AiImages() {
  return (
    <Section>
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>Imágenes</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Imágenes que detienen el scroll — creadas 100% con IA.
        </h2>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => (
          <Placeholder
            key={i}
            data-reveal
            label={`[IMAGEN IA ${i + 1}]`}
            className="aspect-square"
          />
        ))}
      </div>
    </Section>
  );
}

/* 10 — ¿Es esto para ti? */
export function IsThisForYou() {
  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-2">
        <div
          data-reveal
          className="reveal rounded-2xl border border-primary/30 bg-card-gradient p-7 shadow-glow"
        >
          <h3 className="text-lg font-semibold text-primary">Sí, esto es para ti si…</h3>
          <ul className="mt-5 space-y-3">
            {[
              "Tienes una tienda de ecommerce o dropshipping con presupuesto de pauta activo.",
              "Necesitas creatividades nuevas cada semana, no un vídeo suelto al año.",
              "Quieres testear varios ángulos y quedarte con el que rinda.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm leading-relaxed">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={rd(120)} className="reveal rounded-2xl border border-border/60 bg-surface/40 p-7">
          <h3 className="text-lg font-semibold text-muted-foreground">No es para ti si…</h3>
          <ul className="mt-5 space-y-3">
            {[
              "Todavía no vendes ni inviertes en anuncios.",
              "Buscas el precio más bajo posible por encima del resultado.",
              "Necesitas rodaje real con actores y localizaciones.",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
              >
                <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/60" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* 11 — Esto es lo que vas a recibir */
export function Deliverables() {
  const items = [
    "[NÚMERO DE VÍDEOS] vídeos publicitarios al mes, listos para subir.",
    "Los 3 formatos disponibles: avatar hablado, VSL narrado y animación 3D.",
    "Research del nicho y guion a medida antes de producir.",
    "Variantes de gancho para testear el mismo vídeo con distintos inicios.",
    "Entrega en [DÍAS DE ENTREGA] días desde la aprobación del guion.",
    "Formatos verticales listos para Meta y TikTok.",
  ];
  return (
    <Section>
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>Entregables</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Esto es lo que vas a recibir
        </h2>
      </div>
      <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {items.map((t, i) => (
          <li
            key={t}
            data-reveal
            style={rd(i * 70)}
            className="reveal flex items-start gap-3 bg-card-gradient p-6 text-sm leading-relaxed"
          >
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            {t}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* 12 — Prueba social */
export function SocialProof() {
  return (
    <Section>
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>Resultados</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Resultados reales de campañas
        </h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <Placeholder key={n} label={`[CAPTURA RESULTADO ${n}]`} className="aspect-[4/3]" />
        ))}
      </div>
    </Section>
  );
}

/* 13 — Bonos */
export function Bonuses() {
  return (
    <Section>
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>Bonos</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Extras incluidos en la oferta
        </h2>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            data-reveal
            style={rd((n - 1) * 70)}
            className="reveal rounded-2xl border border-border bg-card-gradient p-7"
          >
            <Gift className="h-5 w-5 text-primary" />
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-primary/80">
              {`[BONO ${n}]`}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* 14 — Precio y oferta */
export function Offer() {
  return (
    <Section>
      <div data-reveal className="reveal mx-auto max-w-2xl text-center">
        <Eyebrow>La oferta</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Todo lo anterior, en un solo plan
        </h2>
      </div>
      <div
        data-reveal
        style={rd(120)}
        className="reveal mx-auto mt-10 max-w-xl rounded-2xl border border-primary/30 bg-card-gradient p-8 text-center shadow-glow"
      >
        <p className="font-mono text-3xl font-semibold tracking-tight text-primary">
          Desde 65€/vídeo
        </p>
        <p className="mt-1 text-sm text-muted-foreground">En pack mensual · precio por formato</p>
        <ul className="mt-6 space-y-3 text-left">
          {[
            "8 vídeos al mes en los formatos que elijas (avatar, VSL o 3D).",
            "Research de nicho y guion incluidos en cada vídeo.",
            "Variantes de gancho para testear.",
            "Entrega en [DÍAS DE ENTREGA] días.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3 text-sm leading-relaxed">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Cta />
          <Link
            to="/precios"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Ver precio por formato →
          </Link>
        </div>
      </div>
    </Section>
  );
}

/* 15 — Garantía */
export function Guarantee() {
  return (
    <Section>
      <div
        data-reveal
        className="reveal mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-card-gradient p-8 text-center shadow-glow"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
          Cero riesgo para ti
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Si el primer anuncio no te convence, lo revisamos hasta que encaje o no lo pagas. Sin
          permanencia y sin letra pequeña.
        </p>
      </div>
    </Section>
  );
}

/* 16 — FAQ */
export function FaqEs() {
  const items = [
    {
      q: "¿Y si el vídeo no me gusta?",
      a: "Lo revisamos contigo hasta dejarlo listo. Antes de producir apruebas el guion, así que las sorpresas se eliminan en la fase barata del proceso.",
    },
    {
      q: "¿Cuánto tarda el primer vídeo?",
      a: "Depende del formato, pero trabajamos en días, no en semanas. La entrega concreta la fijamos al aprobar el guion.",
    },
    {
      q: "¿Necesito poner mi voz o un actor?",
      a: "No. Todo se genera con IA: voz, avatar o animación. Si prefieres usar tu propia voz o metraje, también podemos integrarlo.",
    },
    {
      q: "¿Qué necesitáis de mí para empezar?",
      a: "El enlace de tu producto, a quién se lo vendes y, si los tienes, tus anuncios anteriores y sus datos. Con eso arrancamos el research.",
    },
    {
      q: "¿Podéis producir varios vídeos al mes de forma continua?",
      a: "Sí. La mayoría de marcas trabajan con nosotros en volumen recurrente para no quemar la misma creatividad.",
    },
    {
      q: "¿Copiáis anuncios de otras marcas?",
      a: "No. Analizamos la estructura de lo que ya funciona y escribimos un guion propio para tu producto.",
    },
    {
      q: "¿En qué formatos entregáis?",
      a: "Vertical listo para Meta y TikTok, y otras proporciones si tu campaña las necesita.",
    },
  ];
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} id="faq" className="scroll-mt-24 border-t border-border/60 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal className="reveal">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* 17 — Cierre con urgencia */
export function FinalCta() {
  return (
    <section className="relative scroll-mt-24 border-t border-border/60 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Eyebrow>
          <Search className="h-3.5 w-3.5 text-primary" />
          Plazas limitadas
        </Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Cada semana sin creatividades nuevas es dinero quemado en pauta.
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Aceptamos un número limitado de marcas al mes para mantener la calidad de cada guion.
          Escríbenos y te decimos si encajas.
        </p>
        <div className="mt-9 flex justify-center">
          <Cta label="Escríbenos por WhatsApp" />
        </div>
      </div>
    </section>
  );
}

/* 18 — Footer */
export function FooterEs() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Play className="h-3.5 w-3.5 fill-current" />
          </span>
          <span className="font-semibold tracking-tight">Droppreel</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Droppreel. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
