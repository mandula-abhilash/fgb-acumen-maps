"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Edit2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Available filter types.
const modes = [
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
  { value: "between", label: "Between" },
];

export function DateFilter({
  icon: Icon = CalendarIcon,
  label,
  value = {},
  onChange,
}) {
  // Helper: returns true if the passed filter object is complete.
  const isFilterActive = (val) => {
    return (
      val &&
      val.mode &&
      ((val.mode === "between" && val.startDate && val.endDate) ||
        ((val.mode === "before" || val.mode === "after") && val.single))
    );
  };

  // Local state for the filter.
  const [localValue, setLocalValue] = useState(value);
  // Controls the visibility of the filter panel.
  const [isOpen, setIsOpen] = useState(!isFilterActive(value));
  // Indicates if we are in edit mode.
  const [isEditing, setIsEditing] = useState(false);

  // Sync local state with parent's value when it changes.
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // When the user selects a filter type.
  const handleModeChange = (mode) => {
    setLocalValue((prev) => ({ ...prev, mode }));
  };

  // When the user picks a date.
  const handleDateChange = (field, date) => {
    setLocalValue((prev) => ({ ...prev, [field]: date }));
  };

  // Validate that the filter is complete.
  const isValid = () => {
    if (!localValue.mode) return false;
    if (localValue.mode === "between") {
      return (
        localValue.startDate &&
        localValue.endDate &&
        localValue.startDate <= localValue.endDate
      );
    }
    if (localValue.mode === "before" || localValue.mode === "after") {
      return !!localValue.single;
    }
    return false;
  };

  // Apply the filter: update the parent state and collapse the panel.
  const handleApplyFilter = () => {
    if (isValid()) {
      onChange(localValue);
      setIsOpen(false);
      setIsEditing(false);
    }
  };

  // When the user clicks Edit, open the panel (edit mode).
  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsOpen(true);
  };

  // Cancel behavior:
  // • In creation mode (no filter applied yet – parent's value is empty), clear everything.
  // • In edit mode (a filter exists), revert the local state to the parent's filter,
  //   whether or not modifications were made.
  const handleCancel = () => {
    const isCreation = Object.keys(value).length === 0;
    if (isCreation) {
      // Creation mode: clear all selections.
      setLocalValue({});
      onChange({});
      // Optionally, keep the panel open for a fresh selection.
      setIsOpen(true);
      setIsEditing(false);
    } else {
      // Edit mode: revert any changes by resetting to the parent's value.
      setLocalValue(value);
      setIsOpen(false);
      setIsEditing(false);
    }
  };

  // Clear filter completely.
  const handleClearFilter = (e) => {
    e.stopPropagation();
    setLocalValue({});
    onChange({});
    setIsOpen(true);
    setIsEditing(false);
  };

  // Return a human-readable summary of the applied filter.
  const getFilterLabel = () => {
    if (!isFilterActive(value)) return null;
    if (value.mode === "between") {
      return `Between ${value.startDate.toLocaleDateString()} and ${value.endDate.toLocaleDateString()}`;
    } else if (value.mode === "before") {
      return `Before ${value.single.toLocaleDateString()}`;
    } else if (value.mode === "after") {
      return `After ${value.single.toLocaleDateString()}`;
    }
  };

  return (
    <div className="space-y-2 px-2">
      {/* Header section */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Icon className="h-4 w-4" />
          <Label className="text-sm font-medium flex-1">{label}</Label>
          {isFilterActive(value) && (
            <div className="h-2 w-2 rounded-full bg-havelock-blue" />
          )}
        </div>
      </div>

      {/* When a filter is applied and the panel is collapsed, show its summary */}
      {isFilterActive(value) && !isOpen && (
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
            <Edit2 className="h-3 w-3" />
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

      {/* Filter panel with select and date pickers */}
      {isOpen && (
        <div className="space-y-2">
          <Select
            value={localValue.mode || ""}
            onValueChange={handleModeChange}
          >
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
              <DatePicker
                value={localValue.startDate || null}
                onChange={(date) => handleDateChange("startDate", date)}
              />
              <DatePicker
                value={localValue.endDate || null}
                onChange={(date) => handleDateChange("endDate", date)}
              />
            </div>
          )}

          {(localValue.mode === "before" || localValue.mode === "after") && (
            <DatePicker
              value={localValue.single || null}
              onChange={(date) => handleDateChange("single", date)}
            />
          )}

          {localValue.mode && (
            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyFilter}
                disabled={!isValid()}
                className="flex-1 bg-web-orange hover:bg-web-orange/90 text-white"
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
