import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check, Play } from "lucide-react";
import { WHATSAPP_URL } from "@/components/landing/LandingEs";

export const Route = createFileRoute("/precios")({
  head: () => ({
    meta: [
      { title: "Presupuesto — Droppreel" },
      {
        name: "description",
        content:
          "Vídeos publicitarios con IA de Droppreel: presupuesto a medida según el estilo y el volumen mensual.",
      },
      { property: "og:title", content: "Presupuesto — Droppreel" },
      {
        property: "og:description",
        content:
          "Vídeos publicitarios con IA en los estilos que mejor encajen con tu producto. Presupuesto a medida.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PreciosPage,
});

const styles = [
  { title: "UGC", body: "Actores de IA hablando de tu producto a cámara." },
  { title: "Objeto parlante", body: "Personajes 3D que hablan en primera persona." },
  { title: "Esqueleto AI", body: "El formato viral que domina TikTok y Meta ahora mismo." },
  {
    title: "Claymation",
    body: "Animación stop-motion, poco usada todavía en la mayoría de nichos.",
  },
  { title: "Crochet", body: "Escenas tejidas a ganchillo, con encanto artesanal." },
  { title: "Musical", body: "Una canción original sobre tu producto." },
];

const included = [
  {
    title: "Research de tu nicho",
    body: "Buscamos qué anuncios ya están funcionando de verdad (volumen real y tiempo activo, no inspiración al azar).",
  },
  {
    title: "Guion a medida",
    body: "Basado en la estructura de esos ganadores y en el ICP de tu cliente, no en una plantilla genérica.",
  },
  {
    title: "Producción del vídeo final",
    body: "Listo para subir a Meta o TikTok.",
  },
];

function PreciosPage() {
  useEffect(() => {
    document.documentElement.lang = "es";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Play className="h-4 w-4 fill-current" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Droppreel</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20 sm:pt-32 sm:pb-28">
        <section className="mx-auto max-w-4xl px-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Presupuesto
          </span>
          <h1 className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Presupuesto a medida, según el estilo y el volumen
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            No publicamos una tarifa fija por estilo: cada presupuesto depende del estilo elegido y
            del volumen mensual acordado. Escríbenos y te lo confirmamos sin compromiso.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-4xl px-5 sm:mt-16">
          <div className="rounded-2xl border border-border bg-surface-elevated/50 p-6 sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight">Incluido en cada vídeo</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {included.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl px-5 sm:mt-16">
          <h2 className="text-lg font-semibold tracking-tight">Los 6 estilos disponibles</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-border">
            {styles.map((row) => (
              <div
                key={row.title}
                className="flex flex-col gap-1 border-b border-border px-5 py-4 last:border-b-0 sm:px-6"
              >
                <h3 className="font-semibold tracking-tight">{row.title}</h3>
                <p className="text-sm text-muted-foreground">{row.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Pack mensual: pensado para ~8 vídeos al mes (2 por semana). El presupuesto en pack se
            acuerda contigo según los estilos que elijas.
          </p>

          <div className="mt-8 rounded-xl border border-border/60 bg-surface/50 p-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              Los vídeos cubren hasta 2-3 minutos de duración. Si el research de tu nicho recomienda
              un formato más largo, el presupuesto se ajusta a esa duración real —{" "}
              <span className="font-medium text-foreground">nunca se factura de más</span> sin
              decírtelo antes.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Pide tu presupuesto
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
