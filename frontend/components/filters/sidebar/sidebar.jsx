"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function Sidebar() {
  const [layers, setLayers] = useState([]);
  const [loadingLayers, setLoadingLayers] = useState(true);
  const [felt, setFelt] = useState(null);

  useEffect(() => {
    const checkFelt = setInterval(() => {
      const feltInstance = window.felt;
      if (feltInstance) {
        clearInterval(checkFelt);
        setFelt(feltInstance);

        // Get initial layers
        feltInstance.getLayers().then((initialLayers) => {
          if (initialLayers && initialLayers.length > 0) {
            // Hide all layers initially
            const layerIds = initialLayers.map((layer) => layer.id);
            feltInstance.setLayerVisibility({ hide: layerIds });
            setLayers(initialLayers);
            setLoadingLayers(false);
          }
        });

        // Subscribe to layer changes
        const unsubscribe = feltInstance.onLayerChange({
          handler: ({ layer }) => {
            setLayers((prevLayers) =>
              prevLayers.map((l) => (l.id === layer.id ? layer : l))
            );
          },
        });

        return () => {
          unsubscribe();
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
              {layers?.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
                >
                  <span className="text-sm font-medium">{layer.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      toggleLayerVisibility(layer.id, layer.visible)
                    }
                  >
                    {layer.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
