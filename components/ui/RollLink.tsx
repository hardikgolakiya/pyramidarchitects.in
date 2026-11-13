"use client";
/**
 * RollLink: text with the two-layer character roll on hover ([data-hover-reveal], spec/03-motion/text-reveal-and-hover-reveal.md).
 * Usage:
 *   <RollLink href="/tour" className="...">Tour</RollLink>            // internal route -> next/link
 *   <RollLink href="/#about">About</RollLink>                         // same-page hash -> Lenis scroll
 *   <RollLink href="https://..." external>Instagram</RollLink>        // target=_blank rel=noreferrer
 *   <RollLink onClick={fn}>Contact</RollLink>                         // no href -> <button type="button">
 *   <RollLink as="span">Label</RollLink>                              // plain span (inside another link/button)
 * Children must be a plain string. The global TextEffects init splits it after the boot loader; elements
 * mounted later are initialised here on mount.
 */
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CSSProperties, FocusEventHandler, MouseEvent, MouseEventHandler, ReactNode } from "react";
import { hoverReveal } from "@/components/providers/TextEffects";
import { onHashClick } from "./scrollToHash";

type Props = {
  children: ReactNode;
  href?: string;
  external?: boolean;
  as?: "span";
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLElement>;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  "aria-label"?: string;
};

export function useLateHoverReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || document.body.dataset.bootLoaderComplete !== "true") return;
    hoverReveal(el.parentElement ?? el);
  }, []);
  return ref;
}

export default function RollLink({ children, href, external, as, className, style, onClick, ...rest }: Props) {
  const ref = useLateHoverReveal<HTMLElement>();
  const common = { "data-hover-reveal": true, className, style, ...rest };

  if (as === "span") return <span ref={ref} {...common}>{children}</span>;

  if (!href) {
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} type="button" onClick={onClick} {...common}>
        {children}
      </button>
    );
  }

  const isExternal = external || /^(https?:|mailto:|tel:)/.test(href);
  if (isExternal) {
    const blank = /^https?:/.test(href);
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={blank ? "_blank" : undefined}
        rel={blank ? "noreferrer" : undefined}
        onClick={onClick}
        {...common}
      >
        {children}
      </a>
    );
  }

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    onHashClick(e);
  };
  return (
    <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} onClick={handle} {...common}>
      {children}
    </Link>
  );
}
