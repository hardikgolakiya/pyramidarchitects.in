"use client";
import { createContext, useCallback, useContext, useState } from "react";

type Ctx = { open: boolean; trigger: HTMLElement | null; openContact: (el?: HTMLElement | null) => void; closeContact: () => void };
const ContactCtx = createContext<Ctx | null>(null);

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const openContact = useCallback((el?: HTMLElement | null) => {
    setTrigger(el ?? (document.activeElement as HTMLElement | null));
    setOpen(true);
  }, []);
  const closeContact = useCallback(() => setOpen(false), []);
  return <ContactCtx.Provider value={{ open, trigger, openContact, closeContact }}>{children}</ContactCtx.Provider>;
}

export function useContact() {
  const c = useContext(ContactCtx);
  if (!c) throw new Error("useContact must be used inside <ContactProvider>");
  return c;
}
