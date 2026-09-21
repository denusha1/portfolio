"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import { goToSection, goToTop } from "@/lib/nav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const nav = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = window.innerHeight * .4;
      let current = "";
      for (const { href } of navLinks) {
        const element = document.getElementById(href.slice(1));
        if (element && element.getBoundingClientRect().top <= threshold) current = href;
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = "#contact";
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const close = () => { setOpen(false); toggle.current?.focus(); };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") {
        const links = Array.from(nav.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); toggle.current?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.current?.focus(); }
        else if (document.activeElement === toggle.current) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
      }
    };
    const desktop = window.matchMedia("(min-width: 900px)");
    const resize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", resize);
    window.addEventListener("keydown", keyboard);
    return () => { document.body.style.overflow = previous; desktop.removeEventListener("change", resize); window.removeEventListener("keydown", keyboard); };
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    if (open) toggle.current?.focus();
    if (href) goToSection(href); else goToTop();
  };
  return <>
    <a href="#main" className="skip-link btn btn-primary btn-sm">Skip to content</a>
    <header className="editorial-rail">
      <a href="#" className="rail-monogram" aria-label="Denusha — home" onClick={event => { event.preventDefault(); navigate(""); }}>D<span>↗</span></a>
      <span className="rail-caption">DEVELOPER<br />PORTFOLIO</span>
      <button ref={toggle} type="button" className="rail-menu" aria-expanded={open} aria-controls="rail-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(value => !value)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      <nav ref={nav} id="rail-navigation" className={`rail-navigation ${open ? "is-open" : ""}`} aria-label="Portfolio sections">
        {[{ label: "Home", href: "" }, ...navLinks].map(({ label, href }, index) => <a key={label} href={href || "#"} aria-current={active === href ? "location" : undefined} onClick={event => { event.preventDefault(); navigate(href); }}><span className="rail-index">0{index}</span><span>{label}</span><ArrowUpRight size={13} aria-hidden="true" /></a>)}
        <a href="/cv.pdf" download className="rail-resume"><span className="rail-index">PDF</span><span>Résumé</span><ArrowUpRight size={13} /></a>
      </nav>
      <div className="rail-bottom"><ThemeToggle /><span>DESIGN + CODE</span></div>
    </header>
  </>;
}
