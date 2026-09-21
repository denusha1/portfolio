/** Decorative type only; nearby headings and links carry the accessible text. */
export default function OutlineWord({ children, className = "" }: { children: string; className?: string }) {
  return <span className={`outline-word ${className}`} aria-hidden="true">{children}</span>;
}
