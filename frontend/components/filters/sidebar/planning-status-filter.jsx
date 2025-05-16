"use client";

import { ScrollText } from "lucide-react";

import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

const planningStatuses = [
  { value: "Allocated", label: "Allocated" },
  { value: "Draft Allocation", label: "Draft Allocation" },
  { value: "Outline Submission", label: "Outline Submission" },
  { value: "Outline Approval", label: "Outline Approval" },
  { value: "Full Submission", label: "Full Submission" },
  { value: "Full Approval", label: "Full Approval" },
  { value: "Detailed Submission", label: "Detailed Submission" },
  { value: "Detailed Approval", label: "Detailed Approval" },
  { value: "Appeal Lodged", label: "Appeal Lodged" },
  { value: "Appeal Allowed", label: "Appeal Allowed" },
];

export function PlanningStatusFilter({ value, onChange }) {
  const isFilterActive = Array.isArray(value) && value.length > 0;

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4" />
        <Label className="text-sm font-medium flex-1">Planning Status</Label>
        {isFilterActive && (
          <div className="h-2 w-2 rounded-full bg-havelock-blue" />
        )}
      </div>
      <MultiSelect
        options={planningStatuses}
        selected={value || []}
        onChange={onChange}
        placeholder="Select planning status..."
      />
    </div>
  );
}
