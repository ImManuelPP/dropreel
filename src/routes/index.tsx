import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import type { Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Droppreel — AI-made video ads & VSLs for ecommerce brands" },
      {
        name: "description",
        content:
          "Droppreel produces AI-generated video sales letters and ad creatives for ecommerce and dropshipping brands. Any format, ready to test on Meta and TikTok.",
      },
      { property: "og:title", content: "Droppreel — AI-made video ads & VSLs for ecommerce brands" },
      {
        property: "og:description",
        content:
          "AI-made VSLs and ad creatives for ecommerce brands: talking avatars, narrated b-roll, 3D animation. Get a quote.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [lang, setLang] = useState<Lang>("en");

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
