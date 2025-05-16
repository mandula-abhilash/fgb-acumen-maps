"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function MultiSelect({
  options,
  selected = [], // Provide default empty array
  onChange,
  placeholder = "Select options",
  className,
  maxCount = 3,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Ensure selected is always an array
  const selectedValues = Array.isArray(selected) ? selected : [];

  const filteredOptions = React.useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [options, searchQuery]
  );

  const handleUnselect = (item) => {
    if (disabled) return;
    onChange(selectedValues.filter((i) => i !== item));
  };

  const handleSelect = (currentValue) => {
    if (disabled) return;
    if (selectedValues.includes(currentValue)) {
      onChange(selectedValues.filter((item) => item !== currentValue));
    } else {
      onChange([...selectedValues, currentValue]);
    }
  };

  const handleClear = (e) => {
    if (disabled) return;
    e.stopPropagation();
    onChange([]);
  };

  const toggleAll = () => {
    if (disabled) return;
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((option) => option.value));
    }
  };

  // Get label for a value from options
  const getOptionLabel = (value) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="relative">
      <Popover
        open={open && !disabled}
        onOpenChange={disabled ? undefined : setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full p-1 justify-between h-auto min-h-10",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            disabled={disabled}
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-wrap items-center gap-1">
                {selectedValues.length === 0 && (
                  <span className="text-sm text-muted-foreground placeholder:text-muted-foreground mx-3">
                    {placeholder}
                  </span>
                )}
                {selectedValues.slice(0, maxCount).map((value) => (
                  <Badge variant="secondary" key={value} className="m-1 pr-1">
                    {getOptionLabel(value)}
                    {!disabled && (
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer p-0.5"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(value);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnselect(value);
                        }}
                      >
                        <X className="h-3 w-3 hover:text-foreground" />
                      </span>
                    )}
                  </Badge>
                ))}
                {selectedValues.length > maxCount && (
                  <Badge variant="secondary" className="m-1">
                    +{selectedValues.length - maxCount} more
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedValues.length > 0 && !disabled && (
                  <>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={handleClear}
                      className="h-auto p-1 cursor-pointer hover:bg-transparent"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </span>
                    <Separator orientation="vertical" className="h-4" />
                  </>
                )}
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 opacity-50 mr-2" />
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-[200px] overflow-y-auto">
              {filteredOptions.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              <CommandGroup>
                <div
                  role="button"
                  onClick={toggleAll}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedValues.length === options.length
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <span>
                    {selectedValues.length === options.length
                      ? "Deselect All"
                      : "Select All"}
                  </span>
                </div>

                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    role="button"
                    onClick={() => handleSelect(option.value)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.label}</span>
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
