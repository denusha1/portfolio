/** In-page navigation follows the same continuous scroll as the mouse or touch. */
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";

export function goToSection(href: string) {
  const element = document.getElementById(href.replace(/^#/, ""));
  if (!element) { window.location.assign(`/${href}`); return; }
  if (window.location.hash !== href) history.pushState(null, "", href);
  element.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
}

export function goToTop() {
  if (window.location.pathname !== "/") { window.location.assign("/"); return; }
  if (window.location.hash) history.pushState(null, "", window.location.pathname);
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
}
