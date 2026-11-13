"use client";
import SmoothScroll from "./SmoothScroll";
import TextEffects from "./TextEffects";
import { ContactProvider } from "./ContactProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContactProvider>
      <SmoothScroll>
        <TextEffects />
        {children}
      </SmoothScroll>
    </ContactProvider>
  );
}
