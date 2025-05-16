"use client";

import { useEffect, useRef, useState } from "react";
import { Felt } from "@feltmaps/js-sdk";

export function useFeltEmbed(mapId, embedOptions) {
  const [felt, setFelt] = useState(null);
  const hasLoadedRef = useRef(false);
  const mapRef = useRef(null);

  useEffect(() => {
    async function loadFelt() {
      if (hasLoadedRef.current) return;
      if (!mapRef.current) return;

      hasLoadedRef.current = true;
      try {
        const feltInstance = await Felt.embed(
          mapRef.current,
          mapId,
          embedOptions
        );
        setFelt(feltInstance);
      } catch (error) {
        console.error("Error loading Felt map:", error);
      }
    }

    loadFelt();
  }, [mapId, embedOptions]);

  return {
    felt,
    mapRef,
  };
}
