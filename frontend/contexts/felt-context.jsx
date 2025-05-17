import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Felt } from "@feltmaps/js-sdk";

const FeltContext = createContext(null);

export function FeltProvider({ children, mapId, options }) {
  const [felt, setFelt] = useState(null);
  const [layers, setLayers] = useState([]);
  const [loadingLayers, setLoadingLayers] = useState(true);
  const [visibilityState, setVisibilityState] = useState({});
  const hasLoadedRef = useRef(false);
  const mapRef = useRef(null);

  useEffect(() => {
    async function loadFelt() {
      if (hasLoadedRef.current || !mapRef.current) return;

      try {
        hasLoadedRef.current = true;
        const feltInstance = await Felt.embed(mapRef.current, mapId, options);
        setFelt(feltInstance);

        // Get initial layers
        const initialLayers = await feltInstance.getLayers();
        if (initialLayers && initialLayers.length > 0) {
          // Create initial visibility state (all hidden)
          const initialVisibility = {};
          const layerIds = initialLayers.map((layer) => {
            initialVisibility[layer.id] = false;
            return layer.id;
          });

          // Hide all layers by default
          await feltInstance.setLayerVisibility({ hide: layerIds });

          // Save layers and their visibility state
          setLayers(initialLayers);
          setVisibilityState(initialVisibility);
          setLoadingLayers(false);
        }

        // Subscribe to layer changes
        const unsubscribe = feltInstance.onLayerChange({
          handler: ({ layer }) => {
            setLayers((prevLayers) => {
              return prevLayers.map((l) => (l.id === layer.id ? layer : l));
            });

            setVisibilityState((prev) => ({
              ...prev,
              [layer.id]: !!layer.visible,
            }));
          },
        });

        return () => {
          unsubscribe();
          hasLoadedRef.current = false;
        };
      } catch (error) {
        console.error("Error loading Felt map:", error);
        setLoadingLayers(false);
      }
    }

    loadFelt();

    return () => {
      hasLoadedRef.current = false;
    };
  }, [mapId, options]);

  const toggleLayerVisibility = async (layerId, currentVisibility) => {
    if (!felt) return;

    try {
      if (currentVisibility) {
        await felt.setLayerVisibility({ hide: [layerId] });
      } else {
        await felt.setLayerVisibility({ show: [layerId] });
      }

      setVisibilityState((prev) => ({
        ...prev,
        [layerId]: !currentVisibility,
      }));
    } catch (error) {
      console.error("Error toggling layer visibility:", error);
    }
  };

  return (
    <FeltContext.Provider
      value={{
        felt,
        mapRef,
        layers,
        loadingLayers,
        visibilityState,
        toggleLayerVisibility,
      }}
    >
      {children}
    </FeltContext.Provider>
  );
}

export function useFelt() {
  const context = useContext(FeltContext);
  if (!context) {
    throw new Error("useFelt must be used within a FeltProvider");
  }
  return context;
}
