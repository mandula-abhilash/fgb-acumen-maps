"use client";

import { useFelt } from "@/contexts/felt-context";

import { Spinner } from "@/components/ui/spinner";

export function MapContent() {
  const { mapRef, felt } = useFelt();

  return (
    <div className="h-full bg-muted overflow-hidden relative">
      <div ref={mapRef} className="absolute inset-0 rounded-lg">
        {!felt && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="lg" className="text-web-orange" />
          </div>
        )}
      </div>
    </div>
  );
}
