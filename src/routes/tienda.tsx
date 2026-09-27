import { createFileRoute } from "@tanstack/react-router";

import { Storefront } from "@/components/store/Storefront";
import { BRAND } from "@/lib/store-data";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: `${BRAND} — Moda de hombre y mujer` },
      {
        name: "description",
        content: `${BRAND}: ropa, calzado y accesorios de hombre y mujer, seleccionados con cuidado.`,
      },
      { property: "og:title", content: BRAND },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600&display=swap",
      },
    ],
  }),
  component: Storefront,
});
