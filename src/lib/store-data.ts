export const BRAND = "Maison Linden";

export type Tone =
  "sand" | "stone" | "espresso" | "olive" | "navy" | "blush" | "charcoal" | "cream";

export type Product = {
  id: string;
  name: string;
  price: number;
  compareAt?: number;
  tone: Tone;
  image?: string;
};

export const announcements = [
  "Rebajas de temporada · Hasta −50%",
  "Envío gratis en pedidos superiores a 60 €",
  "Devoluciones sencillas en 30 días",
];

export const menu: { label: string; children?: string[] }[] = [
  { label: "Inicio" },
  {
    label: "Hombre",
    children: [
      "Chaquetas",
      "Camisas y punto",
      "Pantalones",
      "Calzado",
      "Gorras y sombreros",
      "Relojes",
    ],
  },
  {
    label: "Mujer",
    children: ["Chaquetas", "Tops", "Pantalones y faldas", "Calzado", "Bolsos", "Accesorios"],
  },
  { label: "Seguir mi pedido" },
  { label: "Contacto" },
  { label: "Sobre nosotros" },
  { label: "Preguntas frecuentes" },
];

export const slides: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta: string;
  tone: Tone;
  image?: string;
}[] = [
  {
    eyebrow: "Nueva temporada",
    title: "Menos ruido, más estilo",
    cta: "Ver novedades",
    tone: "espresso",
  },
  { eyebrow: "Hombre", title: "Sastrería para cada día", cta: "Comprar ahora", tone: "navy" },
  { eyebrow: "Mujer", title: "Líneas suaves, gesto firme", cta: "Comprar ahora", tone: "blush" },
  {
    eyebrow: "Gafas de sol",
    title: "Hecho para el sol",
    subtitle: "Monturas ligeras con lentes polarizadas",
    cta: "Comprar ahora",
    tone: "olive",
  },
];

export const categories: { label: string; tone: Tone; image?: string }[] = [
  { label: "Ropa de hombre", tone: "stone" },
  { label: "Ropa de mujer", tone: "blush" },
  { label: "Calzado de hombre", tone: "espresso" },
  { label: "Calzado de mujer", tone: "sand" },
];

export const promos: { title: string; tagline: string; tone: Tone; image?: string }[] = [
  { title: "Colección Solène", tagline: "Suave. Luminosa. Atemporal.", tone: "cream" },
  { title: "Piel Aldren", tagline: "Robusta. Urbana. Pulida.", tone: "charcoal" },
];

export const bestSellers: Record<"el" | "ella", Product[]> = {
  el: [
    { id: "b1", name: "Jersey de punto Orla", price: 69.99, compareAt: 119.99, tone: "stone" },
    { id: "b2", name: "Zapatillas de piel Ferro", price: 89.99, compareAt: 149.99, tone: "cream" },
    { id: "b3", name: "Gafas de sol Brisa", price: 39.99, compareAt: 69.99, tone: "charcoal" },
    { id: "b4", name: "Americana Holm", price: 99.99, compareAt: 179.99, tone: "navy" },
    { id: "b5", name: "Chino Tavel", price: 54.99, tone: "sand" },
    { id: "b6", name: "Gorra de lana Ebro", price: 29.99, tone: "olive" },
  ],
  ella: [
    {
      id: "g1",
      name: "Sandalias de tacón Rosella",
      price: 74.99,
      compareAt: 129.99,
      tone: "blush",
    },
    { id: "g2", name: "Sombrero de paja Liora", price: 34.99, compareAt: 59.99, tone: "sand" },
    { id: "g3", name: "Vestido midi Anise", price: 79.99, compareAt: 139.99, tone: "olive" },
    { id: "g4", name: "Bolso de mano Vela", price: 64.99, tone: "espresso" },
    { id: "g5", name: "Cárdigan Nerea", price: 59.99, compareAt: 99.99, tone: "cream" },
    { id: "g6", name: "Blusa de lino Maren", price: 44.99, tone: "stone" },
  ],
};

export const highlight = {
  title: "El mocasín de siempre",
  tagline: "Cosido a mano y listo para el verano",
  cta: "Comprar",
  tone: "espresso" as Tone,
  image: undefined as string | undefined,
};

export const reserve: { title: string; products: Product[] } = {
  title: "Punto de invierno",
  products: [
    {
      id: "r1",
      name: "Chaqueta de merino Alder",
      price: 129.99,
      compareAt: 199.99,
      tone: "charcoal",
    },
    { id: "r2", name: "Jersey de merino Corven", price: 89.99, compareAt: 149.99, tone: "navy" },
    { id: "r3", name: "Jersey de cachemir Iselle", price: 94.99, compareAt: 159.99, tone: "cream" },
    { id: "r4", name: "Cárdigan de merino Borda", price: 99.99, tone: "olive" },
    { id: "r5", name: "Cárdigan Wren", price: 109.99, compareAt: 169.99, tone: "stone" },
    { id: "r6", name: "Sobrecamisa de lana Tarn", price: 119.99, tone: "espresso" },
  ],
};

export const trust = {
  eyebrow: "Compra con confianza",
  intro:
    "Somos un equipo pequeño y lo hacemos todo en casa: elegimos cada prenda, preparamos cada envío y contestamos cada mensaje.",
  items: [
    {
      title: "Te contesta una persona",
      body: "Escríbenos por email o WhatsApp sobre tallas, pedidos o cambios y te responde alguien del equipo.",
    },
    {
      title: "Probado antes de venderlo",
      body: "Lavamos, usamos y revisamos las muestras de cada prenda antes de añadirla a la tienda.",
    },
    {
      title: "30 días para decidir",
      body: "Si algo no te convence, lo devuelves en 30 días. Recibirás el número de seguimiento por email.",
    },
  ],
};

export const footer = {
  policies: [
    "Política de privacidad",
    "Devoluciones y reembolsos",
    "Envíos y entregas",
    "Métodos de pago",
    "Términos del servicio",
    "Guía de tallas",
  ],
  business: [
    ["Empresa", "Tu empresa S.L."],
    ["NIF", "B00000000"],
    ["Email", "hola@tudominio.com"],
    ["Teléfono", "+34 000 000 000"],
    ["Dirección", "Calle Ejemplo 1, 28001 Madrid"],
    ["Horario", "Lunes a viernes, 9:00–17:00"],
  ] as [string, string][],
};

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
