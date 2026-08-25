import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal. Attach the returned ref to a container; every
 * descendant marked with `data-reveal` fades/slides in when it enters the
 * viewport. Stagger per item via `style={{ "--reveal-delay": "120ms" }}`.
 * The `.reveal` CSS class handles prefers-reduced-motion (instant show).
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      for (const el of els) el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
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
