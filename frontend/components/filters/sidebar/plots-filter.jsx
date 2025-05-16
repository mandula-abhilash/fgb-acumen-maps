"use client";

import { useState } from "react";
import { Building2, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const modes = [
  { value: "between", label: "Between" },
  { value: "more-than", label: "More than" },
  { value: "less-than", label: "Less than" },
];

export function PlotsFilter({ value = {}, onChange }) {
  // Define isFilterActive before using it in useState
  const isFilterActive = (val = value) => {
    return (
      val &&
      val.mode &&
      ((val.mode === "between" && val.min && val.max) ||
        (["more-than", "less-than"].includes(val.mode) && val.single))
    );
  };

  const [localValue, setLocalValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);
  const [isOpen, setIsOpen] = useState(!isFilterActive(value));

  const handleModeChange = (mode) => {
    setLocalValue({ mode, min: "", max: "", single: "" });
    setIsDirty(true);
  };

  const handleValueChange = (field, newValue) => {
    setLocalValue((prev) => ({
      ...prev,
      [field]: newValue,
    }));
    setIsDirty(true);
  };

  const handleApplyFilter = () => {
    // Validate and transform values
    const filterValue = {
      ...localValue,
      min: localValue.min ? parseInt(localValue.min) : undefined,
      max: localValue.max ? parseInt(localValue.max) : undefined,
      single: localValue.single ? parseInt(localValue.single) : undefined,
    };

    onChange(filterValue);
    setIsDirty(false);
    setIsOpen(false);
  };

  const handleClearFilter = (e) => {
    e.stopPropagation();
    setLocalValue({});
    setIsDirty(false);
    onChange({});
    setIsOpen(true);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const isValid = () => {
    if (!localValue.mode) return false;

    if (localValue.mode === "between") {
      return (
        localValue.min &&
        localValue.max &&
        parseInt(localValue.min) <= parseInt(localValue.max)
      );
    }

    if (localValue.mode === "more-than" || localValue.mode === "less-than") {
      return !!localValue.single;
    }

    return false;
  };

  const getFilterLabel = () => {
    if (!isFilterActive()) return null;

    if (value.mode === "between") {
      return `Between ${value.min} and ${value.max} plots`;
    } else if (value.mode === "more-than") {
      return `More than ${value.single} plots`;
    } else if (value.mode === "less-than") {
      return `Less than ${value.single} plots`;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-2 px-2">
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center gap-2 flex-1">
              <Building2 className="h-4 w-4" />
              <Label className="text-sm font-medium flex-1">
                Number of Plots
              </Label>
              {isFilterActive() && (
                <div className="h-2 w-2 rounded-full bg-havelock-blue" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        {isFilterActive() && !isOpen && (
          <div className="flex items-center gap-2 px-6 py-1 bg-muted/100 rounded-md group transition-colors hover:bg-muted">
            <span className="flex-1 text-sm font-medium group-hover:text-havelock-blue transition-colors">
              {getFilterLabel()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
              onClick={handleEdit}
            >
              <Pencil className="h-3 w-3" />
              <span className="sr-only">Edit filter</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
              onClick={handleClearFilter}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear filter</span>
            </Button>
          </div>
        )}

        <CollapsibleContent>
          <div className="space-y-2 pt-2">
            <Select value={localValue.mode} onValueChange={handleModeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select filter type" />
              </SelectTrigger>
              <SelectContent>
                {modes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {localValue.mode === "between" && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Minimum plots"
                  value={localValue.min || ""}
                  onChange={(e) => handleValueChange("min", e.target.value)}
                  min="0"
                />
                <Input
                  type="number"
                  placeholder="Maximum plots"
                  value={localValue.max || ""}
                  onChange={(e) => handleValueChange("max", e.target.value)}
                  min="0"
                />
              </div>
            )}

            {(localValue.mode === "more-than" ||
              localValue.mode === "less-than") && (
              <Input
                type="number"
                placeholder={`${localValue.mode === "more-than" ? "Minimum" : "Maximum"} plots`}
                value={localValue.single || ""}
                onChange={(e) => handleValueChange("single", e.target.value)}
                min="0"
              />
            )}

            {localValue.mode && (
              <Button
                onClick={handleApplyFilter}
                disabled={!isValid() || !isDirty}
                className="w-full mt-2 bg-web-orange hover:bg-web-orange/90 text-white"
              >
                Apply Filter
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
