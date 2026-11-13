import Hero from "@/components/sections/hero/Hero";
import About from "@/components/sections/about/About";
import ArchitectureExplorer from "@/components/sections/explorer/ArchitectureExplorer";
import ResidenceSlides from "@/components/sections/residence-slides/ResidenceSlides";
import CloudTransition from "@/components/sections/cloud-transition/CloudTransition";
import ApartmentStage from "@/components/sections/apartment/ApartmentStage";
import TourTeaser from "@/components/sections/tour-teaser/TourTeaser";
import SiteFooter from "@/components/layout/SiteFooter";

// Section order and ids follow spec/01-layout/sections.md.
export default function Home() {
  return (
    <>
      <main className="relative w-full overflow-x-clip">
        <Hero />
        <About />
        <ArchitectureExplorer />
        <ResidenceSlides />
        <CloudTransition />
        <ApartmentStage />
        <TourTeaser />
      </main>
      <SiteFooter />
    </>
  );
}
