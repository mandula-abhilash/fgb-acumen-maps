"use client";

import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";

import { getDefaultRegions } from "@/lib/api/regions";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

export function RegionFilter({ value, onChange }) {
  const { toast } = useToast();
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFilterActive = Array.isArray(value) && value.length > 0;

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const data = await getDefaultRegions();
        setRegions(data);
      } catch (error) {
        console.error("Failed to fetch regions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load regions. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner size="sm" className="text-web-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <Globe2 className="h-4 w-4" />
        <Label className="text-sm font-medium flex-1">Region</Label>
        {isFilterActive && (
          <div className="h-2 w-2 rounded-full bg-havelock-blue" />
        )}
      </div>
      <MultiSelect
        options={regions}
        selected={value || []}
        onChange={onChange}
        placeholder="Select regions..."
      />
    </div>
  );
}
