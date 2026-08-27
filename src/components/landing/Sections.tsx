import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Play,
  Flame,
  Clock3,
  Bot,
  UserRound,
  Film,
  Boxes,
  Smartphone,
  Sparkles,
  Wand2,
  Check,
  X,
  Plus,
  Minus,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { content, type Lang } from "@/lib/i18n";
import { sampleVideos } from "@/lib/videos";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useScrollReveal } from "@/components/landing/Reveal";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Reveal-delay helper: stagger items with style={rd(120)}. */
const rd = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}

export function Header({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const t = content[lang];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Play className="h-4 w-4 fill-current" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Droppreel</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { id: "what", label: t.nav.what },
            { id: "how", label: t.nav.how },
            { id: "work", label: t.nav.work },
            { id: "faq", label: t.nav.faq },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-border bg-surface p-0.5">
            {(["en", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => scrollTo("contact")} className="hidden sm:inline-flex">
            {t.nav.cta}
          </Button>
        </div>
      </div>
    </header>
  );
}

/** Ambient looping video backdrop for the hero — blurred full-bleed layer
 *  plus a sharper center strip, dimmed by a dark overlay so text stays crisp.
 *  Falls back to a static blurred poster when prefers-reduced-motion is set,
 *  and pauses playback while the hero is scrolled out of view. */
function HeroBackdrop() {
  const [motionOk, setMotionOk] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const clip = sampleVideos[2]!;

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotionOk(true);
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!motionOk || !root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        for (const v of videoRefs.current) {
          if (!v) continue;
          if (entry?.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [motionOk]);

  const setVideo = (i: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[i] = el;
  };

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {motionOk ? (
        <>
          <video
            ref={setVideo(0)}
            src={clip.src}
            poster={clip.poster}
            muted
            loop
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-45 blur-2xl"
          />
          <div className="hero-center-fade absolute inset-y-0 left-1/2 aspect-[9/16] -translate-x-1/2">
            <video
              ref={setVideo(1)}
              src={clip.src}
              poster={clip.poster}
              muted
              loop
              autoPlay
              playsInline
              className="h-full w-full object-cover opacity-55"
            />
          </div>
        </>
      ) : (
        <img
          src={clip.poster}
          alt=""
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-35 blur-2xl"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
    </div>
  );
}

export function Hero({ lang }: { lang: Lang }) {
  const t = content[lang].hero;
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <HeroBackdrop />
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Eyebrow>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {t.badge}
        </Eyebrow>
        <h1 className="mt-7 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          <span className="text-gradient">{t.title}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t.subtitle}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => scrollTo("contact")}>
            {t.primary}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => scrollTo("work")}
          >
            <Play className="h-4 w-4" />
            {t.secondary}
          </Button>
        </div>

        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {t.stats.map((s) => (
            <div key={s.label} className="bg-card-gradient px-6 py-6">
              <dt className="text-lg font-semibold text-primary">{s.value}</dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Problem({ lang }: { lang: Lang }) {
  const t = content[lang].problem;
  const icons = [Flame, Clock3, Bot] as const;
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div data-reveal className="reveal max-w-2xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.items.map((item, i) => {
            const Icon = icons[i % icons.length]!;
            return (
              <article
                key={i}
                data-reveal
                style={rd(i * 100)}
                className="reveal group rounded-2xl border border-border bg-card-gradient p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-elevated text-primary transition-colors group-hover:border-primary/40">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WhatWeDo({ lang }: { lang: Lang }) {
  const t = content[lang].what;
  const icons = [UserRound, Film, Boxes, Smartphone, Sparkles, Wand2] as const;
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} id="what" className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div data-reveal className="reveal max-w-3xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{t.body}</p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, i) => {
            const Icon = icons[i % icons.length]!;
            return (
              <div
                key={i}
                data-reveal
                style={rd(i * 70)}
                className="reveal bg-card-gradient p-7 transition-colors duration-300 hover:bg-surface-elevated"
              >
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Vs({ lang }: { lang: Lang }) {
  const t = content[lang].vs;
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div data-reveal className="reveal max-w-3xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{t.body}</p>
        </div>

        <div className="relative mt-12 grid gap-6 lg:grid-cols-2">
          <span className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:inline-flex">
            VS
          </span>

          <div data-reveal className="reveal rounded-2xl border border-border/60 bg-surface/40 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-surface-elevated/60 text-muted-foreground/70">
                <Bot className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-muted-foreground">{t.genericTitle}</h3>
            </div>
            <ul className="space-y-4">
              {t.rows.map((row, i) => (
                <li key={i} data-reveal style={rd(120 + i * 70)} className="reveal flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/60" />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {row.generic}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal style={rd(150)} className="reveal relative rounded-2xl border border-primary/30 bg-card-gradient p-6 shadow-glow sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <Play className="h-5 w-5 fill-current" />
              </span>
              <h3 className="text-lg font-semibold text-primary">{t.dropreelTitle}</h3>
            </div>
            <ul className="space-y-4">
              {t.rows.map((row, i) => (
                <li key={i} data-reveal style={rd(270 + i * 70)} className="reveal flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed text-foreground">{row.dropreel}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({ lang }: { lang: Lang }) {
  const t = content[lang].how;
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} id="how" className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div data-reveal className="reveal max-w-2xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, i) => (
            <li key={i} data-reveal style={rd(i * 100)} className="reveal relative rounded-2xl border border-border bg-card-gradient p-7">
              <span className="font-mono text-xs tracking-[0.2em] text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const WORK_INITIAL_VISIBLE = 3;

export function Work({ lang }: { lang: Lang }) {
  const t = content[lang].work;
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const visible = expanded ? sampleVideos : sampleVideos.slice(0, WORK_INITIAL_VISIBLE);
  const ref = useScrollReveal<HTMLElement>([expanded]);

  return (
    <section ref={ref} id="work" className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div data-reveal className="reveal max-w-2xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t.body}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((video, i) => (
            <button
              key={video.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={t.cards[i]?.alt ?? t.play}
              data-reveal
              style={rd((i % WORK_INITIAL_VISIBLE) * 90)}
              className="reveal group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <video
                src={video.src}
                poster={video.poster}
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
                className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-background/60 text-primary backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-5 w-5 fill-current" />
                </span>
              </div>
            </button>
          ))}
        </div>

        {sampleVideos.length > WORK_INITIAL_VISIBLE ? (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  {t.seeLess}
                  <Minus className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t.seeMore}
                  <Plus className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ) : null}

        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => scrollTo("contact")}>
            {t.cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => { if (!open) setActive(null); }}>
        <DialogContent className="w-auto max-w-[92vw] gap-0 border-border bg-background p-2 sm:max-w-[92vw] sm:p-3">
          <DialogTitle className="sr-only">
            {active !== null ? (t.cards[active]?.alt ?? t.play) : t.play}
          </DialogTitle>
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
    </section>
  );
}

export function Faq({ lang }: { lang: Lang }) {
  const t = content[lang].faq;
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} id="faq" className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal className="reveal">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {t.items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} data-reveal style={rd(i * 80)} className="reveal border-border">
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

export function Contact({ lang }: { lang: Lang }) {
  const t = content[lang].contact;
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = useServerFn(submitQuoteRequest);
  const ref = useScrollReveal<HTMLElement>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = quoteSchema.safeParse({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      brand: String(fd.get("brand") ?? ""),
      needs: String(fd.get("needs") ?? ""),
      budget: String(fd.get("budget") ?? ""),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form fields.");
      return;
    }
    setSubmitting(true);
    try {
      await submit({ data: parsed.data });
      form.reset();
      setSent(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <section ref={ref} id="contact" className="relative scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-start">
        <div data-reveal className="reveal">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{t.body}</p>
        </div>

        <div data-reveal style={rd(120)} className="reveal rounded-2xl border border-border bg-card-gradient p-7 shadow-card sm:p-9">
          {sent ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-semibold">{t.successTitle}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t.successBody}</p>
              <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                {t.again}
              </Button>
            </div>
          ) : (
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t.name}</Label>
                  <Input id="name" name="name" required autoComplete="name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">{t.brand}</Label>
                <Input id="brand" name="brand" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="needs">{t.needs}</Label>
                <Textarea id="needs" name="needs" rows={4} required placeholder={t.needsPlaceholder} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">{t.budget}</Label>
                <Input id="budget" name="budget" placeholder={t.budgetPlaceholder} />
              </div>
              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {t.submit}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  const t = content[lang].footer;
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Play className="h-3.5 w-3.5 fill-current" />
          </span>
          <span className="font-semibold tracking-tight">Droppreel</span>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">{t.tagline}</p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Droppreel. {t.rights}
        </p>
      </div>
    </footer>
  );
}
