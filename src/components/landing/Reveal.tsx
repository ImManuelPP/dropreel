import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal. Attach the returned ref to a container; every
 * descendant marked with `data-reveal` fades/slides in when it enters the
 * viewport. Stagger per item via `style={{ "--reveal-delay": "120ms" }}`.
 *
 * After the entrance transition completes, the reveal classes are removed so
 * they never block hover transforms (e.g. hover:-translate-y-1). Users with
 * prefers-reduced-motion get fully visible, class-free content immediately.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (els.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      for (const el of els) el.classList.remove("reveal", "is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-visible");
          observer.unobserve(el);
          el.addEventListener("transitionend", function onEnd(e) {
            if (e.propertyName === "opacity") {
              el.classList.remove("reveal", "is-visible");
              el.removeEventListener("transitionend", onEnd);
            }
          });
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );
    for (const el of els) {
      if (!el.classList.contains("is-visible")) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
