import type { Metadata } from "next";
import RotateDeviceWarning from "@/components/tour/RotateDeviceWarning";
import TourExperience from "@/components/tour/TourExperience";
import { tourMeta } from "@/content/tour";

// Fixes the reference: generic "3d Tour" title, canonical pointing at "/", og:url "/" (spec/04-assets-seo/favicon-meta.md).
export const metadata: Metadata = {
  title: tourMeta.title,
  description: tourMeta.description,
  alternates: { canonical: "/tour" },
  openGraph: {
    title: tourMeta.ogTitle,
    description: tourMeta.ogDescription,
    url: "/tour",
    images: ["/brand/og-image.jpg"],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: tourMeta.ogTitle, description: tourMeta.ogDescription },
};

export default function TourPage() {
  return (
    <>
      <h1 className="sr-only">{tourMeta.h1}</h1>
      <p className="sr-only">{tourMeta.intro}</p>
      <RotateDeviceWarning />
      <TourExperience />
    </>
  );
}
