"use client";

import { useFelt } from "@/contexts/felt-context";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function Sidebar() {
  const { layers, loadingLayers, visibilityState, toggleLayerVisibility } =
    useFelt();

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
