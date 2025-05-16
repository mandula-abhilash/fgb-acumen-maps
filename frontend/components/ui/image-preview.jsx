"use client";

import { useState } from "react";
import { ZoomIn } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";

import { cn } from "@/lib/utils";

export function ImagePreview({ src, alt, className, aspectRatio = "16/9" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "group relative cursor-zoom-in overflow-hidden rounded-lg border bg-muted",
          className
        )}
        style={{ aspectRatio }}
        onClick={() => setOpen(true)}
      >
        <div className="absolute inset-0 z-10 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-full items-center justify-center">
            <ZoomIn className="h-8 w-8 text-white" />
          </div>
        </div>
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src, alt }]}
        plugins={[Zoom]}
        animation={{ fade: 300 }}
        carousel={{ finite: true }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        zoom={{
          maxZoomPixelRatio: 5,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          wheelZoomRatio: 0.1,
          pinchZoomDistanceThreshold: 50,
          scrollToZoom: true,
        }}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(8px)",
          },
        }}
      />
    </>
  );
}
