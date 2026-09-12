import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
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

/**
 * Fila que se desplaza sola de forma continua, pero el usuario puede tomar
 * el control en cualquier momento arrastrando con el dedo o el ratón — al
 * soltar, retoma el deslizamiento automático tras una pausa breve. El
 * contenido que se le pase ya tiene que venir duplicado una vez (2x) para
 * que el bucle sea perfecto (al llegar a la mitad del ancho total, se
 * reinicia justo donde empezaba la copia).
 */
function useAutoScrollRow(speedPxPerSec = 36) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout>;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) el.scrollLeft += speedPxPerSec * dt;
      const half = el.scrollWidth / 2;
      if (half > 0) {
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft < 0) el.scrollLeft += half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => {
      paused = true;
      clearTimeout(resumeTimer);
    };
    const scheduleResume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
        last = performance.now();
      }, 1500);
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", scheduleResume);
    el.addEventListener("pointercancel", scheduleResume);
    el.addEventListener("pointerleave", scheduleResume);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", scheduleResume);
      el.removeEventListener("pointercancel", scheduleResume);
      el.removeEventListener("pointerleave", scheduleResume);
    };
  }, [speedPxPerSec]);
  return ref;
}

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

/**
 * Hueco de vídeo a pantalla casi completa, sin borde ni recuadro de
 * "pendiente" — para los carruseles de Formatos y Ejemplos reales, donde
 * el vídeo (cuando lo haya) debe ocupar casi toda la altura visible, como
 * en la referencia del competidor, no una cajita pequeña con marco.
 */
function MediaSlot({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`relative flex aspect-[9/16] items-end overflow-hidden rounded-xl bg-surface-elevated ${className}`}
    >
      <span className="w-full bg-gradient-to-t from-black/70 to-transparent p-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-primary/80">
        {label}
      </span>
    </div>
  );
}

/**
 * Tarjeta numerada (imagen + número + título + descripción) — el mismo
 * patrón que usa el competidor en "Esto es lo que vas a recibir" y en sus
 * bonos, en vez de una lista plana de bullets.
 */
function NumberedCard({
  n,
  title,
  body,
  imageLabel,
}: {
  n: number;
  title: string;
  body: string;
  imageLabel: string;
}) {
  return (
    <div
      data-reveal
      style={rd((n - 1) * 70)}
      className="reveal flex flex-col overflow-hidden rounded-2xl border border-border bg-card-gradient"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-surface-elevated text-center font-mono text-[10px] uppercase tracking-[0.18em] text-primary/70">
        {imageLabel}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            {n}
          </span>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
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
        Si llevas meses pagando pauta con el mismo anuncio, no tienes un problema de presupuesto:
        tienes un problema de creatividades.
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
    <section ref={ref} id="top" className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24">
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
          Estudiamos qué anuncios ya funcionan en tu nicho y producimos tus vídeos con IA: avatares
          que hablan, VSLs narrados en off y animación 3D. Tú pones el producto, nosotros ponemos
          las creatividades.
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
          Mismo método en cada proyecto: research del nicho, guion a medida y producción íntegra con
          IA. Sin actores, sin rodajes, sin esperas de semanas.
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

/* 5 — Carrusel de formatos (desliza solo, en bucle continuo) */
export function Formats() {
  const formats = [
    {
      tagLabel: "AVATAR DE IA",
      title: "Avatar de IA que habla",
      body: "Un personaje hablando a cámara: gancho directo, testimonio o explicación de producto.",
      tag: "[EJEMPLO FORMATO 1]",
    },
    {
      tagLabel: "VSL NARRADO",
      title: "VSL narrado en off",
      body: "Voz en off sobre imágenes reales de tu producto y b-roll, con estructura de VSL.",
      tag: "[EJEMPLO FORMATO 2]",
    },
    {
      tagLabel: "ANIMACIÓN 3D",
      title: "Animación 3D con sincronía labial",
      body: "Personaje animado en 3D que habla o canta, ideal para marcas con carácter propio.",
      tag: "[EJEMPLO FORMATO 3]",
    },
  ];
  // Se duplica una vez para que el bucle sea perfecto: al llegar a la
  // mitad del scroll total, se reinicia justo donde empezaba la copia.
  const looped = [...formats, ...formats];
  const rowRef = useAutoScrollRow(36);
  return (
    <Section id="formatos">
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>Formatos</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          No es un formato. Son 3.
        </h2>
      </div>
      {/* Sale del ancho central (max-w-6xl) para llegar de borde a borde de
          la pantalla, como en la referencia -- los vídeos van a pantalla
          casi completa, no metidos en una cajita pequeña. */}
      <div data-reveal className="reveal relative left-1/2 right-1/2 -mx-[50vw] mt-12 w-screen">
        <div ref={rowRef} className="no-scrollbar flex touch-pan-x gap-4 overflow-x-auto px-5">
          {looped.map((f, i) => (
            <div key={`${f.title}-${i}`} className="shrink-0" aria-hidden={i >= formats.length}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {f.tagLabel}
              </span>
              <MediaSlot label={f.tag} className="mt-3 h-[62vh] w-auto sm:h-[68vh]" />
              <h3 className="mt-4 max-w-64 font-semibold">{f.title}</h3>
              <p className="mt-2 max-w-64 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* 6 — Ejemplos reales (carrusel que se desliza solo, arrastrable con el dedo) */
export function RealExamples() {
  const examples = Array.from({ length: 6 }, (_, i) => `[EJEMPLO REAL ${i + 1}]`);
  const looped = [...examples, ...examples];
  const rowRef = useAutoScrollRow(40);
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
      <div data-reveal className="reveal relative left-1/2 right-1/2 -mx-[50vw] mt-12 w-screen">
        <div ref={rowRef} className="no-scrollbar flex touch-pan-x gap-4 overflow-x-auto px-5">
          {looped.map((tag, i) => (
            <div key={`${tag}-${i}`} className="shrink-0" aria-hidden={i >= examples.length}>
              <MediaSlot label={tag} className="h-[62vh] w-auto sm:h-[68vh]" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* 7 y 9 — Bloques de clonación (dos columnas) */
/**
 * Fila con flechas Anterior/Siguiente (como la referencia), más deslizable
 * con el dedo o el ratón. Se ocultan/deshabilitan las flechas al llegar a
 * cada extremo.
 */
function useCarouselNav() {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollByPage = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return { ref, atStart, atEnd, scrollByPage };
}

function CarouselArrows({
  atStart,
  atEnd,
  onPrev,
  onNext,
}: {
  atStart: boolean;
  atEnd: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label="Anterior"
        disabled={atStart}
        onClick={onPrev}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors disabled:opacity-30 enabled:hover:border-primary/50 enabled:hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        disabled={atEnd}
        onClick={onNext}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors disabled:opacity-30 enabled:hover:border-primary/50 enabled:hover:text-primary"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function CloneBlock({
  eyebrow,
  title,
  body,
  pairs,
  beforeLabel,
  afterLabel,
  aspect = "aspect-[9/16]",
}: {
  eyebrow: string;
  title: string;
  body: string;
  pairs: { before: string; after: string }[];
  beforeLabel: string;
  afterLabel: string;
  aspect?: string;
}) {
  const { ref, atStart, atEnd, scrollByPage } = useCarouselNav();
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div data-reveal className="reveal max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{body}</p>
        </div>
        <CarouselArrows
          atStart={atStart}
          atEnd={atEnd}
          onPrev={() => scrollByPage(-1)}
          onNext={() => scrollByPage(1)}
        />
      </div>
      <div ref={ref} className="no-scrollbar mt-12 flex touch-pan-x gap-8 overflow-x-auto">
        {pairs.map((pair, i) => (
          <div key={i} className="flex shrink-0 gap-4">
            <div className="w-40 sm:w-48">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {beforeLabel}
              </p>
              <Placeholder label={pair.before} className={`mt-3 w-full ${aspect}`} />
            </div>
            <div className="w-40 sm:w-48">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {afterLabel}
              </p>
              <Placeholder label={pair.after} className={`mt-3 w-full ${aspect}`} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function CloneWinner() {
  const pairs = [1, 2, 3].map((n) => ({
    before: `[ANUNCIO ORIGINAL ${n}]`,
    after: `[TU VERSIÓN ${n}]`,
  }));
  return (
    <CloneBlock
      eyebrow="Clonación de estructura"
      title="El mismo anuncio ganador. Ahora con tu marca."
      body="Clona el mismo anuncio para tu marca, o adáptalo a un producto distinto."
      pairs={pairs}
      beforeLabel="Anuncio que ya funciona"
      afterLabel="Tu versión"
    />
  );
}

export function CloneAdapted() {
  const pairs = [1, 2, 3, 4].map((n) => ({
    before: `[ESTRUCTURA DE ORIGEN ${n}]`,
    after: `[ADAPTADA A TU MARCA ${n}]`,
  }));
  return (
    <CloneBlock
      eyebrow="Adaptación"
      title="No copies el diseño. Clona lo que ya convierte."
      body="Adaptado para tu producto."
      pairs={pairs}
      beforeLabel="Estructura de origen"
      afterLabel="Adaptada a tu marca"
      aspect="aspect-square"
    />
  );
}

/* 8 — Galería de imágenes con IA */
export function AiImages() {
  const images = Array.from({ length: 10 }, (_, i) => `[IMAGEN IA ${i + 1}]`);
  const looped = [...images, ...images];
  const rowRef = useAutoScrollRow(30);
  return (
    <Section>
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>Imágenes</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Imágenes que detienen el scroll — creadas 100% con IA.
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Sin fotógrafo, sin estudio, sin sesión de producto — solo tus fotos y unas líneas de
          texto.
        </p>
      </div>
      <div data-reveal className="reveal relative left-1/2 right-1/2 -mx-[50vw] mt-12 w-screen">
        <div ref={rowRef} className="no-scrollbar flex touch-pan-x gap-4 overflow-x-auto px-5">
          {looped.map((label, i) => (
            <div key={`${label}-${i}`} className="shrink-0" aria-hidden={i >= images.length}>
              <Placeholder label={label} className="aspect-square w-56 sm:w-64" />
            </div>
          ))}
        </div>
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
        <div
          data-reveal
          style={rd(120)}
          className="reveal rounded-2xl border border-border/60 bg-surface/40 p-7"
        >
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
    {
      title: "[NÚMERO DE VÍDEOS] vídeos al mes",
      body: "El volumen exacto se fija según el plan mensual que elijas.",
      imageLabel: "[FOTO ENTREGABLE 1]",
    },
    {
      title: "Research de tu nicho",
      body: "Analizamos qué está funcionando de verdad en tu categoría antes de escribir nada.",
      imageLabel: "[FOTO ENTREGABLE 2]",
    },
    {
      title: "Guion a medida",
      body: "Aprobado por ti antes de producir, no una plantilla genérica reciclada.",
      imageLabel: "[FOTO ENTREGABLE 3]",
    },
    {
      title: "Los 3 formatos",
      body: "Avatar de IA, VSL narrado o animación 3D — el que mejor encaje con tu producto.",
      imageLabel: "[FOTO ENTREGABLE 4]",
    },
    {
      title: "Variantes de gancho",
      body: "Varios inicios distintos para testear el mismo vídeo y quedarte con el que rinda.",
      imageLabel: "[FOTO ENTREGABLE 5]",
    },
    {
      title: "Formato vertical listo",
      body: "Entregado listo para subir directo a Meta o TikTok.",
      imageLabel: "[FOTO ENTREGABLE 6]",
    },
    {
      title: "Entrega en [DÍAS DE ENTREGA] días",
      body: "Contados desde que apruebas el guion, no desde que empezamos a grabar.",
      imageLabel: "[FOTO ENTREGABLE 7]",
    },
  ];
  return (
    <Section>
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>Entregables</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Esto es lo que vas a recibir
        </h2>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <NumberedCard key={item.title} n={i + 1} {...item} />
        ))}
      </div>
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
        <p className="mt-4 leading-relaxed text-muted-foreground">
          No es teoría: esto es lo que marcas de ecommerce como la tuya ya están consiguiendo con
          estos mismos vídeos en su pauta.
        </p>
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
  const bonuses = [1, 2, 3, 4, 5, 6].map((n) => ({
    title: `[TÍTULO BONO ${n}]`,
    body: `[DESCRIPCIÓN BONO ${n}]`,
    imageLabel: `[FOTO BONO ${n}]`,
  }));
  return (
    <Section>
      <div data-reveal className="reveal max-w-2xl">
        <Eyebrow>
          <Gift className="h-3.5 w-3.5 text-primary" />
          Bonos
        </Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Extras incluidos en la oferta
        </h2>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {bonuses.map((bonus, i) => (
          <NumberedCard key={bonus.title} n={i + 1} {...bonus} />
        ))}
      </div>
    </Section>
  );
}

/* 14 — Precio y oferta */
export function Offer() {
  const included = [
    "[NÚMERO DE VÍDEOS] vídeos al mes.",
    "Research de tu nicho antes de escribir el guion.",
    "Guion a medida, aprobado por ti antes de producir.",
    "Los 3 formatos disponibles: avatar de IA, VSL narrado o animación 3D.",
    "Variantes de gancho para testear el mismo vídeo.",
    "Formato vertical listo para Meta y TikTok.",
    "Entrega en [DÍAS DE ENTREGA] días desde la aprobación del guion.",
    "Los bonos de arriba, incluidos en tu pack.",
  ];
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
        <span className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Repeat className="h-3.5 w-3.5" />
          Pack mensual · ~8 vídeos al mes
        </span>
        <ul className="mt-6 space-y-3 text-left">
          {included.map((t) => (
            <li key={t} className="flex items-start gap-3 text-sm leading-relaxed">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-7 font-mono text-3xl font-semibold tracking-tight text-primary">
          Desde 65€/vídeo
        </p>
        <p className="mt-1 text-sm text-muted-foreground">En pack mensual · precio por formato</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Cta />
          <Link
            to="/precios"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Ver precio por formato →
          </Link>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Revisión incluida
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              Sin actores ni rodaje
            </span>
          </div>
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
