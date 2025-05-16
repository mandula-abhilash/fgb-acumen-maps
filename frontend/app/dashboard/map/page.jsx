"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { Felt } from "@feltmaps/js-sdk";

import { Spinner } from "@/components/ui/spinner";

export default function MapPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    async function loadFeltMap() {
      const container = document.getElementById("felt-map-container");
      if (!container) return;

      try {
        const map = await Felt.embed(container, "ZGqxKlVgR8eyiNfbVsYqxB", {
          uiControls: {
            cooperativeGestures: false,
            fullScreenButton: false,
            showLegend: false,
          },
        });

        console.log(map);
        const layers = await map.getLayers();
        console.log("Felt Layers:", layers);
      } catch (err) {
        console.error("Failed to load Felt map:", err);
      }
    }

    loadFeltMap();
  }, []);

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
        <div
          id="felt-map-container"
          className="absolute inset-0 rounded-lg"
        ></div>
      </div>
    </div>
  );
}
