"use client";

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function YearSelect({ currentYear, years, onYearSelect }) {
  return (
    <Select.Root
      value={String(currentYear)}
      onValueChange={(val) => onYearSelect(parseInt(val, 10))}
    >
      <Select.Trigger
        className={cn(
          "inline-flex items-center justify-between rounded-md border px-2 py-1",
          "bg-transparent text-sm font-medium text-center",
          "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        )}
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className={cn(
            "z-50 rounded-md border bg-white shadow-md",
            "max-h-48 overflow-y-auto"
          )}
        >
          <Select.Viewport className="p-1">
            <Select.ScrollUpButton className="flex items-center justify-center p-1">
              <ChevronUp className="h-4 w-4" />
            </Select.ScrollUpButton>
            {years.map((year) => (
              <Select.Item
                key={year}
                value={String(year)}
                className={cn(
                  "px-2 py-1 text-sm cursor-pointer rounded-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                )}
              >
                <Select.ItemText>{year}</Select.ItemText>
              </Select.Item>
            ))}
            <Select.ScrollDownButton className="flex items-center justify-center p-1">
              <ChevronDown className="h-4 w-4" />
            </Select.ScrollDownButton>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fromYear = 1900,
  toYear = 2100,
  onSelect,
  selected,
  mode,
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selected ? new Date(selected) : new Date()
  );

  React.useEffect(() => {
    if (selected) {
      setCurrentMonth(new Date(selected));
    }
  }, [selected]);

  const handleMonthChange = (month) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    if (selected) {
      const updatedSelection = new Date(selected);
      updatedSelection.setFullYear(year);
      onSelect?.(updatedSelection);
    }
  };

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const handleDateSelect = (date) => {
    if (date) {
      // Create date at noon UTC
      const newDate = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          12,
          0,
          0,
          0
        )
      );
      onSelect?.(newDate);
    }
  };

  const CustomCaption = ({ displayMonth }) => {
    return (
      <div className="flex items-center justify-between w-full">
        <button
          onClick={handlePreviousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0"
          )}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {displayMonth.toLocaleString("default", { month: "long" })}
          </span>
          <YearSelect
            currentYear={displayMonth.getFullYear()}
            years={years}
            onYearSelect={handleYearChange}
          />
        </div>
        <button
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0"
          )}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      month={currentMonth}
      onMonthChange={handleMonthChange}
      onSelect={handleDateSelect}
      selected={selected}
      mode={mode}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
      }}
      {...props}
      numberOfMonths={1}
      fixedWeeks={true}
      styles={{
        root: { width: "100%" },
        months: { width: "100%" },
        month: { width: "100%" },
        table: { width: "100%", marginBottom: 0 },
        tbody: { display: "flex", flexDirection: "column", gap: "2px" },
        head: { height: "32px", marginBottom: "4px" },
        caption: {
          position: "relative",
          alignItems: "center",
          marginBottom: "8px",
        },
      }}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
