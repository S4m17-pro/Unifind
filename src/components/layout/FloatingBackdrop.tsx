"use client";

import { useEffect, useRef } from "react";
import { Backpack, Glasses, KeyRound, Smartphone, Tag, Watch } from "lucide-react";

/**
 * Decoración flotante del mundo "Vitrina de aire".
 * SVG de trazo fino, sin imágenes: no pesa en el RNF del catálogo.
 */
export default function FloatingBackdrop() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--scroll", String(window.scrollY));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden"
    >
      <div ref={layerRef} className="absolute inset-0" style={{ "--scroll": "0" } as React.CSSProperties}>
        <Tag
          className="float-a absolute top-[14%] left-[5%] h-24 w-24 -rotate-12 text-teal-900/[0.07] sm:h-32 sm:w-32"
          strokeWidth={1}
          style={{ transform: "translateY(calc(var(--scroll, 0) * 0.06px))" }}
        />
        <KeyRound
          className="float-b absolute top-[26%] right-[7%] h-20 w-20 rotate-12 text-teal-900/[0.08] sm:h-28 sm:w-28"
          strokeWidth={1}
          style={{ transform: "translateY(calc(var(--scroll, 0) * -0.04px))" }}
        />
        <Smartphone
          className="float-c absolute top-[58%] left-[9%] h-16 w-16 -rotate-6 text-teal-900/[0.06] sm:h-24 sm:w-24"
          strokeWidth={1}
          style={{ transform: "translateY(calc(var(--scroll, 0) * 0.05px))" }}
        />
        <Glasses
          className="float-a absolute right-[14%] bottom-[14%] h-20 w-20 rotate-6 text-teal-900/[0.07] sm:h-28 sm:w-28"
          strokeWidth={1}
          style={{ transform: "translateY(calc(var(--scroll, 0) * -0.03px))" }}
        />
        <Watch
          className="float-b absolute top-[9%] right-[30%] hidden h-16 w-16 rotate-12 text-teal-900/[0.06] md:block"
          strokeWidth={1}
          style={{ transform: "translateY(calc(var(--scroll, 0) * 0.03px))" }}
        />
        <Backpack
          className="float-c absolute bottom-[22%] left-[28%] hidden h-24 w-24 -rotate-6 text-teal-900/[0.05] lg:block"
          strokeWidth={1}
          style={{ transform: "translateY(calc(var(--scroll, 0) * 0.04px))" }}
        />
      </div>
    </div>
  );
}
