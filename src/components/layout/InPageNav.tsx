"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HEADER_GAP_PX = 16;
const HASH_RETRY_MS = 120;

export function scrollToPageHash(hash: string, behavior: ScrollBehavior = "smooth") {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({ behavior, block: "start" });
  return true;
}

function sameDocumentHash(href: string): string | null {
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }

  if (url.origin !== window.location.origin) return null;
  if (url.pathname !== window.location.pathname) return null;
  return url.hash || null;
}

function syncHeaderOffset() {
  const header = document.querySelector<HTMLElement>("[data-app-header]");
  if (!header) return;

  const height = Math.ceil(header.getBoundingClientRect().height + HEADER_GAP_PX);
  document.documentElement.style.setProperty("--app-header-offset", `${height}px`);
}

/**
 * Keeps in-page anchors (Cómo reclamar) aligned under the two-row sticky header
 * and stops Next.js hash Links from remounting the home hero at scroll 0.
 */
export default function InPageNav() {
  const pathname = usePathname();

  useEffect(() => {
    syncHeaderOffset();

    const header = document.querySelector<HTMLElement>("[data-app-header]");
    if (!header) return;

    const observer = new ResizeObserver(syncHeaderOffset);
    observer.observe(header);
    window.addEventListener("resize", syncHeaderOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderOffset);
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) return;

    let cancelled = false;
    const run = (behavior: ScrollBehavior) => {
      if (!cancelled) scrollToPageHash(window.location.hash, behavior);
    };

    run("auto");
    const frame = window.requestAnimationFrame(() => run("auto"));
    const timer = window.setTimeout(() => run("smooth"), HASH_RETRY_MS);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      scrollToPageHash(window.location.hash);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.includes("#")) return;

      const hash = sameDocumentHash(href);
      if (!hash) return;

      const id = decodeURIComponent(hash.slice(1));
      if (!document.getElementById(id)) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }

      syncHeaderOffset();
      scrollToPageHash(hash);
    };

    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
