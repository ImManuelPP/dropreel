import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Contact,
  Faq,
  Footer,
  Header,
  Hero,
  HowItWorks,
  Problem,
  Vs,
  WhatWeDo,
  Work,
} from "@/components/landing/Sections";
import { content, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Droppreel — Anuncios en vídeo con IA y VSLs para marcas de ecommerce" },
      {
        name: "description",
        content:
          "Droppreel produce VSLs y creatividades publicitarias generadas con IA para marcas de ecommerce y dropshipping. Cualquier formato, listo para testear en Meta y TikTok.",
      },
      { property: "og:title", content: "Droppreel — Anuncios en vídeo con IA y VSLs para marcas de ecommerce" },
      {
        property: "og:description",
        content:
          "VSLs y creatividades publicitarias hechas con IA para marcas de ecommerce: avatares hablados, metraje narrado, animación 3D. Pide presupuesto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const t = content[lang];
    document.documentElement.lang = lang;
    document.title = `${t.hero.badge} · Droppreel`;
    const desc = `${t.hero.subtitle.slice(0, 155)}${t.hero.subtitle.length > 155 ? "..." : ""}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", desc);
  }, [lang]);

  return (
    <div className="min-h-screen bg-background">
      <Header lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <Problem lang={lang} />
        <WhatWeDo lang={lang} />
        <Vs lang={lang} />
        <HowItWorks lang={lang} />
        <Work lang={lang} />
        <Faq lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
