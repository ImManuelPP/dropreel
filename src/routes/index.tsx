import { createFileRoute } from "@tanstack/react-router";
import {
  AiImages,
  AlertBanner,
  Bonuses,
  CloneAdapted,
  CloneWinner,
  Deliverables,
  FaqEs,
  FinalCta,
  FooterEs,
  Formats,
  Guarantee,
  HeroEs,
  IsThisForYou,
  Nav,
  Offer,
  ProblemEs,
  RealExamples,
  SocialProof,
  Trust,
} from "@/components/landing/LandingEs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Droppreel — Anuncios en vídeo con IA para marcas de ecommerce" },
      {
        name: "description",
        content:
          "Producimos anuncios en vídeo con IA para ecommerce y dropshipping: avatares que hablan, VSLs narrados y animación 3D, con research de tu nicho.",
      },
      { property: "og:title", content: "Droppreel — Anuncios en vídeo con IA para marcas de ecommerce" },
      {
        property: "og:description",
        content:
          "Anuncios en vídeo hechos con IA para marcas de ecommerce: research del nicho, guion a medida y producción íntegra. Pide tu presupuesto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AlertBanner />
      <Nav />
      <main>
        <HeroEs />
        <Trust />
        <ProblemEs />
        <Formats />
        <RealExamples />
        <CloneWinner />
        <AiImages />
        <CloneAdapted />
        <IsThisForYou />
        <Deliverables />
        <SocialProof />
        <Bonuses />
        <Offer />
        <Guarantee />
        <FaqEs />
        <FinalCta />
      </main>
      <FooterEs />
    </div>
  );
}
