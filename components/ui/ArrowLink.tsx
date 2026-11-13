"use client";
/**
 * ArrowLink: uppercase text CTA with underlined rolling label and an arrow that nudges on hover
 * (reference hero CTAs, spec/02-design-system/components-styling.md "Hero text link").
 * Usage:
 *   <ArrowLink href="/#marquee-transition">{copy.cta1}</ArrowLink>
 *   <ArrowLink href="/" direction="back" tone="dark">{copy.back}</ArrowLink>
 *   <ArrowLink onClick={fn}>Label</ArrowLink>   // renders a <button>
 * Default classes are the hero ones; pass className to override size/padding (merged with tailwind-merge).
 */
import Link from "next/link";
import type { MouseEvent, MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import RollLink from "./RollLink";
import { onHashClick } from "./scrollToHash";

type Props = {
  children: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  tone?: "light" | "dark";
  direction?: "forward" | "back";
  className?: string;
  labelClassName?: string;
};

export default function ArrowLink({ children, href, onClick, tone = "light", direction = "forward", className, labelClassName }: Props) {
  const back = direction === "back";
  const cls = cn(
    "group flex items-center gap-3 py-1.5 text-sm uppercase md:text-base lg:py-0 lg:text-lg ls:text-xs",
    !href && "cursor-pointer",
    className,
  );
  const label = (
    <RollLink as="span" className={cn("border-b", tone === "light" ? "border-white" : "border-[#2A2725]", labelClassName)}>
      {children}
    </RollLink>
  );
  const arrow = (
    <span
      aria-hidden="true"
      className={cn("inline-block transition-transform duration-300", back ? "group-hover:-translate-x-1" : "group-hover:translate-x-1")}
    >
      {back ? "←" : "→"}
    </span>
  );
  const inner = back ? (
    <>
      {arrow}
      {label}
    </>
  ) : (
    <>
      {label}
      {arrow}
    </>
  );

  if (!href) {
    return (
      <button type="button" onClick={onClick} className={cn(cls, "text-left")}>
        {inner}
      </button>
    );
  }
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const blank = /^https?:/.test(href);
    return (
      <a href={href} onClick={onClick} target={blank ? "_blank" : undefined} rel={blank ? "noreferrer" : undefined} className={cls}>
        {inner}
      </a>
    );
  }
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    onHashClick(e);
  };
  return (
    <Link href={href} onClick={handle} className={cls}>
      {inner}
    </Link>
  );
}
