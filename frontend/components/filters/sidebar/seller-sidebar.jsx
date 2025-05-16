"use client";

import { usePathname, useRouter } from "next/navigation";
import { useFilters } from "@/contexts/filters-context";
import { List, Map } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

export function SellerSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { filters, handleFilterChange, viewMode, handleViewModeChange } =
    useFilters();
  const isOpportunitiesPage = pathname === "/dashboard/opportunities";

  const handleViewModeToggle = () => {
    if (!isOpportunitiesPage) {
      router.push("/dashboard/opportunities");
    } else {
      handleViewModeChange();
    }
  };

  return (
    <div className="w-72 h-full flex flex-col">
      {/* Header Section */}
      <div className="p-4 border-b space-y-4">
        {/* View Mode Toggle */}
        <Toggle
          pressed={viewMode === "map" && isOpportunitiesPage}
          onPressedChange={handleViewModeToggle}
          className="w-full justify-start h-9"
        >
          {!isOpportunitiesPage ? (
            <>
              <List className="h-4 w-4 mr-2" />
              Live Opportunities
            </>
          ) : viewMode === "list" ? (
            <>
              <Map className="h-4 w-4 mr-2" />
              Explore on Map
            </>
          ) : (
            <>
              <List className="h-4 w-4 mr-2" />
              View as List
            </>
          )}
        </Toggle>

        {/* Shortlisted Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                handleFilterChange("showShortlisted", !filters.showShortlisted)
              }
              className={`h-4 w-4 rounded flex items-center justify-center ${
                filters.showShortlisted
                  ? "bg-web-orange"
                  : "border border-gray-300"
              }`}
              aria-checked={filters.showShortlisted}
              role="checkbox"
            >
              {filters.showShortlisted && (
                <Check className="h-3 w-3 text-white" />
              )}
            </button>
            <Label
              onClick={() =>
                handleFilterChange("showShortlisted", !filters.showShortlisted)
              }
              className="text-sm cursor-pointer select-none"
            >
              Show Shortlisted Only
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
