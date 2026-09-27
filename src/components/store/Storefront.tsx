import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  MessageCircle,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BRAND,
  announcements,
  bestSellers,
  categories,
  footer,
  formatPrice,
  highlight,
  menu,
  promos,
  reserve,
  slides,
  trust,
  type Product,
  type Tone,
} from "@/lib/store-data";

type CartLine = { product: Product; qty: number };
type CartApi = {
  lines: CartLine[];
  add: (p: Product) => void;
  setQty: (id: string, qty: number) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartApi | null>(null);
const useCart = () => useContext(CartContext)!;

function Media({
  tone,
  image,
  alt,
  className,
  children,
}: {
  tone: Tone;
  image?: string | undefined;
  alt?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden", !image && `tone-${tone}`, className)}>
      {image && (
        <img
          src={image}
          alt={alt ?? ""}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {children}
    </div>
  );
}

function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-primary py-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
      <span key={i} className="animate-in fade-in duration-500">
        {announcements[i]}
      </span>
    </div>
  );
}

function Header() {
  const { lines, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20 md:px-8">
        <div className="flex items-center gap-2">
          <button
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
            className="p-2 lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <button aria-label="Buscar" onClick={() => setSearchOpen((v) => !v)} className="p-2">
            <Search className="size-5" />
          </button>
        </div>
        <a
          href="#top"
          className="text-center font-serif text-xl tracking-[0.18em] uppercase md:text-2xl"
        >
          {BRAND}
        </a>
        <div className="flex justify-end">
          <button aria-label="Carrito" onClick={() => setOpen(true)} className="relative p-2">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className="hidden justify-center gap-8 pb-4 text-[13px] font-medium lg:flex">
        {menu.map((item) =>
          item.children ? (
            <div key={item.label} className="group relative">
              <button className="flex items-center gap-1 hover:opacity-60">
                {item.label} <ChevronDown className="size-3.5" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <ul className="border bg-popover p-4 shadow-lg">
                  {item.children.map((c) => (
                    <li key={c}>
                      <a
                        href="#"
                        className="block py-1.5 text-muted-foreground hover:text-foreground"
                      >
                        {c}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <a key={item.label} href="#" className="hover:opacity-60">
              {item.label}
            </a>
          ),
        )}
      </nav>

      {searchOpen && (
        <div className="border-t bg-background px-4 py-3 md:px-8">
          <form
            className="mx-auto flex max-w-2xl items-center gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              placeholder="Buscar productos…"
              className="h-10 flex-1 bg-transparent outline-none"
            />
            <button type="button" aria-label="Cerrar búsqueda" onClick={() => setSearchOpen(false)}>
              <X className="size-4" />
            </button>
          </form>
        </div>
      )}

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="store w-80 overflow-y-auto p-0">
          <SheetTitle className="border-b px-6 py-5 font-serif tracking-[0.18em] uppercase">
            {BRAND}
          </SheetTitle>
          <ul className="px-6 py-2">
            {menu.map((item) => (
              <MobileMenuItem key={item.label} label={item.label} items={item.children} />
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </header>
  );
}

function MobileMenuItem({ label, items }: { label: string; items?: string[] | undefined }) {
  const [open, setOpen] = useState(false);
  if (!items)
    return (
      <li className="border-b">
        <a href="#" className="block py-4 text-sm font-medium">
          {label}
        </a>
      </li>
    );
  return (
    <li className="border-b">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-sm font-medium"
      >
        {label} <ChevronDown className={cn("size-4 transition", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="pb-3 pl-3">
          {items.map((c) => (
            <li key={c}>
              <a href="#" className="block py-2 text-sm text-muted-foreground">
                {c}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const go = (n: number) => setI((n + slides.length) % slides.length);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go(i + 1), 6000);
    return () => clearTimeout(t);
  }, [i, playing]);

  return (
    <section id="top" className="relative h-[78vh] min-h-[480px] overflow-hidden md:h-[88vh]">
      {slides.map((s, n) => (
        <div
          key={s.title}
          aria-hidden={n !== i}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            n === i ? "opacity-100" : "opacity-0",
          )}
        >
          <Media
            tone={s.tone}
            image={s.image}
            className={cn("absolute inset-0", n === i && "store-kenburns")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-20 text-center text-white md:pb-28">
            {s.eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]">{s.eyebrow}</p>
            )}
            <h2 className="font-serif text-4xl leading-tight md:text-7xl">{s.title}</h2>
            {s.subtitle && <p className="mt-3 text-sm md:text-base">{s.subtitle}</p>}
            <a
              href="#best-sellers"
              tabIndex={n === i ? 0 : -1}
              className="mt-7 border border-white bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-transparent hover:text-white"
            >
              {s.cta}
            </a>
          </div>
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3 text-white">
        <button aria-label="Anterior" onClick={() => go(i - 1)} className="p-1">
          <ChevronLeft className="size-4" />
        </button>
        {slides.map((s, n) => (
          <button
            key={s.title}
            aria-label={`Ir a la diapositiva ${n + 1}`}
            onClick={() => go(n)}
            className={cn("h-0.5 transition-all", n === i ? "w-10 bg-white" : "w-5 bg-white/50")}
          />
        ))}
        <button aria-label="Siguiente" onClick={() => go(i + 1)} className="p-1">
          <ChevronRight className="size-4" />
        </button>
        <button
          aria-label={playing ? "Pausar" : "Reproducir"}
          onClick={() => setPlaying((v) => !v)}
          className="ml-2 p-1"
        >
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </button>
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-8 text-center font-serif text-3xl md:mb-12 md:text-4xl">{children}</h2>;
}

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <SectionTitle>Colecciones</SectionTitle>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {categories.map((c) => (
          <a key={c.label} href="#" className="group block">
            <Media tone={c.tone} image={c.image} alt={c.label} className="aspect-[3/4]">
              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
            </Media>
            <p className="mt-3 text-center text-sm font-semibold uppercase tracking-[0.12em]">
              {c.label}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

function Promos() {
  return (
    <section className="grid md:grid-cols-2">
      {promos.map((p) => (
        <a key={p.title} href="#" className="group relative block">
          <Media
            tone={p.tone}
            image={p.image}
            alt={p.title}
            className="aspect-[4/5] md:aspect-[5/6]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent transition group-hover:from-black/60" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-center text-white md:p-12">
              <h2 className="font-serif text-3xl md:text-4xl">{p.title}</h2>
              <p className="mt-2 text-sm tracking-wide">{p.tagline}</p>
              <span className="mt-5 inline-block border-b border-white pb-1 text-xs font-semibold uppercase tracking-[0.2em]">
                Comprar ahora
              </span>
            </div>
          </Media>
        </a>
      ))}
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const off = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;
  return (
    <div className="group">
      <Media tone={product.tone} image={product.image} alt={product.name} className="aspect-[3/4]">
        {off > 0 && (
          <span className="absolute left-3 top-3 bg-destructive px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground">
            −{off}%
          </span>
        )}
        <button
          onClick={() => add(product)}
          className="absolute inset-x-3 bottom-3 bg-background py-3 text-xs font-semibold uppercase tracking-[0.15em] text-foreground transition md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Añadir al carrito
        </button>
      </Media>
      <h3 className="mt-3 text-sm font-medium">{product.name}</h3>
      <p className="mt-1 text-sm">
        <span className={cn(off > 0 && "text-destructive")}>{formatPrice(product.price)}</span>
        {product.compareAt && (
          <span className="ml-2 text-muted-foreground line-through">
            {formatPrice(product.compareAt)}
          </span>
        )}
      </p>
    </div>
  );
}

function BestSellers() {
  const [tab, setTab] = useState<"el" | "ella">("el");
  return (
    <section
      id="best-sellers"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 md:px-8 md:py-24"
    >
      <SectionTitle>Los más vendidos</SectionTitle>
      <div className="mb-10 flex justify-center gap-8">
        {(
          [
            ["el", "Para él"],
            ["ella", "Para ella"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.15em] transition",
              tab === k ? "border-foreground" : "border-transparent text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        key={tab}
        className="grid grid-cols-2 gap-x-3 gap-y-10 animate-in fade-in duration-500 md:grid-cols-3 md:gap-x-6"
      >
        {bestSellers[tab].map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function Highlight() {
  return (
    <section>
      <Media
        tone={highlight.tone}
        image={highlight.image}
        alt={highlight.title}
        className="h-[60vh] min-h-[380px]"
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <h2 className="font-serif text-4xl md:text-6xl">{highlight.title}</h2>
          <p className="mt-3 text-sm tracking-wide md:text-base">{highlight.tagline}</p>
          <a
            href="#"
            className="mt-7 border border-white px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
          >
            {highlight.cta}
          </a>
        </div>
      </Media>
    </section>
  );
}

function Reserve() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle>{reserve.title}</SectionTitle>
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:gap-6 md:px-8 xl:mx-auto xl:max-w-7xl">
        {reserve.products.map((p) => (
          <div key={p.id} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[28%] lg:w-[23%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Trust() {
  const icons = [MessageCircle, ShieldCheck, RotateCcw] as const;
  return (
    <section className="bg-secondary px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {trust.eyebrow}
        </p>
        <p className="mx-auto mt-4 max-w-2xl font-serif text-2xl leading-snug md:text-3xl">
          {trust.intro}
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {trust.items.map((t, n) => {
            const Icon = icons[n % icons.length]!;
            return (
              <div key={t.title}>
                <Icon className="mx-auto size-7" strokeWidth={1.5} />
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.15em]">
                  {t.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {t.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };
  return (
    <footer className="border-t px-4 pb-10 pt-16 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">Menú</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {menu.map((m) => (
              <li key={m.label}>
                <a href="#" className="hover:text-foreground">
                  {m.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">Políticas</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {footer.policies.map((p) => (
              <li key={p}>
                <a href="#" className="hover:text-foreground">
                  {p}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">Información</h2>
          <dl className="space-y-2 text-sm text-muted-foreground">
            {footer.business.map(([k, v]) => (
              <div key={k}>
                <dt className="inline font-medium text-foreground">{k}: </dt>
                <dd className="inline">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">Suscríbete</h2>
          <p className="text-sm text-muted-foreground">
            Novedades, ofertas exclusivas y lanzamientos antes que nadie.
          </p>
          {subscribed ? (
            <p className="mt-4 text-sm font-medium">¡Gracias! Te has suscrito.</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-4 flex border-b border-foreground">
              <input
                type="email"
                required
                placeholder="Tu email"
                aria-label="Tu email"
                className="h-11 flex-1 bg-transparent text-sm outline-none"
              />
              <button className="text-xs font-semibold uppercase tracking-[0.15em]">Enviar</button>
            </form>
          )}
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-7xl text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BRAND}
      </p>
    </footer>
  );
}

function CartDrawer() {
  const { lines, setQty, open, setOpen } = useCart();
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="store flex w-full flex-col p-0 sm:max-w-md">
        <SheetTitle className="border-b px-6 py-5 text-sm font-semibold uppercase tracking-[0.2em]">
          Carrito
        </SheetTitle>
        {lines.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Tu carrito está vacío.
          </p>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-6">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Media
                    tone={product.tone}
                    image={product.image}
                    alt={product.name}
                    className="h-24 w-20 shrink-0"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(product.price)}
                    </p>
                    <div className="mt-auto flex w-fit items-center border">
                      <button
                        aria-label="Quitar uno"
                        onClick={() => setQty(product.id, qty - 1)}
                        className="p-2"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <button
                        aria-label="Añadir uno"
                        onClick={() => setQty(product.id, qty + 1)}
                        className="p-2"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t p-6">
              <div className="flex justify-between text-sm font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Envío e impuestos calculados al finalizar la compra.
              </p>
              <button className="mt-5 w-full bg-primary py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90">
                Finalizar compra
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function Storefront() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  const cart: CartApi = {
    lines,
    open,
    setOpen,
    add: (product) => {
      setLines((ls) => {
        const found = ls.find((l) => l.product.id === product.id);
        return found
          ? ls.map((l) => (l === found ? { ...l, qty: l.qty + 1 } : l))
          : [...ls, { product, qty: 1 }];
      });
      setOpen(true);
    },
    setQty: (id, qty) =>
      setLines((ls) =>
        qty <= 0
          ? ls.filter((l) => l.product.id !== id)
          : ls.map((l) => (l.product.id === id ? { ...l, qty } : l)),
      ),
  };

  return (
    <CartContext.Provider value={cart}>
      <div className="store min-h-screen">
        <AnnouncementBar />
        <Header />
        <main>
          <Hero />
          <Categories />
          <Promos />
          <BestSellers />
          <Highlight />
          <Reserve />
          <Trust />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartContext.Provider>
  );
}
