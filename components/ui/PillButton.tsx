"use client";
/**
 * PillButton: outline pill CTA (reference tour teaser "Enter ... →", spec/02-design-system/components-styling.md).
 * Usage:
 *   <PillButton href="/tour" className="tour-fade">{copy.cta}</PillButton>        // light: white border on imagery
 *   <PillButton tone="dark" onClick={fn}>{copy.retry}</PillButton>                // dark: ink border on sand
 *   <PillButton tone="sand" onClick={fn}>Try again</PillButton>                    // sand outline on ink (fills sand on hover)
 * Renders next/link for internal hrefs, <a> for external/mailto/tel, <button> without href.
 * Extra props (ref, aria-*, onMouseEnter...) are forwarded.
 */
import Link from "next/link";
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { onHashClick } from "./scrollToHash";

const tones = {
  light: "border-white/70 hover:bg-white hover:text-[#2A2725] focus-visible:outline-white",
  dark: "border-[#2A2725]/70 text-[#2A2725] hover:bg-[#2A2725] hover:text-[#EDE6D6] focus-visible:outline-[#2A2725]",
  sand: "border-[#EDE6D6]/25 text-[#EDE6D6] hover:bg-[#EDE6D6] hover:text-[#2A2725] focus-visible:outline-[#EDE6D6]",
} as const;

type Base = { children: ReactNode; tone?: keyof typeof tones; className?: string };
type AsLink = Base & { href: string } & Omit<ComponentPropsWithRef<"a">, "href" | "children" | "className">;
type AsButton = Base & { href?: undefined } & Omit<ComponentPropsWithRef<"button">, "children" | "className">;

export const pillClasses = (tone: keyof typeof tones = "light", className?: string) =>
  cn(
    "inline-block rounded-full border px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
    tones[tone],
    className,
  );

export default function PillButton(props: AsLink | AsButton) {
  const { children, tone = "light", className } = props;
  const cls = pillClasses(tone, className);

  if (props.href === undefined) {
    const { children: _c, tone: _t, className: _cn, href: _h, type, ...btn } = props as AsButton;
    void _c; void _t; void _cn; void _h;
    return (
      <button type={type ?? "button"} className={cls} {...btn}>
        {children}
      </button>
    );
  }

  const { children: _c, tone: _t, className: _cn, href, onClick, ...a } = props as AsLink;
  void _c; void _t; void _cn;
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const blank = /^https?:/.test(href);
    return (
      <a href={href} onClick={onClick} target={blank ? "_blank" : undefined} rel={blank ? "noreferrer" : undefined} className={cls} {...a}>
        {children}
      </a>
    );
  }
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    onHashClick(e);
  };
  return (
    <Link href={href} onClick={handle} className={cls} {...a}>
      {children}
    </Link>
  );
}
