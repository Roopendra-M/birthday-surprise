/**
 * GSAP utility helpers.
 * Always import gsap lazily (dynamic import) in Next.js to avoid SSR issues,
 * or use the `useEffect` guard pattern shown here.
 */

import type { gsap as GsapType } from "gsap";

type Gsap = typeof GsapType;

let _gsap: Gsap | null = null;

/**
 * Lazily loads GSAP (client-side only).
 */
export async function loadGsap(): Promise<Gsap> {
  if (_gsap) return _gsap;
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  const { TextPlugin }    = await import("gsap/TextPlugin");
  const { Flip }          = await import("gsap/Flip");

  gsap.registerPlugin(ScrollTrigger, TextPlugin, Flip);
  _gsap = gsap;
  return gsap;
}

/**
 * Common GSAP eases – use these strings in your tweens.
 */
export const GsapEases = {
  power2In:    "power2.in",
  power2Out:   "power2.out",
  power2InOut: "power2.inOut",
  power3Out:   "power3.out",
  power4Out:   "power4.out",
  elastic:     "elastic.out(1, 0.5)",
  bounce:      "bounce.out",
  back:        "back.out(1.7)",
  circ:        "circ.out",
  expo:        "expo.out",
} as const;

/**
 * Animate elements into view using GSAP.
 * @param targets – CSS selector or element(s)
 * @param delay   – stagger delay between items
 */
export async function animateIntoView(
  targets: string | Element | Element[],
  delay = 0.08
) {
  const gsap = await loadGsap();
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");

  gsap.fromTo(
    targets,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: GsapEases.power3Out,
      stagger: delay,
      scrollTrigger: {
        trigger: typeof targets === "string" ? targets : undefined,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }
  );
  
  return ScrollTrigger;
}

/**
 * GSAP-powered horizontal marquee (infinite scroll text).
 * @param wrapper  – the outer container element
 * @param duration – seconds for one full cycle
 */
export async function createMarquee(wrapper: Element, duration = 20) {
  const gsap = await loadGsap();
  const inner = wrapper.querySelector<HTMLElement>("[data-marquee-inner]");
  if (!inner) return;

  gsap.to(inner, {
    x: "-50%",
    duration,
    ease: "none",
    repeat: -1,
  });
}
