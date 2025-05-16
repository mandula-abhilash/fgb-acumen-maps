"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { useFeltEmbed } from "@/lib/felt";
import { Spinner } from "@/components/ui/spinner";

export default function MapPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { felt, mapRef } = useFeltEmbed("ZGqxKlVgR8eyiNfbVsYqxB", {
    uiControls: {
      cooperativeGestures: false,
      fullScreenButton: false,
      showLegend: false,
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (felt) {
      // Subscribe to layer changes
      const unsubscribe = felt.onLayerChange({
        handler: ({ layer }) => {
          console.log("Layer changed:", layer);
        },
      });

      // Get initial layers
      felt.getLayers().then((layers) => {
        console.log("Initial layers:", layers);
      });

      // Get viewport information
      felt.getViewport().then((viewport) => {
        console.log("Current viewport:", viewport);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [felt]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-full p-6">
      <div className="h-[calc(100vh-10rem)] bg-muted rounded-lg overflow-hidden relative">
        <div ref={mapRef} className="absolute inset-0 rounded-lg">
          {!felt && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="lg" className="text-web-orange" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
