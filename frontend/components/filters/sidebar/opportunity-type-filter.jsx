"use client";

import { FileText } from "lucide-react";

import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

export const opportunityTypes = [
  { value: "Section 106", label: "Section 106" },
  { value: "Grant Funded Land & Build", label: "Grant Funded Land & Build" },
  { value: "Build to Rent", label: "Build to Rent" },
  { value: "Care", label: "Care" },
  { value: "Other", label: "Other" },
];

export function OpportunityTypeFilter({ value, onChange }) {
  const isFilterActive = Array.isArray(value) && value.length > 0;

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <Label className="text-sm font-medium flex-1">Opportunity Type</Label>
        {isFilterActive && (
          <div className="h-2 w-2 rounded-full bg-havelock-blue" />
        )}
      </div>
      <MultiSelect
        options={opportunityTypes}
        selected={value || []}
        onChange={onChange}
        placeholder="Select opportunity types..."
      />
    </div>
  );
}
