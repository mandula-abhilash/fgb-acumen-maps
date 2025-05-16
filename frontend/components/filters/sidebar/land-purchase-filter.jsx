"use client";

import { Store } from "lucide-react";

import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

const landPurchaseStatuses = [
  { value: "Land Offer Stage", label: "Land Offer Stage" },
  { value: "Preferred Buyer", label: "Preferred Buyer" },
  { value: "Heads of Terms Agreed", label: "Heads of Terms Agreed" },
  { value: "Contracts Exchanged", label: "Contracts Exchanged" },
  { value: "Purchase Completed", label: "Purchase Completed" },
];

export function LandPurchaseFilter({ value, onChange }) {
  const isFilterActive = Array.isArray(value) && value.length > 0;

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <Store className="h-4 w-4" />
        <Label className="text-sm font-medium flex-1">
          Land Purchase Status
        </Label>
        {isFilterActive && (
          <div className="h-2 w-2 rounded-full bg-havelock-blue" />
        )}
      </div>
      <MultiSelect
        options={landPurchaseStatuses}
        selected={value || []}
        onChange={onChange}
        placeholder="Select purchase status..."
      />
    </div>
  );
}
