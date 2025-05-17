"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function Sidebar() {
  const [layers, setLayers] = useState([]);
  const [loadingLayers, setLoadingLayers] = useState(true);
  const [felt, setFelt] = useState(null);
  const [visibilityState, setVisibilityState] = useState({});

  useEffect(() => {
    const checkFelt = setInterval(() => {
      const feltInstance = window.felt;
      if (feltInstance) {
        clearInterval(checkFelt);
        setFelt(feltInstance);

        // Get initial layers
        feltInstance.getLayers().then((initialLayers) => {
          if (initialLayers && initialLayers.length > 0) {
            // Create initial visibility state (all hidden)
            const initialVisibility = {};
            const layerIds = initialLayers.map((layer) => {
              initialVisibility[layer.id] = false;
              return layer.id;
            });

            // Hide all layers by default
            feltInstance.setLayerVisibility({ hide: layerIds });

            // Save layers and their visibility state
            setLayers(initialLayers);
            setVisibilityState(initialVisibility);
            setLoadingLayers(false);
          }
        });

        // Subscribe to layer changes to detect any changes including visibility
        const unsubscribe = feltInstance.onLayerChange({
          handler: ({ layer }) => {
            // Update the layers list when a layer changes
            setLayers((prevLayers) => {
              return prevLayers.map((l) => (l.id === layer.id ? layer : l));
            });

            // Update visibility state if it changed
            setVisibilityState((prev) => ({
              ...prev,
              [layer.id]: !!layer.visible,
            }));
          },
        });

        // Setup polling to check visibility state periodically
        // This helps ensure our UI stays in sync with the actual map state
        const visibilityCheckInterval = setInterval(async () => {
          if (feltInstance) {
            try {
              const currentLayers = await feltInstance.getLayers();
              if (currentLayers && currentLayers.length > 0) {
                const newVisibility = {};
                currentLayers.forEach((layer) => {
                  newVisibility[layer.id] = !!layer.visible;
                });
                setVisibilityState(newVisibility);
              }
            } catch (error) {
              console.error("Error checking layer visibility:", error);
            }
          }
        }, 2000); // Check every 2 seconds

        return () => {
          unsubscribe();
          clearInterval(visibilityCheckInterval);
          clearInterval(checkFelt);
        };
      }
    }, 500); // Check every 500ms

    return () => clearInterval(checkFelt);
  }, []);

  const toggleLayerVisibility = async (layerId, currentVisibility) => {
    if (!felt) return;

    try {
      if (currentVisibility) {
        await felt.setLayerVisibility({ hide: [layerId] });
      } else {
        await felt.setLayerVisibility({ show: [layerId] });
      }

      // Update local state immediately for better UX feedback
      setVisibilityState((prev) => ({
        ...prev,
        [layerId]: !currentVisibility,
      }));
    } catch (error) {
      console.error("Error toggling layer visibility:", error);
    }
  };

  return (
    <div className="w-72 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {loadingLayers ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="lg" className="text-web-orange" />
            </div>
          ) : (
            <div className="space-y-2">
              {layers?.map((layer) => {
                // Use our tracked visibility state instead of layer.visible
                const isVisible = visibilityState[layer.id] || false;

                return (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
                  >
                    <span className="text-sm font-medium">{layer.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleLayerVisibility(layer.id, isVisible)}
                    >
                      {isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
